import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { LeadsService } from '../../leads/leads.service';
import { projectConstantsLocal } from 'src/app/constants/project-constants';

@Component({
  selector: 'app-revenue',
  templateUrl: './revenue.component.html',
  styleUrl: './revenue.component.scss',
})
export class RevenueComponent implements OnInit {
  leads: any = null;
  loading: any;
  totalRevenueValue: number = 0;
  leadId: string | null = null;
  breadCrumbItems: any = [];
  disbursalDetails: any[] = [];
  version = projectConstantsLocal.VERSION_DESKTOP;
  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private leadsService: LeadsService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.breadCrumbItems = [
      {
        icon: 'pi pi-home',
        label: ' Dashboard',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      {
        label: 'Disbursals',
        routerLink: '/user/disbursals',
        queryParams: { v: this.version },
      },
      { label: 'Revenue Details' },
    ];
  }
  ngOnInit(): void {
    this.leadId = this.route.snapshot.paramMap.get('id');
    if (this.leadId) {
      this.getLeadById(this.leadId);
      this.getDisbursalsDetailsById(this.leadId);
    }
  }
  sumRevenueValues(disbursals: any[]): number {
    if (!disbursals || disbursals.length === 0) {
      return 0;
    }
    return disbursals.reduce((total, disbursal) => {
      return total + (disbursal.revenueValue || 0);
    }, 0);
  }
  getDisbursalsDetailsById(leadId) {
    this.loading = true;
    this.leadsService.getDisbursalsDetailsById(leadId).subscribe(
      (lead: any) => {
        this.disbursalDetails = lead;
        this.totalRevenueValue = this.sumRevenueValues(this.disbursalDetails);
        console.log('Disbursal details:', this.disbursalDetails);
        console.log('Total Revenue Value:', this.totalRevenueValue);
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  updateCalculatedRevenue(rowData: any): void {
    rowData.revenueValue =
      (rowData.sanctionedAmount * rowData.payoutValue) / 100;
  }
  goBack(): void {
    this.location.back();
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

  saveFormData(): void {
    const formData = this.disbursalDetails.map((detail) => ({
      id: detail.id,
      payoutValue: detail.payoutValue,
      revenueValue: detail.revenueValue,
    }));
    console.log(formData);
    this.loading = true;
    this.leadsService.updateRevenueDetails(this.leadId, formData).subscribe(
      (response: any) => {
        this.loading = false;
        this.toastService.showSuccess('Revenue info Saved Successfully');
        const targetUrl = `user/disbursals`;
        this.router.navigateByUrl(targetUrl);
      },
      (error) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
}
