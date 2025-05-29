import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { LeadsService } from '../../leads/leads.service';
import { Location } from '@angular/common';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { DateTimeProcessorService } from 'src/app/services/date-time-processor.service';
@Component({
  selector: 'app-approved-amount',
  templateUrl: './approved-amount.component.html',
  styleUrl: './approved-amount.component.scss',
})
export class ApprovedAmountComponent implements OnInit {
  leads: any = null;
  leadId: string | null = null;
  moment: any;
  loading: any;
  version = projectConstantsLocal.VERSION_DESKTOP;
  statusOptions: any[] = projectConstantsLocal.APPROVALS_STATUS;
  processcodes: any[] = projectConstantsLocal.PROCESS_CODES;
  productTypes: any[] = projectConstantsLocal.PRODUCT_TYPES;
  approvalDetails: any[] = [];
  breadCrumbItems: any[] = [
    {
      icon: 'pi pi-home',
      label: ' Dashboard',
      routerLink: '/user/dashboard',
      queryParams: { v: this.version },
    },
    {
      label: 'Sanctions',
      routerLink: '/user/approvals',
      queryParams: { v: this.version },
    },
    { label: 'Sanction Details' },
  ];
  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private leadsService: LeadsService,
    private toastService: ToastService,
    private dateTimeProcessor: DateTimeProcessorService,
    private router: Router
  ) {
    this.moment = this.dateTimeProcessor.getMoment();
  }

  ngOnInit(): void {
    this.leadId = this.route.snapshot.paramMap.get('id');
    if (this.leadId) {
      this.getLeadById(this.leadId);
      this.getApprovalsDetailsById(this.leadId);
    }
  }

  changeLeadStatus(leadId, statusId) {
    this.loading = true;
    this.leadsService.changeLeadStatus(leadId, statusId).subscribe(
      (leads) => {
        this.toastService.showSuccess('Lead Status Changed Successfully');
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  saveFormData(): void {
    const formData = this.approvalDetails.map((detail) => ({
      id: detail.id,
      program: detail.program,
      bankName: detail.bankName,
      lan: detail.lan,
      sanctionedAmount: detail.sanctionedAmount,
      disbursedAmount: detail.disbursedAmount,
      roi: detail.roi,
      tenure: detail.tenure,
      processCode: detail.processCode,
      productType: detail.productType,
      productTypeName: this.getProductTypeName(detail.productType),
      // approvalDate: detail.approvalDate
      //   ? this.moment(detail.approvalDate).format('MM/DD/YYYY')
      //   : null,
      // disbursalDate: detail.disbursalDate
      //   ? this.moment(detail.disbursalDate).format('MM/DD/YYYY')
      //   : null,
      approvalDate: detail.approvalDate
        ? this.moment(detail.approvalDate).format('YYYY-MM-DD')
        : null,
      disbursalDate: detail.disbursalDate
        ? this.moment(detail.disbursalDate).format('YYYY-MM-DD')
        : null,
      approvedStatus: detail.approvedStatus,
      approvedRemarks: detail.approvedRemarks,
    }));
    this.loading = true;
    this.leadsService.updateApprovalsDetails(this.leadId, formData).subscribe(
      (response: any) => {
        this.loading = false;
        this.toastService.showSuccess('Sanctions Info Saved Successfully');
        const targetUrl = `user/approvals`;
        this.router.navigateByUrl(targetUrl);
      },
      (error) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  getProductTypeName(statusId) {
    if (this.productTypes && this.productTypes.length > 0) {
      let productTypeName = this.productTypes.filter(
        (productType) => productType.id == statusId
      );
      return (
        (productTypeName &&
          productTypeName[0] &&
          productTypeName[0].displayName) ||
        ''
      );
    }
    return '';
  }
  getMinDisbursalDate(approvalDate: string | Date): Date {
    return approvalDate ? this.moment(approvalDate).toDate() : new Date();
  }

  onApprovalDateChange(index: number): void {
    const detail = this.approvalDetails[index];
    if (detail && detail.approvalDate) {
      detail.minDisbursalDate = this.getMinDisbursalDate(detail.approvalDate);
    }
  }

  getApprovalsDetailsById(leadId) {
    this.loading = true;
    this.leadsService.getApprovalsDetailsById(leadId).subscribe(
      (lead: any) => {
        this.approvalDetails = lead;
        console.log('FIPDETAILS:', this.approvalDetails);
        this.loading = false;
        this.approvalDetails.forEach((detail, index) => {
          this.onApprovalDateChange(index);
        });
      },
      (error: any) => {
        this.loading = false;
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
  goBack(): void {
    this.location.back();
  }
}
