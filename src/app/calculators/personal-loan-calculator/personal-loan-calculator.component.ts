import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-personal-loan-calculator',
  templateUrl: './personal-loan-calculator.component.html',
  styleUrls: ['./personal-loan-calculator.component.scss']
})
export class PersonalLoanCalculatorComponent implements OnInit {
  loanAmount: number = 500000;
  interestRate: number = 10;
  tenure: number = 2;

  emi: number = 0;
  totalInterest: number = 0;
  totalPayable: number = 0;

  repaymentSchedule: any[] = [];
  groupedSchedule: { [year: string]: any[] } = {};
  groupedYears: { year: string }[] = [];
  expandedRows: { [year: string]: boolean } = {};

  piechartOptions: any;

  constructor() {}

  ngOnInit(): void {
    this.calculateEMI();
  }

  calculateEMI(): void {
    const principal = this.loanAmount;
    const annualRate = this.interestRate;
    const months = this.tenure * 12;
    const monthlyRate = annualRate / 12 / 100;

    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    this.emi = Math.round(emi);
    this.repaymentSchedule = [];
    this.groupedSchedule = {};
    this.groupedYears = [];

    let balance = principal;
    let totalInterest = 0;

    const startDate = new Date();

    for (let i = 0; i < months; i++) {
      const interest = Math.round(balance * monthlyRate);
      const principalPart = Math.round(this.emi - interest);
      totalInterest += interest;
      balance -= principalPart;

      const monthDate = new Date(startDate);
      monthDate.setMonth(startDate.getMonth() + i);
      const monthName = monthDate.toLocaleString('default', { month: 'short' });
      const year = monthDate.getFullYear();

      const row = {
        month: `${monthName} ${year}`,
        emi: this.emi,
        principal: principalPart,
        interest: interest,
        balance: balance > 0 ? Math.round(balance) : 0
      };

      if (!this.groupedSchedule[year]) {
        this.groupedSchedule[year] = [];
        this.groupedYears.push({ year: String(year) });
      }
      this.groupedSchedule[year].push(row);
    }

    this.totalInterest = Math.round(totalInterest);
    this.totalPayable = Math.round(this.emi * months);

    this.updateChart();
  }

  getYearlyTotal(year: string, field: 'emi' | 'principal' | 'interest'): number {
    return this.groupedSchedule[year].reduce((acc, row) => acc + Number(row[field]), 0);
  }

  toggleRow(year: string): void {
    this.expandedRows[year] = !this.expandedRows[year];
  }

  updateChart() {
    this.piechartOptions = {
      series: [this.loanAmount, this.totalInterest],
      chart: {
        type: 'donut',
        height: 320
      },
      labels: ['Principal', 'Interest'],
      fill: {
        colors: ['#007bff', '#ffc107']
      },
      legend: {
        position: 'bottom'
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ]
    };
  }
}
