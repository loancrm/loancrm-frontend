import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { LeadsService } from '../leads/leads.service';
import { MenuItem } from 'primeng/api';
import { RoutingService } from 'src/app/services/routing-service';
import { ToastService } from 'src/app/services/toast.service';
import { Location } from '@angular/common';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-rejects',
  templateUrl: './rejects.component.html',
  styleUrl: './rejects.component.scss',
})
export class RejectsComponent implements OnInit {
  leads: any = [];
  loading: any;
  totalLeadsCount: any = 0;
  leadIdToSearch: any;
  breadCrumbItems: any = [];
  businessNameToSearch: any;
  mobileNumberToSearchforbank: any;
  businessNameToSearchforbank: any;
  businessNameToSearchforplbank: any;
  mobileNumberToSearchcni: any;
  businessNameToSearchcni: any;
  businessNameToSearchplcni: any;
  currentTableEvent: any;
  selectedSourcedByStatus: any;
  selectedplSourcedByStatus: any;
  selectedSourcedByStatusforbank: any;
  selectedplSourcedByStatusforbank: any;
  selectedSourcedByStatusforcni: any;
  selectedSourcedByStatusforplcni: any;
  leadStatus: any = projectConstantsLocal.REJECTED_STATUS;
  appliedFilter: {};
  plappliedFilter: {};
  appliedFilterforbank: {};
  plappliedFilterforbank: {};
  appliedFilterforcni: {};
  plappliedFilterforcni: {};
  filterConfig: any[] = [];
  searchFilter: any = {};
  plsearchFilter: any = {};
  mobileNumberToSearch: any;
  businessNameToSearchForPersonal: any;
  searchFilterbank: any = {};
  plsearchFilterbank: any = {};
  searchFiltercni: any = {};
  plsearchFiltercni: any = {};
  @ViewChild('leadsTable') leadsTable!: Table;
  @ViewChild('leadsTablebank') leadsTablebank!: Table;
  @ViewChild('plleadsTablebank') plleadsTablebank!: Table;
  @ViewChild('leadsTablecni') leadsTablecni!: Table;
  @ViewChild('plleadsTablecni') plleadsTablecni!: Table;
  leadSources: any = [];
  activeItem: any;
  items: any;
  leadUsers: any = [];
  apiLoading: any;
  leadInternalStatusList: any = projectConstantsLocal.LEAD_INTERNAL_STATUS;
  turnoverDetails: any = projectConstantsLocal.BUSINESS_TURNOVER;
  entityDetails: any = projectConstantsLocal.BUSINESS_ENTITIES;
  natureofBusinessDetails: any = projectConstantsLocal.NATURE_OF_BUSINESS;
  hadOwnHouse = projectConstantsLocal.YES_OR_NO;
  version = projectConstantsLocal.VERSION_DESKTOP;
  businessEntities = projectConstantsLocal.BUSINESS_ENTITIES;
  userDetails: any;
  rejectStatus: any = projectConstantsLocal.REJECTED_STATUS;
  selectedLoginStatus = this.rejectStatus[0];
  selectedplLoginStatus = this.rejectStatus[0];
  @ViewChild('personalleadsTable') personalleadsTable!: Table;
  constructor(
    private location: Location,
    private leadsService: LeadsService,
    private toastService: ToastService,
    private routingService: RoutingService,
    private localStorageService: LocalStorageService
  ) {
    this.breadCrumbItems = [
      {
        label: ' Home',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      { label: 'Rejects' },
    ];
    this.getLeadUsers();
  }

  ngOnInit() {
    // this.items = [
    //   { label: 'In House Rejects', name: 'inHouseRejects' },
    //   { label: 'Banker Rejects', name: 'bankerRejects' },
    //   { label: 'CNI', name: 'cni' },
    // ];
    // this.loadActiveItem();
    // this.loadAllLeadData().then(() => {
    this.items = this.getFilteredItems();
    this.loadActiveItem();
    // this.employmentStatus = this.getStatusItems();
    // this.loadEmploymentActiveItem();
    // });
    let userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    this.userDetails = userDetails.user;
    this.setFilterConfig();
    const storedAppliedFilter =
      this.localStorageService.getItemFromLocalStorage(
        'inhouseRejectsAppliedFilter'
      );
    if (storedAppliedFilter) {
      this.appliedFilter = storedAppliedFilter;
    }
    const storedAppliedFiltercni =
      this.localStorageService.getItemFromLocalStorage('cniAppliedFilter');
    if (storedAppliedFiltercni) {
      this.appliedFilterforcni = storedAppliedFiltercni;
    }
    const storedAppliedFilterbank = this.localStorageService.getItemFromLocalStorage(
      'bankrejectsAppliedFilter'
    );
    if (storedAppliedFilterbank) {
      this.appliedFilterforbank = storedAppliedFilterbank;
    }
    const storedStatus = this.localStorageService.getItemFromLocalStorage('selectedInhouseRejects');
    if (storedStatus) {
      this.selectedSourcedByStatus = storedStatus;
    }
    const storedStatus1 = this.localStorageService.getItemFromLocalStorage('selectedBankRejects');
    if (storedStatus1) {
      this.selectedSourcedByStatusforbank = storedStatus1;
    }
    const storedStatus2 = this.localStorageService.getItemFromLocalStorage('selectedCNI');
    if (storedStatus2) {
      this.selectedSourcedByStatusforcni = storedStatus2;
    }
  }
  getFilteredItems(): { label: string; name: string }[] {
    return [
      {
        label: `Business Loan `,
        name: 'businessLoan',
      },
      {
        // label: `Personal Loan (${this.totalLeadsCountArray?.personalcount || 0
        //   })`,
        label: `Personal Loan
        `,
        name: 'personalLoan',
      },
      {
        label: `Home Loan`,
        name: 'homeLoan',
      },
      {
        label: `LAP `,
        name: 'lap',
      },
      {
        label: `Professional Loans`,
        name: 'professionalLoans',
      },
      {
        label: `Educational Loans `,
        name: 'educationlLoans',
      },
      {
        label: `Car loans`,
        name: 'carLoan',
      },
      {
        label: `Commercial Vehicle Loans`,
        name: 'commercialVehicleLoan',
      },
    ];
  }



  loadActiveItem() {
    const storedActiveItemName =
      this.localStorageService.getItemFromLocalStorage('rejectsActiveItem');
    if (storedActiveItemName) {
      this.activeItem =
        this.items.find((item) => item.name === storedActiveItemName) ||
        this.items[0];
    } else {
      this.activeItem = this.items[0];
    }
  }
  setFilterConfig() {
    this.filterConfig = [
      {
        header: 'Lead Id',
        data: [
          {
            field: 'id',
            title: 'Lead Id',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Business Name',
        data: [
          {
            field: 'businessName',
            title: 'Business Name',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Date Range',
        data: [
          {
            field: 'createdOn',
            title: 'From',
            type: 'date',
            filterType: 'gte',
          },
          { field: 'createdOn', title: 'To', type: 'date', filterType: 'lte' },
        ],
      },
      {
        header: 'Phone Number',
        data: [
          {
            field: 'primaryPhone',
            title: 'Phone Number',
            type: 'text',
            filterType: 'like',
          },
        ],
      },

      {
        header: 'Business Entity',
        data: [
          {
            field: 'businessEntity',
            title: 'Business Entity',
            type: 'dropdown',
            filterType: 'like',
            options: this.entityDetails.map((entity) => ({
              label: entity.displayName,
              value: entity.name,
            })),
          },
        ],
      },
      {
        header: 'Contact Person',
        data: [
          {
            field: 'contactPerson',
            title: 'Contact Person Name',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'City',
        data: [
          {
            field: 'city',
            title: 'City Name',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Business Turnover',
        data: [
          {
            field: 'businessTurnover',
            placeholder: 'Select Turnover',
            title: 'Business Turnover',
            type: 'dropdown',
            filterType: 'like',

            options: this.turnoverDetails.map((turnover) => ({
              label: turnover.displayName,
              value: turnover.name,
            })),
          },
        ],
      },
      {
        header: 'Nature Of Business',
        data: [
          {
            field: 'natureOfBusiness',
            title: 'Nature of Business',
            type: 'dropdown',
            filterType: 'like',
            options: this.natureofBusinessDetails.map((natureofB) => ({
              label: natureofB.displayName,
              value: natureofB.name,
            })),
          },
        ],
      },
      {
        header: 'created On  ',
        data: [
          {
            field: 'createdOn',
            title: 'Date ',
            type: 'date',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Had Own House',
        data: [
          {
            field: 'hadOwnHouse',
            title: 'Had Own House',
            type: 'dropdown',
            filterType: 'like',
            options: this.hadOwnHouse.map((ownHouse) => ({
              label: ownHouse.displayName,
              value: ownHouse.name,
            })),
          },
        ],
      },
    ];
  }
  onActiveItemChange(event) {
    // console.log(event);
    this.activeItem = event;
    this.localStorageService.setItemOnLocalStorage(
      'rejectsActiveItem',
      event.name
    );
  }
  applyConfigFilters(event) {
    let api_filter = event;
    if (api_filter['reset']) {
      delete api_filter['reset'];
      this.appliedFilter = {};
    } else {
      this.appliedFilter = api_filter;
    }
    this.localStorageService.setItemOnLocalStorage(
      'inhouseRejectsAppliedFilter',
      this.appliedFilter
    );
    this.loadLeads(null);
  }
  applyConfigFiltersforcni(event) {
    let api_filter = event;
    if (api_filter['reset']) {
      delete api_filter['reset'];
      this.appliedFilterforcni = {};
    } else {
      this.appliedFilterforcni = api_filter;
    }
    this.localStorageService.setItemOnLocalStorage(
      'cniAppliedFilter',
      this.appliedFilterforcni
    );
    this.loadCNIRejectedLeads(null);
  }
  applyConfigFiltersforbank(event) {
    let api_filter = event;
    if (api_filter['reset']) {
      delete api_filter['reset'];
      this.appliedFilterforbank = {};
    } else {
      this.appliedFilterforbank = api_filter;
    }
    this.localStorageService.setItemOnLocalStorage(
      'bankrejectsAppliedFilter',
      this.appliedFilterforbank
    );
    this.loadBankRejectedLeads(this.currentTableEvent);
  }
  loginstatusChange(event: any) {
    this.selectedLoginStatus = event.value; // store the whole object if needed
    // console.log(this.selectedLoginStatus)
  }

  loginplstatusChange(event: any) {
    this.selectedplLoginStatus = event.value; // store the whole object if needed
    // console.log(this.selectedplLoginStatus)
  }

  loadLeads(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['leadInternalStatus-eq'] = '10';
    if (this.selectedSourcedByStatus && this.selectedSourcedByStatus.name) {
      if (this.selectedSourcedByStatus.name != 'All') {
        api_filter['sourcedBy-eq'] = this.selectedSourcedByStatus.id;
      }
    }
    // console.log(api_filter);
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilter,
      this.appliedFilter
    );
    if (api_filter) {
      this.getTotalLeadsFilesCount(api_filter);
      this.getTotalLeads(api_filter);
    }
  }


  loadplLeads(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['leadInternalStatus-eq'] = '10';
    if (this.selectedplSourcedByStatus && this.selectedplSourcedByStatus.name) {
      if (this.selectedplSourcedByStatus.name != 'All') {
        api_filter['sourcedBy-eq'] = this.selectedplSourcedByStatus.id;
      }
    }
    // console.log(api_filter);
    api_filter = Object.assign(
      {},
      api_filter,
      this.plsearchFilter,
      this.plappliedFilter
    );
    if (api_filter) {
      this.getplTotalLeadsCount(api_filter);
      this.getplTotalLeads(api_filter);
    }
  }

  getplTotalLeads(filter = {}) {
    this.apiLoading = true;
    this.leadsService.getloanLeads(filter).subscribe(
      (response) => {
        this.leads = response;
        this.apiLoading = false;
        // console.log(this.leads)
      },
      (error: any) => {
        this.apiLoading = false;
        this.toastService.showError(error);
      }
    );
  }
  getplTotalLeadsCount(filter = {}) {
    this.leadsService.getloanLeadsCount(filter).subscribe(
      (leadsCount) => {
        this.totalLeadsCount = leadsCount;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  loadBankRejectedLeads(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    if (
      this.selectedSourcedByStatusforbank &&
      this.selectedSourcedByStatusforbank.name
    ) {
      if (this.selectedSourcedByStatusforbank.name != 'All') {
        api_filter['sourcedBy-eq'] = this.selectedSourcedByStatusforbank.id;
      }
    }
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilterbank,
      this.appliedFilterforbank
    );
    if (api_filter) {
      this.getBankRejectedLeadCount(api_filter);
      this.getBankRejectsLeads(api_filter);
    }
  }

  loadplBankRejectedLeads(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    if (
      this.selectedplSourcedByStatusforbank &&
      this.selectedplSourcedByStatusforbank.name
    ) {
      if (this.selectedplSourcedByStatusforbank.name != 'All') {
        api_filter['sourcedBy-eq'] = this.selectedplSourcedByStatusforbank.id;
      }
    }
    api_filter = Object.assign(
      {},
      api_filter,
      this.plsearchFilterbank,
      this.plappliedFilterforbank
    );
    if (api_filter) {
      this.getplBankRejectedLeadCount(api_filter);
      this.getplBankRejectsLeads(api_filter);
    }
  }
  getplBankRejectsLeads(filter = {}) {
    this.apiLoading = true;
    this.leadsService.getplBankRejectsLeads(filter).subscribe(
      (leads) => {
        this.leads = leads;
        this.apiLoading = false;
      },
      (error: any) => {
        this.apiLoading = false;
        this.toastService.showError(error);
      }
    );
  }

  getplBankRejectedLeadCount(filter = {}) {
    this.leadsService.getplBankRejectedLeadCount(filter).subscribe(
      (leadsCount) => {
        this.totalLeadsCount = leadsCount;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  loadCNIRejectedLeads(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    if (
      this.selectedSourcedByStatusforcni &&
      this.selectedSourcedByStatusforcni.name
    ) {
      if (this.selectedSourcedByStatusforcni.name != 'All') {
        api_filter['sourcedBy-eq'] = this.selectedSourcedByStatusforcni.id;
      }
    }
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFiltercni,
      this.appliedFilterforcni
    );
    if (api_filter) {
      this.getCNIRejectedLeadCount(api_filter);
      this.getCNIRejectsLeads(api_filter);
    }
  }

  loadplCNIRejectedLeads(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    if (
      this.selectedSourcedByStatusforplcni &&
      this.selectedSourcedByStatusforplcni.name
    ) {
      if (this.selectedSourcedByStatusforplcni.name != 'All') {
        api_filter['sourcedBy-eq'] = this.selectedSourcedByStatusforplcni.id;
      }
    }
    api_filter = Object.assign(
      {},
      api_filter,
      this.plsearchFiltercni,
      this.plappliedFilterforcni
    );
    if (api_filter) {
      this.getplCNIRejectedLeadCount(api_filter);
      this.getplCNIRejectsLeads(api_filter);
    }
  }
  getplCNIRejectsLeads(filter = {}) {
    this.apiLoading = true;
    this.leadsService.getplCNIRejectsLeads(filter).subscribe(
      (leads) => {
        this.leads = leads;
        this.apiLoading = false;
      },
      (error: any) => {
        this.apiLoading = false;
        this.toastService.showError(error);
      }
    );
  }
  getplCNIRejectedLeadCount(filter = {}) {
    this.leadsService.getplCNIRejectedLeadCount(filter).subscribe(
      (leadsCount) => {
        this.totalLeadsCount = leadsCount;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  statusChange(event) {
    this.localStorageService.setItemOnLocalStorage(
      'selectedInhouseRejects',
      event.value
    );
    this.loadLeads(this.currentTableEvent);
  }


  plstatusChange(event) {
    // this.localStorageService.setItemOnLocalStorage(
    //   'selectedInhouseRejects',
    //   event.value
    // );
    this.loadplLeads(this.currentTableEvent);
  }
  filterWithBusinessNameForPersonal() {
    let searchFilterPersonal = {
      'contactPerson-like': this.businessNameToSearchForPersonal,
    };
    this.applyFiltersPersonal(searchFilterPersonal);
  }

  filterWithBusinessNameforplBank() {
    let searchFilterPersonal = {
      'contactPerson-like': this.businessNameToSearchforplbank,
    };
    this.applyFiltersplbank(searchFilterPersonal);
  }
  applyFiltersPersonal(searchFilterPersonal = {}) {
    this.plsearchFilter = searchFilterPersonal;
    this.loadplLeads(this.currentTableEvent);
  }
  statusChangeforcni(event) {
    this.localStorageService.setItemOnLocalStorage('selectedCNI', event.value);
    this.loadCNIRejectedLeads(this.currentTableEvent);
  }

  statusChangeforplcni(event) {
    this.localStorageService.setItemOnLocalStorage('selectedCNI', event.value);
    this.loadplCNIRejectedLeads(this.currentTableEvent);
  }
  statusChangeforbank(event) {
    this.localStorageService.setItemOnLocalStorage(
      'selectedBankRejects',
      event.value
    );
    this.loadBankRejectedLeads(this.currentTableEvent);
  }

  plstatusChangeforbank(event) {
    this.localStorageService.setItemOnLocalStorage(
      'selectedBankRejects',
      event.value
    );
    this.loadplBankRejectedLeads(this.currentTableEvent);
  }
  getTotalLeadsFilesCount(filter = {}) {
    this.leadsService.getLeadsCount(filter).subscribe(
      (leadsCount) => {
        this.totalLeadsCount = leadsCount;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getBankRejectedLeadCount(filter = {}) {
    this.leadsService.getBankRejectedLeadCount(filter).subscribe(
      (leadsCount) => {
        this.totalLeadsCount = leadsCount;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getCNIRejectedLeadCount(filter = {}) {
    this.leadsService.getCNIRejectedLeadCount(filter).subscribe(
      (leadsCount) => {
        this.totalLeadsCount = leadsCount;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  getTotalLeads(filter = {}) {
    this.apiLoading = true;
    this.leadsService.getInhouseRejectedLeads(filter).subscribe(
      (response) => {
        this.leads = response;
        this.apiLoading = false;
        // console.log(this.leads)
      },
      (error: any) => {
        this.apiLoading = false;
        this.toastService.showError(error);
      }
    );
  }

  getBankRejectsLeads(filter = {}) {
    this.apiLoading = true;
    this.leadsService.getBankRejectsLeads(filter).subscribe(
      (leads) => {
        this.leads = leads;
        this.apiLoading = false;
      },
      (error: any) => {
        this.apiLoading = false;
        this.toastService.showError(error);
      }
    );
  }

  getCNIRejectsLeads(filter = {}) {
    this.apiLoading = true;
    this.leadsService.getCNIRejectsLeads(filter).subscribe(
      (leads) => {
        this.leads = leads;
        this.apiLoading = false;
      },
      (error: any) => {
        this.apiLoading = false;
        this.toastService.showError(error);
      }
    );
  }
  filterWithMobileNumber() {
    let searchFilter = { 'primaryPhone-like': this.mobileNumberToSearch };
    this.applyFilters(searchFilter);
  }

  filterWithMobileNumberforbank() {
    let searchFilterbank = {
      'primaryPhone-like': this.mobileNumberToSearchforbank,
    };
    this.applyFiltersbank(searchFilterbank);
  }
  filterWithMobileNumbercni() {
    let searchFiltercni = { 'primaryPhone-like': this.mobileNumberToSearchcni };
    this.applyFiltersforCni(searchFiltercni);
  }

  inputValueChangeEvent(dataType, value) {
    if (value == '') {
      this.searchFilter = {};
      this.leadsTable.reset();
    }
  }

  inputValueChangeEventcni(dataType, value) {
    if (value == '') {
      this.searchFiltercni = {};
      this.leadsTablecni.reset();
    }
  }
  inputValueChangeEventplcni(dataType, value) {
    if (value == '') {
      this.plsearchFiltercni = {};
      this.plleadsTablecni.reset();
    }
  }
  inputValueChangeEventforbank(dataType, value) {
    if (value == '') {
      this.searchFilterbank = {};
      this.leadsTablebank.reset();
    }
  }

  inputValueChangeEventforplbank(dataType, value) {
    if (value == '') {
      this.plsearchFilterbank = {};
      this.plleadsTablebank.reset();
    }
  }
  filterWithBusinessName() {
    let searchFilter = { 'businessName-like': this.businessNameToSearch };
    this.applyFilters(searchFilter);
  }

  filterWithBusinessNameforCNI() {
    let searchFiltercni = { 'businessName-like': this.businessNameToSearchcni };
    this.applyFiltersforCni(searchFiltercni);
  }
  filterWithBusinessNameforplCNI() {
    let searchFilterPersonal = {
      'contactPerson-like': this.businessNameToSearchplcni,
    };
    this.applyFiltersforplCni(searchFilterPersonal);
  }

  applyFiltersforplCni(searchFiltercni = {}) {
    this.plsearchFiltercni = searchFiltercni;
    this.loadplCNIRejectedLeads(this.currentTableEvent);
  }
  filterWithBusinessNameforBank() {
    let searchFilterbank = {
      'businessName-like': this.businessNameToSearchforbank,
    };
    this.applyFiltersbank(searchFilterbank);
  }

  applyFilters(searchFilter = {}) {
    this.searchFilter = searchFilter;
    this.loadLeads(this.currentTableEvent);
  }

  applyFiltersforCni(searchFiltercni = {}) {
    this.searchFiltercni = searchFiltercni;
    this.loadCNIRejectedLeads(this.currentTableEvent);
  }

  applyFiltersbank(searchFilterbank = {}) {
    this.searchFilterbank = searchFilterbank;
    this.loadBankRejectedLeads(this.currentTableEvent);
  }

  applyFiltersplbank(searchFilterbank = {}) {
    this.plsearchFilterbank = searchFilterbank;
    this.loadplBankRejectedLeads(this.currentTableEvent);
  }
  getLeadUsers(filter = {}) {
    this.loading = true;
    this.leadsService.getUsers(filter).subscribe(
      (leadUsers: any) => {
        this.leadUsers = [{ name: 'All' }, ...leadUsers];
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
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

  // viewLead(event) {
  //   const lead = event.data
  //   this.routingService.handleRoute('leads/profile/' + lead.id, null);
  // }

  viewLead(event: any) {
    // console.log('Row clicked:', event.data);
    const lead = event.data
    const loanType = lead.loanType; // e.g., 'personalloan', 'home loan', etc.
    if (loanType === 'personalLoan' || loanType === 'homeLoan' || loanType === 'lap') {
      this.routingService.handleRoute(`leads/profile/${loanType}/${lead.leadId}`, null);
    } else {
      // If no known loanType, omit status from the route
      this.routingService.handleRoute(`leads/profile/${lead.id}`, null);
    }
  }

  rejectsDetails(leadId) {
    this.routingService.handleRoute('rejects/rejectsDetails/' + leadId, null);
  }

  plrejectsDetails(lead) {
    const loanType = lead.loanType; // e.g., 'personalloan', 'home loan', etc.
    if (loanType === 'personalLoan' || loanType === 'homeLoan' || loanType === 'lap') {
      this.routingService.handleRoute(`rejects/rejectsDetails/${loanType}/${lead.leadId}`, null);
    } else {
      // If no known loanType, omit status from the route
      this.routingService.handleRoute(`rejects/rejectsDetails/${lead.id}`, null);
    }
  }



  inhouserejectsDetails(leadId) {
    this.routingService.handleRoute('rejects/inHouseRejects/' + leadId, null);
  }

  cniDetails(leadId) {
    this.routingService.handleRoute('rejects/cniDetails/' + leadId, null);
  }
  plcniDetails(lead) {
    const loanType = lead.loanType; // e.g., 'personalloan', 'home loan', etc.
    if (loanType === 'personalLoan' || loanType === 'homeLoan' || loanType === 'lap') {
      this.routingService.handleRoute(`rejects/cniDetails/${loanType}/${lead.leadId}`, null);
    } else {
      this.routingService.handleRoute(`rejects/cniDetails/${lead.id}`, null);
    }
  }

  actionItems(lead: any): MenuItem[] {
    const menuItems: any = [
      {
        label: 'Actions',
        items: [
          // {
          //   label: 'View',
          //   icon: 'pi pi-eye',
          //   command: () => this.viewLead(lead.id),
          // },
          {
            label: 'Rejects Details',
            icon: 'pi pi-info-circle',
            command: () => this.inhouserejectsDetails(lead.id),
          },
          {
            label: 'Send to files',
            icon: 'pi pi-sign-in',
            command: () => this.revertToFiles(lead),
          },
          {
            label: 'Send to Credit Evaluation',
            icon: 'pi pi-sign-in',
            command: () => this.revertToCredit(lead),
          },
        ],
      },
    ];
    return menuItems;
  }

  plactionItems(lead: any): MenuItem[] {
    const menuItems: any = [
      {
        label: 'Actions',
        items: [
          {
            label: 'Send to Credit Evaluation',
            icon: 'pi pi-sign-in',
            command: () => this.revertToplCredit(lead),
          },
        ],
      },
    ];
    return menuItems;
  }

  actionItemsforBank(lead: any): MenuItem[] {
    const menuItems: any = [
      {
        label: 'Actions',
        items: [
          // {
          //   label: 'View',
          //   icon: 'pi pi-eye',
          //   command: () => this.viewLead(lead.id),
          // },
          {
            label: 'Rejects Details',
            icon: 'pi pi-info-circle',
            command: () => this.rejectsDetails(lead.id),
          },
        ],
      },
    ];
    return menuItems;
  }
  actionItemsforCni(lead: any): MenuItem[] {
    const menuItems: any = [
      {
        label: 'Actions',
        items: [
          // {
          //   label: 'View',
          //   icon: 'pi pi-eye',
          //   command: () => this.viewLead(lead.id),
          // },
          {
            label: 'Rejects Details',
            icon: 'pi pi-info-circle',
            command: () => this.cniDetails(lead.id),
          },
        ],
      },
    ];

    return menuItems;
  }
  evaluateCredit(leadId) {
    this.routingService.handleRoute('credit/evaluate/' + leadId, null);
  }

  revertToFiles(lead) {
    this.changeLeadStatus(lead.id, 3);
  }

  revertToCredit(lead) {
    this.changeLeadStatus(lead.id, 5);
  }
  revertToplCredit(lead: any) {
    this.changeLoadLeadStatus(lead.leadId, 5);
  }
  changeLoadLeadStatus(leadId: number, statusId: number) {
    this.loading = true;
    this.leadsService.changeLoanLeadStatus(leadId, statusId).subscribe(
      () => {
        this.loading = false;
        this.toastService.showSuccess('Lead Status Changed Successfully');
        this.loadplLeads(this.currentTableEvent);
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
        this.loadLeads(this.currentTableEvent);
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  goBack() {
    this.location.back();
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

  inputValueChangeEventForPersonal(dataType, value) {
    if (value == '') {
      this.plsearchFilter = {};
      this.personalleadsTable.reset();
    }
  }
}
