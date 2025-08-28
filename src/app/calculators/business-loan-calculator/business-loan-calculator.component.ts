import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-business-loan-calculator',
  templateUrl: './business-loan-calculator.component.html',
  styleUrls: ['./business-loan-calculator.component.scss']
})
export class BusinessLoanCalculatorComponent implements OnInit {

  // Flat Loan
  loanAmount: number = 500000;
  interestRate: number = 10;
  tenure: number = 2; // years
  emi: number = 0;
  totalInterest: number = 0;
  totalPayable: number = 0;
  repaymentSchedule: any[] = [];

  // Diminishing Loan
  diminishingloanAmount: number = 500000;
  diminishinginterestRate: number = 10;
  diminishingtenure: number = 2;
  diminishingemi: number = 0;
  diminishingtotalInterest: number = 0;
  diminishingtotalPayable: number = 0;
  diminishingrepaymentSchedule: any[] = [];

  // Common
  activeTab: number = 0;
  piechartOptions: any;
  diminishingpiechartOptions: any;
  businessName: string = '';

  constructor() { }

  ngOnInit(): void {
    this.calculateEMI();
    this.calculateDiminishingEMI();
  }

  /** Prevent invalid key entry */
  preventInvalidKeys(event: KeyboardEvent) {
    const invalidKeys = ['e', 'E', '+', '-', ' '];
    if (invalidKeys.includes(event.key)) event.preventDefault();
  }

  preventInvalidPaste(event: ClipboardEvent) {
    const paste = event.clipboardData?.getData('text') || '';
    if (/[^0-9.]/.test(paste)) event.preventDefault();
  }

  /** Input limiters */
  limitInputLength(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.slice(0, 8);
    input.value = value;
    this.loanAmount = Number(value);
  }
  limitInputLengthfordiminishing(event: Event, field: 'personal' | 'business'): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.slice(0, 8);
    input.value = value;

    if (field === 'personal') {
      this.diminishingloanAmount = Number(value);
    } else if (field === 'business') {
      this.diminishingloanAmount = Number(value); // if you're also handling business loan
    }
  }
  restrictTenureKeys(event: KeyboardEvent) {
    const value = (event.target as HTMLInputElement).value;
    if (!/[0-9]/.test(event.key) && !['Backspace', 'Delete', 'Tab'].includes(event.key)) {
      event.preventDefault();
    }
    if (parseInt(value + event.key) > 4) event.preventDefault();
  }


  restrictTenureKeysdiminishing(event: KeyboardEvent) {
    const value = (event.target as HTMLInputElement).value;

    // Allow only numbers and the necessary keys (backspace, delete, etc.)
    if (!/[0-9]/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Delete' && event.key !== 'Tab') {
      event.preventDefault();
    }

    // If the value is greater than 4, prevent entering more digits
    if (parseInt(value + event.key) > 8) {
      event.preventDefault();
    }
  }

  limitInterestRate(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = parseFloat(input.value);
    if (isNaN(value)) return;

    if (value > 15.99) value = 15.99;
    if (value < 1) value = 1;

    input.value = value.toFixed(2);
    this.interestRate = value;
    this.calculateEMI();
  }

  /** Flat EMI calculation */
  calculateEMI(): void {
    const totalInterest = (this.loanAmount * this.interestRate * this.tenure) / 100;
    const totalPayable = this.loanAmount + totalInterest;
    const months = this.tenure * 12;
    const emi = Math.round(totalPayable / months);

    this.emi = emi;
    this.totalInterest = Math.round(totalInterest);
    this.totalPayable = Math.round(totalPayable);

    this.repaymentSchedule = [];
    let balance = totalPayable;

    for (let i = 1; i <= months; i++) {
      const principalPart = Math.round(this.loanAmount / months);
      const interestPart = Math.round(totalInterest / months);
      balance -= emi;

      this.repaymentSchedule.push({
        month: `Month ${i}`,
        emi,
        principal: principalPart,
        interest: interestPart,
        balance: balance > 0 ? Math.round(balance) : 0
      });
    }

    this.updateChart();
  }

  /** Diminishing EMI calculation */
  calculateDiminishingEMI(): void {
    const principal = this.diminishingloanAmount;
    const months = this.diminishingtenure * 12;
    const monthlyRate = this.diminishinginterestRate / 12 / 100;

    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    this.diminishingemi = Math.round(emi);
    this.diminishingrepaymentSchedule = [];
    this.diminishingtotalInterest = 0;

    let balance = principal;

    for (let i = 1; i <= months; i++) {
      const interestPart = Math.round(balance * monthlyRate);
      const principalPart = Math.round(this.diminishingemi - interestPart);
      balance -= principalPart;
      this.diminishingtotalInterest += interestPart;

      this.diminishingrepaymentSchedule.push({
        month: `Month ${i}`,
        emi: this.diminishingemi,
        principal: principalPart,
        interest: interestPart,
        balance: balance > 0 ? Math.round(balance) : 0
      });
    }

    this.diminishingtotalPayable = Math.round(this.diminishingemi * months);
    this.updateChart();
  }

  /** Chart update */
  updateChart(): void {
    this.piechartOptions = {
      series: [this.loanAmount, this.totalInterest],
      chart: { type: 'donut', height: 320 },
      labels: ['Principal', 'Interest'],
      colors: ['#29415B', '#EE7846'],
      legend: { position: 'bottom' }
    };

    this.diminishingpiechartOptions = {
      series: [this.diminishingloanAmount, this.diminishingtotalInterest],
      chart: { type: 'donut', height: 320 },
      labels: ['Principal', 'Interest'],
      colors: ['#000', '#EE7846'],
      legend: { position: 'bottom' }
    };
  }

  /** PDF for flat loan */
  generatePDF(): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const businessName = this.businessName;

    const addWatermark = () => {
      doc.setFont('helvetica', 'medium');
      doc.setTextColor(230, 230, 230);
      doc.setFontSize(60);
      doc.text('MyLoanCRM', pageWidth / 2, pageHeight / 2, { angle: 45, align: 'center' });
    };

    const addHeader = () => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor('#000');
      doc.text(businessName?.toUpperCase() || 'LOAN REPORT', pageWidth / 2, 15, { align: 'center' });
    };

    addHeader();
    autoTable(doc, {
      startY: 30,
      body: [
        ['Loan Amount:', `Rs. ${this.loanAmount}`, 'Monthly EMI:', `Rs. ${this.emi}`],
        ['Interest Rate (Flat):', `${this.interestRate}%`, 'Interest:', `Rs. ${this.totalInterest}`],
        ['Tenure:', `${this.tenure} years`, 'Total Payable:', `Rs. ${this.totalPayable}`],
      ],
      theme: 'grid',
    });

    doc.text('Repayment Schedule', 14, 65);
    autoTable(doc, {
      head: [['S. No.', 'Month', 'EMI', 'Principal', 'Interest', 'Balance']],
      body: this.repaymentSchedule.map((r, i) => [i + 1, r.month, r.emi, r.principal, r.interest, r.balance]),
      startY: 70,
      headStyles: { fillColor: [41, 65, 91], textColor: 255 },
      didDrawPage: () => { addWatermark(); addHeader(); }
    });

    doc.save(`${businessName?.toUpperCase() || 'LOAN'}-EMI-REPORT.pdf`);
  }
  onTabChange() {
    this.updateChart();
  }
  /** PDF for diminishing loan */
  generatediminishingPDF(): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const businessName = this.businessName;

    const addWatermark = () => {
      doc.setFont('helvetica', 'medium');
      doc.setTextColor(230, 230, 230);
      doc.setFontSize(60);
      doc.text('MyLoanCRM', pageWidth / 2, pageHeight / 2, { angle: 45, align: 'center' });
    };

    const addHeader = () => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor('#29415B');
      doc.text(businessName?.toUpperCase() || 'LOAN REPORT', pageWidth / 2, 15, { align: 'center' });
    };

    addHeader();
    autoTable(doc, {
      startY: 30,
      body: [
        ['Loan Amount:', `Rs. ${this.diminishingloanAmount}`, 'Monthly EMI:', `Rs. ${this.diminishingemi}`],
        ['Interest Rate (Diminishing):', `${this.diminishinginterestRate}%`, 'Interest:', `Rs. ${this.diminishingtotalInterest}`],
        ['Tenure:', `${this.diminishingtenure} years`, 'Total Payable:', `Rs. ${this.diminishingtotalPayable}`],
      ],
      theme: 'grid',
    });

    doc.text('Repayment Schedule', 14, 65);
    autoTable(doc, {
      head: [['S. No.', 'Month', 'EMI', 'Principal', 'Interest', 'Balance']],
      body: this.diminishingrepaymentSchedule.map((r, i) => [i + 1, r.month, r.emi, r.principal, r.interest, r.balance]),
      startY: 70,
      headStyles: { fillColor: [41, 65, 91], textColor: 255 },
      didDrawPage: () => { addWatermark(); addHeader(); }
    });

    doc.save(`${businessName?.toUpperCase() || 'LOAN'}-DIMINISHING-REPORT.pdf`);
  }
}
