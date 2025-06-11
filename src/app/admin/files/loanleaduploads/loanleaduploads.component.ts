import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { LeadsService } from '../../leads/leads.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { DateTimeProcessorService } from 'src/app/services/date-time-processor.service';
import { DialogService } from 'primeng/dynamicdialog';
import { FileUploadComponent } from '../../file-upload/file-upload.component';
import { projectConstantsLocal } from 'src/app/constants/project-constants';

@Component({
  selector: 'app-loanleaduploads',
  templateUrl: './loanleaduploads.component.html',
  styleUrl: './loanleaduploads.component.scss',
})
export class LoanleaduploadsComponent implements OnInit {
  moment: any;
  leadId: any;
  displayedItems: any = [];
  items: any;
  loading: any;
  activeItem: any;
  contactPerson: any;
  aadharNumber: any;
  coApplicantRelation: any;
  coApplicantName: any;
  cibilScore: any;
  companyName: any;
  panNumber: any;
  loanleads: any;
  userDetails: any;
  version = projectConstantsLocal.VERSION_DESKTOP;
  breadCrumbItems: any = [];
  selectedFiles: any = {
    panCard: { filesData: [], links: [], uploadedFiles: [] },
    gstCertificate: { filesData: [], links: [], uploadedFiles: [] },
    aadharCard: { filesData: [], links: [], uploadedFiles: [] },
    photo: { filesData: [], links: [], uploadedFiles: [] },
    voterId: { filesData: [], links: [], uploadedFiles: [] },
    coApplicantPancard: { filesData: [], links: [], uploadedFiles: [] },
    coApplicantAadharcard: { filesData: [], links: [], uploadedFiles: [] },
    coApplicantPhoto: { filesData: [], links: [], uploadedFiles: [] },
    coApplicantVoterId: { filesData: [], links: [], uploadedFiles: [] },
    cibilReport: { filesData: [], links: [], uploadedFiles: [] },
    companyId: { filesData: [], links: [], uploadedFiles: [] },
    paySlips: [{ filesData: [], links: [], uploadedFiles: [] }],
    bankStatements: [{ filesData: [], links: [], uploadedFiles: [] }],
    residenceProof: { filesData: [], links: [], uploadedFiles: [] },
    otherDocuments: [{ filesData: [], links: [], uploadedFiles: [] }],
    saleDeed: { filesData: [], links: [], uploadedFiles: [] },
    saleAgreement: { filesData: [], links: [], uploadedFiles: [] },
    presentIncomeReturns: [{ filesData: [], links: [], uploadedFiles: [] }],
    pastIncomeReturns: [{ filesData: [], links: [], uploadedFiles: [] }],
    gstDetails: [{ filesData: [], links: [], uploadedFiles: [] }],
  };
  paySlips: any = [
    {
      date: '',
      salary: '',
      paySlips: [],
    },
  ];
  existingLoans: any = [
    {
      bankName: '',
      loanType: '',
      emiAmount: '',
      emiClosingDate: '',
    },
  ];
  bankStatements: any = [
    {
      name: '',
      accountType: '',
      from: '',
      to: '',
      bankStatements: [],
    },
  ];
  otherDocuments: any = [
    {
      name: '',
      otherDocuments: [],
    },
  ];
  financialReturns: any = [
    {
      pastIncomeTax: '',
      pastIncomeReturns: [],
      presentIncomeTax: '',
      presentIncomeReturns: [],
    },
  ];
  gstDetails: any = [
    {
      operatingState: '',
      filingPeriod: '',
      gst3BSale: '',
      gstDetails: [],
    },
  ];
  constructor(
    private location: Location,
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute,
    private leadsService: LeadsService,
    private dialogService: DialogService,
    private localStorageService: LocalStorageService,
    private dateTimeProcessor: DateTimeProcessorService
  ) {
    this.moment = this.dateTimeProcessor.getMoment();
    this.leadId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.leadId) {
      this.getLoanLeadById(this.leadId).then((data) => {
        if (data) {
          this.setLeadDocumentsData();
        }
      });
    }
    this.breadCrumbItems = [
      {
        icon: 'pi pi-home',
        label: ' Dashboard',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      {
        label: 'Files',
        routerLink: '/user/files',
        queryParams: { v: this.version },
      },
      { label: 'Upload Documents' },
    ];
  }
  ngOnInit() {
    this.userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    this.updateItemsBasedOnCondition();
  }
  updateItemsBasedOnCondition() {
    const { loanType, employmentStatus } = this.loanleads[0];
    this.items = [
      { label: 'KYCs', name: 'kycs' },
      { label: 'Cibil', name: 'cibil' },
      { label: 'Bank Statements', name: 'bankStatements' },
      { label: 'Existing Loans', name: 'existingLoans' },
      { label: 'Other Details', name: 'otherDetails' },
    ];
    const isEmployed = employmentStatus === 'employed';
    const isSelfEmployed = employmentStatus === 'self-employed';
    const isHomeOrLap = loanType === 'homeLoan' || loanType === 'lap';
    if (isEmployed && (loanType === 'homeLoan' || loanType === 'lap')) {
      this.items.push({ label: 'Sale Details', name: 'saledetails' });
    }
    if (isEmployed && (loanType === 'personalLoan' || isHomeOrLap)) {
      this.items.push({ label: 'Company Details', name: 'companydetails' });
    }
    if (isSelfEmployed && isHomeOrLap) {
      this.items.push(
        { label: 'Financials', name: 'financials' },
        { label: 'GST', name: 'gst' },
        { label: 'Sale Details', name: 'saledetails' }
      );
    }
    this.activeItem = this.items[0];
  }
  onActiveItemChange(event) {
    console.log(event);
    this.activeItem = event;
  }
  updateDisplayedItems() {
    const loanDisplayProperty =
      this.loanleads && this.loanleads[0]?.employmentStatus === 'employed'
        ? 'contactPerson'
        : 'businessName';
    this.displayedItems = [
      { data: this.loanleads, displayProperty: loanDisplayProperty },
    ];
  }
  getLoanLeadById(leadId) {
    return new Promise((resolve, reject) => {
      this.leadsService.getLoanLeadById(leadId).subscribe(
        (response: any) => {
          this.loanleads = response;
          console.log(this.loanleads);
          this.updateItemsBasedOnCondition();
          this.updateDisplayedItems();
          resolve(true);
        },
        (error) => {
          resolve(false);
          this.toastService.showError(error);
        }
      );
    });
  }
  setLeadDocumentsData() {
    this.contactPerson = this.loanleads[0].contactPerson || '';
    this.aadharNumber = this.loanleads[0].aadharNumber || '';
    this.coApplicantName = this.loanleads[0].coApplicantName || '';
    this.coApplicantRelation = this.loanleads[0].coApplicantRelation || '';
    this.panNumber = this.loanleads[0].panNumber || '';
    this.cibilScore = this.loanleads[0].cibilScore || '';
    this.companyName = this.loanleads[0].companyName || '';
    if (this.loanleads[0].panCard) {
      this.selectedFiles['panCard']['uploadedFiles'] =
        this.loanleads[0].panCard;
    }
    if (this.loanleads[0].aadharCard) {
      this.selectedFiles['aadharCard']['uploadedFiles'] =
        this.loanleads[0].aadharCard;
    }
    if (this.loanleads[0].photo) {
      this.selectedFiles['photo']['uploadedFiles'] = this.loanleads[0].photo;
    }
    if (this.loanleads[0].voterId) {
      this.selectedFiles['voterId']['uploadedFiles'] =
        this.loanleads[0].voterId;
    }
    if (this.loanleads[0].coApplicantPancard) {
      this.selectedFiles['coApplicantPancard']['uploadedFiles'] =
        this.loanleads[0].coApplicantPancard;
    }
    if (this.loanleads[0].coApplicantAadharcard) {
      this.selectedFiles['coApplicantAadharcard']['uploadedFiles'] =
        this.loanleads[0].coApplicantAadharcard;
    }
    if (this.loanleads[0].coApplicantPhoto) {
      this.selectedFiles['coApplicantPhoto']['uploadedFiles'] =
        this.loanleads[0].coApplicantPhoto;
    }
    if (this.loanleads[0].coApplicantVoterId) {
      this.selectedFiles['coApplicantVoterId']['uploadedFiles'] =
        this.loanleads[0].coApplicantVoterId;
    }
    if (this.loanleads[0].cibilReport) {
      this.selectedFiles['cibilReport']['uploadedFiles'] =
        this.loanleads[0].cibilReport;
    }
    if (this.loanleads[0].companyId) {
      this.selectedFiles['companyId']['uploadedFiles'] =
        this.loanleads[0].companyId;
    }
    if (this.loanleads[0].gstCertificate) {
      this.selectedFiles['gstCertificate']['uploadedFiles'] =
        this.loanleads[0].gstCertificate;
    }
    if (this.loanleads[0].paySlips && this.loanleads[0].paySlips.length > 0) {
      this.paySlips = [];
      this.selectedFiles['paySlips'] = [];
      this.loanleads[0].paySlips.forEach((statement, index) => {
        let fileData = {
          filesData: [],
          links: [],
          uploadedFiles: statement['paySlips'],
        };
        this.selectedFiles['paySlips'].push(fileData);
        this.paySlips.push(statement);
      });
    }
    if (
      this.loanleads[0].bankStatements &&
      this.loanleads[0].bankStatements.length > 0
    ) {
      this.bankStatements = [];
      this.selectedFiles['bankStatements'] = [];
      this.loanleads[0].bankStatements.forEach((statement, index) => {
        let fileData = {
          filesData: [],
          links: [],
          uploadedFiles: statement['bankStatements'],
        };
        this.selectedFiles['bankStatements'].push(fileData);
        this.bankStatements.push(statement);
      });
    }
    if (
      this.loanleads[0].existingLoans &&
      this.loanleads[0].existingLoans.length > 0
    ) {
      this.existingLoans = [];
      this.loanleads[0].existingLoans.forEach((loans, index) => {
        this.existingLoans.push(loans);
      });
    }
    if (this.loanleads[0].residenceProof) {
      this.selectedFiles['residenceProof']['uploadedFiles'] =
        this.loanleads[0].residenceProof;
    }
    if (
      this.loanleads[0].otherDocuments &&
      this.loanleads[0].otherDocuments.length > 0
    ) {
      this.otherDocuments = [];
      this.selectedFiles['otherDocuments'] = [];
      this.loanleads[0].otherDocuments.forEach((statement, index) => {
        let fileData = {
          filesData: [],
          links: [],
          uploadedFiles: statement['otherDocuments'],
        };
        this.selectedFiles['otherDocuments'].push(fileData);
        this.otherDocuments.push(statement);
      });
    }
    if (this.loanleads[0].saleDeed) {
      this.selectedFiles['saleDeed']['uploadedFiles'] =
        this.loanleads[0].saleDeed;
    }
    if (this.loanleads[0].saleAgreement) {
      this.selectedFiles['saleAgreement']['uploadedFiles'] =
        this.loanleads[0].saleAgreement;
    }
    if (
      this.loanleads[0].financialReturns &&
      this.loanleads[0].financialReturns.length > 0
    ) {
      this.financialReturns = [];
      this.selectedFiles['pastIncomeReturns'] = [];
      this.selectedFiles['presentIncomeReturns'] = [];
      this.loanleads[0].financialReturns.forEach((statement, index) => {
        statement['pastIncomeTax'] = statement['pastIncomeTax'];
        statement['presentIncomeTax'] = statement['presentIncomeTax'];
        let fileData = {
          filesData: [],
          links: [],
          uploadedFiles: statement['pastIncomeReturns'],
        };
        let fileData4 = {
          filesData: [],
          links: [],
          uploadedFiles: statement['presentIncomeReturns'],
        };
        this.selectedFiles['pastIncomeReturns'].push(fileData);
        this.selectedFiles['presentIncomeReturns'].push(fileData4);
        this.financialReturns.push(statement);
      });
    }
    if (
      this.loanleads[0].gstDetails &&
      this.loanleads[0].gstDetails.length > 0
    ) {
      this.gstDetails = [];
      this.selectedFiles['gstDetails'] = [];
      this.loanleads[0].gstDetails.forEach((gst, index) => {
        let fileData = {
          filesData: [],
          links: [],
          uploadedFiles: gst['gstDetails'],
        };
        this.selectedFiles['gstDetails'].push(fileData);
        this.gstDetails.push(gst);
      });
    }
  }
  addPayslipsRow() {
    let data = {
      date: '',
      salary: '',
      paySlips: [],
    };
    let fileData = { filesData: [], links: [], uploadedFiles: [] };
    this.paySlips.push(data);
    this.selectedFiles.paySlips.push(fileData);
  }
  addBankStatementsRow() {
    let data = {
      name: '',
      accountType: '',
      from: '',
      to: '',
      bankStatements: [],
    };
    let fileData = { filesData: [], links: [], uploadedFiles: [] };
    this.bankStatements.push(data);
    this.selectedFiles.bankStatements.push(fileData);
  }
  deletePayslipsRow(index) {
    this.paySlips.splice(index, 1);
    if (
      this.selectedFiles['paySlips'] &&
      this.selectedFiles['paySlips'][index]
    ) {
      this.selectedFiles['paySlips'].splice(index, 1);
    }
  }
  deleteBankStatementsRow(index) {
    this.bankStatements.splice(index, 1);
    if (
      this.selectedFiles['bankStatements'] &&
      this.selectedFiles['bankStatements'][index]
    ) {
      this.selectedFiles['bankStatements'].splice(index, 1);
    }
  }
  addExistingLoansRow() {
    let data = {
      bankName: '',
      loanType: '',
      emiAmount: '',
      emiClosingDate: '',
    };
    this.existingLoans.push(data);
  }
  deleteExistingLoansRow(index) {
    this.existingLoans.splice(index, 1);
  }
  addOtherAttachmentsRow() {
    let data = {
      name: '',
      otherDocuments: [],
    };
    let fileData = { filesData: [], links: [], uploadedFiles: [] };
    this.otherDocuments.push(data);
    this.selectedFiles.otherDocuments.push(fileData);
  }
  deleteOtherAttachmentsRow(index) {
    this.otherDocuments.splice(index, 1);
    if (
      this.selectedFiles['otherDocuments'] &&
      this.selectedFiles['otherDocuments'][index]
    ) {
      this.selectedFiles['otherDocuments'].splice(index, 1);
    }
  }
  addGstDetailsRow() {
    let data = {
      operatingState: '',
      filingPeriod: '',
      gst3BSale: '',
      gstDetails: [],
    };
    let fileData = { filesData: [], links: [], uploadedFiles: [] };
    this.gstDetails.push(data);
    this.selectedFiles.gstDetails.push(fileData);
  }
  deleteGstDetailsRow(index) {
    this.gstDetails.splice(index, 1);
    if (
      this.selectedFiles['gstDetails'] &&
      this.selectedFiles['gstDetails'][index]
    ) {
      this.selectedFiles['gstDetails'].splice(index, 1);
    }
  }
  saveKycsSection() {
    let formData = {
      contactPerson: this.contactPerson,
      panNumber: this.panNumber,
      aadharNumber: this.aadharNumber,
      coApplicantRelation: this.coApplicantRelation,
      coApplicantName: this.coApplicantName,
    };
    formData['panCard'] = [];
    if (
      this.selectedFiles['panCard'] &&
      this.selectedFiles['panCard']['links']
    ) {
      for (let i = 0; i < this.selectedFiles['panCard']['links'].length; i++) {
        formData['panCard'].push(this.selectedFiles['panCard']['links'][i]);
      }
      for (
        let i = 0;
        i < this.selectedFiles['panCard']['uploadedFiles'].length;
        i++
      ) {
        formData['panCard'].push(
          this.selectedFiles['panCard']['uploadedFiles'][i]
        );
      }
    }
    formData['aadharCard'] = [];
    if (
      this.selectedFiles['aadharCard'] &&
      this.selectedFiles['aadharCard']['links']
    ) {
      for (
        let i = 0;
        i < this.selectedFiles['aadharCard']['links'].length;
        i++
      ) {
        formData['aadharCard'].push(
          this.selectedFiles['aadharCard']['links'][i]
        );
      }
      for (
        let i = 0;
        i < this.selectedFiles['aadharCard']['uploadedFiles'].length;
        i++
      ) {
        formData['aadharCard'].push(
          this.selectedFiles['aadharCard']['uploadedFiles'][i]
        );
      }
    }
    formData['photo'] = [];
    if (this.selectedFiles['photo'] && this.selectedFiles['photo']['links']) {
      for (let i = 0; i < this.selectedFiles['photo']['links'].length; i++) {
        formData['photo'].push(this.selectedFiles['photo']['links'][i]);
      }
      for (
        let i = 0;
        i < this.selectedFiles['photo']['uploadedFiles'].length;
        i++
      ) {
        formData['photo'].push(this.selectedFiles['photo']['uploadedFiles'][i]);
      }
    }
    formData['voterId'] = [];
    if (
      this.selectedFiles['voterId'] &&
      this.selectedFiles['voterId']['links']
    ) {
      for (let i = 0; i < this.selectedFiles['voterId']['links'].length; i++) {
        formData['voterId'].push(this.selectedFiles['voterId']['links'][i]);
      }
      for (
        let i = 0;
        i < this.selectedFiles['voterId']['uploadedFiles'].length;
        i++
      ) {
        formData['voterId'].push(
          this.selectedFiles['voterId']['uploadedFiles'][i]
        );
      }
    }
    formData['coApplicantPancard'] = [];
    if (
      this.selectedFiles['coApplicantPancard'] &&
      this.selectedFiles['coApplicantPancard']['links']
    ) {
      for (
        let i = 0;
        i < this.selectedFiles['coApplicantPancard']['links'].length;
        i++
      ) {
        formData['coApplicantPancard'].push(
          this.selectedFiles['coApplicantPancard']['links'][i]
        );
      }
      for (
        let i = 0;
        i < this.selectedFiles['coApplicantPancard']['uploadedFiles'].length;
        i++
      ) {
        formData['coApplicantPancard'].push(
          this.selectedFiles['coApplicantPancard']['uploadedFiles'][i]
        );
      }
    }
    formData['coApplicantAadharcard'] = [];
    if (
      this.selectedFiles['coApplicantAadharcard'] &&
      this.selectedFiles['coApplicantAadharcard']['links']
    ) {
      for (
        let i = 0;
        i < this.selectedFiles['coApplicantAadharcard']['links'].length;
        i++
      ) {
        formData['coApplicantAadharcard'].push(
          this.selectedFiles['coApplicantAadharcard']['links'][i]
        );
      }
      for (
        let i = 0;
        i < this.selectedFiles['coApplicantAadharcard']['uploadedFiles'].length;
        i++
      ) {
        formData['coApplicantAadharcard'].push(
          this.selectedFiles['coApplicantAadharcard']['uploadedFiles'][i]
        );
      }
    }
    formData['coApplicantPhoto'] = [];
    if (
      this.selectedFiles['coApplicantPhoto'] &&
      this.selectedFiles['coApplicantPhoto']['links']
    ) {
      for (
        let i = 0;
        i < this.selectedFiles['coApplicantPhoto']['links'].length;
        i++
      ) {
        formData['coApplicantPhoto'].push(
          this.selectedFiles['coApplicantPhoto']['links'][i]
        );
      }
      for (
        let i = 0;
        i < this.selectedFiles['coApplicantPhoto']['uploadedFiles'].length;
        i++
      ) {
        formData['coApplicantPhoto'].push(
          this.selectedFiles['coApplicantPhoto']['uploadedFiles'][i]
        );
      }
    }
    formData['coApplicantVoterId'] = [];
    if (
      this.selectedFiles['coApplicantVoterId'] &&
      this.selectedFiles['coApplicantVoterId']['links']
    ) {
      for (
        let i = 0;
        i < this.selectedFiles['coApplicantVoterId']['links'].length;
        i++
      ) {
        formData['coApplicantVoterId'].push(
          this.selectedFiles['coApplicantVoterId']['links'][i]
        );
      }
      for (
        let i = 0;
        i < this.selectedFiles['coApplicantVoterId']['uploadedFiles'].length;
        i++
      ) {
        formData['coApplicantVoterId'].push(
          this.selectedFiles['coApplicantVoterId']['uploadedFiles'][i]
        );
      }
    }
    console.log(formData);
    console.log(this.leadId);
    this.loading = true;
    this.leadsService.addLoanLeadsDocumentData(this.leadId, formData).subscribe(
      (data: any) => {
        console.log(data);
        this.loading = false;
        this.toastService.showSuccess("Kyc's Saved Successfully");
        this.getLoanLeadById(this.leadId);
      },
      (error) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  saveCibilSection() {
    let formData = {
      contactPerson: this.contactPerson,
      panNumber: this.panNumber,
      aadharNumber: this.aadharNumber,
      cibilScore: this.cibilScore,
    };
    formData['cibilReport'] = [];
    if (
      this.selectedFiles['cibilReport'] &&
      this.selectedFiles['cibilReport']['links']
    ) {
      for (
        let i = 0;
        i < this.selectedFiles['cibilReport']['links'].length;
        i++
      ) {
        formData['cibilReport'].push(
          this.selectedFiles['cibilReport']['links'][i]
        );
      }
      for (
        let i = 0;
        i < this.selectedFiles['cibilReport']['uploadedFiles'].length;
        i++
      ) {
        formData['cibilReport'].push(
          this.selectedFiles['cibilReport']['uploadedFiles'][i]
        );
      }
    }
    console.log(formData);
    console.log(this.leadId);
    this.loading = true;
    this.leadsService.addLoanLeadsDocumentData(this.leadId, formData).subscribe(
      (data: any) => {
        console.log(data);
        this.loading = false;
        this.toastService.showSuccess('Cibil Data Saved Successfully');
        this.getLoanLeadById(this.leadId);
      },
      (error) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  saveCompanyDetailsSection() {
    for (let index = 0; index < this.paySlips.length; index++) {
      this.paySlips[index]['date'] = this.moment(
        this.paySlips[index]['date']
      ).format('MM/DD/YYYY');
      this.paySlips[index]['paySlips'] = [];
      if (
        this.selectedFiles['paySlips'][index] &&
        this.selectedFiles['paySlips'][index]['links']
      ) {
        for (
          let i = 0;
          i < this.selectedFiles['paySlips'][index]['links'].length;
          i++
        ) {
          this.paySlips[index]['paySlips'].push(
            this.selectedFiles['paySlips'][index]['links'][i]
          );
        }
        for (
          let i = 0;
          i < this.selectedFiles['paySlips'][index]['uploadedFiles'].length;
          i++
        ) {
          this.paySlips[index]['paySlips'].push(
            this.selectedFiles['paySlips'][index]['uploadedFiles'][i]
          );
        }
      }
    }
    let formData = {
      companyName: this.companyName,
      paySlips: this.paySlips,
    };
    formData['companyId'] = [];
    if (
      this.selectedFiles['companyId'] &&
      this.selectedFiles['companyId']['links']
    ) {
      for (
        let i = 0;
        i < this.selectedFiles['companyId']['links'].length;
        i++
      ) {
        formData['companyId'].push(this.selectedFiles['companyId']['links'][i]);
      }
      for (
        let i = 0;
        i < this.selectedFiles['companyId']['uploadedFiles'].length;
        i++
      ) {
        formData['companyId'].push(
          this.selectedFiles['companyId']['uploadedFiles'][i]
        );
      }
    }
    console.log(formData);
    console.log(this.leadId);
    this.loading = true;
    this.leadsService.addLoanLeadsDocumentData(this.leadId, formData).subscribe(
      (data: any) => {
        console.log(data);
        this.loading = false;
        this.toastService.showSuccess('company Details Saved Successfully');
        this.getLoanLeadById(this.leadId);
      },
      (error) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  saveBankStatementsSection() {
    for (let index = 0; index < this.bankStatements.length; index++) {
      this.bankStatements[index]['from'] = this.moment(
        this.bankStatements[index]['from']
      ).format('MM/DD/YYYY');
      this.bankStatements[index]['to'] = this.moment(
        this.bankStatements[index]['to']
      ).format('MM/DD/YYYY');
      this.bankStatements[index]['bankStatements'] = [];
      if (
        this.selectedFiles['bankStatements'][index] &&
        this.selectedFiles['bankStatements'][index]['links']
      ) {
        for (
          let i = 0;
          i < this.selectedFiles['bankStatements'][index]['links'].length;
          i++
        ) {
          this.bankStatements[index]['bankStatements'].push(
            this.selectedFiles['bankStatements'][index]['links'][i]
          );
        }
        for (
          let i = 0;
          i <
          this.selectedFiles['bankStatements'][index]['uploadedFiles'].length;
          i++
        ) {
          this.bankStatements[index]['bankStatements'].push(
            this.selectedFiles['bankStatements'][index]['uploadedFiles'][i]
          );
        }
      }
    }
    let formData = {
      bankStatements: this.bankStatements,
    };
    console.log(formData);
    console.log(this.leadId);
    this.loading = true;
    this.leadsService.addLoanLeadsDocumentData(this.leadId, formData).subscribe(
      (data: any) => {
        console.log(data);
        this.loading = false;
        this.toastService.showSuccess('Bank Statements Saved Successfully');
        this.getLoanLeadById(this.leadId);
      },
      (error) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  saveExistingLoans() {
    for (let index = 0; index < this.existingLoans.length; index++) {
      this.existingLoans[index]['emiClosingDate'] = this.moment(
        this.existingLoans[index]['emiClosingDate']
      ).format('MM/DD/YYYY');
    }
    let formData = {
      existingLoans: this.existingLoans,
    };
    this.loading = true;
    this.leadsService.addLoanLeadsDocumentData(this.leadId, formData).subscribe(
      (data: any) => {
        this.loading = false;
        this.toastService.showSuccess(
          'Existing Loan Details Saved Successfully'
        );
        this.getLoanLeadById(this.leadId);
      },
      (error) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  saveOtherAttachments() {
    let formData = {};
    formData['residenceProof'] = [];
    if (
      this.selectedFiles['residenceProof'] &&
      this.selectedFiles['residenceProof']['links']
    ) {
      for (
        let i = 0;
        i < this.selectedFiles['residenceProof']['links'].length;
        i++
      ) {
        formData['residenceProof'].push(
          this.selectedFiles['residenceProof']['links'][i]
        );
      }
      for (
        let i = 0;
        i < this.selectedFiles['residenceProof']['uploadedFiles'].length;
        i++
      ) {
        formData['residenceProof'].push(
          this.selectedFiles['residenceProof']['uploadedFiles'][i]
        );
      }
    }
    for (let index = 0; index < this.otherDocuments.length; index++) {
      this.otherDocuments[index]['otherDocuments'] = [];
      if (
        this.selectedFiles['otherDocuments'][index] &&
        this.selectedFiles['otherDocuments'][index]['links']
      ) {
        for (
          let i = 0;
          i < this.selectedFiles['otherDocuments'][index]['links'].length;
          i++
        ) {
          this.otherDocuments[index]['otherDocuments'].push(
            this.selectedFiles['otherDocuments'][index]['links'][i]
          );
        }
        for (
          let i = 0;
          i <
          this.selectedFiles['otherDocuments'][index]['uploadedFiles'].length;
          i++
        ) {
          this.otherDocuments[index]['otherDocuments'].push(
            this.selectedFiles['otherDocuments'][index]['uploadedFiles'][i]
          );
        }
      }
    }
    formData['otherDocuments'] = this.otherDocuments;
    this.loading = true;
    this.leadsService.addLoanLeadsDocumentData(this.leadId, formData).subscribe(
      (data: any) => {
        this.loading = false;
        this.toastService.showSuccess('Other Details Saved Successfully');
        this.getLoanLeadById(this.leadId);
      },
      (error) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  saveSaleDetailsSection() {
    let formData = {};
    formData['saleDeed'] = [];
    if (
      this.selectedFiles['saleDeed'] &&
      this.selectedFiles['saleDeed']['links']
    ) {
      for (let i = 0; i < this.selectedFiles['saleDeed']['links'].length; i++) {
        formData['saleDeed'].push(this.selectedFiles['saleDeed']['links'][i]);
      }
      for (
        let i = 0;
        i < this.selectedFiles['saleDeed']['uploadedFiles'].length;
        i++
      ) {
        formData['saleDeed'].push(
          this.selectedFiles['saleDeed']['uploadedFiles'][i]
        );
      }
    }
    formData['saleAgreement'] = [];
    if (
      this.selectedFiles['saleAgreement'] &&
      this.selectedFiles['saleAgreement']['links']
    ) {
      for (
        let i = 0;
        i < this.selectedFiles['saleAgreement']['links'].length;
        i++
      ) {
        formData['saleAgreement'].push(
          this.selectedFiles['saleAgreement']['links'][i]
        );
      }
      for (
        let i = 0;
        i < this.selectedFiles['saleAgreement']['uploadedFiles'].length;
        i++
      ) {
        formData['saleAgreement'].push(
          this.selectedFiles['saleAgreement']['uploadedFiles'][i]
        );
      }
    }
    this.loading = true;
    this.leadsService.addLoanLeadsDocumentData(this.leadId, formData).subscribe(
      (data: any) => {
        this.loading = false;
        this.toastService.showSuccess('Sale Details Saved Successfully');
        this.getLoanLeadById(this.leadId);
      },
      (error) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  saveFinancialReturns() {
    for (let index = 0; index < this.financialReturns.length; index++) {
      this.financialReturns[index]['pastIncomeReturns'] = [];
      this.financialReturns[index]['presentIncomeReturns'] = [];
      if (
        this.selectedFiles['pastIncomeReturns'][index] &&
        this.selectedFiles['pastIncomeReturns'][index]['links']
      ) {
        for (
          let i = 0;
          i < this.selectedFiles['pastIncomeReturns'][index]['links'].length;
          i++
        ) {
          this.financialReturns[index]['pastIncomeReturns'].push(
            this.selectedFiles['pastIncomeReturns'][index]['links'][i]
          );
        }
        for (
          let i = 0;
          i <
          this.selectedFiles['pastIncomeReturns'][index]['uploadedFiles']
            .length;
          i++
        ) {
          this.financialReturns[index]['pastIncomeReturns'].push(
            this.selectedFiles['pastIncomeReturns'][index]['uploadedFiles'][i]
          );
        }
      }
      if (
        this.selectedFiles['presentIncomeReturns'][index] &&
        this.selectedFiles['presentIncomeReturns'][index]['links']
      ) {
        for (
          let i = 0;
          i < this.selectedFiles['presentIncomeReturns'][index]['links'].length;
          i++
        ) {
          this.financialReturns[index]['presentIncomeReturns'].push(
            this.selectedFiles['presentIncomeReturns'][index]['links'][i]
          );
        }
        for (
          let i = 0;
          i <
          this.selectedFiles['presentIncomeReturns'][index]['uploadedFiles']
            .length;
          i++
        ) {
          this.financialReturns[index]['presentIncomeReturns'].push(
            this.selectedFiles['presentIncomeReturns'][index]['uploadedFiles'][
            i
            ]
          );
        }
      }
    }
    let formData = {
      financialReturns: this.financialReturns,
    };
    this.loading = true;
    this.leadsService.addLoanLeadsDocumentData(this.leadId, formData).subscribe(
      (data: any) => {
        this.loading = false;
        this.toastService.showSuccess('Financial Returns Saved Successfully');
        this.getLoanLeadById(this.leadId);
      },
      (error) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  saveGstDetails() {
    for (let index = 0; index < this.gstDetails.length; index++) {
      this.gstDetails[index]['filingPeriod'] = this.moment(
        this.gstDetails[index]['filingPeriod']
      ).format('MM/DD/YYYY');
      this.gstDetails[index]['gstDetails'] = [];
      if (
        this.selectedFiles['gstDetails'][index] &&
        this.selectedFiles['gstDetails'][index]['links']
      ) {
        for (
          let i = 0;
          i < this.selectedFiles['gstDetails'][index]['links'].length;
          i++
        ) {
          this.gstDetails[index]['gstDetails'].push(
            this.selectedFiles['gstDetails'][index]['links'][i]
          );
        }
        for (
          let i = 0;
          i < this.selectedFiles['gstDetails'][index]['uploadedFiles'].length;
          i++
        ) {
          this.gstDetails[index]['gstDetails'].push(
            this.selectedFiles['gstDetails'][index]['uploadedFiles'][i]
          );
        }
      }
    }
    let formData = {
      gstDetails: this.gstDetails,
    };
    formData['gstCertificate'] = [];
    if (
      this.selectedFiles['gstCertificate'] &&
      this.selectedFiles['gstCertificate']['links']
    ) {
      for (
        let i = 0;
        i < this.selectedFiles['gstCertificate']['links'].length;
        i++
      ) {
        formData['gstCertificate'].push(
          this.selectedFiles['gstCertificate']['links'][i]
        );
      }
      for (
        let i = 0;
        i < this.selectedFiles['gstCertificate']['uploadedFiles'].length;
        i++
      ) {
        formData['gstCertificate'].push(
          this.selectedFiles['gstCertificate']['uploadedFiles'][i]
        );
      }
    }
    this.loading = true;
    this.leadsService.addLoanLeadsDocumentData(this.leadId, formData).subscribe(
      (data: any) => {
        this.loading = false;
        this.toastService.showSuccess('GST Details Saved Successfully');
        this.getLoanLeadById(this.leadId);
      },
      (error) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  uploadFiles(fileType, acceptableTypes, index?) {
    let data = {
      acceptableTypes: acceptableTypes,
      files:
        index || index == 0
          ? this.selectedFiles[fileType][index]['filesData']
          : this.selectedFiles[fileType]['filesData'],
      uploadedFiles:
        index || index == 0
          ? this.selectedFiles[fileType][index]['uploadedFiles']
          : this.selectedFiles[fileType]['uploadedFiles'],
    };
    let fileUploadRef = this.dialogService.open(FileUploadComponent, {
      header: 'Select Files',
      width: '90%',
      contentStyle: { 'max-height': '500px', overflow: 'auto' },
      baseZIndex: 10000,
      data: data,
    });
    fileUploadRef.onClose.subscribe((files: any) => {
      if (files) {
        this.saveFiles(files, fileType, index);
      }
    });
  }
  saveFiles(files, fileType, index) {
    this.loading = true;
    if (files && files.length > 0) {
      const formData = new FormData();
      for (let file of files) {
        if (file && !file['fileuploaded']) {
          formData.append('files', file);
        }
      }
      const accountId = this.userDetails?.accountId || 'default';
      this.leadsService.uploadFiles(formData, this.leadId, fileType, accountId).subscribe(
        (response: any) => {
          if (response && response['links'] && response['links'].length > 0) {
            for (let i = 0; i < response['links'].length; i++) {
              index || index == 0
                ? this.selectedFiles[fileType][index]['links'].push(
                  response['links'][i]
                )
                : this.selectedFiles[fileType]['links'].push(
                  response['links'][i]
                );
            }
            for (let i = 0; i < files.length; i++) {
              files[i]['fileuploaded'] = true;
              index || index == 0
                ? this.selectedFiles[fileType][index]['filesData'].push(
                  files[i]
                )
                : this.selectedFiles[fileType]['filesData'].push(files[i]);
            }
            console.log(
              'this.selectedFiles',
              this.selectedFiles[fileType],
              files
            );
            this.toastService.showSuccess('Files Uploaded Successfully');
          } else {
            this.toastService.showError({ error: 'Something went wrong' });
          }
          this.loading = false;
        },
        (error: any) => {
          this.loading = false;
          this.toastService.showError(error);
        }
      );
    }
  }
  getFileIcon(fileType) {
    return this.leadsService.getFileIcon(fileType);
  }
  goBack(): void {
    this.location.back();
  }
}
