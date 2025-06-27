import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-business-loan-calculator',
  templateUrl: './business-loan-calculator.component.html',
  styleUrls: ['./business-loan-calculator.component.scss']
})
export class BusinessLoanCalculatorComponent implements OnInit {
  loanAmount: number = 500000;
  interestRate: number = 10;
  tenure: number = 2;

  emi: number = 0;
  totalInterest: number = 0;
  totalPayable: number = 0;

  repaymentSchedule: any[] = [];
  groupedSchedule: { [key: string]: any[] } = {};
  groupedYears: { year: string }[] = [];
  expandedRows: { [key: string]: boolean } = {};

  piechartOptions: any;

  constructor() {}

  ngOnInit(): void {
    this.calculateEMI();
  }

  calculateEMI(): void {
    const totalInterest = (this.loanAmount * this.interestRate * this.tenure) / 100;
    const totalPayable = this.loanAmount + totalInterest;
    const months = this.tenure * 12;
    const emi = Math.round(totalPayable / months);

    this.emi = emi;
    this.totalInterest = Math.round(totalInterest);
    this.totalPayable = Math.round(totalPayable);

    this.repaymentSchedule = [];
    this.groupedSchedule = {};
    this.groupedYears = [];

    let balance = totalPayable;
    const startDate = new Date();

    for (let i = 0; i < months; i++) {
      const monthDate = new Date(startDate);
      monthDate.setMonth(startDate.getMonth() + i);

      const monthName = monthDate.toLocaleString('default', { month: 'long' });
      const year = monthDate.getFullYear().toString();

      const principalPart = Math.round(this.loanAmount / months);
      const interestPart = Math.round(totalInterest / months);
      balance -= emi;

      const row = {
        month: `${monthName}-${year}`,
        emi,
        principal: principalPart,
        interest: interestPart,
        balance: balance > 0 ? Math.round(balance) : 0
      };

      if (!this.groupedSchedule[year]) {
        this.groupedSchedule[year] = [];
      }
      this.groupedSchedule[year].push(row);
    }

    this.groupedYears = Object.keys(this.groupedSchedule).map(year => ({ year }));

    this.updateChart();
  }

  toggleRow(year: string): void {
    this.expandedRows[year] = !this.expandedRows[year];
  }

  getYearlyTotal(year: string, field: 'emi' | 'principal' | 'interest'): number {
    return this.groupedSchedule[year].reduce((sum, row) => sum + Number(row[field]), 0);
  }

  updateChart(): void {
    this.piechartOptions = {
      series: [this.loanAmount, this.totalInterest],
      chart: {
        type: 'donut',
        height: 320,
        offsetY: -20
      },
      labels: ['Principal Amount', 'Interest Amount'],
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 90,
          donut: {
            size: '75%'
          }
        }
      },
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
