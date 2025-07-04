import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeadsService } from '../admin/leads/leads.service';
import { LocalStorageService } from '../services/local-storage.service';
import { ToastService } from '../services/toast.service';
import { DateTimeProcessorService } from '../services/date-time-processor.service';
import { projectConstantsLocal } from '../constants/project-constants';

declare var Razorpay: any;

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {
  accountId: number = 0;
  moment: any;
  user: any;

  plans = [
    {
      plan_name: 'Free Trial',
      plan_type: 'Free',
      price: 0,
      durationDays: 30,
      iconClass: 'fas fa-bolt',
      colorClass: 'bg-success',
      features: [
        'Up to 100 Leads',
        'Basic Lead Management',
        'Single User Access'
      ]
    },
    {
      plan_name: 'Basic',
      plan_type: 'Basic',
      price: 999,
      durationDays: 30,
      iconClass: 'fas fa-layer-group',
      colorClass: 'bg-primary',
      features: [
        'Up to 1000 Leads',
        'Customer KYC Upload',
        'Single User Access',
        'Basic Reporting',
        'Email Notifications'
      ]
    },
    {
      plan_name: 'Professional',
      plan_type: 'Premium',
      price: 1999,
      durationDays: 365,
      iconClass: 'fas fa-star',
      colorClass: 'bg-warning text-dark',
      features: [
        'Up to 5000 Leads',
        'Multi-User Support (5 Users)',
        'Workflow Automation',
        'Document Collection & Tracking',
        'Loan Application Tracking',
        'Integration with Email & SMS'
      ]
    }
  ];

  constructor(
    private router: Router,
    private subscriptionService: LeadsService,
    private localStorageService: LocalStorageService,
    private toastService: ToastService,
    private dateTimeProcessor: DateTimeProcessorService
  ) {
    this.moment = this.dateTimeProcessor.getMoment();
  }

  ngOnInit(): void {
    const userDetails = this.localStorageService.getItemFromLocalStorage('userDetails');
    if (userDetails?.user?.accountId) {
      this.accountId = userDetails.user.accountId;
      this.user = userDetails.user;
    } else {
      this.toastService.showError('User not found. Please login again.');
      this.router.navigate(['/auth/login']);
    }
  }

  // Entry point for subscription
  subscribeToPlan(plan: any): void {
    if (plan.plan_type === 'Free') {
      this.createSubscription(plan);
    } else {
      this.subscriptionService.createRazorpayOrder(plan.price).subscribe({
        next: (order: any) => this.launchRazorpay(order, plan),
        error: () => this.toastService.showError('Failed to initiate payment.')
      });
    }
  }

  // Launch Razorpay payment
  launchRazorpay(order: any, plan: any) {
    const options = {
      key: projectConstantsLocal.RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: 'INR',
      name: 'LOANCRM',
      description: plan.plan_name,
      order_id: order.id,
      handler: (response: any) => this.verifyPayment(response, plan),
      prefill: {
        name: this.user.name,
        email: this.user.email,
        contact: this.user.phone
      },
      theme: { color: '#3399cc' }
    };

    try {
      const razorpay = new Razorpay(options);
      razorpay.open();
    } catch (e) {
      this.toastService.showError('Razorpay failed to load. Please try again.');
    }
  }

  // Verify Razorpay and store subscription
  verifyPayment(paymentResponse: any, plan: any) {
    const subscriptionData = {
      accountId: this.accountId,
      plan_name: plan.plan_name,
      plan_type: plan.plan_type,
      price: plan.price,
      durationDays: plan.durationDays,
      auto_renew: 1,
      razorpay_payment_id: paymentResponse.razorpay_payment_id,
      razorpay_order_id: paymentResponse.razorpay_order_id,
      razorpay_signature: paymentResponse.razorpay_signature
    };

    this.subscriptionService.verifyAndStoreSubscription(subscriptionData).subscribe({
      next: () => {
        this.toastService.showSuccess(`${plan.plan_name} activated!`);
        this.router.navigate(['/user/dashboard']);
      },
      error: (err) => {
        this.toastService.showError(err);
      }
    });
  }

  // Handle free plan
  createSubscription(plan: any): void {
    const subscriptionData = {
      accountId: this.accountId,
      plan_name: plan.plan_name,
      plan_type: plan.plan_type,
      price: plan.price,
      durationDays: plan.durationDays,
      auto_renew: 1
    };

    this.subscriptionService.createSubscription(subscriptionData).subscribe({
      next: () => {
        this.toastService.showSuccess('Free Trial Activated!');
        this.router.navigate(['/user/dashboard']);
      },
      error: (err) => {
        this.toastService.showError(
          err
        );
      }
    });
  }
}
