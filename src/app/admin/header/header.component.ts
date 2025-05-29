import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { ToastService } from '../../services/toast.service';
import { SubscriptionService } from '../../services/subscription.service';
import { LeadsService } from '../leads/leads.service';
import { DialogService } from 'primeng/dynamicdialog';
import { LeadSearchComponent } from '../leadSearch/leadSearch.component';
import { RoutingService } from 'src/app/services/routing-service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  showSidebar: any = false;
  sidebarVisible: boolean = false;
  sidebarCollapsed = false;
  userDetails: any;
  userRoles: any = [];
  searchFilter: any = {};
  businessNameToSearch: any;
  currentTableEvent: any;
  loading: any;
  notificationCount = 0;isMobile: boolean = false;
  notifications: { message: string, timestamp: Date }[] = [];
  showDropdown = false;
  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private localStorage: LocalStorageService,
    private router: Router,
    private dialogService: DialogService,
    private leadsService: LeadsService,
    private localStorageService: LocalStorageService,
    private subscriptionService: SubscriptionService,
    private routingService: RoutingService,
  ) {
    this.leadsService.sidebarVisible$.subscribe((collapsed) => {
      this.sidebarCollapsed = collapsed;
    });
    this.getUserRoles();
  }

  ngOnInit(): void {
     this.isMobile = window.innerWidth < 768;
  window.addEventListener('resize', () => {
    this.isMobile = window.innerWidth < 768;
  });
    this.userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    if (this.userDetails && this.userDetails.user) {
      this.userDetails = this.userDetails.user;
      this.userDetails.userImage = JSON.parse(this.userDetails.userImage);
    }
    // this.leadsService.connect(this.userDetails.id, this.userDetails.userType);

    // this.leadsService.onDocumentAdded((data) => {
    //   if (this.userDetails.userType == 1) {
    //     this.notifications.unshift({ message: data.message, timestamp: new Date() });
    //     this.notificationCount = this.notifications.length;
    //   }
    // });
  }
  userLogout() {
    this.authService
      .doLogout()
      .then(() => {
        this.toastService.showSuccess('Logout Successful');
        this.localStorage.clearAllFromLocalStorage();
        this.router.navigate(['user', 'login']);
      })
      .catch((error) => {
        this.toastService.showError(error);
      });
  }
  viewUser(userId) {
    this.routingService.handleRoute('team/view/' + userId, null);
  }
  // toggleDropdown() {
  //   this.showDropdown = !this.showDropdown;
  //   if (this.showDropdown) {
  //     this.notificationCount = 0; // Optionally reset badge when user opens dropdown
  //   }
  // }

  // clearNotifications() {
  //   this.notifications = [];
  //   this.notificationCount = 0;
  // }
  filterWithBusinessName() {
    let searchFilter = {};
    if (this.isPhoneNumber(this.businessNameToSearch)) {
      searchFilter = { 'primaryPhone-like': this.businessNameToSearch };
    } else {
      searchFilter = { 'businessName-like': this.businessNameToSearch };
    }
    this.applyFilters(searchFilter);
  }

  isPhoneNumber(value: string): boolean {
    const phoneNumberPattern = /^[0-9]{10}$/;
    return phoneNumberPattern.test(value);
  }
  applyFilters(searchFilter = {}) {
    this.searchFilter = searchFilter;
    this.loadLeads(this.currentTableEvent);
  }

  loadLeads(event) {
    this.currentTableEvent = event;
    let api_filter = this.leadsService.setFiltersFromPrimeTable(event);

    api_filter = Object.assign({}, api_filter, this.searchFilter);
    if (api_filter) {
      this.searchLeads(api_filter);
    }
  }

  searchLeads(filter = {}) {
    this.loading = true;
    this.leadsService.searchLeads(filter).subscribe(
      (response: any) => {
        console.log(response);
        if (response) {
          this.dialogService.open(LeadSearchComponent, {
            data: response,
            header: 'Lead Information',
            width: '80%',
          });
        } else {
          this.toastService.showError('An unknown error occurred.');
        }
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  getUserRoles(filter = {}) {
    this.leadsService.getUserRoles(filter).subscribe(
      (roles) => {
        this.userRoles = roles;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getUserRoleName(userId) {
    if (this.userRoles && this.userRoles.length > 0) {
      let leadUserName = this.userRoles.filter(
        (leadUser) => leadUser.id == userId
      );
      return (leadUserName && leadUserName[0] && leadUserName[0].name) || '';
    }
    return '';
  }
  showSidebarMenu() {
    this.showSidebar = !this.showSidebar;
    this.subscriptionService.sendMessage({
      ttype: 'showSidebar',
      value: this.showSidebar,
    });
  }
}
