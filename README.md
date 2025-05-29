# Eloanspro

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.1.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


callbacks modified code

<div>
  <div class="card">
    <div class="d-flex justify-content-between">
      <div class="pointer-cursor" (click)="goBack()">
        <span class="back-btn-icon"
          ><i class="pi pi-arrow-left fw-bold"></i></span
        >&nbsp;
        <span class="back-btn-text text-capitalize">Callbacks</span>
      </div>
      <!-- <div>
        <button
          pButton
          pRipple
          type="button"
          class="p-button-primary me-2"
          icon="pi pi-plus"
          (click)="createCallBack()"
        >
          &nbsp;Add Callback
        </button>
      </div> -->
      <div>
        <ng-container>
          <p-dropdown
            [options]="loanTypes"
            placeholder="Add Callback"
            [(ngModel)]="selectedLoanType"
            optionLabel="displayName"
            optionValue="name"
            (onChange)="onLoanTypeSelect($event)"
            [showClear]="true"
            appendTo="body"
            [dropdownIcon]="'fa fa-caret-down'"
            styleClass="custom-dropdown p-button-primary"
          ></p-dropdown>
        </ng-container>
      </div>
    </div>
  </div>
  <div class="bread-crumb">
    <p-breadcrumb [model]="breadCrumbItems"></p-breadcrumb>
  </div>
  <div class="text-capitalize">
    <p-tabMenu
      [model]="items"
      class="tabdesign"
      [activeItem]="activeItem"
      (activeItemChange)="onActiveItemChange($event)"
    ></p-tabMenu>

    <div *ngIf="activeItem && activeItem.name">
      <div *ngIf="activeItem.name == 'businessLoan'" class="text-capitalize">
        <p-table
          #callBacksTable
          [value]="callBacks"
          [lazy]="true"
          class="p-datatable-striped"
          (onLazyLoad)="loadCallBacks($event)"
          dataKey="id"
          [showCurrentPageReport]="true"
          [rowsPerPageOptions]="[10, 25, 50]"
          [paginator]="true"
          [rows]="10"
          [totalRecords]="callBacksCount"
          [loading]="apiLoading"
          responsiveLayout="scroll"
          scrollHeight="flex"
          [globalFilterFields]="[
            'referenceNo',
            'customer.firstName',
            'partner.partnerName',
            'status'
          ]"
          styleClass="p-datatable-customers"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Callbacks"
        >
          <ng-template pTemplate="caption">
            <div class="row">
              <div class="col-md-4 mt-2 no-padding-small">
                <div class="p-inputgroup">
                  <input
                    type="text"
                    pInputText
                    placeholder="Search Callback with Business Name"
                    [(ngModel)]="businessNameToSearch"
                    (ngModelChange)="
                      inputValueChangeEvent('loanId', businessNameToSearch)
                    "
                    (keyup.enter)="filterWithBusinessName()"
                  />
                  <button
                    type="button"
                    pButton
                    icon="pi pi-search"
                    class="p-button-primary"
                    [disabled]="!businessNameToSearch"
                    (click)="filterWithBusinessName()"
                  ></button>
                </div>
              </div>
              <div class="col-md-4 mt-2 no-padding-small">
                <div
                  class="p-inputgroup"
                  *ngIf="
                    userDetails &&
                    userDetails.userType &&
                    userDetails.userType != '3'
                  "
                >
                  <p-dropdown
                    styleClass="text-left"
                    [style]="{ width: '100%' }"
                    [options]="leadUsers"
                    (onChange)="statusChangesourcedBy($event)"
                    [dropdownIcon]="'fa fa-caret-down'"
                    [(ngModel)]="selectedSoucedByStatus"
                    optionLabel="name"
                    dataKey="name"
                    appendTo="body"
                    [filter]="true"
                    filterPlaceholder="Search..."
                  >
                  </p-dropdown>
                </div>
              </div>
              <div class="col-md-4 mt-2 no-padding-small text-right">
                <div class="d-flex">
                  <div class="flex-grow-1 me-2">
                    <p-dropdown
                      styleClass="text-left"
                      [style]="{ width: '100%' }"
                      [options]="callbackStatus"
                      (onChange)="statusChange($event)"
                      [dropdownIcon]="'fa fa-caret-down'"
                      [(ngModel)]="selectedCallbackStatus"
                      optionLabel="displayName"
                      appendTo="body"
                      dataKey="name"
                    >
                    </p-dropdown>
                  </div>
                  <div class="d-flex align-items-center pointer-cursor">
                    <app-filter
                      [position]="'right'"
                      [iconColor]="'#33009C'"
                      [iconSize]="'28px!important'"
                      (filterEvent)="applyConfigFilters($event, '')"
                      [filterConfig]="filterConfig"
                      [showFilterIndication]="appliedFilter"
                    >
                    </app-filter>
                  </div>
                </div>
              </div>
            </div>
          </ng-template>
          <ng-template pTemplate="header" let-columns>
            <tr>
              <th class="text-nowrap">Callback Id</th>
              <th class="text-nowrap">Business Name</th>
              <th>Phone</th>
              <th class="text-nowrap">Callback Date</th>
              <th>Remarks</th>
              <th
                class="text-nowrap"
                *ngIf="
                  userDetails &&
                  userDetails.userType &&
                  userDetails.userType != '3'
                "
              >
                Sourced By
              </th>
              <th class="text-nowrap">Created Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-callback>
            <tr
              class="text-capitalize"
              [ngClass]="{ 'disabled-row': callback.disabled }"
            >
              <td>
                <span class="table-column-data" *ngIf="callback.callBackId">{{
                  callback.callBackId
                }}</span>
              </td>
              <td>
                <b>
                  <span
                    class="table-column-data"
                    *ngIf="callback.businessName"
                    >{{ callback.businessName | capitalizeFirst }}</span
                  >
                </b>
              </td>
              <td>
                <span class="table-column-data" *ngIf="callback.phone">{{
                  callback.phone
                }}</span>
              </td>
              <td>
                <span class="table-column-data" *ngIf="callback.date">{{
                  callback.date | date : "mediumDate"
                }}</span>
              </td>
              <td>
                <span class="table-column-data" *ngIf="callback.remarks">{{
                  callback.remarks | capitalizeFirst
                }}</span>
              </td>
              <td
                *ngIf="
                  userDetails &&
                  userDetails.userType &&
                  userDetails.userType != '3'
                "
              >
                <span class="table-column-data" *ngIf="callback.sourcedBy">{{
                  getSourceName(callback.sourcedBy) | capitalizeFirst
                }}</span>
              </td>
              <td>
                <span class="table-column-data" *ngIf="callback.createdOn">{{
                  callback.createdOn | date : "mediumDate"
                }}</span>
              </td>
              <td>
                <span
                  class="table-column-data fw-bold statusdata"
                  *ngIf="callback.callbackInternalStatus"
                  [ngStyle]="{
                    color: getStatusColor(
                      getStatusName(callback.callbackInternalStatus)
                    ).textColor,
                    'background-color': getStatusColor(
                      getStatusName(callback.callbackInternalStatus)
                    ).backgroundColor
                  }"
                >
                  {{ getStatusName(callback.callbackInternalStatus) }}
                </span>
              </td>
              <td>
                <div
                  class="text-center d-flex"
                  *ngIf="callback.callbackInternalStatus !== 3"
                >
                  <div class="d-flex mr-3">
                    <button
                      pButton
                      pRipple
                      type="button"
                      class="p-button-primary"
                      (click)="updateCallBack(callback.id)"
                    >
                      Update
                    </button>
                  </div>
                  <p-menu
                    appendTo="body"
                    #menu
                    [model]="actionItems(callback, '')"
                    [popup]="true"
                  ></p-menu>
                  <button
                    pButton
                    type="button"
                    (click)="menu.toggle($event)"
                    icon="pi pi-bars"
                  ></button>
                </div>
                <div
                  class="text-center d-flex"
                  *ngIf="callback.callbackInternalStatus == 3"
                >
                  <button
                    pButton
                    pRipple
                    type="button"
                    class="p-button-primary me-2 custom-btn"
                    (click)="viewLead(callback.referenceNo)"
                  >
                    View
                  </button>
                </div>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr class="text-center">
              <td colspan="10" class="text-center fw-bold">
                <img
                  src="../../../assets/images/menu/no-data.gif"
                  width="200"
                  height="200"
                />
                <p>No Callbacks Found</p>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <div *ngIf="activeItem.name == 'personalLoan'" class="text-capitalize">
        <p-table
          #personalcallBacksTable
          [value]="callBacks"
          [lazy]="true"
          class="p-datatable-striped"
          (onLazyLoad)="loadPersonalLoanCallBacks($event)"
          dataKey="id"
          [showCurrentPageReport]="true"
          [rowsPerPageOptions]="[10, 25, 50]"
          [paginator]="true"
          [rows]="10"
          [totalRecords]="callBacksCount"
          [loading]="apiLoading"
          responsiveLayout="scroll"
          scrollHeight="flex"
          [globalFilterFields]="[
            'referenceNo',
            'customer.firstName',
            'partner.partnerName',
            'status'
          ]"
          styleClass="p-datatable-customers"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Callbacks"
        >
          <ng-template pTemplate="caption">
            <div class="row">
              <div
                class="col-md-4 mt-2 no-padding-small"
              >
                <div class="p-inputgroup">
                  <input
                    type="text"
                    pInputText
                    placeholder="Search Callback with Person Name"
                    [(ngModel)]="personNameToSearch"
                    (ngModelChange)="
                      inputValueChangeEventForPersonal('loanId', personNameToSearch)
                    "
                    (keyup.enter)="filterWithPersonName()"
                  />
                  <button
                    type="button"
                    pButton
                    icon="pi pi-search"
                    class="p-button-primary"
                    [disabled]="!businessNameToSearch"
                    (click)="filterWithBusinessName()"
                  ></button>
                </div>
              </div>
              <div class="col-md-4 mt-2 no-padding-small">
                <div
                  class="p-inputgroup"
                  *ngIf="
                    userDetails &&
                    userDetails.userType &&
                    userDetails.userType != '3'
                  "
                >
                  <br class="d-lg-none d-md-none" />
                  <p-dropdown
                    styleClass="text-left"
                    [style]="{ width: '100%' }"
                    [options]="leadUsers"
                    (onChange)="statusChangeForPersonal($event)"
                    [dropdownIcon]="'fa fa-caret-down'"
                    [(ngModel)]="SourcedByForPersonal"
                    optionLabel="name"
                    dataKey="name"
                    appendTo="body"
                    [filter]="true"
                    filterPlaceholder="Search..."
                  >
                  </p-dropdown>
                </div>
              </div>
              <div class="col-md-4 mt-2 no-padding-small text-right">
                <div class="d-flex">
                  <div class="flex-grow-1 me-2">
                    <p-dropdown
                      styleClass="text-left"
                      [style]="{ width: '100%' }"
                      [options]="callbackStatus"
                      (onChange)="statusChangeForPersonal1($event)"
                      [dropdownIcon]="'fa fa-caret-down'"
                      [(ngModel)]="selectedPersonalCallbackStatus"
                      optionLabel="displayName"
                      appendTo="body"
                      dataKey="name"
                    >
                    </p-dropdown>
                  </div>
                  <div class="d-flex align-items-center pointer-cursor">
                    <app-filter
                      [position]="'right'"
                      [iconColor]="'#33009C'"
                      [iconSize]="'28px!important'"
                      (filterEvent)="applyConfigFilters($event, 'Personal')"
                      [filterConfig]="filterConfig"
                      [showFilterIndication]="appliedFilter"
                    >
                    </app-filter>
                  </div>
                </div>
              </div>
            </div>
          </ng-template>
          <ng-template pTemplate="header" let-columns>
            <tr>
              <th class="text-nowrap">Callback Id</th>
              <th class="text-nowrap">Business Name</th>
              <th>Phone</th>
              <th class="text-nowrap">Callback Date</th>
              <th>Remarks</th>
              <th
                class="text-nowrap"
                *ngIf="
                  userDetails &&
                  userDetails.userType &&
                  userDetails.userType != '3'
                "
              >
                Sourced By
              </th>
              <th class="text-nowrap">Created Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-callback>
            <tr
              class="text-capitalize"
              [ngClass]="{ 'disabled-row': callback.disabled }"
            >
              <td>
                <span class="table-column-data" *ngIf="callback.callBackId">{{
                  callback.callBackId
                }}</span>
              </td>
              <td>
                <b>
                  <span
                    class="table-column-data"
                    *ngIf="callback.businessName"
                    >{{ callback.businessName | capitalizeFirst }}</span
                  >
                </b>
              </td>
              <td>
                <span class="table-column-data" *ngIf="callback.phone">{{
                  callback.phone
                }}</span>
              </td>
              <td>
                <span class="table-column-data" *ngIf="callback.date">{{
                  callback.date | date : "mediumDate"
                }}</span>
              </td>
              <td>
                <span class="table-column-data" *ngIf="callback.remarks">{{
                  callback.remarks | capitalizeFirst
                }}</span>
              </td>
              <td
                *ngIf="
                  userDetails &&
                  userDetails.userType &&
                  userDetails.userType != '3'
                "
              >
                <span class="table-column-data" *ngIf="callback.sourcedBy">{{
                  getSourceName(callback.sourcedBy) | capitalizeFirst
                }}</span>
              </td>
              <td>
                <span class="table-column-data" *ngIf="callback.createdOn">{{
                  callback.createdOn | date : "mediumDate"
                }}</span>
              </td>
              <td>
                <span
                  class="table-column-data fw-bold statusdata"
                  *ngIf="callback.callbackInternalStatus"
                  [ngStyle]="{
                    color: getStatusColor(
                      getStatusName(callback.callbackInternalStatus)
                    ).textColor,
                    'background-color': getStatusColor(
                      getStatusName(callback.callbackInternalStatus)
                    ).backgroundColor
                  }"
                >
                  {{ getStatusName(callback.callbackInternalStatus) }}
                </span>
              </td>
              <td>
                <div
                  class="text-center d-flex"
                  *ngIf="callback.callbackInternalStatus !== 3"
                >
                  <div class="d-flex mr-3">
                    <button
                      pButton
                      pRipple
                      type="button"
                      class="p-button-primary"
                      (click)="updateCallBack(callback.id)"
                    >
                      Update
                    </button>
                  </div>
                  <p-menu
                    appendTo="body"
                    #menu
                    [model]="actionItems(callback, 'personal')"
                    [popup]="true"
                  ></p-menu>
                  <button
                    pButton
                    type="button"
                    (click)="menu.toggle($event)"
                    icon="pi pi-bars"
                  ></button>
                </div>
                <div
                  class="text-center d-flex"
                  *ngIf="callback.callbackInternalStatus == 3"
                >
                  <button
                    pButton
                    pRipple
                    type="button"
                    class="p-button-primary me-2 custom-btn"
                    (click)="viewLead(callback.referenceNo)"
                  >
                    View
                  </button>
                </div>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr class="text-center">
              <td colspan="10" class="text-center fw-bold">
                <img
                  src="../../../assets/images/menu/no-data.gif"
                  width="200"
                  height="200"
                />
                <p>No Callbacks Found</p>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
      <div *ngIf="activeItem.name == 'homeLoan'">
        <p-tabMenu
          [model]="employmentStatus"
          class="tabdesign"
          [activeItem]="activeEmploymentStatus"
          (activeItemChange)="onActiveEmploymentStatusChange($event)"
        ></p-tabMenu>
        <ng-container
          *ngIf="activeEmploymentStatus && activeEmploymentStatus.name"
        >
          <ng-container
            *ngIf="
              activeEmploymentStatus.name == 'employed' ||
              activeEmploymentStatus.name == 'self-employed'
            "
          >
            <div class="text-capitalize">
              <p-table
                #HomecallBacksTable
                [value]="callBacks"
                [sortOrder]="-1"
                [lazy]="true"
                (onLazyLoad)="
                  activeEmploymentStatus.name == 'employed'
                    ? loadHomeLoanCallBacks($event)
                    : loadHomeLoanSelfCallBacks($event)
                "
                dataKey="id"
                [showCurrentPageReport]="true"
                [rowsPerPageOptions]="[10, 25, 50]"
                [paginator]="true"
                [rows]="10"
                class="p-datatable-striped"
                [totalRecords]="callBacksCount"
                [loading]="apiLoading"
                responsiveLayout="scroll"
                scrollHeight="flex"
                [globalFilterFields]="[
                  'referenceNo',
                  'customer.firstName',
                  'partner.partnerName',
                  'status'
                ]"
                styleClass="p-datatable-customers"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Callbacks"
              >
                <ng-template pTemplate="caption">
                  <div class="row">
                    <div class="col-md-4 mt-2 no-padding-small">
                      <div class="p-inputgroup">
                        <input
                          type="text"
                          pInputText
                          [placeholder]="
                            activeEmploymentStatus.name === 'employed'
                              ? 'Search Lead with Person Name'
                              : 'Search Lead with Business Name'
                          "
                          [(ngModel)]="searchInputValue"
                          (ngModelChange)="handleInputChange($event)"
                          (keyup.enter)="filterBasedOnEmploymentStatus()"
                        />
                        <button
                          type="button"
                          pButton
                          icon="pi pi-search"
                          class="p-button-primary"
                          [disabled]="!searchInputValue"
                          (click)="filterBasedOnEmploymentStatus()"
                        ></button>
                      </div>
                    </div>
                    <div class="col-md-4 mt-2 no-padding-small">
                      <div
                        class="p-inputgroup"
                        *ngIf="
                          userDetails &&
                          userDetails.userType &&
                          userDetails.userType != '3'
                        "
                      >
                        <br class="d-lg-none d-md-none" />
                        <p-dropdown
                          styleClass="text-left"
                          [style]="{ width: '100%' }"
                          [options]="leadUsers"
                          (onChange)="
                            activeEmploymentStatus.name === 'employed'
                              ? statusChangeForHome($event)
                              : statusChangeForHomeSelf($event)
                          "
                          [dropdownIcon]="'fa fa-caret-down'"
                          [(ngModel)]="SourcedByForHome"
                          optionLabel="name"
                          dataKey="name"
                          [filter]="true"
                          appendTo="body"
                          filterPlaceholder="Search..."
                        >
                        </p-dropdown>
                      </div>
                    </div>
                    <div class="col-md-4 mt-2 no-padding-small text-right">
                      <div class="d-flex">
                        <div class="flex-grow-1 me-2">
                          <p-dropdown
                            styleClass="text-left"
                            [style]="{ width: '100%' }"
                            [options]="callbackStatus"
                            (onChange)="
                              activeEmploymentStatus.name === 'employed'
                                ? statusChangeForHome($event)
                                : statusChangeForHomeSelf($event)
                            "
                            [dropdownIcon]="'fa fa-caret-down'"
                            [(ngModel)]="selectedHomeCallbackStatus"
                            optionLabel="displayName"
                            dataKey="name"
                            appendTo="body"
                          >
                          </p-dropdown>
                        </div>
                        <div class="d-flex align-items-center pointer-cursor">
                          <app-filter
                            [position]="'right'"
                            [iconColor]="'#33009C'"
                            [iconSize]="'28px!important'"
                            (filterEvent)="
                              activeEmploymentStatus.name === 'employed'
                                ? applyConfigFilters($event, 'Home')
                                : applyConfigFilters($event, 'Homeself')
                            "
                            [filterConfig]="
                              activeEmploymentStatus.name === 'employed'
                                ? HomefilterConfig
                                : HomeSelffilterConfig
                            "
                            [showFilterIndication]="
                              activeEmploymentStatus.name === 'employed'
                                ? appliedFilterHome
                                : appliedFilterHomeself
                            "
                          >
                          </app-filter>
                        </div>
                      </div>
                    </div>
                  </div>
                </ng-template>
                <ng-template pTemplate="header">
                  <tr>
                    <th class="text-nowrap">Callback Id</th>
                    <th
                      class="text-nowrap"
                      *ngIf="activeEmploymentStatus.name === 'employed'"
                    >
                      Person Name
                    </th>
                    <th
                      class="text-nowrap"
                      *ngIf="activeEmploymentStatus.name === 'self-employed'"
                    >
                      Business Name
                    </th>
                    <th>Phone</th>
                    <th class="text-nowrap">Callback Date</th>
                    <th>Remarks</th>
                    <th
                      class="text-nowrap"
                      *ngIf="
                        userDetails &&
                        userDetails.userType &&
                        userDetails.userType != '3'
                      "
                    >
                      Sourced By
                    </th>
                    <th class="text-nowrap">Created Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </ng-template>
                <ng-template pTemplate="body" let-callback>
                  <tr>
                    <td>
                      <span
                        class="table-column-data"
                        *ngIf="callback.callBackId"
                        >{{ callback.callBackId }}</span
                      >
                    </td>
                    <td >
                      <span
                        class="table-column-data"
                        *ngIf="callback.businessName"
                        >{{ callback.businessName | capitalizeFirst }}</span
                      >
                    </td>
                    <td>
                      <span class="table-column-data" *ngIf="callback.phone">{{
                        callback.phone
                      }}</span>
                    </td>
                    <td>
                      <span class="table-column-data" *ngIf="callback.date">{{
                        callback.date | date : "mediumDate"
                      }}</span>
                    </td>
                    <td>
                      <span
                        class="table-column-data"
                        *ngIf="callback.remarks"
                        >{{ callback.remarks | capitalizeFirst }}</span
                      >
                    </td>
                    <td
                      *ngIf="
                        userDetails &&
                        userDetails.userType &&
                        userDetails.userType != '3'
                      "
                    >
                      <span
                        class="table-column-data"
                        *ngIf="callback.sourcedBy"
                        >{{
                          getSourceName(callback.sourcedBy) | capitalizeFirst
                        }}</span
                      >
                    </td>
                    <td>
                      <span
                        class="table-column-data"
                        *ngIf="callback.createdOn"
                        >{{ callback.createdOn | date : "mediumDate" }}</span
                      >
                    </td>
                    <td>
                      <span
                        class="table-column-data fw-bold statusdata"
                        *ngIf="callback.callbackInternalStatus"
                        [ngStyle]="{
                          color: getStatusColor(
                            getStatusName(callback.callbackInternalStatus)
                          ).textColor,
                          'background-color': getStatusColor(
                            getStatusName(callback.callbackInternalStatus)
                          ).backgroundColor
                        }"
                      >
                        {{ getStatusName(callback.callbackInternalStatus) }}
                      </span>
                    </td>
                    <td>
                      <div
                        class="text-center d-flex"
                        *ngIf="callback.callbackInternalStatus !== 3"
                      >
                        <div class="d-flex mr-3">
                          <button
                            pButton
                            pRipple
                            type="button"
                            class="p-button-primary"
                            (click)="updateCallBack(callback.id)"
                          >
                            Update
                          </button>
                        </div>
                        <p-menu
                          appendTo="body"
                          #menu
                          [model]="getHomeActionItems(callback)"
                          [popup]="true"
                        ></p-menu>
                        <button
                          pButton
                          type="button"
                          (click)="menu.toggle($event)"
                          icon="pi pi-bars"
                        ></button>
                      </div>
                      <div
                        class="text-center d-flex"
                        *ngIf="callback.callbackInternalStatus == 3"
                      >
                        <button
                          pButton
                          pRipple
                          type="button"
                          class="p-button-primary me-2 custom-btn"
                          (click)="viewLead(callback.referenceNo)"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                  <tr class="text-center">
                    <td colspan="10" class="text-center fw-bold">
                      <img
                        src="../../../assets/images/menu/no-data.gif"
                        width="200"
                        height="200"
                      />
                      <p>No Callbacks Found</p>
                    </td>
                  </tr>
                </ng-template>
              </p-table>
            </div>
          </ng-container>
        </ng-container>
      </div>
      <div *ngIf="activeItem.name == 'lap'">
        <p-tabMenu
          [model]="employmentStatus"
          class="tabdesign"
          [activeItem]="activeEmploymentStatus"
          (activeItemChange)="onActiveEmploymentStatusChange($event)"
        ></p-tabMenu>
        <ng-container
          *ngIf="activeEmploymentStatus && activeEmploymentStatus.name"
        >
          <ng-container
            *ngIf="
              activeEmploymentStatus.name == 'employed' ||
              activeEmploymentStatus.name == 'self-employed'
            "
          >
            <div class="text-capitalize">
              <p-table
                #LapcallbacksTable
                [value]="callBacks"
                [sortOrder]="-1"
                [lazy]="true"
                (onLazyLoad)="
                  activeEmploymentStatus.name == 'employed'
                    ? loadLAPCallBacks($event)
                    : loadLAPSelfCallBacks($event)
                "
                dataKey="id"
                [showCurrentPageReport]="true"
                [rowsPerPageOptions]="[10, 25, 50]"
                [paginator]="true"
                [rows]="10"
                class="p-datatable-striped"
                [totalRecords]="callBacksCount"
                [loading]="apiLoading"
                responsiveLayout="scroll"
                scrollHeight="flex"
                [globalFilterFields]="[
                  'referenceNo',
                  'customer.firstName',
                  'partner.partnerName',
                  'status'
                ]"
                styleClass="p-datatable-customers"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Callbacks"
              >
                <ng-template pTemplate="caption">
                  <div class="row">
                    <div class="col-md-4 mt-2 no-padding-small">
                      <div class="p-inputgroup">
                        <input
                          type="text"
                          pInputText
                          [placeholder]="
                            activeEmploymentStatus.name === 'employed'
                              ? 'Search Lead with Person Name'
                              : 'Search Lead with Business Name'
                          "
                          [(ngModel)]="searchInputValue"
                          (ngModelChange)="handleInputChange($event)"
                          (keyup.enter)="filterBasedOnEmploymentStatus()"
                        />
                        <button
                          type="button"
                          pButton
                          icon="pi pi-search"
                          class="p-button-primary"
                          [disabled]="!searchInputValue"
                          (click)="filterBasedOnEmploymentStatus()"
                        ></button>
                      </div>
                    </div>
                    <div class="col-md-4 mt-2 no-padding-small">
                      <div
                        class="p-inputgroup"
                        *ngIf="
                          userDetails &&
                          userDetails.userType &&
                          userDetails.userType != '3'
                        "
                      >
                        <br class="d-lg-none d-md-none" />
                        <p-dropdown
                          styleClass="text-left"
                          [style]="{ width: '100%' }"
                          [options]="leadUsers"
                          (onChange)="
                            activeEmploymentStatus.name === 'employed'
                              ? statusChangeForLap($event)
                              : statusChangeForLapSelf($event)
                          "
                          [dropdownIcon]="'fa fa-caret-down'"
                          [(ngModel)]="SourcedByForLap"
                          optionLabel="name"
                          dataKey="name"
                          appendTo="body"
                          [filter]="true"
                          filterPlaceholder="Search..."
                        >
                        </p-dropdown>
                      </div>
                    </div>
                    <div class="col-md-4 mt-2 no-padding-small text-right">
                      <div class="d-flex">
                        <div class="flex-grow-1 me-2">
                          <p-dropdown
                            styleClass="text-left"
                            [style]="{ width: '100%' }"
                            [options]="callbackStatus"
                            (onChange)="
                              activeEmploymentStatus.name === 'employed'
                                ? statusChangeForLap($event)
                                : statusChangeForLapSelf($event)
                            "
                            [dropdownIcon]="'fa fa-caret-down'"
                            [(ngModel)]="selectedLapCallbackStatus"
                            optionLabel="displayName"
                            dataKey="name"
                            appendTo="body"
                          >
                          </p-dropdown>
                        </div>
                        <div class="d-flex align-items-center pointer-cursor">
                          <app-filter
                            [position]="'right'"
                            [iconColor]="'#33009C'"
                            [iconSize]="'28px!important'"
                            (filterEvent)="
                              activeEmploymentStatus.name === 'employed'
                                ? applyConfigFilters($event, 'Lap')
                                : applyConfigFilters($event, 'Lapself')
                            "
                            [filterConfig]="
                              activeEmploymentStatus.name === 'employed'
                                ? HomefilterConfig
                                : HomeSelffilterConfig
                            "
                            [showFilterIndication]="
                              activeEmploymentStatus.name === 'employed'
                                ? appliedFilterLap
                                : appliedFilterLapself
                            "
                          >
                          </app-filter>
                        </div>
                      </div>
                    </div>
                  </div>
                </ng-template>
                <ng-template pTemplate="header">
                  <tr>
                    <th class="text-nowrap">Callback Id</th>
                    <th
                      class="text-nowrap"
                      *ngIf="activeEmploymentStatus.name === 'employed'"
                    >
                      Person Name
                    </th>
                    <th
                      class="text-nowrap"
                      *ngIf="activeEmploymentStatus.name === 'self-employed'"
                    >
                      Business Name
                    </th>

                    <th>Phone</th>
                    <th class="text-nowrap">Callback Date</th>
                    <th>Remarks</th>
                    <th
                      class="text-nowrap"
                      *ngIf="
                        userDetails &&
                        userDetails.userType &&
                        userDetails.userType != '3'
                      "
                    >
                      Sourced By
                    </th>
                    <th class="text-nowrap">Created Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </ng-template>
                <ng-template pTemplate="body" let-callback>
                  <tr>
                    <td>
                      <span
                        class="table-column-data"
                        *ngIf="callback.callBackId"
                        >{{ callback.callBackId }}</span
                      >
                    </td>
                    <td *ngIf="activeEmploymentStatus.name === 'employed'">
                      <span
                        class="table-column-data"
                        *ngIf="callback.businessName"
                        >{{ callback.businessName | capitalizeFirst }}</span
                      >
                    </td>
                    <td *ngIf="activeEmploymentStatus.name === 'self-employed'">
                      <span
                        class="table-column-data"
                        *ngIf="callback.businessName"
                        >{{ callback.businessName | capitalizeFirst }}</span
                      >
                    </td>

                    <td>
                      <span class="table-column-data" *ngIf="callback.phone">{{
                        callback.phone
                      }}</span>
                    </td>
                    <td>
                      <span class="table-column-data" *ngIf="callback.date">{{
                        callback.date | date : "mediumDate"
                      }}</span>
                    </td>
                    <td>
                      <span
                        class="table-column-data"
                        *ngIf="callback.remarks"
                        >{{ callback.remarks | capitalizeFirst }}</span
                      >
                    </td>
                    <td
                      *ngIf="
                        userDetails &&
                        userDetails.userType &&
                        userDetails.userType != '3'
                      "
                    >
                      <span
                        class="table-column-data"
                        *ngIf="callback.sourcedBy"
                        >{{
                          getSourceName(callback.sourcedBy) | capitalizeFirst
                        }}</span
                      >
                    </td>
                    <td>
                      <span
                        class="table-column-data"
                        *ngIf="callback.createdOn"
                        >{{ callback.createdOn | date : "mediumDate" }}</span
                      >
                    </td>
                    <td>
                      <span
                        class="table-column-data fw-bold statusdata"
                        *ngIf="callback.callbackInternalStatus"
                        [ngStyle]="{
                          color: getStatusColor(
                            getStatusName(callback.callbackInternalStatus)
                          ).textColor,
                          'background-color': getStatusColor(
                            getStatusName(callback.callbackInternalStatus)
                          ).backgroundColor
                        }"
                      >
                        {{ getStatusName(callback.callbackInternalStatus) }}
                      </span>
                    </td>
                    <td>
                      <div
                        class="text-center d-flex"
                        *ngIf="callback.callbackInternalStatus !== 3"
                      >
                        <div class="d-flex mr-3">
                          <button
                            pButton
                            pRipple
                            type="button"
                            class="p-button-primary"
                            (click)="updateCallBack(callback.id)"
                          >
                            Update
                          </button>
                        </div>
                        <p-menu
                          appendTo="body"
                          #menu
                          [model]="getLapActionItems(callback)"
                          [popup]="true"
                        ></p-menu>
                        <button
                          pButton
                          type="button"
                          (click)="menu.toggle($event)"
                          icon="pi pi-bars"
                        ></button>
                      </div>
                      <div
                        class="text-center d-flex"
                        *ngIf="callback.callbackInternalStatus == 3"
                      >
                        <button
                          pButton
                          pRipple
                          type="button"
                          class="p-button-primary me-2 custom-btn"
                          (click)="viewLead(callback.referenceNo)"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                  <tr class="text-center">
                    <td colspan="10" class="text-center fw-bold">
                      <img
                        src="../../../assets/images/menu/no-data.gif"
                        width="200"
                        height="200"
                      />
                      <p>No Callbacks Found</p>
                    </td>
                  </tr>
                </ng-template>
              </p-table>
            </div>
          </ng-container>
        </ng-container>
      </div>

      <!-- <div
        *ngIf="activeItem.name == 'convertedCallbacks'"
        class="text-capitalize"
      >
        <p-table
          #convertedcallBacksTable
          [value]="callBacks"
          [lazy]="true"
          class="p-datatable-striped"
          (onLazyLoad)="loadConvertedCallBacks($event)"
          dataKey="id"
          [showCurrentPageReport]="true"
          [rowsPerPageOptions]="[10, 25, 50]"
          [paginator]="true"
          [rows]="10"
          [totalRecords]="callBacksCount"
          [loading]="apiLoading"
          responsiveLayout="scroll"
          scrollHeight="flex"
          [globalFilterFields]="[
            'referenceNo',
            'customer.firstName',
            'partner.partnerName',
            'status'
          ]"
          styleClass="p-datatable-customers"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Converted Leads"
        >
          <ng-template pTemplate="caption">
            <div class="row">
              <div
                class="col-md-4 mt-2 no-padding-small"
                *ngIf="
                  userDetails &&
                  userDetails.userType &&
                  userDetails.userType == '3'
                "
              >
                <div class="p-inputgroup">
                  <input
                    type="text"
                    pInputText
                    placeholder="Search Callback with Business Name"
                    [(ngModel)]="businessNameConvertedCallback"
                    (ngModelChange)="
                      inputValueChangeEventConvertedCallback(
                        'loanId',
                        businessNameConvertedCallback
                      )
                    "
                    (keyup.enter)="filterWithBusinessNameConverted()"
                  />
                  <button
                    type="button"
                    pButton
                    icon="pi pi-search"
                    class="p-button-primary"
                    [disabled]="!businessNameConvertedCallback"
                    (click)="filterWithBusinessNameConverted()"
                  ></button>
                </div>
              </div>
              <div class="col-md-4 mt-2 no-padding-small">
                <div
                  class="p-inputgroup"
                  *ngIf="
                    userDetails &&
                    userDetails.userType &&
                    userDetails.userType != '3'
                  "
                >
                  <br class="d-lg-none d-md-none" />
                  <p-dropdown
                    styleClass="text-left"
                    [style]="{ width: '100%' }"
                    [options]="leadUsers"
                    (onChange)="statusChangeConverted($event)"
                    [dropdownIcon]="'fa fa-caret-down'"
                    [(ngModel)]="selectedSoucedByConverted"
                    optionLabel="name"
                    dataKey="name"
                    appendTo="body"
                    [filter]="true"
                    filterPlaceholder="Search..."
                  >
                  </p-dropdown>
                </div>
              </div>
              <div
                class="col-md-4 mt-2 no-padding-small"
                *ngIf="
                  userDetails &&
                  userDetails.userType &&
                  userDetails.userType != '3'
                "
              ></div>
              <div class="col-md-4 mt-2 no-padding-small text-right">
                <div class="d-flex">
                  <div class="flex-grow-1 me-2"></div>
                  <div class="d-flex align-items-center pointer-cursor">
                    <app-filter
                      [position]="'right'"
                      [iconColor]="'#33009C'"
                      [iconSize]="'28px!important'"
                      (filterEvent)="applyConfigFiltersConverted($event)"
                      [filterConfig]="filterConfig"
                      [showFilterIndication]="appliedFilterConverted"
                    >
                    </app-filter>
                  </div>
                </div>
              </div>
            </div>
          </ng-template>
          <ng-template pTemplate="header" let-columns>
            <tr>
              <th class="text-nowrap">Callback Id</th>
              <th class="text-nowrap">Lead Id</th>
              <th class="text-nowrap">Business Name</th>
              <th>Phone</th>
              <th class="text-nowrap">Callback Date</th>
              <th>Remarks</th>
              <th
                class="text-nowrap"
                *ngIf="
                  userDetails &&
                  userDetails.userType &&
                  userDetails.userType != '3'
                "
              >
                Sourced By
              </th>
              <th class="text-nowrap">Created Date</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-callback>
            <tr
              class="text-capitalize"
              [ngClass]="{ 'disabled-row': callback.disabled }"
            >
              <td>
                <span class="table-column-data" *ngIf="callback.callBackId">{{
                  callback.callBackId
                }}</span>
              </td>
              <td>
                <span class="table-column-data" *ngIf="callback.referenceNo">{{
                  callback.referenceNo
                }}</span>
              </td>
              <td>
                <b>
                  <span
                    class="table-column-data"
                    *ngIf="callback.businessName"
                    >{{ callback.businessName | capitalizeFirst }}</span
                  >
                </b>
              </td>
              <td>
                <span class="table-column-data" *ngIf="callback.phone">{{
                  callback.phone
                }}</span>
              </td>
              <td>
                <span class="table-column-data" *ngIf="callback.date">{{
                  callback.date | date : "mediumDate"
                }}</span>
              </td>
              <td>
                <span class="table-column-data" *ngIf="callback.remarks">{{
                  callback.remarks | capitalizeFirst
                }}</span>
              </td>
              <td
                *ngIf="
                  userDetails &&
                  userDetails.userType &&
                  userDetails.userType != '3'
                "
              >
                <span class="table-column-data" *ngIf="callback.sourcedBy">{{
                  getSourceName(callback.sourcedBy) | capitalizeFirst
                }}</span>
              </td>
              <td>
                <span class="table-column-data" *ngIf="callback.createdOn">{{
                  callback.createdOn | date : "mediumDate"
                }}</span>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr class="text-center">
              <td colspan="10" class="text-center fw-bold">
                <img
                  src="../../../assets/images/menu/no-data.gif"
                  width="200"
                  height="200"
                />
                <p>No Converted Leads Found</p>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div> -->
    </div>
  </div>
</div>




callbacks.ts file 
import { Component, OnInit, ViewChild } from '@angular/core';
import { RoutingService } from '../../services/routing-service';
import { Location } from '@angular/common';
import { LeadsService } from '../leads/leads.service';
import { ToastService } from '../../services/toast.service';
import { Table } from 'primeng/table';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-callbacks',
  templateUrl: './callbacks.component.html',
  styleUrl: './callbacks.component.scss',
})
export class CallbacksComponent implements OnInit {
  breadCrumbItems: any = [];
  searchFilter: any = {};
  // searchFilterConverted: any = {};
  filterConfig: any[] = [];
  currentTableEvent: any;
  callBacks: any = [];
  callBacksCount: any = 0;
  items: any;
  activeItem: any;
  loading: any;
  userDetails: any;

  selectedSoucedByStatus: any;
  // selectedSoucedByConverted: any;
  callbackStatus: any = projectConstantsLocal.CALLBACK_STATUS;
  callBackIdToSearch: any;
  selectedCallbackStatus = this.callbackStatus[1];
  businessNameToSearch: any;
  // businessNameConvertedCallback: any;
  callbackInternalStatusList: any = projectConstantsLocal.CALLBACK_INTERNAL_STATUS;
  leadUsers: any = [];
  capabilities: any;
  appliedFilter: {};
  apiLoading: any;
  // appliedFilterConverted: {};
  @ViewChild('callBacksTable') callBacksTable!: Table;
  @ViewChild('personalcallBacksTable') personalcallBacksTable!: Table;
    @ViewChild('HomecallBacksTable') HomecallBacksTable!: Table;
    @ViewChild('LapcallBacksTable') LapcallBacksTable!: Table;
  // @ViewChild('convertedcallBacksTable') convertedcallBacksTable!: Table;
  version = projectConstantsLocal.VERSION_DESKTOP;


  loanTypes: any = projectConstantsLocal.LOAN_TYPES;
  selectedLoanType: string;
  employmentStatus: any;
  activeEmploymentStatus: any;
  totalCallbacksCountArray: any;
  totalStatusCallbacksCountArray:any;
  searchInputValue: string = '';
  personNameToSearchForHome: any;
  personNameToSearch: any;
  businessNameToSearchForHome: any;
  searchFilterPersonal: any = {};
  searchFilterForHomeSelf: any = {};
  searchFilterForLapSelf: any = {};
  searchFilterForHome: any = {};
  searchFilterForLap: any = {};
  SourcedByForPersonal: any;
  SourcedByForHome: any;
  SourcedByForLap: any;
  appliedFilterPersonal: {};
  appliedFilterLap: {};
  appliedFilterLapself: {};
  appliedFilterHomeself: {};
  appliedFilterHome: {};
  selectedHomeCallbackStatus = this.callbackStatus[1];
  selectedLapCallbackStatus = this.callbackStatus[1];
  selectedPersonalCallbackStatus = this.callbackStatus[1];
  personalfilterConfig: any[] = [];
  HomefilterConfig: any[] = [];
  HomeSelffilterConfig: any[] = [];
  constructor(
    private routingService: RoutingService,
    private location: Location,
    private leadsService: LeadsService,
    private confirmationService: ConfirmationService,
    private toastService: ToastService,
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
      { label: 'Callbacks' },
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

    // this.items = [
    //   { label: 'Callbacks', name: 'callbacks' },
    //   { label: 'Converted Leads', name: 'convertedCallbacks' },
    // ];

    // this.items = [
    //   { label: 'Business Loan', name: 'businessLoan' },
    //   { label: 'Personal Loan', name: 'personalLoan' },
    //   { label: 'Home Loan', name: 'homeLoan' },
    //   { label: 'LAP', name: 'lap' },
    // ];
    this.initializeUserDetails();
    this.loadAllLeadData().then(() => {
      this.items = this.getFilteredItems();
      this.loadActiveItem();
      this.employmentStatus = this.getStatusItems();
      this.loadEmploymentActiveItem();
    });
    // this.activeItem = this.items[0];
    this.capabilities = this.leadsService.getUserRbac();
    console.log(this.capabilities);
    this.setFilterConfig();
    // const storedAppliedFilter =
    //   this.localStorageService.getItemFromLocalStorage(
    //     'callbacksAppliedFilter'
    //   );
    // if (storedAppliedFilter) {
    //   this.appliedFilter = storedAppliedFilter;
    // }
    // const storedAppliedFiltercallbacktolead =
    //   this.localStorageService.getItemFromLocalStorage(
    //     'callbackstoLeadAppliedFilter'
    //   );
    // if (storedAppliedFiltercallbacktolead) {
    //   this.appliedFilterConverted = storedAppliedFiltercallbacktolead;
    // }
    const storedStatus1 = this.localStorageService.getItemFromLocalStorage(
      'selectedCallbackStatus'
    );
    if (storedStatus1) {
      this.selectedCallbackStatus = storedStatus1;
    }
    const storedStatus2 = this.localStorageService.getItemFromLocalStorage(
      'selectedCallbackSourcedByStatus'
    );
    if (storedStatus2) {
      this.selectedSoucedByStatus = storedStatus2;
    }
    const storedStatus3 = this.localStorageService.getItemFromLocalStorage(
      'selectedCallbackSourcedByForPersonal'
    );
    if (storedStatus3) {
      this.SourcedByForPersonal = storedStatus3;
    }

    const storedStatus4 = this.localStorageService.getItemFromLocalStorage(
      'selectedPersonalCallbackStatus'
    );
    if (storedStatus4) {
      this.selectedPersonalCallbackStatus = storedStatus4;
    }
    console.log(this.selectedSoucedByStatus)
    const loanTypes = ['', 'Personal', 'Home', 'Homeself', 'Lap', 'Lapself'];
    loanTypes.forEach((type) => {
      const localStorageKey = `callbacksAppliedFilter${type}`;
      const storedFilter =
        this.localStorageService.getItemFromLocalStorage(localStorageKey);
      if (storedFilter) {
        this[`appliedFilter${type}`] = storedFilter;
      } else {
        this[`appliedFilter${type}`] = {};
      }
    });

  }

  private async initializeUserDetails(): Promise<void> {
    const userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    this.userDetails = userDetails.user;

  }
  private async loadAllLeadData(): Promise<void> {
    try {
      await Promise.all([
        // this.loadLeadsforPersonal(event),
        // this.loadLeadsforHome(event),
        // this.loadLeadsforHomeself(event),
        // this.loadLeadsforlap(event),
        // this.loadLeadsforlapself(event),
        this.getTotalCallbacksCountArray(event),
        this.getStatusCallbacksCountArray(event)
      ]);
    } catch (error) {}
  }

  loadActiveItem() {
    const storedActiveItemName =
      this.localStorageService.getItemFromLocalStorage('callbacksActiveItem');
    if (storedActiveItemName) {
      this.activeItem =
        this.items.find((item) => item.name === storedActiveItemName) ||
        this.items[0];
    } else {
      this.activeItem = this.items[0];
    }
  }

  loadEmploymentActiveItem() {
    const storedActiveItemName =
      this.localStorageService.getItemFromLocalStorage(
        'employmentStatusActiveItem'
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
  getFilteredItems(): { label: string; name: string }[] {
    return [
      {
        label: `Business Loan (${this.totalCallbacksCountArray?.businesscount})`,
        name: 'businessLoan',
      },
      {
        label: `Personal Loan (${
          this.totalCallbacksCountArray?.personalcount || 0
        })`,
        name: 'personalLoan',
      },
      {
        label: `Home Loan (${this.totalCallbacksCountArray?.homeLoancount || 0})`,
        name: 'homeLoan',
      },
      {
        label: `LAP (${this.totalCallbacksCountArray?.LAPLoancount || 0})`,
        name: 'lap',
      },
    ];
  }
    getTotalCallbacksCountArray(filter = {}) {
    if (
      this.userDetails &&
      this.userDetails?.id &&
      this.userDetails?.userType &&
      this.userDetails?.userType == '3'
    ) {
      filter['sourcedBy-eq'] = this.userDetails.id;
    }
    filter['callbackInternalStatus-eq'] = 1;
    this.leadsService.getTotalCallbacksCountArray(filter).subscribe(
      (callbacksCount) => {
        this.totalCallbacksCountArray = callbacksCount;
        console.log(this.totalCallbacksCountArray);
        this.items = this.getFilteredItems();
        // this.activeItem = this.items[0];
        this.loadActiveItem();
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getStatusCallbacksCountArray(filter = {}) {
    if (
      this.userDetails &&
      this.userDetails?.id &&
      this.userDetails?.userType &&
      this.userDetails?.userType == '3'
    ) {
      filter['sourcedBy-eq'] = this.userDetails.id;
    }
    filter['callbackInternalStatus-eq'] = 1;
    this.leadsService.getStatusCallbacksCountArray(filter).subscribe(
      (callbacksCount) => {
        this.totalStatusCallbacksCountArray = callbacksCount;
        console.log(this.totalStatusCallbacksCountArray);
        this.employmentStatus = this.getStatusItems();
        // this.activeItem = this.items[0];
        this.loadEmploymentActiveItem();
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }


  getStatusItems(): { label: string; name: string }[] {
    if (!this.totalStatusCallbacksCountArray) {
      return [];
    }
console.log(this.activeItem)
    // Check the active item and update the labels accordingly
    if (this.activeItem.name === 'homeLoan') {
      return [
        {
          label: `Employed (${this.totalStatusCallbacksCountArray.homeLoancount || 0})`,
          name: 'employed',
        },
        {
          label: `Self Employed (${this.totalStatusCallbacksCountArray.homeLoanSelfcount || 0})`,
          name: 'self-employed',
        },
      ];
    } else if (this.activeItem.name === 'lap') {
      return [
        {
          label: `Employed (${this.totalStatusCallbacksCountArray.LAPLoancount || 0})`,
          name: 'employed',
        },
        {
          label: `Self Employed (${this.totalStatusCallbacksCountArray.LAPLoanSelfcount || 0})`,
          name: 'self-employed',
        },
      ];
    }

    // Default case (if activeItem is neither homeLoan nor LAP)
    return [];
  }

  actionItems(callback: any,callbackType: string): MenuItem[] {
    const menuItems: any = [{ label: 'Actions', items: [] }];
    if (callback.callbackInternalStatus === 1) {
      menuItems[0].items.push({
        label: 'Archive',
        icon: 'pi pi-sign-in',
        command: () => this.sendCallbackToArchive(callback,callbackType),
      });
      menuItems[0].items.push({
        label: 'Send to Lead',
        icon: 'pi pi-sign-in',
        command: () => this.confirmConversion(callback,callbackType),
      });
    } else if (callback.callbackInternalStatus === 2) {
      menuItems[0].items.push({
        label: 'Send to New callback',
        icon: 'pi pi-sign-in',
        command: () => this.revertCallbackToNew(callback,callbackType),
      });
    }
    if (this.capabilities?.delete) {
      menuItems[0].items.push({
        label: 'Delete',
        icon: 'fa fa-trash',
        command: () => this.confirmDelete(callback),
      });
    }
    return menuItems;
  }

  confirmDelete(callback) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete this Callback ? <br>
              Business Name: ${callback.businessName}<br>
              Callback ID: ${callback.callBackId}
              `,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteCallBack(callback.callBackId);
      },
    });
  }

  deleteCallBack(callBackId) {
    this.loading = true;
    this.leadsService.deleteCallBack(callBackId).subscribe(
      (response: any) => {
        console.log(response);
        this.toastService.showSuccess(response?.message);
        this.loading = false;
        this.loadCallBacks(this.currentTableEvent);
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  onActiveItemChange(event) {
    console.log(event);
    this.activeItem = event;
    this.localStorageService.setItemOnLocalStorage(
      'callbacksActiveItem',
      event.name
    );
    this.employmentStatus =this.getStatusItems();
    this.loadEmploymentActiveItem();
  }

  onActiveEmploymentStatusChange(event: any) {
    this.activeEmploymentStatus = event;
    const { name } = this.activeEmploymentStatus;
    const { name: itemName } = this.activeItem;
    console.log(name);
    console.log(itemName);
    const loadCallbacksFn =
      name === 'employed'
        ? itemName === 'homeLoan'
          ? this.loadHomeLoanCallBacks
          : this.loadLAPCallBacks
        : itemName === 'homeLoan'
        ? this.loadHomeLoanSelfCallBacks
        : this.loadLAPSelfCallBacks;

    loadCallbacksFn.call(this, event);
    this.localStorageService.setItemOnLocalStorage(
      'employmentStatusActiveItem',
      event.name
    );
  }
  setFilterConfig() {
    console.log("filter config")
    this.filterConfig = [
      {
        header: 'Callback Id',
        data: [
          {
            field: 'callBackId',
            title: 'Callback Id',
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
            field: 'phone',
            title: 'Phone Number',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Callback Date',
        data: [
          {
            field: 'date',
            title: 'Callback Date',
            type: 'date',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Callback Date Range',
        data: [
          {
            field: 'date',
            title: 'From',
            type: 'date',
            filterType: 'gte',
          },
          { field: 'date', title: 'To', type: 'date', filterType: 'lte' },
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
    ];
  }
  sendCallbackToArchive(callback,callbackType) {
    this.changeCallBackStatus(callback.id, 2,callbackType);
  }

  confirmConversion(callback,callbackType) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to convert this callback to lead?',
      header: 'Confirm Conversion',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        this.sendCallbackToLead(callback,callbackType);
      },
    });
  }
  sendCallbackToLead(callback,callbackType) {
    this.loading = true;
    const formData: any = {
      businessName: callback.businessName,
      primaryPhone: callback.phone,
      referenceNo: callback.callBackId,
      ...(this.userDetails?.userType === '3' && this.userDetails?.id
        ? {
            sourcedBy: this.userDetails.id,
            leadSource: 1,
          }
        : {}),
    };
    console.log('Form Data:', formData);
    this.leadsService.createLeadFromCallback(formData).subscribe(
      (leadData: any) => {
        if (leadData?.id) {
          console.log('Created Lead ID:', leadData.id);
          this.toastService.showSuccess('Lead Created Successfully');
          this.routingService.handleRoute(`leads/update/${leadData.id}`, null);
          const callbackFormData = {
            businessName: callback.businessName,
            referenceNo: leadData.id,
          };
          console.log('callbackFormData', callbackFormData);
          this.leadsService
            .updateCallBack(callback.id, callbackFormData)
            .subscribe(
              (updateResponse: any) => {
                this.loading = false;
                if (updateResponse) {
                  this.changeCallBackStatus(callback.id, 3,callbackType);
                }
              },
              (error: any) => {
                this.loading = false;
                console.error('Callback Update Error:', error);
                this.toastService.showError(error);
              }
            );
        }
      },
      (error: any) => {
        this.loading = false;
        console.error('Lead Creation Error:', error);
        this.toastService.showError(error);
      }
    );
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
  //     'callbacksAppliedFilter',
  //     this.appliedFilter
  //   );
  //   this.loadCallBacks(null);
  // }

  applyConfigFilters(event, filterType: string) {
    let api_filter = event;
    let localStorageKey = `callbacksAppliedFilter${filterType}`;
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
        this.loadCallbackTypes('personal');
        break;
      case 'Home':
        this.loadCallbackTypes('home');
        break;
      case 'Homeself':
        this.loadCallbackTypes('homeself');
        break;
      case 'Lap':
        this.loadCallbackTypes('lap');
        break;
      case 'Lapself':
        this.loadCallbackTypes('lapself');
        break;
      default:
        this.loadCallBacks(null);
        break;
    }
  }
  revertCallbackToNew(callback,callbackType) {
    this.changeCallBackStatus(callback.id, 1, callbackType);
  }

  changeCallBackStatus(callbackId, statusId,callbackType) {
    this.loading = true;
    this.leadsService.changeCallBackStatus(callbackId, statusId).subscribe(
      () => {
        this.loading = false;
        this.toastService.showSuccess('Lead Status Changed Successfully');
        this.loadCallbackTypes(callbackType);
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  getStatusColor(status: string): {
    textColor: string;
    backgroundColor: string;
  } {
    switch (status) {
      case 'New':
        return { textColor: '#5DCC0B', backgroundColor: '#E4F7D6' };
      case 'Archived':
        return { textColor: '#FFBA15', backgroundColor: '#FFF3D6' };
      case 'Converted':
        return { textColor: '#7B1FA2', backgroundColor: '#EAD1F7' }; // Purple theme
      default:
        return { textColor: 'black', backgroundColor: 'white' };
    }
  }

  getStatusName(statusId) {
    if (this.callbackInternalStatusList && this.callbackInternalStatusList.length > 0) {
      let leadStatusName = this.callbackInternalStatusList.filter(
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
  getLeadUsers(filter = {}) {
    this.loading = true;
    this.leadsService.getUsers(filter).subscribe(
      (leadUsers: any) => {
        this.leadUsers = [{ name: 'All' }, ...leadUsers];
        this.loading = false;
        console.log(leadUsers)
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
  createCallBack() {
    this.routingService.handleRoute('callbacks/create', null);
  }
  createSecuredCallBack() {
    this.routingService.handleRoute(['/callbacks/create'], {
      queryParams: { loanType: this.selectedLoanType },
    });
  }

  updateCallBack(callBackId) {
    this.routingService.handleRoute('callbacks/update/' + callBackId, null);
  }
  viewLead(leadId) {
    this.routingService.handleRoute('leads/profile/' + leadId, null);
  }
  goBack() {
    this.location.back();
  }


  loadCallbackTypes(callbackType: string) {
    switch (callbackType) {
      case 'personal':
        this.loadPersonalLoanCallBacks(this.currentTableEvent);
        break;
      case 'home':
        this.loadHomeLoanCallBacks(this.currentTableEvent);
        break;
      case 'homeself':
        this.loadHomeLoanSelfCallBacks(this.currentTableEvent);
        break;
      case 'lap':
        this.loadLAPCallBacks(this.currentTableEvent);
        break;
      case 'lapself':
        this.loadLAPSelfCallBacks(this.currentTableEvent);
        break;
      default:
        console.error('Unknown lead type');
    }
  }

  loadCallBacks(event) {
    console.log(event);
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    if (this.selectedCallbackStatus) {
      if (this.selectedCallbackStatus && this.selectedCallbackStatus.name) {
        if (this.selectedCallbackStatus.name != 'all') {
          api_filter['callbackInternalStatus-eq'] =
            this.selectedCallbackStatus.id;
        } else {
          api_filter['callbackInternalStatus-or'] = '1,2,3';
        }
      }
    } else {
      api_filter['callbackInternalStatus-or'] = '1,2,3';
    }
    console.log(this.selectedSoucedByStatus)
    if (this.selectedSoucedByStatus && this.selectedSoucedByStatus.name) {
      if (this.selectedSoucedByStatus.name == 'All') {
        api_filter['callbackInternalStatus-or'] = '1,2,3';
      } else {
        api_filter['sourcedBy-eq'] = this.selectedSoucedByStatus.id;
      }
    }
    api_filter['loanType-eq'] = "businessLoan";
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
      console.log(api_filter);
      this.getCallBacksCount(api_filter);
      this.getCallBacks(api_filter);
    }
  }

  loadPersonalLoanCallBacks(event) {
    console.log(event);
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'personalLoan';
    api_filter['employmentStatus-eq'] = 'employed';
    if (this.selectedPersonalCallbackStatus) {
      if (this.selectedPersonalCallbackStatus && this.selectedPersonalCallbackStatus.name) {
        if (this.selectedPersonalCallbackStatus.name != 'all') {
          api_filter['callbackInternalStatus-eq'] = this.selectedPersonalCallbackStatus.id;
        } else {
          api_filter['callbackInternalStatus-or'] = '1,2,3';
        }
      }
    }
    if (this.SourcedByForPersonal && this.SourcedByForPersonal.name) {
      if (this.SourcedByForPersonal.name != 'All') {
        api_filter['sourcedBy-eq'] = this.SourcedByForPersonal.id;
      }
    }
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilterPersonal,
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
      console.log(api_filter);
      this.getCallBacksCount(api_filter);
      this.getCallBacks(api_filter);
    }
  }


  loadHomeLoanCallBacks(event) {
    console.log(event);
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'homeLoan';
    api_filter['employmentStatus-eq'] = 'employed';

    if (this.selectedHomeCallbackStatus) {
      if (this.selectedHomeCallbackStatus && this.selectedHomeCallbackStatus.name) {
        if (this.selectedHomeCallbackStatus.name != 'all') {
          api_filter['callbackInternalStatus-eq'] = this.selectedHomeCallbackStatus.id;
        } else {
          api_filter['callbackInternalStatus-or'] = '1,2,3';
        }
      }
    }
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
    if (api_filter) {
      console.log(api_filter);
      this.getCallBacksCount(api_filter);
      this.getCallBacks(api_filter);
    }
  }

  loadHomeLoanSelfCallBacks(event) {
    console.log(event);
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'homeLoan';
    api_filter['employmentStatus-eq'] = 'self-employed';
    if (this.selectedHomeCallbackStatus) {
      if (this.selectedHomeCallbackStatus && this.selectedHomeCallbackStatus.name) {
        if (this.selectedHomeCallbackStatus.name != 'all') {
          api_filter['callbackInternalStatus-eq'] = this.selectedHomeCallbackStatus.id;
        } else {
          api_filter['callbackInternalStatus-or'] = '1,2,3';
        }
      }
    }
    if (this.selectedSoucedByStatus && this.selectedSoucedByStatus.name) {
      if (this.selectedSoucedByStatus.name == 'All') {
        api_filter['callbackInternalStatus-or'] = '1,2,3';
      } else {
        api_filter['sourcedBy-eq'] = this.selectedSoucedByStatus.id;
      }
    }
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilterForHomeSelf,
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
      console.log(api_filter);
      this.getCallBacksCount(api_filter);
      this.getCallBacks(api_filter);
    }
  }

  loadLAPCallBacks(event) {
    console.log(event);
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'lap';
    api_filter['employmentStatus-eq'] = 'employed';
    if (this.selectedLapCallbackStatus) {
      if (this.selectedLapCallbackStatus && this.selectedLapCallbackStatus.name) {
        if (this.selectedLapCallbackStatus.name != 'all') {
          api_filter['callbackInternalStatus-eq'] = this.selectedLapCallbackStatus.id;
        } else {
          api_filter['callbackInternalStatus-or'] = '1,2,3';
        }
      }
    }
    if (this.selectedSoucedByStatus && this.selectedSoucedByStatus.name) {
      if (this.selectedSoucedByStatus.name == 'All') {
        api_filter['callbackInternalStatus-or'] = '1,2,3';
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
      console.log(api_filter);
      this.getCallBacksCount(api_filter);
      this.getCallBacks(api_filter);
    }
  }

  loadLAPSelfCallBacks(event) {
    console.log(event);
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
    api_filter['loanType-eq'] = 'lap';
    api_filter['employmentStatus-eq'] = 'self-employed';
    if (this.selectedLapCallbackStatus) {
      if (this.selectedLapCallbackStatus && this.selectedLapCallbackStatus.name) {
        if (this.selectedLapCallbackStatus.name != 'all') {
          api_filter['callbackInternalStatus-eq'] = this.selectedLapCallbackStatus.id;
        } else {
          api_filter['callbackInternalStatus-or'] = '1,2,3';
        }
      }
    }
    if (this.selectedSoucedByStatus && this.selectedSoucedByStatus.name) {
      if (this.selectedSoucedByStatus.name == 'All') {
        api_filter['callbackInternalStatus-or'] = '1,2,3';
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
      console.log(api_filter);
      this.getCallBacksCount(api_filter);
      this.getCallBacks(api_filter);
    }
  }

  handleInputChange(value: string): void {
    this.searchInputValue = value;
    if (this.activeEmploymentStatus.name === 'employed') {
      this.personNameToSearchForHome = value;
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
      }
    }
  }

  filterWithPersonNameForHome() {
    let searchFilterForHome = {
      'businessName-like': this.personNameToSearchForHome,
    };
    this.applyFiltersHome(searchFilterForHome);
  }
  filterWithPersonNameForLAP() {
    let searchFilterForLap = {
      'businessName-like': this.personNameToSearchForHome,
    };
    console.log(searchFilterForLap);
    this.applyFiltersLap(searchFilterForLap);
  }
  inputValueChangeEventForHome(dataType, value) {
    if (value == '') {
      this.searchFilterForHome = {};
      this.HomecallBacksTable.reset();
    }
  }

  inputValueChangeEventForHomeSelf(dataType, value) {
    if (value == '') {
      this.searchFilterForHomeSelf = {};
      this.HomecallBacksTable.reset();
    }
  }
  inputValueChangeEventForLAP(dataType, value) {
    if (value == '') {
      this.searchFilterForLap = {};
      this.LapcallBacksTable.reset();
    }
  }

  inputValueChangeEventForLAPSelf(dataType, value) {
    if (value == '') {
      this.searchFilterForLapSelf = {};
      this.LapcallBacksTable.reset();
    }
  }

  inputValueChangeEventForPersonal(dataType, value) {
    if (value == '') {
      this.searchFilterPersonal = {};
      this.personalcallBacksTable.reset();
    }
  }
  applyFiltersHome(searchFilterForHome = {}) {
    this.searchFilterForHome = searchFilterForHome;
    this.loadCallbackTypes('home');
  }

  applyFiltersLap(searchFilterForLap = {}) {
    this.searchFilterForLap = searchFilterForLap;
    this.loadCallbackTypes('lap');
  }
  applyFiltersHomeSelf(searchFilterForHomeSelf = {}) {
    this.searchFilterForHomeSelf = searchFilterForHomeSelf;
    this.loadCallbackTypes('homeself');
  }

  applyFiltersLapSelf(searchFilterForLapSelf = {}) {
    this.searchFilterForLapSelf = searchFilterForLapSelf;
    this.loadCallbackTypes('lapself');
  }

  filterBasedOnEmploymentStatus(): void {
    if (this.activeEmploymentStatus.name === 'employed') {
      if (this.activeItem.name === 'homeLoan') {
        this.filterWithPersonNameForHome();
      } else if (this.activeItem.name === 'lap') {
        this.filterWithPersonNameForLAP();
      }
    } else {
      if (this.activeItem.name === 'homeLoan') {
        this.filterWithBusinessNameForHome();
      } else if (this.activeItem.name === 'lap') {
        this.filterWithBusinessNameForLAP();
      }
    }
  }

  filterWithBusinessNameForHome() {
    let searchFilterForHomeSelf = {
      'businessName-like': this.businessNameToSearchForHome,
    };
    this.applyFiltersHomeSelf(searchFilterForHomeSelf);
  }

  filterWithBusinessNameForLAP() {
    let searchFilterForLapSelf = {
      'businessName-like': this.businessNameToSearchForHome,
    };
    this.applyFiltersLapSelf(searchFilterForLapSelf);
  }
  statusChangeForPersonal(event) {
    this.localStorageService.setItemOnLocalStorage(
      'selectedCallbackSourcedByForPersonal',
      event.value
    );
    this.loadCallbackTypes('personal');
  }
  statusChangeForPersonal1(event) {
    this.localStorageService.setItemOnLocalStorage(
      'selectedPersonalCallbackStatus',
      event.value
    );
    this.loadCallbackTypes('personal');
  }


  statusChangeForHome(event) {
    this.loadCallbackTypes('home');
  }

  statusChangeForLap(event) {
    this.loadCallbackTypes('lap');
  }

  statusChangeForHomeSelf(event) {
    this.loadCallbackTypes('homeself');
  }
  statusChangeForLapSelf(event) {
    this.loadCallbackTypes('lapself');
  }
  getLapActionItems(lead: any): MenuItem[] {
    const callbackType =
      this.activeEmploymentStatus.name === 'employed' ? 'lap' : 'lapself';
    return this.actionItems(lead, callbackType);
  }
  getHomeActionItems(lead: any): MenuItem[] {
    const callbackType =
      this.activeEmploymentStatus.name === 'employed' ? 'home' : 'homeself';
    return this.actionItems(lead, callbackType);
  }
  // loadConvertedCallBacks(event) {
  //   console.log(event);
  //   this.currentTableEvent = event;
  //   let api_filter = this.leadsService.setFiltersFromPrimeTable(event);
  //   api_filter['callbackInternalStatus-eq'] = '3';
  //   if (this.selectedSoucedByConverted && this.selectedSoucedByConverted.name) {
  //     if (this.selectedSoucedByConverted.name != 'All') {
  //       api_filter['sourcedBy-eq'] = this.selectedSoucedByConverted.id;
  //     }
  //   }
  //   api_filter = Object.assign(
  //     {},
  //     api_filter,
  //     this.searchFilterConverted,
  //     this.appliedFilterConverted
  //   );
  //   if (
  //     this.userDetails &&
  //     this.userDetails.id &&
  //     this.userDetails.userType &&
  //     this.userDetails.userType == '3'
  //   ) {
  //     api_filter['sourcedBy-eq'] = this.userDetails.id;
  //   }
  //   if (api_filter) {
  //     console.log(api_filter);
  //     this.getCallBacksCount(api_filter);
  //     this.getCallBacks(api_filter);
  //   }
  // }

  inputValueChangeEvent(dataType, value) {
    if (value == '') {
      this.searchFilter = {};
      this.callBacksTable.reset();
    }
  }

  // inputValueChangeEventConvertedCallback(dataType, value) {
  //   if (value == '') {
  //     this.searchFilterConverted = {};
  //     this.convertedcallBacksTable.reset();
  //   }
  // }
  getCallBacksCount(filter = {}) {
    this.leadsService.getCallBacksCount(filter).subscribe(
      (response) => {
        this.callBacksCount = response;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getCallBacks(filter = {}) {
    this.apiLoading = true;
    this.leadsService.getCallBacks(filter).subscribe(
      (callBacks) => {
        this.callBacks = callBacks;
        this.apiLoading = false;
      },
      (error: any) => {
        this.apiLoading = false;
        this.toastService.showError(error);
      }
    );
  }

  filterWithCallBackId() {
    let searchFilter = { 'callBackId-like': this.callBackIdToSearch };
    this.applyFilters(searchFilter);
  }

  applyFilters(searchFilter = {}) {
    this.searchFilter = searchFilter;
    this.loadCallBacks(this.currentTableEvent);
  }

  filterWithBusinessName() {
    let searchFilter = { 'businessName-like': this.businessNameToSearch };
    this.applyFilters(searchFilter);
  }

  filterWithPersonName() {
    let searchFilter = { 'businessName-like': this.personNameToSearch };
    this.applyFiltersForPersonal(searchFilter);
  }

  applyFiltersForPersonal(searchFilterPersonal = {}) {
    this.searchFilterPersonal = searchFilterPersonal;
    this.loadCallbackTypes('personal');
  }
  // filterWithBusinessNameConverted() {
  //   let searchFilterConverted = {
  //     'businessName-like': this.businessNameConvertedCallback,
  //   };
  //   this.applyFiltersConverted(searchFilterConverted);
  // }

  // applyFiltersConverted(searchFilterConverted = {}) {
  //   this.searchFilterConverted = searchFilterConverted;
  //   this.loadConvertedCallBacks(this.currentTableEvent);
  // }
  statusChange(event) {
    this.localStorageService.setItemOnLocalStorage(
      'selectedCallbackStatus',
      event.value
    );
    this.loadCallBacks(this.currentTableEvent);
  }
  statusChangesourcedBy(event) {
    this.localStorageService.setItemOnLocalStorage(
      'selectedCallbackSourcedByStatus',
      event.value
    );
    this.loadCallBacks(this.currentTableEvent);
  }

  // statusChangeConverted(event) {
  //   this.loadConvertedCallBacks(this.currentTableEvent);
  // }



  onLoanTypeSelect(event: any): void {
    console.log('Selected Loan Type:', event.value);
    this.selectedLoanType = event.value;
    // if (this.selectedLoanType == 'businessLoan') {
    //   this.createCallBack();
    // } else {
      this.createSecuredCallBack();
    // }
  }


}




# callback create.html

<div>
  <div>
    <div class="card">
      <div class="d-flex justify-content-between">
        <div class="pointer-cursor" (click)="goBack()">
          <span class="back-btn-icon"
            ><i class="pi pi-arrow-left fw-bold"></i></span
          >&nbsp;
          <span class="back-btn-text text-capitalize">{{ heading }}</span>
        </div>
      </div>
    </div>
    <div class="bread-crumb">
      <p-breadcrumb [model]="breadCrumbItems"></p-breadcrumb>
    </div>
  </div>
</div>

<div *ngIf="!loading">
  <div class="p-fluid" *ngIf="loanType == 'lap' || loanType == 'homeLoan'">
    <div class="container p-3">
      <div class="row justify-content-center align-items-center mt-2">
        <div class="col-md-6 col-lg-4">
          <div class="field-radiobutton form-check">
            <p-radioButton
              name="employmentStatus"
              value="employed"
              [(ngModel)]="employmentStatus"
              inputId="employed"
              class="form-check-input"
            ></p-radioButton>
            <label for="employed" class="form-check-label">Employed</label>
          </div>
        </div>
        <div class="col-md-6 col-lg-4">
          <div class="field-radiobutton form-check">
            <p-radioButton
              name="employmentStatus"
              value="self-employed"
              [(ngModel)]="employmentStatus"
              inputId="selfEmployed"
              class="form-check-input"
            ></p-radioButton>
            <label for="selfEmployed" class="form-check-label"
              >Self-Employed</label
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<div *ngIf="!loading">
  <div
    class="card callback-form"
    *ngIf="
      loanType === 'businessLoan' ||
      (loanType === 'homeLoan' && employmentStatus === 'self-employed') ||
      (loanType === 'lap' && employmentStatus === 'self-employed') ||
      loanType === 'personalLoan' ||
        (loanType === 'homeLoan' && employmentStatus === 'employed') ||
        (loanType === 'lap' && employmentStatus === 'employed')
    "
  >
    <form
      class="login-form"
      [formGroup]="callBackForm"
      novalidate
      (ngSubmit)="onSubmit(callBackForm.value)"
    >
      <div class="row">
        <div class="col-md-4">
          <img
            src="../../../../assets/images/leads/6.jpg"
            width="400"
            height="290"
            class="icon"
            alt="Callbacks Icon"
          />
        </div>
        <div class="col-md-8">
          <div class="row mt-2">
            <!-- Business Name (For Self-Employed) -->
            <div
              class="col-md-4 mt-2"
              *ngIf="employmentStatus === 'self-employed'"
            >
              <div>
                <div class="my-1">
                  <label
                    >Business Name&nbsp;<span class="text-danger"
                      >*</span
                    ></label
                  >
                </div>
                <input
                  pInputText
                  class="rounded-lg"
                  type="text"
                  formControlName="businessName"
                  placeholder="Enter Business Name"
                  autocomplete="off"
                />
              </div>
            </div>

            <!-- Person Name (For Employed) -->
            <div class="col-md-4 mt-2" *ngIf="employmentStatus === 'employed'">
              <div>
                <div class="my-1">
                  <label
                    >Person Name&nbsp;<span class="text-danger">*</span></label
                  >
                </div>
                <input
                  pInputText
                  class="rounded-lg"
                  type="text"
                  formControlName="businessName"
                  placeholder="Enter Person Name"
                  autocomplete="off"
                />
              </div>
            </div>
            <div class="col-md-4 mt-2">
              <div>
                <div class="my-1">
                  <label>Phone&nbsp;<span class="text-danger">*</span></label>
                </div>
                <input
                  pInputText
                  class="rounded-lg"
                  type="text"
                  placeholder="Enter Phone"
                  formControlName="phone"
                  autocomplete="off"
                  maxlength="10"
                />
              </div>
            </div>
            <!-- Callback Date -->
            <div class="col-md-4 mt-2">
              <div>
                <div class="my-1">
                  <label
                    >Callback Date&nbsp;<span class="text-danger"
                      >*</span
                    ></label
                  >
                </div>
                <p-calendar
                  formControlName="date"
                  dateFormat="yy-mm-dd"
                  placeholder="Select Callback Date"
                  [showIcon]="true"
                  appendTo="body"
                  [readonlyInput]="true"
                  [showButtonBar]="true"
                ></p-calendar>
              </div>
            </div>

            <!-- Sourced By (For User Types other than '3') -->
            <div
              class="col-md-4 mt-2"
              *ngIf="userDetails?.userType && userDetails.userType !== '3'"
            >
              <div>
                <div class="my-1">
                  <label
                    >Sourced By&nbsp;<span class="text-danger">*</span></label
                  >
                </div>
                <p-dropdown
                  [options]="leadUsers"
                  formControlName="sourcedBy"
                  optionLabel="name"
                  optionValue="id"
                  appendTo="body"
                  [showClear]="true"
                  placeholder="Select Sourced By"
                  [dropdownIcon]="'fa fa-caret-down'"
                ></p-dropdown>
              </div>
            </div>

            <!-- Created On (For User Types other than '3') -->
            <div
              class="col-md-4 mt-2"
              *ngIf="userDetails?.userType && userDetails.userType !== '3'"
            >
              <div>
                <div class="my-1">
                  <label>Created On</label>
                </div>
                <p-calendar
                  formControlName="createdOn"
                  placeholder="Select Created On Date"
                  [showIcon]="true"
                  appendTo="body"
                  dateFormat="yy-mm-dd"
                  [showButtonBar]="true"
                ></p-calendar>
              </div>
            </div>

            <!-- Remarks -->
            <div class="col-12">
              <div class="my-1">
                <label>Remarks&nbsp;<span class="text-danger">*</span></label>
              </div>
              <textarea
                pInputTextarea
                class="rounded-lg"
                placeholder="Enter Remarks"
                formControlName="remarks"
                autocomplete="off"
                [autoResize]="true"
              ></textarea>
            </div>

            <!-- Buttons -->
            <div class="d-flex justify-content-center">
              <div class="d-flex mt-3 mb-3">
                <button
                  pButton
                  pRipple
                  type="button"
                  class="p-button-info me-2"
                  (click)="goBack()"
                >
                  Go Back
                </button>
                <button
                  pButton
                  pRipple
                  type="submit"
                  [disabled]="!callBackForm.valid"
                  class="p-button-primary"
                >
                  {{ actionType === "create" ? "Add" : "Update" }} Callback
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</div>

<div *ngIf="loading">
  <app-preloader></app-preloader>
</div>



# create.ts file 
import { Component } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DateTimeProcessorService } from '../../../services/date-time-processor.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { RoutingService } from '../../../services/routing-service';
import { ToastService } from '../../../services/toast.service';
import { LeadsService } from '../../leads/leads.service';
import { Location } from '@angular/common';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import moment from 'moment-timezone';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
})
export class CreateComponent {
  breadCrumbItems: any = [];
  leadUsers: any = [];
  callBackForm: UntypedFormGroup;
  callBackId: any;
  loading: any;
  callBackData: any;
  heading: any = 'Create Callback';
  actionType: any = 'create';
  moment: any;
  userDetails: any;
  leadSources: any = [];
  loanType: string;
  employmentStatus: any = projectConstantsLocal.EMPLOYMENT_STATUS;
  version = projectConstantsLocal.VERSION_DESKTOP;
  constructor(
    private location: Location,
    private formBuilder: UntypedFormBuilder,
    private leadsService: LeadsService,
    private toastService: ToastService,
    private localStorageService: LocalStorageService,
    private activatedRoute: ActivatedRoute,
    private routingService: RoutingService,
    private dateTimeProcessor: DateTimeProcessorService
  ) {
    this.moment = this.dateTimeProcessor.getMoment();
    this.activatedRoute.queryParams.subscribe((params) => {
      this.loanType = params['loanType'];
      console.log('Selected Loan Type:', this.loanType);
    });
    this.activatedRoute.params.subscribe((params) => {
      if (params && params['id']) {
        this.callBackId = params['id'];
        this.actionType = 'update';
        this.heading = 'Update Callback';
        this.getCallBackDetailsById().then((data) => {
          if (data) {
            (this.employmentStatus = this.callBackData?.employmentStatus),
              (this.loanType = this.callBackData.loanType),
            console.log('callBackData', this.callBackData);
            this.callBackForm.patchValue({
              businessName: this.callBackData.businessName,
              personName: this.callBackData.businessName,
              phone: this.callBackData.phone,
              sourcedBy: this.callBackData.sourcedBy,
              createdOn: this.moment(this.callBackData.createdOn).format(
                'YYYY-MM-DD  HH:mm:ss'
              ),
              // date: this.moment(this.callBackData.date).format('MM/DD/YYYY'),
              date: this.callBackData.date,
              remarks: this.callBackData.remarks,
            });
          }
        });
      }
    });
    this.userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    this.breadCrumbItems = [
      {
        icon: 'pi pi-home',
        label: ' Dashboard',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      {
        label: 'Callbacks',
        routerLink: '/user/callbacks',
        queryParams: { v: this.version },
      },
      { label: this.actionType == 'create' ? 'Create' : 'Update' },
    ];
    this.getLeadUsers();
  }
  ngOnInit() {
    let userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    this.userDetails = userDetails.user;
    console.log(this.userDetails);
    this.createForm();
    if (this.loanType == 'personalLoan') {
      this.employmentStatus = 'employed';
    }
    if (this.loanType == 'businessLoan') {
      this.employmentStatus = 'self-employed';
    }
  }
  getCallBackDetailsById(filter = {}) {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.leadsService
        .getCallBackDetailsById(this.callBackId, filter)
        .subscribe(
          (callBackData) => {
            this.callBackData = callBackData;
            this.loading = false;
            resolve(true);
          },
          (error: any) => {
            this.loading = false;
            resolve(false);
            this.toastService.showError(error);
          }
        );
    });
  }
  createForm() {
    this.callBackForm = this.formBuilder.group({
      businessName: ['', Validators.compose([Validators.required])],
      // personName: ['', Validators.compose([Validators.required])],
      phone: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^\d{10}$/),
        ]),
      ],
      sourcedBy: ['', Validators.compose([Validators.required])],
      date: ['', Validators.compose([Validators.required])],
      remarks: ['', Validators.compose([Validators.required])],
      createdOn: [''],
    });
    if (
      this.userDetails &&
      this.userDetails.userType &&
      this.userDetails.userType == '3' &&
      this.userDetails.id
    ) {
      this.callBackForm.controls['sourcedBy'].setValue(this.userDetails.id);
    }
  }
  onSubmit(formValues) {
    let formData: any = {
      loanType: this.loanType,
      employmentStatus: this.employmentStatus,
      businessName: formValues.businessName,
      phone: formValues.phone,
      // date: formValues.date,
      date: this.moment(formValues.date).format('YYYY-MM-DD'),
      remarks: formValues.remarks,
      sourcedBy: formValues.sourcedBy,
      lastUpdatedBy:
        this.userDetails &&
        this.userDetails.user &&
        this.userDetails.user.username,
        // ...(this.loanType ? { employmentStatus: this.employmentStatus } : {})
    };
    if (this.actionType == 'create') {
      if (formValues.createdOn) {
        formData.createdOn = moment(formValues.createdOn)
          .tz('Asia/Kolkata') // Convert to IST
          .set({
            hour: moment().tz('Asia/Kolkata').hour(), // Set the current hour in IST
            minute: moment().tz('Asia/Kolkata').minute(), // Set the current minute in IST
            second: moment().tz('Asia/Kolkata').second(), // Set the current second in IST
            millisecond: moment().tz('Asia/Kolkata').millisecond(), // Set the current millisecond in IST
          })
          .utc()
          .format('YYYY-MM-DD HH:mm:ss'); // Format as UTC time
      }
      this.loading = true;
      this.leadsService.createCallBack(formData).subscribe(
        (data) => {
          if (data) {
            this.loading = false;
            this.toastService.showSuccess('Callback Created Successfully');
            this.routingService.handleRoute('callbacks', null);
          }
        },
        (error: any) => {
          this.loading = false;
          this.toastService.showError(error);
        }
      );
    } else if (this.actionType == 'update') {
      if (formValues.createdOn) {
        const newCreatedOn = this.moment(formValues.createdOn).format(
          'YYYY-MM-DD'
        );
        const currentCreatedOn = this.moment(
          this.callBackData?.createdOn
        ).format('YYYY-MM-DD');
        console.log(newCreatedOn);
        console.log(currentCreatedOn);
        if (newCreatedOn !== currentCreatedOn) {
          formData.createdOn = moment(formValues.createdOn)
            .tz('Asia/Kolkata')
            .set({
              hour: moment().tz('Asia/Kolkata').hour(),
              minute: moment().tz('Asia/Kolkata').minute(),
              second: moment().tz('Asia/Kolkata').second(),
              millisecond: moment().tz('Asia/Kolkata').millisecond(),
            })
            .utc()
            .format('YYYY-MM-DD HH:mm:ss');
        }
      }
      this.loading = true;
      this.leadsService.updateCallBack(this.callBackId, formData).subscribe(
        (data) => {
          if (data) {
            this.loading = false;
            this.toastService.showSuccess('Callback Updated Successfully');
            this.routingService.handleRoute('callbacks', null);
          }
        },
        (error: any) => {
          this.loading = false;
          this.toastService.showError(error);
        }
      );
    }
  }
  getLeadUsers(filter = {}) {
    this.leadsService.getUsers(filter).subscribe(
      (users) => {
        this.leadUsers = users;
        console.log('Lead Users:', this.leadUsers);
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  goBack() {
    this.location.back();
  }
}
