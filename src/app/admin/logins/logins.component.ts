import { Component, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { RoutingService } from 'src/app/services/routing-service';
import { ToastService } from 'src/app/services/toast.service';
import { LeadsService } from '../leads/leads.service';
import { Table } from 'primeng/table';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-logins',
  templateUrl: './logins.component.html',
  styleUrl: './logins.component.scss',
})
export class LoginsComponent {
  leads: any = [];
  appliedFilter: {};
  appliedFilterfip: {};
  activeItem: any = null;
  loading: any;
  items: any;
  loginStatus: any = projectConstantsLocal.LOGIN_STATUS;
  totalLeadsCount: any = 0;
  totalLeadsCountfip: any = 0;
  leadIdToSearch: any;
  breadCrumbItems: any = [];
  businessNameToSearch: any;
  businessNameToSearchforfip: any;
  mobileNumberToSearch: any;
  mobileNumberToSearchfip: any;
  filterConfig: any[] = [];
  currentTableEvent: any;
  searchFilter: any = {};
  searchFilterfip: any = {};
  @ViewChild('leadsTable') leadsTable!: Table;
  @ViewChild('leadsTableforfip') leadsTableforfip!: Table;
  leadSources: any = [];
  leadUsers: any = [];
  userDetails: any;
  apiLoading: any;
  selectedSourcedByStatus: any;
  selectedSourcedByfipStatus: any;
  leadInternalStatusList: any = projectConstantsLocal.LEAD_INTERNAL_STATUS;
  turnoverDetails: any = projectConstantsLocal.BUSINESS_TURNOVER;
  entityDetails: any = projectConstantsLocal.BUSINESS_ENTITIES;
  natureofBusinessDetails: any = projectConstantsLocal.NATURE_OF_BUSINESS;
  hadOwnHouse = projectConstantsLocal.YES_OR_NO;
  version = projectConstantsLocal.VERSION_DESKTOP;
  businessEntities = projectConstantsLocal.BUSINESS_ENTITIES
  constructor(
    private location: Location,
    private leadsService: LeadsService,
    private toastService: ToastService,
    private routingService: RoutingService,
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService
  ) {
    this.breadCrumbItems = [
      {
        icon: 'pi pi-home',
        label: ' Dashboard',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      { label: 'Logins' },
    ];
    this.getLeadUsers();
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.selectedSourcedByStatus = {
        id: params['id'],
        name: params['name'],
      };
    });
    this.items = [
      { label: 'Ready To Login', name: 'readyToLogin' },
      { label: 'All Processed Files', name: 'filesInProcess' },
    ];
    this.loadActiveItem();
    let userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    this.userDetails = userDetails.user;
    this.setFilterConfig();
    const storedAppliedFilterlogins = this.localStorageService.getItemFromLocalStorage(
      'loginsAppliedFilter'
    );
    if (storedAppliedFilterlogins) {
      this.appliedFilter = storedAppliedFilterlogins;
    }
    const storedAppliedFilter = this.localStorageService.getItemFromLocalStorage(
      'allprocessedAppliedFilter'
    );
    if (storedAppliedFilter) {
      this.appliedFilterfip = storedAppliedFilter;
    }
    const storedStatus = this.localStorageService.getItemFromLocalStorage('selectedLogins');
    if (storedStatus) {
      this.selectedSourcedByStatus = storedStatus;
    }
    const storedStatus1 = this.localStorageService.getItemFromLocalStorage('selectedallProcessedFiles');
    if (storedStatus1) {
      this.selectedSourcedByfipStatus = storedStatus1;
    }
  }

  loadActiveItem() {
    const storedActiveItemName =
      this.localStorageService.getItemFromLocalStorage('loginsActiveItem');
    if (storedActiveItemName) {
      this.activeItem =
        this.items.find((item) => item.name === storedActiveItemName) ||
        this.items[0];
    } else {
      this.activeItem = this.items[0];
    }
  }
  onActiveItemChange(event) {
    this.activeItem = event;
    this.localStorageService.setItemOnLocalStorage(
      'loginsActiveItem',
      event.name
    );
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
  filterWithBusinessName() {
    let searchFilter = { 'businessName-like': this.businessNameToSearch };
    this.applyFilters(searchFilter);
  }
  filterWithMobileNumber() {
    let searchFilter = { 'primaryPhone-like': this.mobileNumberToSearch };
    this.applyFilters(searchFilter);
  }

  filterWithMobileNumberfip() {
    let searchFilterfip = {
      'primaryPhone-like': this.mobileNumberToSearchfip,
    };
    this.applyFiltersforFip(searchFilterfip);
  }

  filterWithBusinessNamefip() {
    let searchFilterfip = {
      'businessName-like': this.businessNameToSearchforfip,
    };
    this.applyFiltersforFip(searchFilterfip);
  }
  applyFilters(searchFilter = {}) {
    this.searchFilter = searchFilter;
    this.loadLeads(this.currentTableEvent);
  }

  applyFiltersforFip(searchFilterfip = {}) {
    this.searchFilterfip = searchFilterfip;
    this.loadDistinctLeads(this.currentTableEvent);
  }
  inputValueChangeEvent(dataType, value) {
    if (value == '') {
      this.searchFilter = {};
      this.leadsTable.reset();
    }
  }

  inputValueChangeEventforFip(dataType, value) {
    if (value == '') {
      this.searchFilterfip = {};
      this.leadsTableforfip.reset();
    }
  }

  updateLead(leadId) {
    this.routingService.handleRoute('leads/update/' + leadId, null);
  }
  loadDistinctLeads(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    if (
      this.selectedSourcedByfipStatus &&
      this.selectedSourcedByfipStatus.name
    ) {
      if (this.selectedSourcedByfipStatus.name == 'All') {
      } else {
        api_filter['sourcedBy-eq'] = this.selectedSourcedByfipStatus.id;
      }
    }
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilterfip,
      this.appliedFilterfip
    );
    if (api_filter) {
      console.log(api_filter);
      this.getDistinctLeadCount(api_filter);
      this.getDistinctLeads(api_filter);
    }
  }

  loadLeads(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['leadInternalStatus-eq'] = 11;
    if (this.selectedSourcedByStatus && this.selectedSourcedByStatus.name) {
      if (this.selectedSourcedByStatus.name == 'All') {
        api_filter['leadInternalStatus-eq'] = '11';
      } else {
        api_filter['sourcedBy-eq'] = this.selectedSourcedByStatus.id;
      }
    }
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
  applyConfigFilters(event) {
    let api_filter = event;
    if (api_filter['reset']) {
      delete api_filter['reset'];
      this.appliedFilter = {};
    } else {
      this.appliedFilter = api_filter;
    }
    this.localStorageService.setItemOnLocalStorage(
      'loginsAppliedFilter',
      this.appliedFilter
    );
    this.loadLeads(null);
  }

  applyConfigFiltersForDistinct(event) {
    let api_filter = event;
    if (api_filter['reset']) {
      delete api_filter['reset'];
      this.appliedFilterfip = {};
    } else {
      this.appliedFilterfip = api_filter;
    }
    this.localStorageService.setItemOnLocalStorage(
      'allprocessedAppliedFilter',
      this.appliedFilterfip
    );
    this.loadDistinctLeads(null);
  }
  statusChange(event) {
    this.localStorageService.setItemOnLocalStorage(
      'selectedLogins',
      event.value
    );
    this.loadLeads(this.currentTableEvent);
  }

  statusChangeDistinct(event) {
    this.localStorageService.setItemOnLocalStorage(
      'selectedallProcessedFiles',
      event.value
    );
    this.loadDistinctLeads(this.currentTableEvent);
  }

  getTotalLeadsFilesCount(filter = {}) {
    this.leadsService.getLeadsCount(filter).subscribe(
      (leadsCount) => {
        this.totalLeadsCount = leadsCount;
        console.log(this.totalLeadsCount);
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getDistinctLeadCount(filter = {}) {
    this.leadsService.getDistinctLeadCount(filter).subscribe(
      (leadsCount) => {
        this.totalLeadsCountfip = leadsCount;
        console.log(this.totalLeadsCountfip);
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

  getDistinctLeads(filter = {}) {
    this.apiLoading = true;
    this.leadsService.getDistinctLeads(filter).subscribe(
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

  viewLead(leadId) {
    this.routingService.handleRoute('leads/profile/' + leadId, null);
  }

  bankSelection(leadId) {
    this.routingService.handleRoute('logins/bankSelection/' + leadId, null);
  }

  savedBanks(leadId) {
    this.routingService.handleRoute('logins/banksSaved/' + leadId, null);
  }

  actionItems(lead: any): MenuItem[] {
    const menuItems: any = [
      {
        label: 'Actions',
        items: [
          {
            label: 'View  Lead',
            icon: 'pi pi-eye',
            command: () => this.viewLead(lead.id),
          },
          {
            label: 'View Files',
            icon: 'pi pi-file',
            command: () => this.viewLeadFiles(lead.id),
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

  actionItemsfip(lead: any): MenuItem[] {
    const menuItems: any = [
      {
        label: 'Actions',
        items: [
          // {
          //   label: 'Send to Credit Evaluation',
          //   icon: 'pi pi-sign-in',
          //   command: () => this.revertToCreditfip(lead),
          // },

          ...(this.userDetails?.userType && this.userDetails.userType == '1'
            ? [
              {
                label: 'View  Lead',
                icon: 'pi pi-eye',
                command: () => this.viewLead(lead.id),
              },
              {
                label: 'View Files',
                icon: 'pi pi-file',
                command: () => this.viewLeadFiles(lead.id),
              },
              {
                label: 'Update Lead',
                icon: 'pi pi-pencil',
                command: () => this.updateLead(lead.id),
              },
              {
                label: 'Upload Files',
                icon: 'pi pi-upload',
                command: () => this.uploadLeadFiles(lead.id),
              },
            ]
            : []),
          {
            label: 'Credit Evaluation',
            icon: 'pi pi-credit-card',
            command: () => this.evaluateCredit(lead.id),
          },
        ],
      },
    ];
    return menuItems;
  }

  evaluateCredit(leadId) {
    this.routingService.handleRoute('credit/evaluate/' + leadId, null);
  }
  viewLeadFiles(leadId) {
    this.routingService.handleRoute('files/view/' + leadId, null);
  }
  uploadLeadFiles(leadId) {
    this.routingService.handleRoute('files/upload/' + leadId, null);
  }
  revertToCredit(lead) {
    this.changeLeadStatus(lead.id, 5);
  }
  // revertToCreditfip(lead) {
  //   this.changeLeadStatusfip(lead.id, 5);
  // }

  changeLeadStatusfip(leadId, statusId) {
    this.loading = true;
    this.leadsService.changeLeadStatus(leadId, statusId).subscribe(
      (leads) => {
        this.toastService.showSuccess('Lead Status Changed Successfully');
        this.loading = false;
        this.loadDistinctLeads(this.currentTableEvent);
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
}
