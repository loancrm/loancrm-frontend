import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LeadsService } from '../../leads/leads.service';
import { ToastService } from 'src/app/services/toast.service';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { DateTimeProcessorService } from 'src/app/services/date-time-processor.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-banks-saved',
  templateUrl: './banks-saved.component.html',
  styleUrls: ['./banks-saved.component.scss'],
})
export class BanksSavedComponent implements OnInit {
  leads: any = null;
  moment: any;
  loading: any;
  version = projectConstantsLocal.VERSION_DESKTOP;
  loginInfoDetails: any[] = [];
  fipDetails: any[] = [];
  breadCrumbItems: any[] = [
    {
      icon: 'pi pi-home',
      label: ' Dashboard',
      routerLink: '/user/dashboard',
      queryParams: { v: this.version },
    },
    {
      label: 'Logins',
      routerLink: '/user/logins',
      queryParams: { v: this.version },
    },
    { label: 'Saved Banks' },
  ];
  statusOptions: any[] = projectConstantsLocal.BANKSSAVED_STATUS;
  leadId: string | null = null;
  capabilities: any;
  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private leadsService: LeadsService,
    private toastService: ToastService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private dateTimeProcessor: DateTimeProcessorService
  ) {
    this.moment = this.dateTimeProcessor.getMoment();
  }
  ngOnInit(): void {
    this.leadId = this.route.snapshot.paramMap.get('id');
    if (this.leadId) {
      this.getLeadById(this.leadId);
      this.getFIPDetailsById(this.leadId);
    }
    this.capabilities = this.leadsService.getUserRbac();
    console.log(this.capabilities);
  }

  getFIPDetailsById(id: string) {
    this.loading = true;
    this.leadsService.getFIPDetailsById(id).subscribe(
      (lead: any) => {
        this.fipDetails = lead;
        console.log('FIPDETAILS:', this.fipDetails);
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  confirmDelete(lead) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete this Login Data ? <br>
              Program: ${lead.program}<br>
              Lender Name: ${lead.bankName}<br>
              login ID: ${lead.id}
              `,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteLogin(lead.id);
      },
    });
  }
  deleteLogin(loginLeadId) {
    this.loading = true;
    this.leadsService.deleteLogin(loginLeadId).subscribe(
      (response: any) => {
        console.log(response);
        this.toastService.showSuccess(response?.message);
        this.loading = false;
        if (this.leadId) {
          this.getLeadById(this.leadId);
          this.getFIPDetailsById(this.leadId);
        }
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  changeLeadStatus(leadId, statusId) {
    this.loading = true;
    this.leadsService.changeLeadStatus(leadId, statusId).subscribe(
      (leads) => {
        this.toastService.showSuccess('Lead Status Changed Successfully');
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  saveFormData(): void {
    const formData = this.fipDetails.map((detail) => ({
      id: detail.id,
      program: detail.program,
      bankName: detail.bankName,
      fipStatus: detail.fipStatus,
      // loginDate: detail.loginDate
      //   ? this.moment(detail.loginDate).format('MM/DD/YYYY')
      //   : null,
      loginDate: detail.loginDate
        ? this.moment(detail.loginDate).format('YYYY-MM-DD')
        : null,
      fipRemarks: detail.fipRemarks,
    }));
    console.log(formData);
    this.loading = true;
    this.leadsService.updateFIPDetails(this.leadId, formData).subscribe(
      (response: any) => {
        this.loading = false;
        this.toastService.showSuccess(
          'Files In Process info Saved Successfully'
        );
        const targetUrl = `user/filesinprocess`;
        this.router.navigateByUrl(targetUrl);
      },
      (error) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  transformLoginInfoDetails(data: any[]): any[] {
    const transformedData: any[] = [];
    const flattenedData = data.flat();
    flattenedData.forEach((program) => {
      program.Banks.forEach((bankName: string) => {
        transformedData.push({
          program: program.Program.toUpperCase(),
          bank: bankName,
          status: '',
          remarks: '',
        });
      });
    });
    return transformedData;
  }
  getLeadById(id: string) {
    this.leadsService.getLeadDetailsById(id).subscribe(
      (lead) => {
        this.leads = lead;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  goBack(): void {
    this.location.back();
  }
}
