import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RoutingService } from 'src/app/services/routing-service';
import { ToastService } from 'src/app/services/toast.service';
import { LeadsService } from '../leads/leads.service';
import { ActivatedRoute } from '@angular/router';
import { DateTimeProcessorService } from 'src/app/services/date-time-processor.service';

@Component({
  selector: 'app-disbursals',
  templateUrl: './disbursals.component.html',
  styleUrl: './disbursals.component.scss',
})
export class DisbursalsComponent implements OnInit {
  leads: any = [];
  breadCrumbItems: any = [];
  appliedFilter: {};
  loading: any;
  apiLoading: any;
  SanctionedAmountSum: { [key: number]: number } = {};
  DisbursedAmountSum: { [key: number]: number } = {};

  loginStatus: any = projectConstantsLocal.LOGIN_STATUS;
  totalLeadsCount: any = 0;
  leadIdToSearch: any;
  businessNameToSearch: any;
  mobileNumberToSearch: any;
  filterConfig: any[] = [];
  currentTableEvent: any;
  searchFilter: any = {};
  @ViewChild('leadsTable') leadsTable!: Table;
  leadSources: any = [];
  leadUsers: any = [];
  userDetails: any;
  selectedSourcedByStatus: any;
  moment: any;
  startDate: string = '';
  endDate: string = '';
  leadInternalStatusList: any = projectConstantsLocal.LEAD_INTERNAL_STATUS;
  turnoverDetails: any = projectConstantsLocal.BUSINESS_TURNOVER;
  entityDetails: any = projectConstantsLocal.BUSINESS_ENTITIES;
  natureofBusinessDetails: any = projectConstantsLocal.NATURE_OF_BUSINESS;
  hadOwnHouse = projectConstantsLocal.YES_OR_NO;
  version = projectConstantsLocal.VERSION_DESKTOP;
  constructor(
    private location: Location,
    private leadsService: LeadsService,
    private toastService: ToastService,
    private routingService: RoutingService,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute,
    private dateTimeProcessor: DateTimeProcessorService
  ) {
    this.moment = this.dateTimeProcessor.getMoment();

    this.breadCrumbItems = [
      {
        icon: 'pi pi-home',
        label: ' Dashboard',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      { label: 'Disbursals' },
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
    let userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    this.userDetails = userDetails.user;
    this.setFilterConfig();
    this.route.queryParams.subscribe((params) => {
      const startDateParam = params['startDate'] || '';
      const endDateParam = params['endDate'] || '';
      if (startDateParam || endDateParam) {
        this.startDate = startDateParam
          ? this.moment(startDateParam).format('YYYY-MM-DD')
          : '';
        this.endDate = endDateParam
          ? this.moment(endDateParam).format('YYYY-MM-DD')
          : '';
        if (this.startDate && this.endDate) {
          this.searchFilter['disbursalDate-gte'] = this.startDate;
          this.searchFilter['disbursalDate-lte'] = this.endDate;
        }
        this.loadLeads(this.currentTableEvent || null);
      }
    });
    const storedAppliedFilter =
      this.localStorageService.getItemFromLocalStorage(
        'disbursalAppliedFilter'
      );
    if (storedAppliedFilter) {
      this.appliedFilter = storedAppliedFilter;
    }
    const storedStatus =
      this.localStorageService.getItemFromLocalStorage('selectedDisbursals');
    if (storedStatus) {
      this.selectedSourcedByStatus = storedStatus;
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
        header: 'Disbursed Date Range',
        data: [
          {
            field: 'disbursalDate',
            title: 'From',
            type: 'date',
            filterType: 'gte',
          },
          {
            field: 'disbursalDate',
            title: 'To',
            type: 'date',
            filterType: 'lte',
          },
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

  filterWithMobileNumber() {
    let searchFilter = { 'primaryPhone-like': this.mobileNumberToSearch };
    this.applyFilters(searchFilter);
  }
  filterWithBusinessName() {
    let searchFilter = { 'businessName-like': this.businessNameToSearch };
    this.applyFilters(searchFilter);
  }
  applyFilters(searchFilter = {}) {
    this.searchFilter = searchFilter;
    this.loadLeads(this.currentTableEvent);
  }
  inputValueChangeEvent(dataType, value) {
    if (value == '') {
      this.searchFilter = {};
      this.leadsTable.reset();
    }
  }
  viewLead(leadId) {
    this.routingService.handleRoute('leads/profile/' + leadId, null);
  }
  loadLeads(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    if (this.selectedSourcedByStatus && this.selectedSourcedByStatus.name) {
      if (this.selectedSourcedByStatus.name != 'All') {
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
      this.getDisbursalLeadCount(api_filter);
      this.getDisbursalLeads(api_filter);
    }
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
  getDisbursalLeadCount(filter = {}) {
    this.leadsService.getDisbursalLeadCount(filter).subscribe(
      (leadsCount) => {
        this.totalLeadsCount = leadsCount;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getDisbursalLeads(filter = {}) {
    this.apiLoading = true;
    this.leadsService.getDisbursalLeads(filter).subscribe(
      (response) => {
        this.leads = response;
        console.log(this.leads);
        this.apiLoading = false;
      },
      (error: any) => {
        this.apiLoading = false;
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
  actionItems(lead: any): MenuItem[] {
    const menuItems: MenuItem[] = [
      {
        label: 'Actions',
        items: [
          {
            label: 'View',
            icon: 'pi pi-eye',
            command: () => this.viewLead(lead.id),
          },
          {
            label: 'Disbursed Details',
            icon: 'pi pi-info-circle',
            command: () => this.disbursalDetails(lead.id),
          },
          ...(this.userDetails && this.userDetails.userType === '1'
            ? [
                {
                  label: 'Revenue',
                  icon: 'pi pi-money-bill',
                  command: () => this.revenueDetails(lead.id),
                },
              ]
            : []),
        ],
      },
    ];
    return menuItems;
  }

  revertToFilesInProcess(lead) {
    this.changeLeadStatus(lead.id, 5);
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

  disbursalDetails(leadId) {
    this.routingService.handleRoute(
      'disbursals/disbursalDetails/' + leadId,
      null
    );
  }

  revenueDetails(leadId) {
    this.routingService.handleRoute('disbursals/revenue/' + leadId, null);
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
      'disbursalAppliedFilter',
      this.appliedFilter
    );
    this.loadLeads(this.currentTableEvent);
  }
  statusChange(event) {
    this.localStorageService.setItemOnLocalStorage(
      'selectedDisbursals',
      event.value
    );
    this.loadLeads(this.currentTableEvent);
  }
  goBack() {
    this.location.back();
  }
}
