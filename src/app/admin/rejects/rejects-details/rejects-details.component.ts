import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { LeadsService } from '../../leads/leads.service';

@Component({
  selector: 'app-rejects-details',
  templateUrl: './rejects-details.component.html',
  styleUrl: './rejects-details.component.scss',
})
export class RejectsDetailsComponent implements OnInit {
  breadCrumbItems: any = [];
  leads: any = null;
  loading: any;
  leadId: string | null = null;
  version = projectConstantsLocal.VERSION_DESKTOP;
  rejectedFilesInProcess: any[] = [];
  bankRejectesData: any[] = [];
  filesInProcessDetails: any[] = [];
  constructor(
    private location: Location,

    private route: ActivatedRoute,
    private leadsService: LeadsService,
    private toastService: ToastService
  ) {
    this.breadCrumbItems = [
      {
        icon: 'pi pi-home',
        label: ' Dashboard',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      {
        label: 'Rejects',
        routerLink: '/user/rejects',
        queryParams: { v: this.version },
      },
      { label: 'Rejects Details' },
    ];
  }

  ngOnInit(): void {
    this.leadId = this.route.snapshot.paramMap.get('id');
    if (this.leadId) {
      this.getLeadById(this.leadId);
      this.getBankRejectsDetailsById(this.leadId);
    }
  }
  getBankRejectsDetailsById(leadId: string): void {
    this.leadsService.getBankRejectsDetailsById(leadId).subscribe(
      (response: any) => {
        console.log('Response data:', response);
        this.bankRejectesData = response;
      },
      (error) => {
        this.toastService.showError(error);
      }
    );
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
  goBack() {
    this.location.back();
  }
}
