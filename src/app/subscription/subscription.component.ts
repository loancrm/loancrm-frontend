import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeadsService } from '../admin/leads/leads.service';
import { LocalStorageService } from '../services/local-storage.service';
import { ToastService } from '../services/toast.service';
import { DateTimeProcessorService } from '../services/date-time-processor.service';

declare var Razorpay: any; // ✅ Proper global declaration

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss'] // ✅ Fixed typo: styleUrls instead of styleUrl
})
export class SubscriptionComponent implements OnInit {
  accountId: number = 0;
  moment: any;

  plans = [
    {
      plan_name: 'Free Trial',
      plan_type: 'Free',
      price: 0,
      durationDays: 7,
      features: [
        'Up to 100 Leads',
        'Basic Lead Management',
        'Single User Access'
      ]
    },
    {
      plan_name: 'Basic',
      plan_type: 'Paid',
      price: 999,
      durationDays: 30,
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
      plan_type: 'Paid',
      price: 1999,
      durationDays: 30,
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
    private dateTimeProcessor: DateTimeProcessorService,
  ) {
    this.moment = this.dateTimeProcessor.getMoment();
  }

  ngOnInit(): void {
    const userDetails = this.localStorageService.getItemFromLocalStorage('userDetails');
    if (userDetails?.user?.accountId) {
      this.accountId = userDetails.user.accountId;
    } else {
      this.toastService.showError('User not found. Please login again.');
      this.router.navigate(['/auth/login']);
    }
  }

  subscribeToPlan(plan: any): void {
    if (plan.plan_type === 'Free') {
      this.createSubscription(plan); // Free plan
    } else {
      this.processPayment(plan); // Paid plan
    }
  }

  processPayment(plan: any): void {
    const options: any = {
      key: 'YOUR_RAZORPAY_KEY', // ✅ Replace with actual Razorpay key
      amount: plan.price * 100, // Razorpay uses paise
      currency: 'INR',
      name: 'Your Company Name',
      description: `Subscribe to ${plan.plan_name}`,
      handler: (response: any) => {
        // You can verify payment here if needed
        this.createSubscription(plan);
      },
      prefill: {
        name: 'User Name', // Optional: Replace with actual user name
        email: 'user@example.com', // Optional: Replace with actual user email
        contact: '9999999999' // Optional: Replace with actual contact
      },
      theme: {
        color: '#3399cc'
      }
    };

    const razorpay = new Razorpay(options);
    razorpay.open();
  }

  createSubscription(plan: any): void {
    const today = this.moment().format('YYYY-MM-DD');
    const endDate = this.moment().add(plan.durationDays, 'days').format('YYYY-MM-DD');

    const subscriptionData = {
      accountId: this.accountId,
      plan_name: plan.plan_name,
      plan_type: plan.plan_type,
      price: plan.price,
      start_date: today,
      end_date: endDate,
      auto_renew: false
    };

    this.subscriptionService.createSubscription(subscriptionData).subscribe({
      next: () => {
        this.toastService.showSuccess('Subscription activated successfully!');
        this.router.navigate(['/user/dashboard']);
      },
      error: (error) => {
        this.toastService.showError(error);
      }
    });
  }
}
