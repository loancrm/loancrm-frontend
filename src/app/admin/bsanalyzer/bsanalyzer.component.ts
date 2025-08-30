// import { Component } from '@angular/core';
// import { BsanalyzerService } from './bsanalyzer.service';
// import { FormBuilder, Validators } from '@angular/forms';
// import { debounceTime, switchMap } from 'rxjs/operators';
// import { of } from 'rxjs';
// type ExtractResponseItem = {
//   bankName: string;
//   bankId: string;
//   accountNumber: string;
//   ifscCode: string;
//   accountType: number | string;
//   statementStartDate?: string;
//   statementEndDate?: string;
//   fileName: string;
//   statusCode: number;
// };
// @Component({
//   selector: 'app-bsanalyzer',
//   templateUrl: './bsanalyzer.component.html',
//   styleUrl: './bsanalyzer.component.scss'
// })
// export class BsanalyzerComponent {
//   uploading = false;
//   extracting = false;
//   creating = false;
//   extractResult?: ExtractResponseItem[];
//   banks: Array<{ id: string | number; name: string }> = [];
//   selectedFiles: File[] = [];

//   // Form
//   form = this.fb.group({
//     reportName: ['API Test', [Validators.required]],
//     reportId: [''],
//     bankSearch: [''], // for autoload banks
//     // account fields (pre-filled from extract)
//     bankId: ['', [Validators.required]],
//     accountType: ['', [Validators.required]], // 1 Savings, 2 Current, 3 OD/CC
//     accountNumber: ['', [Validators.required]],
//     accountReferenceNumber: [''],
//     analysisStartDate: [''],
//     analysisEndDate: [''],
//     password: [''], // optional for PDFs
//   });

//   // map of file names => for fileNames list in report JSON
//   get fileNames(): string[] {
//     return this.selectedFiles.map(f => f.name);
//   }

//   constructor(private fb: FormBuilder, private bsaServcie: BsanalyzerService) {
//     // live bank search
//     this.form.get('bankSearch')!.valueChanges
//       .pipe(
//         debounceTime(300),
//         switchMap(q => {
//           if (!q || ('' + q).length < 3) return of([]);
//           return this.bsaServcie.fetchBanks(q as string);
//         })
//       )
//       .subscribe(list => (this.banks = list || []));
//   }

//   // file input
//   onFileChange(e: Event) {
//     const input = e.target as HTMLInputElement;
//     this.selectedFiles = Array.from(input.files || []);
//   }

//   // Step 2: Extract details from uploaded PDF
//   extract() {
//     if (!this.selectedFiles.length) {
//       alert('Please choose at least one PDF file.');
//       return;
//     }
//     this.extracting = true;
//     // Pass the first file only, or update the service to accept an array if needed
//     this.bsaServcie.extractBankDetails(this.selectedFiles[0]).subscribe({
//       next: (resp: ExtractResponseItem[]) => {
//         this.extractResult = resp;
//         console.log(this.extractResult)
//         // Use the first item to pre-fill the form
//         const first = resp?.[0];
//         if (first) {
//           this.form.patchValue({
//             bankId: first.bankId || '',
//             accountNumber: first.accountNumber || '',
//             accountType: first.accountType !== undefined && first.accountType !== null ? String(first.accountType) : '',
//             analysisStartDate: first.statementStartDate || '',
//             analysisEndDate: first.statementEndDate || '',
//           });
//         }
//       },
//       error: (err) => {
//         console.error('Extract error:', err);
//         alert('Failed to extract details.');
//       },
//       complete: () => (this.extracting = false),
//     });
//   }

//   // choose a bank from the suggestions
//   pickBank(b: { id: string | number; name: string }) {
//     this.form.patchValue({ bankId: String(b.id), bankSearch: b.name });
//   }

//   // Step 3: Create Report
//   createReport() {
//     if (this.form.invalid) {
//       this.form.markAllAsTouched();
//       return;
//     }
//     if (!this.selectedFiles.length) {
//       alert('Please upload at least one PDF statement.');
//       return;
//     }

//     // Build report JSON per API spec
//     const v = this.form.value;
//     const report = {
//       reportName: v.reportName,
//       reportId: v.reportId || '',
//       accountList: [
//         {
//           account: {
//             bankId: String(v.bankId),
//             accountType: Number(v.accountType),
//             accountNumber: String(v.accountNumber),
//             accountReferenceNumber: v.accountReferenceNumber || '',
//             analysisStartDate: v.analysisStartDate || null,
//             analysisEndDate: v.analysisEndDate || null,
//             startDate: v.analysisStartDate || null,
//             endDate: v.analysisEndDate || null,
//           },
//           // optional: password (single password for all files in this account)
//           ...(v.password ? { password: v.password } : {}),
//           fileNames: this.fileNames, // MUST match uploaded file names
//           // Example of sanction limits:
//           // sanctionLimits: [{ sanctionAmount: '10000', startDate: '2018-01-01', endDate: '2020-10-05' }]
//         },
//       ],
//       // if you also attach GST accounts, add gstList here
//       gstList: []
//     };
//     console.log(report)
//     this.creating = true;
//     this.bsaServcie.createReport(report, this.selectedFiles).subscribe({
//       next: (resp) => {
//         console.log('Create report response:', resp);
//         alert('Report created successfully!');
//       },
//       error: (err) => {
//         console.error('Create report error:', err);
//         alert(err?.error?.error || 'Failed to create report');
//       },
//       complete: () => (this.creating = false),
//     });
//   }

// }

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { debounceTime, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { BsanalyzerService } from './bsanalyzer.service';

type ExtractResponseItem = {
  bankName: string;
  bankId: string;
  accountNumber: string;
  ifscCode: string;
  accountType: number | string;
  statementStartDate?: string;
  statementEndDate?: string;
  fileName: string;
  statusCode: number;
};

@Component({
  selector: 'app-bsanalyzer',
  templateUrl: './bsanalyzer.component.html',
  styleUrls: ['./bsanalyzer.component.scss']
})
export class BsanalyzerComponent implements OnInit {
  isEditMode = false;
  reportIdFromRoute: string | null = null;
  uploadedFiles: any[] = [];
  uploading = false;
  extracting = false;
  creatingOrUpdating = false;
  extractResult?: ExtractResponseItem[];
  banks: Array<{ id: string | number; name: string }> = [];
  selectedFiles: File[] = [];

  form = this.fb.group({
    reportName: ['', [Validators.required]],
    reportId: [''],        // existing reportId (edit mode)
    newReportId: [''],     // only if renaming report
    bankSearch: [''],      // for autocomplete
    bankId: ['', [Validators.required]],
    accountType: ['', [Validators.required]],
    accountNumber: ['', [Validators.required]],
    accountReferenceNumber: [''],
    analysisStartDate: [''],
    analysisEndDate: [''],
    password: [''],
    accountId: ['']        // only in edit mode
  });

  constructor(
    private fb: FormBuilder,
    private bsaService: BsanalyzerService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // check if we are editing
    this.reportIdFromRoute = this.route.snapshot.paramMap.get('reportId');
    if (this.reportIdFromRoute) {
      this.isEditMode = true;
      this.loadReport(this.reportIdFromRoute);
    }

    // 🔎 live bank search
    this.form.get('bankSearch')!.valueChanges
      .pipe(
        debounceTime(300),
        switchMap(q => {
          if (!q || ('' + q).length < 3) return of([]);
          return this.bsaService.fetchBanks(q as string);
        })
      )
      .subscribe(list => (this.banks = list || []));
  }

  loadReport(reportId: string) {
    const params = { reportId: reportId };
    this.bsaService.fetchReport(params).subscribe(report => {
      const acc = report.reportAccounts?.[0]?.account || {};
      this.form.patchValue({
        reportId: report.report?.reportId,
        reportName: report.report?.reportName,
        bankId: acc.bankId,
        accountType: acc.accountType,
        accountNumber: acc.accountNumber,
        accountReferenceNumber: acc.accountReferenceNumber,
        analysisStartDate: acc.analysisStartDate,
        analysisEndDate: acc.analysisEndDate,
        accountId: acc.accountId
      });

      // ✅ store existing uploaded files
      this.uploadedFiles = report.reportAccounts?.[0]?.files || [];
    });
  }

  // choose a bank from the suggestions
  pickBank(b: { id: string | number; name: string }) {
    this.form.patchValue({ bankId: String(b.id), bankSearch: b.name });
  }

  // file input
  onFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.selectedFiles = Array.from(input.files || []);
  }

  get fileNames(): string[] {
    return this.selectedFiles.map(f => f.name);
  }

  // Step 2: Extract
  extract() {
    if (!this.selectedFiles.length) {
      alert('Please choose at least one PDF file.');
      return;
    }
    this.extracting = true;
    this.bsaService.extractBankDetails(this.selectedFiles[0]).subscribe({
      next: (resp: ExtractResponseItem[]) => {
        this.extractResult = resp;
        const first = resp?.[0];
        if (first) {
          this.form.patchValue({
            bankId: first.bankId || '',
            accountNumber: first.accountNumber || '',
            accountType: first.accountType ? String(first.accountType) : '',
            analysisStartDate: first.statementStartDate || '',
            analysisEndDate: first.statementEndDate || ''
          });
        }
      },
      error: err => {
        console.error('Extract error:', err);
        alert('Failed to extract details.');
      },
      complete: () => (this.extracting = false)
    });
  }

  // Save report (create or update)
  saveReport() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;
    this.creatingOrUpdating = true;

    if (!this.isEditMode) {
      // ✅ Create
      const report = {
        reportName: v.reportName,
        reportId: v.reportId || '',
        accountList: [
          {
            account: {
              bankId: String(v.bankId),
              accountType: Number(v.accountType),
              accountNumber: String(v.accountNumber),
              accountReferenceNumber: v.accountReferenceNumber || '',
              analysisStartDate: v.analysisStartDate || null,
              analysisEndDate: v.analysisEndDate || null,
              startDate: v.analysisStartDate || null,
              endDate: v.analysisEndDate || null
            },
            ...(v.password ? { password: v.password } : {}),
            fileNames: this.fileNames
          }
        ],
        gstList: []
      };

      this.bsaService.createReport(report, this.selectedFiles).subscribe({
        next: res => alert('Report created successfully!'),
        error: err => alert(err?.error?.error || 'Create failed'),
        complete: () => (this.creatingOrUpdating = false)
      });

    } else {
      // ✅ Update
      console.log(this.uploadedFiles)
      const updatePayload = {
        reportDetails: {
          reportId: v.reportId,
          newReportId: v.newReportId || undefined,
          newReportName: v.reportName
        },
        accountList: [
          {
            account: {
              accountId: v.accountId,
              bankId: v.bankId,
              accountType: v.accountType,
              accountNumber: v.accountNumber,
              accountReferenceNumber: v.accountReferenceNumber,
              analysisStartDate: v.analysisStartDate,
              analysisEndDate: v.analysisEndDate
            },
            ...(v.password ? { password: v.password } : {}),
            // In both Create and Update payloads:
            fileNames: [...this.uploadedFiles.map(f => f.originalName), ...this.fileNames]
          }
        ],
        fileIds: [] // if you want to delete old files
      };

      this.bsaService.updateReport(updatePayload, this.selectedFiles).subscribe({
        next: res => alert('Report updated successfully!'),
        error: err => alert(err?.error?.error || 'Update failed'),
        complete: () => (this.creatingOrUpdating = false)
      });
    }
  }
}
