import { Component, OnInit } from '@angular/core';
import { LeadsService } from '../leads.service';
import { ToastService } from 'src/app/services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RoutingService } from 'src/app/services/routing-service';
import { HttpClient } from '@angular/common/http';
export interface FollowUpNote {
  date: string;
  remarks: string;
  updatedBy: string;
}
@Component({
  selector: 'app-lead-profile',
  templateUrl: './lead-profile.component.html',
  styleUrl: './lead-profile.component.scss',
})
export class LeadProfileComponent implements OnInit {
  breadCrumbItems: any = [];
  displayedItems: any = [];
  loading: boolean = false;
  leadId: string | null = null;
  leadsData: any;
  accountId: any;
  expandedRows: { [key: string]: boolean } = {};
  loanType: string = '';
  employmentStatus: string = '';
  leadUsers: any = [];
  isDialogVisible = false;
  selectLender: any = null;
  leadSources: any = [];
  userDetails: any;
  selectedRows: any[] = [];
  isFullscreen = false;
  bankMap = new Map<number, string>();
  banks: any = [];
  groupedGstData: { [key: string]: any[] } = {};
  isEditingRemarks: boolean = false;
  showTableDialog: boolean = false;
  version = projectConstantsLocal.VERSION_DESKTOP;
  leadInternalStatusList: any = projectConstantsLocal.LEAD_INTERNAL_STATUS;
  businessEntities: any = projectConstantsLocal.BUSINESS_ENTITIES;
  designationType: any = projectConstantsLocal.DOCTOR_OR_CA;
  carType: any = projectConstantsLocal.CAR_TYPE
  timelineEvents: { date: Date | null; title: string; image: string; }[];
  notes: FollowUpNote[] = [];
  newNote: FollowUpNote = { date: '', remarks: '', updatedBy: '' };
  messages: any[] = [];
  newMessage = '';
  receiver = '917331129435';
  // receiver = '919959864301';



  constructor(
    private route: ActivatedRoute,
    private leadsService: LeadsService,
    private location: Location,
    private router: Router,
    private http: HttpClient,
    private toastService: ToastService,
    private routingService: RoutingService,
    private localStorageService: LocalStorageService
  ) {
    this.getBankers();
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    const userDetails = this.localStorageService.getItemFromLocalStorage('userDetails');
    this.userDetails = userDetails.user;
    this.newNote.updatedBy = this.userDetails.name;
    this.accountId = this.userDetails?.accountId; // make sure accountId is available
    this.leadId = this.route.snapshot.paramMap.get('id');
    const status = this.route.snapshot.paramMap.get('status');
    if (this.leadId) {
      // if (!status) {
      //   this.getAllLeadData(this.leadId);
      // } else {
      //   const validStatuses = ['personalLoan', 'homeLoan', 'lap', 'professionalLoans', 'carLoan'];
      //   if (validStatuses.includes(status)) {
      //     this.getAllLoanLeadData(this.leadId);
      //   } else {
      //     console.warn('Unknown status:', status);
      //     this.getAllLeadData(this.leadId);
      //   }
      // }
      const validStatuses = ['personalLoan', 'homeLoan', 'lap', 'professionalLoans', 'carLoan'];

      if (status && validStatuses.includes(status)) {
        this.getAllLoanLeadData(this.leadId);
      } else {
        this.getAllLeadData(this.leadId);
      }
      this.loadNotes();
    }
    console.log(this.groupedGstData)
    this.breadCrumbItems = [
      {
        label: ' Home',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      {
        label: 'leads',
        routerLink: '/user/leads',
        queryParams: { v: this.version },
      },
      { label: 'Profile' },
    ];
    this.getLeadUsers();
    this.getLeadSourcesvalues();
    this.leadsService.onMessageReceived().subscribe(msg => {
      msg.status = "received"; // mark as received
      this.messages.push(msg);
    });

    this.leadsService.onMessageSent().subscribe(msg => {
      msg.status = "sent"; // single tick
      this.messages.push(msg);
    });
  }

  getAllLeadData(leadId: string) {
    this.loading = true;
    this.leadsService.getAllLeadData(leadId).subscribe(
      (response) => {
        this.leadsData = response;
        // console.log(this.leadsData);
        this.loanType = (this.leadsData?.leadData?.loanType || '')
        this.employmentStatus = (this.leadsData?.leadData?.employmentStatus || '')
        this.gstDetailsGroupData();
        this.updateDisplayedItems();
        this.setTimelineDates();
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  gstDetailsGroupData() {
    if (this.leadsData?.documents?.gstDetails?.length) {
      console.log(this.leadsData?.documents?.gstDetails)
      this.groupedGstData = this.leadsData?.documents?.gstDetails.reduce((acc, item) => {
        const state = item.operatingState || "Unknown";
        const year = item.year || "Unknown";

        if (!acc[state]) {
          acc[state] = {};
        }
        if (!acc[state][year]) {
          acc[state][year] = [];
        }

        acc[state][year].push(item);
        return acc;
      }, {});
    }
  }
  getAllLoanLeadData(leadId: string) {
    this.loading = true;
    this.leadsService.getAllLoanLeadData(leadId).subscribe(
      (response) => {
        this.leadsData = response;
        this.leadsData.documents = this.leadsData.documents || {};
        // console.log(this.leadsData);
        // console.log('Lead Status:', this.leadsData.leadStatusName);
        // console.log('Lead Internal Status:', this.leadsData.leadData?.leadInternalStatus);
        this.loanType = (this.leadsData?.leadData?.loanType || '')
        this.employmentStatus = (this.leadsData?.leadData?.employmentStatus || '')
        this.gstDetailsGroupData();
        this.updateDisplayedItems();
        this.setTimelineDates();
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  // onDownloadZip(): void {
  //   const accountId = 1270983;
  //   const leadId = 3745806921;
  //   const url = `https://files.loancrm.org/files?accountId=${accountId}&leadId=${leadId}&downloadZip=true`;

  //   this.http.get(url, { responseType: 'blob' }).subscribe({
  //     next: (blob: Blob) => {
  //       if (!blob || blob.size === 0) {
  //         console.error('Empty or invalid file received.');
  //         this.toastService.showError('Empty or invalid ZIP file received.');
  //         return;
  //       }
  //       const downloadURL = window.URL.createObjectURL(blob);
  //       const a = document.createElement('a');
  //       a.href = downloadURL;
  //       a.download = `lead_${leadId}_files.zip`;
  //       a.style.display = 'none';
  //       document.body.appendChild(a);
  //       a.click();
  //       document.body.removeChild(a);
  //       window.URL.revokeObjectURL(downloadURL);
  //     },
  //     error: (err) => {
  //       console.error('Download failed:', err);
  //       this.toastService.showError('ZIP download failed. Please try again.');
  //     }
  //   });
  // }

  loadNotes() {
    this.leadsService.getNotes(this.leadId).subscribe({
      next: (res: any) => {
        this.notes = res.notes || [];
      },
      error: (err) => console.error(err)
    });
  }

  addNote() {
    this.leadsService.addNote(this.leadId, this.newNote).subscribe({
      next: (res: any) => {
        console.log(this.notes)
        this.notes = res.notes;
        console.log(this.notes)
        this.newNote = { date: '', remarks: '', updatedBy: this.userDetails.name }; // reset
      },
      error: (err) => console.error(err)
    });
  }
  getYearTotal(records: any[]): number {
    return records.reduce((sum, item) => sum + (parseFloat(item.gst3BSale) || 0), 0);
  }

  getStateTotal(years: any): number {
    return Object.values(years).reduce(
      (sum: number, yearArr: any) => sum + this.getYearTotal(yearArr as any[]),
      0
    );
  }

  getGrandTotal(): number {
    return Object.values(this.groupedGstData || {}).reduce(
      (sum, state: any) => sum + this.getStateTotal(state),
      0
    );
  }
  onDownloadZip(applicantname): void {
    const name = applicantname
    console.log(name)
    if (this.leadId) {
      const url = this.leadsService.downloadZip(this.accountId, this.leadId, name);
      window.open(url, '_blank'); // Opens in new tab
    } else {
      this.toastService.showError('Lead ID is missing. Cannot download ZIP.');
    }
  }

  isBusinessView(): boolean {
    const lt = (this.loanType || '');
    const es = (this.employmentStatus || '');
    // console.log(this.loanType);
    // console.log(this.employmentStatus);
    return (
      (lt === 'homeLoan' && es === 'self-employed') ||
      (lt === 'lap' && es === 'self-employed') ||
      (lt === 'carLoan' && es === 'self-employed') ||
      (!['personalLoan', 'homeLoan', 'lap', 'professionalLoans', 'carLoan'].includes(lt))
    );
  }
  isPersonalView(): boolean {
    const lt = (this.loanType || '');
    const es = (this.employmentStatus || '');
    return (
      (lt === 'personalLoan' && es === 'employed') ||
      (lt === 'homeLoan' && es === 'employed') ||
      (lt === 'lap' && es === 'employed') ||
      (lt === 'carLoan' && es === 'employed') ||
      (lt === 'professionalLoans' && es === 'employed')
    );
  }
  isdesignation(): boolean {
    const lt = (this.loanType || '')
    const es = (this.employmentStatus || '')
    return (
      (lt === 'personalLoan' && es === 'employed') ||
      (lt === 'homeLoan' && es === 'employed') ||
      (lt === 'lap' && es === 'employed') ||
      (lt === 'carLoan' && es === 'employed')
    );
  }
  isdesignationtype(): boolean {
    const lt = (this.loanType || '')
    return (
      (lt === 'professionalLoans')
    );
  }
  isProprietorPersonal(): boolean {
    const lt = (this.loanType || '')
    const es = (this.employmentStatus || '')
    return ['personalLoan', 'homeLoan', 'lap', 'professionalLoans', 'carLoan'].includes(lt) && es === 'employed';
  }
  getDesignationValue(value: any, loanType: string): string {
    if (!value) return '';

    // Case 1: ProfessionalLoans → lookup by ID
    if (loanType === 'professionalLoans') {
      const found = this.designationType.find(user => user.id == value);
      return found?.displayName || '';
    }

    // Case 2: Other loans → already text
    return value;
  }



  getMaskedPhone(phone: any) {
    return this.leadsService.maskPhoneNumber(phone);
  }
  isImageFile(file: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const fileExtension = file.split('.').pop()?.toLowerCase();
    return !!fileExtension && imageExtensions.includes(fileExtension);
  }
  openWhatsApp(number: string) {
    const whatsappUrl = `https://wa.me/${number}`;
    window.open(whatsappUrl, '_blank');
  }

  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
  }
  isRowSelected(item: any): boolean {
    return this.selectedRows?.some(selected => selected.id === item.id);
  }

  toggleRow(index: number | string): void {
    this.expandedRows[index] = !this.expandedRows[index];
  }
  // getAllLeadData(leadId: string) {
  //   this.loading = true;
  //   this.leadsService.getAllLeadData(leadId).subscribe(
  //     (response) => {
  //       this.leadsData = response;
  //       this.loanType = (this.leadsData?.leadData?.loanType || '').toLowerCase();
  //       this.employmentStatus = (this.leadsData?.leadData?.employmentStatus || '').toLowerCase();

  //       // console.log(this.leadsData);
  //       // console.log('leads full data:', this.leadsData);
  //       this.updateDisplayedItems();
  //       this.setTimelineDates();
  //       this.loading = false; // Ensure loading is set to false after data is processed
  //     },
  //     (error: any) => {
  //       this.loading = false;
  //       this.toastService.showError(error);
  //     }
  //   );
  // }
  // getAllLoanLeadData(leadId: string) {
  //   this.loading = true;
  //   this.leadsService.getAllLoanLeadData(leadId).subscribe(
  //     (response) => {
  //       this.leadsData = response;
  //       // console.log('loanleads full data:', this.loanleads);
  //       console.log(this.leadsData.leadData);
  //       // console.log('loanleads full data:', this.loanleads.logins);
  //       // console.log("loanleads.logins length:", this.loanleads?.logins?.length);  // ✅ Ensure array exists

  //       // console.log(this.loanleads.leaData.logins);
  //       // console.log(this.loanleads.leadData.loanType);
  //       // console.log(this.loanleads.leadData.employmentStatus);
  //       // console.log(this.loanleads.leadData.salary);
  //       // console.log(this.loanleads.leadData.sanctionedAmount);
  //       // console.log(this.loanleads.leadData.logins);
  //       this.updateDisplayedItems();
  //       this.setTimelineDates();
  //       this.loading = false; // Ensure loading is set to false after data is processed
  //     },
  //     (error: any) => {
  //       this.loading = false;
  //       this.toastService.showError(error);
  //     }
  //   );
  // }

  saveRemarks(newRemark: string) {
    this.isEditingRemarks = false;
    const leadId = this.leadsData.leadData.id
    const payload = {
      businessName: this.leadsData.leadData.businessName,
      remarks: newRemark
    };

    this.leadsService.updateLead(leadId, payload).subscribe({
      next: () => {
        this.toastService.showSuccess('Remarks updated successfully');
      },
      error: (err) => {
        this.toastService.showError('Failed to update remarks');
        console.error(err);
      }
    });
  }
  showUserDetails(user: any): void {
    // console.log('User details:', user);
    this.selectLender = user.data;
    this.isDialogVisible = true;
  }
  clearDialog(): void {
    this.selectLender = null;
    this.isDialogVisible = false;
  }

  convertToLakhsOrCrores(amount: number): string {
    // console.log(amount);
    if (amount >= 10000000) {
      const crores = amount / 10000000;

      return crores % 1 === 0
        ? crores.toFixed(0) + ' Cr'
        : crores.toFixed(2) + ' Cr';
    } else if (amount >= 100000) {
      const lakhs = amount / 100000;
      return lakhs % 1 === 0
        ? lakhs.toFixed(0) + ' L'
        : lakhs.toFixed(2) + ' L';
    } else {
      return amount % 1 === 0 ? amount.toFixed(0) : amount.toString();
    }
  }
  setTimelineDates(): void {
    const baseTimeline = [
      { title: 'Lead Created', image: 'assets/images/icons/leads.svg' },
      { title: 'Files Uploaded', image: 'assets/images/icons/files.svg' },
      { title: 'Credit Evaluation', image: 'assets/images/icons/credit.svg' },
      { title: 'Login', image: 'assets/images/icons/logins.svg' },
      { title: 'Approved', image: 'assets/images/icons/sanctions.svg' },
      { title: 'Disbursed', image: 'assets/images/icons/disbursal.svg' }
    ];

    this.timelineEvents = baseTimeline.map(item => {
      let date = null;
      switch (item.title) {
        case 'Lead Created':
          date = this.leadsData?.leadData?.createdOn;
          break;
        case 'Files Uploaded':
          date = this.leadsData?.documents?.createdOn;
          break;
        case 'Credit Evaluation':
          date = this.leadsData?.credits?.createdOn;
          break;
        case 'Login':
          date = this.leadsData?.leadData?.loginDate;
          break;
        case 'Approved':
          date = this.leadsData?.leadData?.approvalDate;
          break;
        case 'Disbursed':
          date = this.leadsData?.leadData?.disbursalDate;
          break;
      }
      return { ...item, date: date ? new Date(date) : null };
    });

    // If no timeline events are set, handle accordingly (e.g., setting default dates or showing a message)
    if (!this.timelineEvents || this.timelineEvents.length === 0) {
      console.warn('No timeline events found for the provided lead.');
    }
  }

  // getLeadById(id: string) {
  //   this.loading = true;
  //   this.leadsService.getLeadDetailsById(id).subscribe(
  //     (response) => {
  //       this.leads = response;
  //       console.log('leads', this.leads);
  //       this.updateDisplayedItems();
  //       this.loading = false;
  //     },
  //     (error: any) => {
  //       this.loading = false;
  //       this.toastService.showError(error);
  //     }
  //   );
  // }

  getLoanLeadById(id: string) {
    this.loading = true;
    this.leadsService.getLoanLeadById(id).subscribe(
      (response) => {
        this.leadsData = response[0];
        // console.log('loanleads', this.loanleads);
        this.updateDisplayedItems();
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  // updateDisplayedItems() {
  //   const loanDisplayProperty =
  //     this.leadsData && this.leadsData?.employmentStatus === 'employed'
  //       ? 'contactPerson'
  //       : 'businessName';
  //   this.displayedItems = [
  //     { data: this.leadsData?.leadData, displayProperty: 'businessName', image: "assets/images/profile/office.png", },
  //     { data: this.leadsData, displayProperty: loanDisplayProperty, image: "assets/images/profile/profile.png" },
  //   ];
  // }
  updateDisplayedItems() {
    if (this.isBusinessView()) {
      // console.log("isBusinessView");
      this.displayedItems = [
        {
          data: this.leadsData?.leadData,
          displayProperty: 'businessName',
          image: 'assets/images/profile/office.png'
        }
      ];
    } else if (this.isPersonalView()) {
      console.log("isPersonalView");
      this.displayedItems = [
        {
          data: this.leadsData?.leadData,
          displayProperty: 'contactPerson',
          image: 'assets/images/profile/profile.png'
        }
      ];
    } else {
      this.displayedItems = [];
    }
  }

  getSourceName(userId) {
    if (this.leadUsers && this.leadUsers.length > 0) {
      let leadUserName = this.leadUsers.filter(
        (leadUser) => leadUser.id == userId
      );
      return (leadUserName && leadUserName[0] && leadUserName[0].name) || '';
    }
    return '';
  }
  //   getDesignationType(value: any): string {
  //   if (!value) return '';

  //   // Ensure list exists
  //   if (Array.isArray(this.designationType) && this.designationType.length > 0) {
  //     // Convert both to string to avoid type mismatch
  //     const found = this.designationType.find(user => String(user.id) === String(value));
  //     if (found) {
  //       return found.displayName;
  //     }
  //   }

  //   // If nothing matched → fallback: show text as-is
  //   if (typeof value === 'string') {
  //     return value;
  //   }

  //   return '';
  // }

  getDesignationType(value: any): string {
    if (!value) return '';

    if (Array.isArray(this.designationType) && this.designationType.length > 0) {
      const found = this.designationType.find(
        user => String(user.id) === String(value)
      );
      if (found) {
        console.log('Designation found:', found.displayName);  // 👈 Debug
        return found.displayName;
      }
    }

    if (typeof value === 'string') {
      console.log('Designation string:', value);  // 👈 Debug
      return value;
    }

    return '';
  }

  getCarType(value: any): string {
    if (!value) return '';

    if (Array.isArray(this.carType) && this.getCarType.length > 0) {
      const found = this.carType.find(
        user => String(user.id) === String(value)
      );
      if (found) {
        console.log('Designation found:', found.displayName);  // 👈 Debug
        return found.displayName;
      }
    }

    if (typeof value === 'string') {
      console.log('Designation string:', value);  // 👈 Debug
      return value;
    }

    return '';
  }
  getStatusName(statusId) {
    if (this.leadInternalStatusList && this.leadInternalStatusList.length > 0) {
      let leadStatusName = this.leadInternalStatusList.filter(
        (leadStatus) => leadStatus.id == statusId
      );
      return (
        (leadStatusName &&
          leadStatusName[0] &&
          leadStatusName[0].displayName) ||
        ''
      );
    }
    return '';
  }

  getEntityName(entity) {
    if (this.businessEntities && this.businessEntities.length > 0) {
      let entityName = this.businessEntities.filter(
        (leadStatus) => leadStatus.name == entity
      );
      return (
        (entityName &&
          entityName[0] &&
          entityName[0].displayName) ||
        ''
      );
    }
    return '';
  }
  getLeadUsers(filter = {}) {
    this.loading = true;
    this.leadsService.getUsers(filter).subscribe(
      (leadUsers) => {
        this.leadUsers = leadUsers;
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  getLeadSourceName(userId) {
    if (this.leadSources && this.leadSources.length > 0) {
      let leadSourceName = this.leadSources.filter(
        (leadUser) => leadUser.id == userId
      );
      return (
        (leadSourceName && leadSourceName[0] && leadSourceName[0].name) || ''
      );
    }
    return '';
  }
  getLeadSourcesvalues(filter = {}) {
    this.loading = true;
    this.leadsService.getLeadSources(filter).subscribe(
      (leadSources) => {
        this.leadSources = leadSources;
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  // updateLead(leadId) {
  //   this.routingService.handleRoute('leads/update/' + leadId, null);
  // }

  updateLead(lead: any) {
    console.log('Row clicked:', lead);
    const loanType = lead.loanType; // e.g., 'personalloan', 'home loan', etc.
    if (loanType === 'personalLoan' || loanType === 'homeLoan' || loanType === 'lap' || loanType === 'professionalLoans' || loanType === 'carLoan') {
      this.routingService.handleRoute('leads/updateLoanLead/' + lead.leadId, null);
    } else {
      this.routingService.handleRoute('leads/update/' + lead.id, null);
    }
  }
  goBack() {
    this.location.back();
  }
  getFileIcon(fileType) {
    return this.leadsService.getFileIcon(fileType);
  }
  getBankers(filter = {}) {
    this.loading = true;
    this.leadsService.getBankers(filter).subscribe(
      (response: any) => {
        this.banks = [{ name: 'All' }, ...response];

        // Create a Map for quick lookup
        this.bankMap.clear();
        for (const bank of response) {
          if (bank.id && bank.name) {
            this.bankMap.set(bank.id, bank.name);
          }
        }
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  getLenderName(bankId: number): string {
    return this.bankMap.get(bankId) || '';
  }
  isValidDate(date: any): boolean {
    return date && !isNaN(new Date(date).getTime());
  }
  sendMessage() {
    if (this.newMessage.trim()) {
      this.leadsService.sendMessage(this.receiver, this.newMessage).subscribe();
      this.newMessage = '';
    }
  }
}
