import { Component, OnInit, ViewChild } from '@angular/core';

import { Location } from '@angular/common';
import { LeadsService } from '../leads/leads.service';
import { ToastService } from 'src/app/services/toast.service';
import { Table } from 'primeng/table';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { RoutingService } from 'src/app/services/routing-service';
import { MenuItem } from 'primeng/api';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-credit-evaluation',
  templateUrl: './credit-evaluation.component.html',
  styleUrl: './credit-evaluation.component.scss',
})
export class CreditEvaluationComponent implements OnInit {
  leads: any = [];
  loading: any;
  employmentStatus: any;
  totalLeadsCount: any = 0;
  leadIdToSearch: any;
  breadCrumbItems: any = [];
  businessNameToSearch: any;
  mobileNumberToSearch: any;
  currentTableEvent: any;
  searchFilter: any = {};
  @ViewChild('leadsTable') leadsTable!: Table;
  @ViewChild('personalleadsTable') personalleadsTable!: Table;
  @ViewChild('professionalleadsTable') professionalleadsTable!: Table;
  @ViewChild('HomeleadsTable') HomeleadsTable!: Table;
  @ViewChild('CarleadsTable') CarleadsTable!: Table;
  @ViewChild('LapleadsTable') LapleadsTable!: Table;
  leadSources: any = [];
  leadUsers: any = [];
  filterConfig: any[] = [];
  activeItem: any;
  activeEmploymentStatus: any;
  totalStatusLeadsCountArray: any;
  totalActiveLeadsCount: any;
  totalLeadsCountArray: any;
  businessNameToSearchForPersonal: any;
  businessNameToSearchForProfessional: any;
  searchFilterForHome: any = {};
  searchFilterForCar: any = {};
  searchFilterPersonal: any = {};
  searchFilterProfessional: any={};
  SourcedByForPersonal: any;
  SourcedByForProfessional: any;
  appliedFilterPersonal: {};
  appliedFilterLapself: {};
  personalfilterConfig: any[] = [];
  searchFilterForHomeSelf: any = {};
  searchFilterForCarSelf: any = {};
  loanLeads: any = [];
  HomefilterConfig: any[] = [];
  HomeSelffilterConfig: any[] = [];
  personNameToSearchForHome: any;
  personalloanLeadsCount: any = 0;
  professionalloanLeadsCount: any =0;
  homeloanselfLeadsCount: any = 0;
  carloanselfLeadsCount: any = 0;
  homeloanLeadsCount: any = 0;
  carloanLeadsCount: any = 0;
  loanleadsLoading: any;
  appliedFilterHome: {};
  appliedFilterCar: {};
  searchFilterForLap: any = {};
  appliedFilterHomeself: {};
  appliedFilterCarself: {};
  searchFilterForLapSelf: any = {};
  businessNameToSearchForHome: any;
  searchInputValue: string = '';
  SourcedByForLap: any;
  appliedFilter: {};
  appliedFilterLap: {};
  lapLeadsCount: any = 0;
  lapselfLeadsCount: any = 0;
  SourcedByForHome: any;
  SourcedByForCar: any;
  apiLoading: any;
  userDetails: any;
  selectedSoucedByStatus: any;
  leadInternalStatusList: any = projectConstantsLocal.LEAD_INTERNAL_STATUS;
  turnoverDetails: any = projectConstantsLocal.BUSINESS_TURNOVER;
  entityDetails: any = projectConstantsLocal.BUSINESS_ENTITIES;
  natureofBusinessDetails: any = projectConstantsLocal.NATURE_OF_BUSINESS;
  hadOwnHouse = projectConstantsLocal.YES_OR_NO;
  version = projectConstantsLocal.VERSION_DESKTOP;
  businessEntities = projectConstantsLocal.BUSINESS_ENTITIES;
  designationType: any = projectConstantsLocal.DOCTOR_OR_CA;
  items: any;
  constructor(
    private location: Location,
    private leadsService: LeadsService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private localStorageService: LocalStorageService
  ) {
    this.breadCrumbItems = [
      {
        label: ' Home',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      { label: 'Credit Evaluation' },
    ];
    this.getLeadUsers();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.selectedSoucedByStatus = {
        id: params['id'],
        name: params['name'],
      };
    });
    let userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    this.userDetails = userDetails.user;
    this.setFilterConfig();
    this.loadAllLeadData().then(() => {
      this.items = this.getFilteredItems();
      this.loadActiveItem();
      this.employmentStatus = this.getStatusItems();
      this.loadEmploymentActiveItem();
    });
    const storedAppliedFilter =
      this.localStorageService.getItemFromLocalStorage('creditsAppliedFilter');
    if (storedAppliedFilter) {
      this.appliedFilter = storedAppliedFilter;
    }
    const storedStatus =
      this.localStorageService.getItemFromLocalStorage('selectedCredits');
    if (storedStatus) {
      this.selectedSoucedByStatus = storedStatus;
    }
  }

  private async loadAllLeadData(): Promise<void> {
    try {
      await Promise.all([
        this.getTotalLeadsCountArray(event),
        this.getbusinessloanleadsCount(event),
        this.getStatusLeadsCountArray(event)
      ]);
    } catch (error) { }
  }
  loadActiveItem() {
    const storedActiveItemName =
      this.localStorageService.getItemFromLocalStorage('creditActiveItem');
    if (storedActiveItemName) {
      this.activeItem =
        this.items.find((item) => item.name === storedActiveItemName) ||
        this.items[0];
    } else {
      this.activeItem = this.items[0];
    }
  }
  onActiveItemChange(event) {
    // console.log(event);
    this.activeItem = event;
    this.localStorageService.setItemOnLocalStorage(
      'creditActiveItem',
      event.name
    );
    this.employmentStatus = this.getStatusItems();
    this.loadEmploymentActiveItem();
  }
  loadEmploymentActiveItem() {
    const storedActiveItemName =
      this.localStorageService.getItemFromLocalStorage(
        'creditEmploymentStatusActiveItem'
      );
    if (storedActiveItemName) {
      this.activeEmploymentStatus =
        this.employmentStatus.find(
          (item) => item.name == storedActiveItemName
        ) || this.employmentStatus[0];
    } else {
      this.activeEmploymentStatus = this.employmentStatus[0];
    }
  }
  getStatusItems(): { label: string; name: string }[] {
    if (!this.totalStatusLeadsCountArray) {
      return [];
    }
    // console.log(this.activeItem)
    // Check the active item and update the labels accordingly
    if (this.activeItem.name === 'homeLoan') {
      return [
        {
          label: `Employed (${this.totalStatusLeadsCountArray.homeLoancount || 0})`,
          name: 'employed',
        },
        {
          label: `Self Employed (${this.totalStatusLeadsCountArray.homeLoanSelfcount || 0})`,
          name: 'self-employed',
        },
      ];
    } else if (this.activeItem.name === 'lap') {
      return [
        {
          label: `Employed (${this.totalStatusLeadsCountArray.LAPLoancount || 0})`,
          name: 'employed',
        },
        {
          label: `Self Employed (${this.totalStatusLeadsCountArray.LAPLoanSelfcount || 0})`,
          name: 'self-employed',
        },
      ];
    } else if (this.activeItem.name === 'carLoan') {
      return [
        {
          label: `Employed (${this.totalStatusLeadsCountArray.CarLoancount || 0})`,
          name: 'employed',
        },
        {
          label: `Self Employed (${this.totalStatusLeadsCountArray.CarLoanSelfcount || 0})`,
          name: 'self-employed',
        },
      ];
    } 

    // Default case (if activeItem is neither homeLoan nor LAP)
    return [];
  }
  getTotalLeadsCountArray(filter = {}) {
    if (
      this.userDetails &&
      this.userDetails?.id &&
      this.userDetails?.userType &&
      this.userDetails?.userType == '3'
    ) {
      filter['sourcedBy-eq'] = this.userDetails.id;
    }
    filter['leadInternalStatus-eq'] = 5;
    this.leadsService.getTotalLeadsCountArray(filter).subscribe(
      (leadsCount) => {
        this.totalLeadsCountArray = leadsCount;
        // console.log(this.totalLeadsCountArray);
        this.items = this.getFilteredItems();
        // this.activeItem = this.items[0];
        this.loadActiveItem();
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  getbusinessloanleadsCount(filter = {}) {
    if (
      this.userDetails &&
      this.userDetails?.id &&
      this.userDetails?.userType &&
      this.userDetails?.userType == '3'
    ) {
      filter['sourcedBy-eq'] = this.userDetails.id;
    }
    filter['leadInternalStatus-eq'] = 5;
    this.leadsService.getLeadsCount(filter).subscribe(
      (leadsCount) => {
        this.totalActiveLeadsCount = leadsCount;
        // console.log(this.totalActiveLeadsCount);
        this.items = this.getFilteredItems();
        // this.activeItem = this.items[0];
        this.loadActiveItem();
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  getStatusLeadsCountArray(filter = {}) {
    if (
      this.userDetails &&
      this.userDetails?.id &&
      this.userDetails?.userType &&
      this.userDetails?.userType == '3'
    ) {
      filter['sourcedBy-eq'] = this.userDetails.id;
    }
    filter['leadInternalStatus-eq'] = 5;
    this.leadsService.getStatusLeadsCountArray(filter).subscribe(
      (leadsCount) => {
        this.totalStatusLeadsCountArray = leadsCount;
        // console.log(this.totalStatusLeadsCountArray);
        this.employmentStatus = this.getStatusItems();
        // this.activeItem = this.items[0];
        this.loadEmploymentActiveItem();
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  getFilteredItems(): { label: string; name: string }[] {
    return [
      {
        label: `Business Loan (${this.totalActiveLeadsCount || 0})`,
        name: 'businessLoan',
      },
      {
        label: `Personal Loan (${this.totalLeadsCountArray?.personalcount || 0
          })`,
        name: 'personalLoan',
      },
      {
        label: `Home Loan (${this.totalLeadsCountArray?.homeLoancount || 0})`,
        name: 'homeLoan',
      },
      {
        label: `LAP (${this.totalLeadsCountArray?.LAPLoancount || 0})`,
        name: 'lap',
      },
      {
        label: `Professional Loans (${this.totalLeadsCountArray?.ProfessionalLoancount || 0})`,
        name: 'professionalLoans',
      },
      {
        label: `Educational Loans (0)`,
        name: 'educationlLoans',
      },
      {
        label: `Car loans (${this.totalLeadsCountArray?.carLoancount || 0})`,
        name: 'carLoan',
      },
      {
        label: `Commercial Vehicle Loans (0)`,
        name: 'commercialVehicleLoan',
      },
    ];
  }
  loadLeads(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['leadInternalStatus-eq'] = 5;
    if (this.selectedSoucedByStatus && this.selectedSoucedByStatus.name) {
      if (this.selectedSoucedByStatus.name == 'All') {
        api_filter['leadInternalStatus-eq'] = '5';
      } else {
        api_filter['sourcedBy-eq'] = this.selectedSoucedByStatus.id;
      }
    }
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilter,
      this.appliedFilter
    );
    if (
      this.userDetails &&
      this.userDetails.id &&
      this.userDetails.userType &&
      this.userDetails.userType == '3'
    ) {
      api_filter['sourcedBy-eq'] = this.userDetails.id;
    }
    if (api_filter) {
      this.getTotalLeadsFilesCount(api_filter);
      this.getTotalLeads(api_filter);
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
        header: 'Property Type',
        data: [
          {
            field: 'hadOwnHouse',
            title: 'Property Type',
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
  // applyConfigFilters(event) {
  //   let api_filter = event;
  //   if (api_filter['reset']) {
  //     delete api_filter['reset'];
  //     this.appliedFilter = {};
  //   } else {
  //     this.appliedFilter = api_filter;
  //   }
  //   this.localStorageService.setItemOnLocalStorage(
  //     'creditsAppliedFilter',
  //     this.appliedFilter
  //   );
  //   this.loadLeads(null);
  // }
  applyConfigFilters(event, filterType: string) {
    let api_filter = event;
    let localStorageKey = `creditsAppliedFilter${filterType}`;
    if (api_filter['reset']) {
      delete api_filter['reset'];
      this[`appliedFilter${filterType}`] = {};
    } else {
      this[`appliedFilter${filterType}`] = api_filter;
    }
    this.localStorageService.setItemOnLocalStorage(
      localStorageKey,
      this[`appliedFilter${filterType}`]
    );
    switch (filterType) {
      case 'Personal':
        this.loadLoanLeads('personal');
        break;
      case 'Home':
        this.loadLoanLeads('home');
        break;
      case 'Homeself':
        this.loadLoanLeads('homeself');
        break;
      case 'Lap':
        this.loadLoanLeads('lap');
        break;
      case 'Lapself':
        this.loadLoanLeads('lapself');
        break;
      case 'professional':
        this.loadLeads('professional');
        break;
      case 'Car':
        this.loadLoanLeads('car');
        break;
      case 'Carself':
        this.loadLoanLeads('carself');
        break;
      default:
        this.loadLeads(null);
        break;
    }
  }
  getTotalLeadsFilesCount(filter = {}) {
    this.leadsService.getLeadsCount(filter).subscribe(
      (leadsCount) => {
        this.totalLeadsCount = leadsCount;
        let filesCount = this.totalLeadsCount;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getTotalLeads(filter = {}) {
    this.apiLoading = true;
    this.leadsService.getLeads(filter).subscribe(
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
  inputValueChangeEvent(dataType, value) {
    if (value == '') {
      this.searchFilter = {};
      this.leadsTable.reset();
    }
  }

  filterWithBusinessName() {
    let searchFilter = { 'businessName-like': this.businessNameToSearch };

    this.applyFilters(searchFilter);
  }

  applyFilters(searchFilter = {}) {
    this.searchFilter = searchFilter;
    this.loadLeads(this.currentTableEvent);
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
  getDesignationType(userId: any): string {
  if (this.designationType && this.designationType.length > 0) {
    const designationType = this.designationType.find(user => user.id == userId);
    return designationType?.displayName || '';
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
  //   const lead = event.data;
  //   this.routingService.handleRoute('leads/profile/' + lead.id, null);
  // }
  viewLead(event: any) {
    // console.log('Row clicked:', event.data);
    const lead = event.data
    const loanType = lead.loanType; // e.g., 'personalloan', 'home loan', etc.
    if (loanType === 'personalLoan' || loanType === 'homeLoan' || loanType === 'lap' || loanType === 'professionalLoans' || loanType === 'carLoan') {
      this.routingService.handleRoute(`leads/profile/${loanType}/${lead.leadId}`, null);
    } else {
      // If no known loanType, omit status from the route
      this.routingService.handleRoute(`leads/profile/${lead.id}`, null);
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
            label: 'Send to files',
            icon: 'pi pi-sign-in',
            command: () => this.revertToFiles(lead),
          },
        ],
      },
    ];
    return menuItems;
  }

  // evaluateCredit(leadId) {
  //   this.routingService.handleRoute('credit/evaluate/' + leadId, null);
  // }
  evaluateCredit(lead) {

    const loanType = lead.loanType; // e.g., 'personalloan', 'home loan', etc.
    if (loanType === 'personalLoan' || loanType === 'homeLoan' || loanType === 'lap' || loanType === 'professionalLoans' || loanType === 'carLoan') {
      this.routingService.handleRoute(`credit/evaluate/${loanType}/${lead.leadId}`, null);
    } else {
      // If no known loanType, omit status from the route
      this.routingService.handleRoute(`credit/evaluate/${lead.id}`, null);
    }
  }
  evaluateLoanCredit(leadId) {
    this.routingService.handleRoute('credit/loan-evaluate/' + leadId, null);
  }
  revertToFiles(lead) {
    this.changeLeadStatus(lead.id, 3);
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

  statusChange(event) {
    this.localStorageService.setItemOnLocalStorage(
      'selectedCredits',
      event.value
    );
    this.loadLeads(this.currentTableEvent);
  }

  goBack() {
    this.location.back();
  }
  filterWithBusinessNameForPersonal() {
    let searchFilterPersonal = {
      'contactPerson-like': this.businessNameToSearchForPersonal,
    };
    this.applyFiltersPersonal(searchFilterPersonal);
  }
   filterWithBusinessNameForProfessional() {
    let searchFilterProfessional = {
      'contactPerson-like': this.businessNameToSearchForProfessional,
    };
    this.applyFiltersProfessional(searchFilterProfessional);
  }
  applyFiltersProfessional(searchFilterProfessional = {}) {
    this.searchFilterProfessional = searchFilterProfessional;
    this.loadLoanLeads('professional');
  }
  applyFiltersPersonal(searchFilterPersonal = {}) {
    this.searchFilterPersonal = searchFilterPersonal;
    this.loadLoanLeads('personal');
  }
  loadLoanLeads(leadType: string) {
    switch (leadType) {
      case 'personal':
        this.loadLeadsforPersonal(this.currentTableEvent);
        break;
      case 'home':
        this.loadLeadsforHome(this.currentTableEvent);
        break;
      case 'homeself':
        this.loadLeadsforHomeself(this.currentTableEvent);
        break;
      case 'lap':
        this.loadLeadsforlap(this.currentTableEvent);
        break;
      case 'lapself':
        this.loadLeadsforlapself(this.currentTableEvent);
        break;
      case 'professional':
        this.loadLeadsforprofessional(this.currentTableEvent);
        break;
       case 'car':
        this.loadLeadsforCar(this.currentTableEvent);
        break;
      case 'carself':
        this.loadLeadsforCarself(this.currentTableEvent);
        break;
      default:
        console.error('Unknown lead type');
    }
  }
  loadLeadsforPersonal(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'personalLoan';
    api_filter['leadInternalStatus-eq'] = '5';
    // if (this.SourcedByForPersonal && this.SourcedByForPersonal.name) {
    //   if (this.SourcedByForPersonal.name == 'All') {
    //     api_filter['leadInternalStatus-eq'] = '5';
    //   } else {
    //     api_filter['sourcedBy-eq'] = this.SourcedByForPersonal.id;
    //   }
    // }
    if (this.SourcedByForPersonal && this.SourcedByForPersonal.name) {
      if (this.SourcedByForPersonal.name != 'All') {
        api_filter['sourcedBy-eq'] = this.SourcedByForPersonal.id;
      }
    }
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilterPersonal,
      this.appliedFilterPersonal,
    );
    if (
      this.userDetails &&
      this.userDetails.id &&
      this.userDetails.userType &&
      this.userDetails.userType == '3'
    ) {
      api_filter['sourcedBy-eq'] = this.userDetails.id;
    }
    // console.log(api_filter);
    if (api_filter) {
      this.getpersonalloanLeadsCount(api_filter);
      this.getloanLeads(api_filter);
    }
  }
  loadLeadsforprofessional(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'professionalLoans';
    api_filter['leadInternalStatus-eq'] = '5';
    // if (this.SourcedByForPersonal && this.SourcedByForPersonal.name) {
    //   if (this.SourcedByForPersonal.name == 'All') {
    //     api_filter['leadInternalStatus-eq'] = '3';
    //   } else {
    //     api_filter['sourcedBy-eq'] = this.SourcedByForPersonal.id;
    //   }
    // }
    if (this.SourcedByForProfessional && this.SourcedByForProfessional.name) {
      if (this.SourcedByForProfessional.name != 'All') {
        api_filter['sourcedBy-eq'] = this.SourcedByForProfessional.id;
      }
    }
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilterProfessional,
      this.applyFiltersProfessional
    );
    if (
      this.userDetails &&
      this.userDetails.id &&
      this.userDetails.userType &&
      this.userDetails.userType == '3'
    ) {
      api_filter['sourcedBy-eq'] = this.userDetails.id;
    }
    // console.log(api_filter);
    if (api_filter) {
      this.getprofessionalloanLeadsCount(api_filter);
      this.getloanLeads(api_filter);
    }
  }
  getloanLeads(filter = {}) {
    this.loanleadsLoading = true;
    this.leadsService.getloanLeads(filter).subscribe(
      (response) => {
        this.loanLeads = response;
        this.loanleadsLoading = false;
      },
      (error: any) => {
        this.loanleadsLoading = false;
        this.toastService.showError(error);
      }
    );
  }
  getpersonalloanLeadsCount(filter = {}) {
    this.leadsService.getloanLeadsCount(filter).subscribe(
      (response) => {
        this.personalloanLeadsCount = response;
        // console.log(this.personalloanLeadsCount);
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  getprofessionalloanLeadsCount(filter = {}) {
    this.leadsService.getloanLeadsCount(filter).subscribe(
      (response) => {
        this.professionalloanLeadsCount = response;
        // console.log(this.personalloanLeadsCount);
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  loadLeadsforHome(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'homeLoan';
    api_filter['employmentStatus-eq'] = 'employed';
    api_filter['leadInternalStatus-eq'] = '5';
    // if (this.SourcedByForHome && this.SourcedByForHome.name) {
    //   if (this.SourcedByForHome.name == 'All') {
    //     api_filter['leadInternalStatus-eq'] = '5';
    //   } else {
    //     api_filter['sourcedBy-eq'] = this.SourcedByForHome.id;
    //   }
    // }
    if (this.SourcedByForHome && this.SourcedByForHome.name) {
      if (this.SourcedByForHome.name != 'All') {
        api_filter['sourcedBy-eq'] = this.SourcedByForHome.id;
      }
    }
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilterForHome,
      this.appliedFilterHome
    );
    if (
      this.userDetails &&
      this.userDetails.id &&
      this.userDetails.userType &&
      this.userDetails.userType == '3'
    ) {
      api_filter['sourcedBy-eq'] = this.userDetails.id;
    }
    // console.log(api_filter);
    if (api_filter) {
      this.getHomeloanLeadsCount(api_filter);
      this.getloanLeads(api_filter);
    }
  }
  loadLeadsforCar(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'carLoan';
    api_filter['employmentStatus-eq'] = 'employed';
    api_filter['leadInternalStatus-eq'] = '5';
    if (this.SourcedByForCar && this.SourcedByForCar.name) {
      if (this.SourcedByForCar.name != 'All') {
        api_filter['sourcedBy-eq'] = this.SourcedByForCar.id;
      }
    }
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilterForCar,
      this.appliedFilterCar
    );
    if (
      this.userDetails &&
      this.userDetails.id &&
      this.userDetails.userType &&
      this.userDetails.userType == '3'
    ) {
      api_filter['sourcedBy-eq'] = this.userDetails.id;
    }
    // console.log(api_filter);
    if (api_filter) {
      this.getCarloanLeadsCount(api_filter);
      this.getloanLeads(api_filter);
    }
  }
  getHomeloanLeadsCount(filter = {}) {
    this.leadsService.getloanLeadsCount(filter).subscribe(
      (response) => {
        this.homeloanLeadsCount = response;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  getCarloanLeadsCount(filter = {}) {
    this.leadsService.getloanLeadsCount(filter).subscribe(
      (response) => {
        this.carloanLeadsCount = response;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  loadLeadsforHomeself(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'homeLoan';
    api_filter['employmentStatus-eq'] = 'self-employed';
    api_filter['leadInternalStatus-eq'] = '5';
    // if (this.SourcedByForHome && this.SourcedByForHome.name) {
    //   if (this.SourcedByForHome.name == 'All') {
    //     api_filter['leadInternalStatus-eq'] = '5';
    //   } else {
    //     api_filter['sourcedBy-eq'] = this.SourcedByForHome.id;
    //   }
    // }
    if (this.SourcedByForHome && this.SourcedByForHome.name) {
      if (this.SourcedByForHome.name != 'All') {
        api_filter['sourcedBy-eq'] = this.SourcedByForHome.id;
      }
    }
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilterForHomeSelf,
      this.appliedFilterHomeself
    );
    if (
      this.userDetails &&
      this.userDetails.id &&
      this.userDetails.userType &&
      this.userDetails.userType == '3'
    ) {
      api_filter['sourcedBy-eq'] = this.userDetails.id;
    }
    if (api_filter) {
      // console.log(api_filter);
      this.getHomeloanselfLeadsCount(api_filter);
      this.getloanLeads(api_filter);
    }
  }
  loadLeadsforCarself(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'carLoan';
    api_filter['employmentStatus-eq'] = 'self-employed';
    api_filter['leadInternalStatus-eq'] = '5';
    if (this.SourcedByForCar && this.SourcedByForCar.name) {
      if (this.SourcedByForCar.name != 'All') {
        api_filter['sourcedBy-eq'] = this.SourcedByForCar.id;
      }
    }
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilterForCarSelf,
      this.appliedFilterCarself
    );
    if (
      this.userDetails &&
      this.userDetails.id &&
      this.userDetails.userType &&
      this.userDetails.userType == '3'
    ) {
      api_filter['sourcedBy-eq'] = this.userDetails.id;
    }
    if (api_filter) {
      // console.log(api_filter);
      this.getCarloanselfLeadsCount(api_filter);
      this.getloanLeads(api_filter);
    }
  }
  getHomeloanselfLeadsCount(filter = {}) {
    this.leadsService.getloanLeadsCount(filter).subscribe(
      (response) => {
        this.homeloanselfLeadsCount = response;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  getCarloanselfLeadsCount(filter = {}) {
    this.leadsService.getloanLeadsCount(filter).subscribe(
      (response) => {
        this.carloanselfLeadsCount = response;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  loadLeadsforlap(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'lap';
    api_filter['employmentStatus-eq'] = 'employed';
    api_filter['leadInternalStatus-eq'] = '5';
    // if (this.SourcedByForLap && this.SourcedByForLap.name) {
    //   if (this.SourcedByForLap.name == 'All') {
    //     api_filter['leadInternalStatus-eq'] = '5';
    //   } else {
    //     api_filter['sourcedBy-eq'] = this.SourcedByForLap.id;
    //   }
    // }
    if (this.SourcedByForLap && this.SourcedByForLap.name) {
      if (this.SourcedByForLap.name != 'All') {
        api_filter['sourcedBy-eq'] = this.SourcedByForLap.id;
      }
    }
    // console.log(api_filter);
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilterForLap,
      this.appliedFilterLap
    );
    if (
      this.userDetails &&
      this.userDetails.id &&
      this.userDetails.userType &&
      this.userDetails.userType == '3'
    ) {
      api_filter['sourcedBy-eq'] = this.userDetails.id;
    }
    if (api_filter) {
      this.getLapLeadsCount(api_filter);
      this.getloanLeads(api_filter);
    }
  }
  getLapLeadsCount(filter = {}) {
    this.leadsService.getloanLeadsCount(filter).subscribe(
      (response) => {
        this.lapLeadsCount = response;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  loadLeadsforlapself(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'lap';
    api_filter['employmentStatus-eq'] = 'self-employed';
    api_filter['leadInternalStatus-eq'] = '5';
    // if (this.SourcedByForLap && this.SourcedByForLap.name) {
    //   if (this.SourcedByForLap.name == 'All') {
    //     api_filter['leadInternalStatus-eq'] = '5';
    //   } else {
    //     api_filter['sourcedBy-eq'] = this.SourcedByForLap.id;
    //   }
    // }
    if (this.SourcedByForLap && this.SourcedByForLap.name) {
      if (this.SourcedByForLap.name != 'All') {
        api_filter['sourcedBy-eq'] = this.SourcedByForLap.id;
      }
    }
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilterForLapSelf,
      this.appliedFilterLapself
    );
    if (
      this.userDetails &&
      this.userDetails.id &&
      this.userDetails.userType &&
      this.userDetails.userType == '3'
    ) {
      api_filter['sourcedBy-eq'] = this.userDetails.id;
    }
    if (api_filter) {
      this.getLapselfLeadsCount(api_filter);
      this.getloanLeads(api_filter);
    }
  }
  getLapselfLeadsCount(filter = {}) {
    this.leadsService.getloanLeadsCount(filter).subscribe(
      (response) => {
        this.lapselfLeadsCount = response;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  inputValueChangeEventForPersonal(dataType, value) {
    if (value == '') {
      this.searchFilterPersonal = {};
      this.personalleadsTable.reset();
    }
  }
  inputValueChangeEventForProfessional(dataType, value) {
    if (value == '') {
      this.searchFilterProfessional = {};
      this.professionalleadsTable.reset();
    }
  }
  // viewLoanLead(event) {
  //   const lead = event.data
  //   this.routingService.handleRoute('files/loanleadview/' + lead.leadId, null);
  // }

  statusChangeForPersonal(event) {
    this.loadLoanLeads('personal');
  }

  statusChangeForProfessional(event) {
    this.loadLoanLeads('professional');
  }

  actionItemsForLead(lead: any, leadType: string): MenuItem[] {
    const menuItems: MenuItem[] = [
      {
        label: 'Actions',
        items: [
          {
            label: 'Send to Files',
            icon: 'pi pi-sign-in',
            command: () => this.revertLoanLeadToFiles(lead, leadType),
          },
        ],
      },
    ];
    return menuItems;
  }
  revertLoanLeadToFiles(lead: any, leadType: string) {
    this.changeLoadLeadStatus(lead.leadId, 3, leadType);
  }
  changeLoadLeadStatus(leadId: number, statusId: number, leadType: string) {
    this.loading = true;
    this.leadsService.changeLoanLeadStatus(leadId, statusId).subscribe(
      () => {
        this.loading = false;
        this.toastService.showSuccess('Lead Status Changed Successfully');
        this.loadLoanLeads(leadType);
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  getLapActionItems(lead: any): MenuItem[] {
    const leadType =
      this.activeEmploymentStatus.name === 'employed' ? 'lap' : 'lapself';
    return this.actionItemsForLead(lead, leadType);
  }
  getCarActionItems(lead: any): MenuItem[] {
    const leadType =
      this.activeEmploymentStatus.name === 'employed' ? 'car' : 'carself';
    return this.actionItemsForLead(lead, leadType);
  }
  statusChangeForLap(event) {
    this.loadLoanLeads('lap');
  }
  statusChangeForLapSelf(event) {
    this.loadLoanLeads('lapself');
  }
  filterBasedOnEmploymentStatus(): void {
    if (this.activeEmploymentStatus.name === 'employed') {
      if (this.activeItem.name === 'homeLoan') {
        this.filterWithPersonNameForHome();
      } else if (this.activeItem.name === 'lap') {
        this.filterWithPersonNameForLAP();
      } else if (this.activeItem.name === 'carLoan') {
        this.filterWithPersonNameForCar();
      }
    } else {
      if (this.activeItem.name === 'homeLoan') {
        this.filterWithBusinessNameForHome();
      } else if (this.activeItem.name === 'lap') {
        this.filterWithBusinessNameForLAP();
      } else if (this.activeItem.name === 'carLoan') {
        this.filterWithBusinessNameForCar();
      }
    }
  }
  filterWithPersonNameForLAP() {
    let searchFilterForLap = {
      'contactPerson-like': this.personNameToSearchForHome,
    };
    // console.log(searchFilterForLap);
    this.applyFiltersLap(searchFilterForLap);
  }
  filterWithPersonNameForHome() {
    let searchFilterForHome = {
      'contactPerson-like': this.personNameToSearchForHome,
    };
    this.applyFiltersHome(searchFilterForHome);
  }
  filterWithBusinessNameForHome() {
    let searchFilterForHomeSelf = {
      'businessName-like': this.businessNameToSearchForHome,
    };
    this.applyFiltersHomeSelf(searchFilterForHomeSelf);
  }
   filterWithPersonNameForCar() {
    let searchFilterForCar = {
      'contactPerson-like': this.personNameToSearchForHome,
    };
    this.applyFiltersCar(searchFilterForCar);
  }
  filterWithBusinessNameForCar() {
    let searchFilterForCarSelf = {
      'businessName-like': this.businessNameToSearchForHome,
    };
    this.applyFiltersCarSelf(searchFilterForCarSelf);
  }
  
  filterWithBusinessNameForLAP() {
    let searchFilterForLapSelf = {
      'businessName-like': this.businessNameToSearchForHome,
    };
    this.applyFiltersLapSelf(searchFilterForLapSelf);
  }
  applyFiltersLap(searchFilterForLap = {}) {
    this.searchFilterForLap = searchFilterForLap;
    this.loadLoanLeads('lap');
  }
  applyFiltersHome(searchFilterForHome = {}) {
    this.searchFilterForHome = searchFilterForHome;
    this.loadLoanLeads('home');
  }
  applyFiltersCar(searchFilterForCar = {}) {
    this.searchFilterForCar = searchFilterForCar;
    this.loadLoanLeads('car');
  }
  applyFiltersLapSelf(searchFilterForLapSelf = {}) {
    this.searchFilterForLapSelf = searchFilterForLapSelf;
    this.loadLoanLeads('lapself');
  }
  applyFiltersHomeSelf(searchFilterForHomeSelf = {}) {
    this.searchFilterForHomeSelf = searchFilterForHomeSelf;
    this.loadLoanLeads('homeself');
  }
  applyFiltersCarSelf(searchFilterForCarSelf = {}) {
    this.searchFilterForCarSelf = searchFilterForCarSelf;
    this.loadLoanLeads('carself');
  }
  handleInputChange(value: string): void {
    this.searchInputValue = value;
    if (this.activeEmploymentStatus.name === 'employed') {
      this.personNameToSearchForHome = value;
      // console.log(this.activeItem);
      // console.log(this.activeEmploymentStatus);
      if (this.activeItem.name === 'homeLoan') {
        this.inputValueChangeEventForHome(
          'loanId',
          this.personNameToSearchForHome
        );
      } else if (this.activeItem.name === 'lap') {
        this.inputValueChangeEventForLAP(
          'loanId',
          this.personNameToSearchForHome
        );
      } else if (this.activeItem.name === 'carLoan') {
        this.inputValueChangeEventForCar(
          'loanId',
          this.personNameToSearchForHome
        );
      }
    } else {
      this.businessNameToSearchForHome = value;
      if (this.activeItem.name === 'homeLoan') {
        this.inputValueChangeEventForHomeSelf(
          'loanId',
          this.businessNameToSearchForHome
        );
      } else if (this.activeItem.name === 'lap') {
        this.inputValueChangeEventForLAPSelf(
          'loanId',
          this.businessNameToSearchForHome
        );
      } else if (this.activeItem.name === 'carLoan') {
        this.inputValueChangeEventForCarSelf(
          'loanId',
          this.businessNameToSearchForHome
        );
      }
    }
  }
  inputValueChangeEventForHomeSelf(dataType, value) {
    if (value == '') {
      this.searchFilterForHomeSelf = {};
      this.HomeleadsTable.reset();
    }
  } inputValueChangeEventForLAPSelf(dataType, value) {
    if (value == '') {
      this.searchFilterForLapSelf = {};
      this.LapleadsTable.reset();
    }
  }
  inputValueChangeEventForLAP(dataType, value) {
    if (value == '') {
      this.searchFilterForLap = {};
      this.LapleadsTable.reset();
    }
  }
  inputValueChangeEventForHome(dataType, value) {
    if (value == '') {
      this.searchFilterForHome = {};
      this.HomeleadsTable.reset();
    }
  }
  inputValueChangeEventForCarSelf(dataType, value) {
    if (value == '') {
      this.searchFilterForCarSelf = {};
      this.CarleadsTable.reset();
    }
  }
  inputValueChangeEventForCar(dataType, value) {
    if (value == '') {
      this.searchFilterForCar = {};
      this.CarleadsTable.reset();
    }
  }
  onActiveEmploymentStatusChange(event: any) {
    this.activeEmploymentStatus = event;
    const { name } = this.activeEmploymentStatus;
    const { name: itemName } = this.activeItem;
    // console.log(name);
    // console.log(itemName);
    // const loadLeadsFn =
    //   name === 'employed'
    //     ? itemName === 'homeLoan'
    //       ? this.loadLeadsforHome
    //       : this.loadLeadsforlap
    //     : itemName === 'homeLoan'
    //       ? this.loadLeadsforHomeself
    //       : this.loadLeadsforlapself;
    // // console.log('loadLeadsFn', loadLeadsFn);
    // loadLeadsFn.call(this, event);
    // this.localStorageService.setItemOnLocalStorage(
    //   'creditEmploymentStatusActiveItem',
    //   event.name
    // );
     let loadLeadsFn: Function | null = null;

  if (name === 'employed') {
    if (itemName === 'homeLoan') {
      loadLeadsFn = this.loadLeadsforHome;
    } else if (itemName === 'lap') {
      loadLeadsFn = this.loadLeadsforlap;
    } else if (itemName === 'carLoan') {
      loadLeadsFn = this.loadLeadsforCar;
    }
  } else {
    if (itemName === 'homeLoan') {
      loadLeadsFn = this.loadLeadsforHomeself;
    } else if (itemName === 'lap') {
      loadLeadsFn = this.loadLeadsforlapself;
    } else if (itemName === 'carLoan') {
      loadLeadsFn = this.loadLeadsforCarself;
    }
  }

  if (loadLeadsFn) {
    loadLeadsFn.call(this, event);
  }

  this.localStorageService.setItemOnLocalStorage(
    'employmentStatusActiveItem',
    event.name
  );
  }
  statusChangeForHome(event) {
    this.loadLoanLeads('home');
  }
  statusChangeForHomeSelf(event) {
    this.loadLoanLeads('homeself');
  }
  statusChangeForCar(event) {
    this.loadLoanLeads('car');
  }
  statusChangeForCarSelf(event) {
    this.loadLoanLeads('carself');
  }
  getHomeActionItems(lead: any): MenuItem[] {
    const leadType =
      this.activeEmploymentStatus.name === 'employed' ? 'home' : 'homeself';
    return this.actionItemsForLead(lead, leadType);
  }
}
