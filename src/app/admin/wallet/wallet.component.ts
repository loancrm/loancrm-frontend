import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeadsService } from '../leads/leads.service';
import { projectConstantsLocal } from '../../constants/project-constants';
import { ToastService } from 'src/app/services/toast.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Router } from '@angular/router';

declare var Razorpay: any;

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent {
  accountId: any;
  balance = 0;
  user: any;

  // GST is default 18%, but will only apply for DEBIT
  gstPercentage = 18;
  gstAmount = 0;
  totalPayable = 0;

  transactions: any[] = [];
  walletForm: FormGroup;

  walletDonutOptions: any;
  walletDonutSeries: number[] = [];

  isLoading = false;

  constructor(
    private leadsService: LeadsService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private fb: FormBuilder,
    private toastService: ToastService
  ) {
    this.walletForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]],
      description: [''],
      currency: ['INR', Validators.required]
    });

    this.walletForm.get('amount')?.valueChanges.subscribe((val) => {
      this.calculateTotals(val);
    });
  }

  ngOnInit() {
    const userDetails = this.localStorageService.getItemFromLocalStorage('userDetails');
    if (userDetails?.user?.accountId) {
      this.accountId = userDetails.user.accountId;
      this.user = userDetails.user;
    } else {
      this.toastService.showError('User not found. Please login again.');
      this.router.navigate(['/user/login']);
      return;
    }
    this.loadBalanceAndTransactions();
  }

  /**
   * For CREDIT transactions → no GST, total = amount
   * For DEBIT transactions (future use) → GST applies
   */
  calculateTotals(amount: number): void {
    if (!amount || amount <= 0) {
      this.gstAmount = 0;
      this.totalPayable = 0;
      return;
    }

    // For CREDIT (Add Funds) → ignore GST
    this.gstAmount = 0;
    this.totalPayable = amount;
  }

  updateWalletChart(): void {
    const totalCredits = this.transactions
      .filter(tx => tx.transactionType === 'CREDIT' && tx.paymentStatus === 'SUCCESS')
      .reduce((sum, tx) => sum + Number(tx.amount), 0);

    const totalDebits = this.transactions
      .filter(tx => tx.transactionType === 'DEBIT' && tx.paymentStatus === 'SUCCESS')
      .reduce((sum, tx) => sum + Number(tx.amount), 0);

    console.log("Credits:", totalCredits);
    console.log("Debits:", totalDebits);

    if (totalCredits === 0 && totalDebits === 0) {
      this.walletDonutOptions = {
        series: [1],
        chart: { type: 'donut', height: 320 },
        labels: ['No data available'],
        colors: ['#E0E0E0'],
        legend: { show: false },
        dataLabels: { enabled: true, formatter: () => 'No data' }
      };
    } else {
      this.walletDonutSeries = [totalCredits, totalDebits];
      this.walletDonutOptions = {
        series: this.walletDonutSeries,
        chart: { type: 'donut', height: 320 },
        labels: ['Total Credits', 'Total Debits'],
        colors: ['#535AB4', '#8E89D0'],
        legend: { position: 'bottom' },
        dataLabels: {
          enabled: true,
          formatter: (_val: number, opts: any) => {
            const value = opts.w.config.series[opts.seriesIndex];
            return '₹' + value.toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            });
          }
        }
      };
    }
  }

  loadBalanceAndTransactions() {
    this.isLoading = true;

    Promise.all([
      this.leadsService.getBalance(this.accountId).toPromise(),
      this.leadsService.getTransactions(this.accountId).toPromise()
    ])
      .then(([balanceRes, transactionsRes]: any) => {
        this.balance = balanceRes?.balance || 0;
        this.transactions = transactionsRes || [];
        this.updateWalletChart();
        this.isLoading = false;
      })
      .catch(() => {
        this.toastService.showError('Failed to load wallet data');
        this.isLoading = false;
      });
  }

  scrollToForm() {
    document.querySelector('#walletFormSection')?.scrollIntoView({ behavior: 'smooth' });
  }

  payWithRazorpay(): void {
    if (this.walletForm.invalid || !this.accountId) {
      this.toastService.showError('Please enter a valid amount.');
      return;
    }

    this.isLoading = true;

    const { amount, description, currency } = this.walletForm.value;

    // CREDIT → gst = 0, netAmount = amount
    this.leadsService.createOrder({
      accountId: this.accountId,
      amount,
      gst_percentage: 0,
      gstAmount: 0,
      netAmount: amount,
      description: 'Wallet Top-up',
      currency,
      transactionType: 'CREDIT'
    }).subscribe({
      next: (order: any) => {
        const options = {
          key: projectConstantsLocal.RAZORPAY_KEY_ID,
          amount: amount * 100, // only entered amount
          currency: order.currency,
          name: 'MYLOANCRM',
          order_id: order.id,
          handler: (response: any) => this.verifyPayment(response),
          prefill: {
            name: this.user?.name || '',
            email: this.user?.email || '',
            contact: this.user?.phone || ''
          },
          theme: { color: '#528FF0' }
        };

        this.isLoading = false;
        const rzp = new Razorpay(options);
        rzp.open();
      },
      error: () => {
        this.toastService.showError('Unable to create Razorpay order');
        this.isLoading = false;
      }
    });
  }

  verifyPayment(response: any) {
    this.isLoading = true;
    this.leadsService.verifyPayment({
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
      accountId: this.accountId
    }).subscribe({
      next: (res: any) => {
        this.toastService.showSuccess(res.message || 'Payment successful!');
        this.walletForm.reset();
        this.loadBalanceAndTransactions();
        this.isLoading = false;
      },
      error: () => {
        this.toastService.showError('Payment verification failed');
        this.isLoading = false;
      }
    });
  }
}
