import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { BsanalyzerService } from '../bsanalyzer.service';
import { ActivatedRoute } from '@angular/router';
import { TreeNode } from 'primeng/api';
interface TabItem {
  label: string;
  id: string;
}

@Component({
  selector: 'app-analyzed-bank-report',
  templateUrl: './analyzed-bank-report.component.html',
  styleUrls: ['./analyzed-bank-report.component.scss']
})
export class AnalyzedBankReportComponent implements OnInit {
  activeTabIndex: number = 0;
  monthwiseKeys: string[] = [];      // All row keys
  monthwiseMatrix: any[] = [];       // Array of month maps for easy lookup
  bankAccountDetails: any = {};      // Bank account key-value pairs
  reportData: any[] = [];
  monthwiseData: any[] = [];
  accountData: any = {};         // Full report from API
  loading: boolean = false;
  overviewData: any;
  dailyBalanceData: any;
  bouncedChequeData: any;
  categoriesData: any;
  irregularitiesData: any;
  cashFlowData: any;
  bizCashFlow: any;
  duplicateTxnsData: any;
  countePartyData: any;
  overviewLoading = false;
  transactionData: any[] = [];
  totalTransactions = 0;
  activeIndex: number = 0;
  transactionLoading = false;
  inflowCategories: TreeNode[] = [];
  outflowCategories: TreeNode[] = [];
  chequeTabs: { label: string; data: any }[] = [];
  sortField: string = 'transaction_date';
  sortOrder: number = 1; // -1 = DESC, 1 = ASC
  @ViewChild('tabContainer') tabContainer!: ElementRef;
  @ViewChild('overflowMenu') overflowMenu!: any;
  @ViewChild('menuButton', { read: ElementRef }) menuButton!: ElementRef;
  menuOpen: boolean = false;
  allTabs: TabItem[] = [
    { label: 'Summary', id: 'summary' },
    { label: 'Overview', id: 'overview' },
    { label: 'Transactions', id: 'transactions' },
    { label: 'Irregularities', id: 'irregularities' },
    { label: 'Monthly Counterparty', id: 'monthly-counterparty' },
    { label: 'Counterparty', id: 'counterparty' },
    { label: 'AML Analysis', id: 'aml-analysis' },
    { label: 'Recurring Payments', id: 'recurring-payments' },
    { label: 'Loans', id: 'loans' },
    { label: 'Loans Analysis', id: 'loans-analysis' },
    { label: 'Daily Balance', id: 'daily-balance' },
    { label: 'Monthly Summary', id: 'monthly-summary' },
    { label: 'Categories', id: 'categories' },
    { label: 'EMI Payments', id: 'emi-payments' },
    { label: 'Bounced Cheques', id: 'bounced-cheques' },
    { label: 'UPI TXNS Analysis', id: 'upi-txns-analysis' },
    { label: 'Cash Flow', id: 'cash-flow' },
    { label: 'Cash Flow Analysis', id: 'cash-flow-analysis' },
    { label: 'Recurring Deposits', id: 'recurring-deposits' },
    { label: 'Biz Cash Flow', id: 'biz-cash-flow' },
    { label: 'Available Balance', id: 'available-balance' },
    { label: 'Duplicate Txns', id: 'duplicate-txns' },
    { label: 'Inter Bank Transfers', id: 'inter-bank-transfers' },
    { label: 'Circular Txns', id: 'circular-txns' },
    { label: 'Salary', id: 'salary' },
    { label: 'OD/CC Utilization', id: 'od-cc-utilization' }
  ];

  visibleTabs: TabItem[] = [];
  overflowTabs: TabItem[] = [];
  activeTabId: string = 'summary';
  monthList: string[] = [];
  dailyBalanceTable: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private bankService: BsanalyzerService
  ) { }

  ngOnInit(): void { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.calculateTabs();
      this.updateActiveIndex();
      this.executeTabFunction(this.activeTabId); // load first tab
    });
  }

  @HostListener('window:resize')
  onResize() {
    this.calculateTabs();
    this.updateActiveIndex();
  }

  calculateTabs() {
    if (!this.tabContainer?.nativeElement) return;

    const containerWidth = this.tabContainer.nativeElement.offsetWidth;
    const tabMinWidth = 140;
    let totalWidth = 0;

    this.visibleTabs = [];
    this.overflowTabs = [];

    for (const tab of this.allTabs) {
      totalWidth += tabMinWidth;
      if (totalWidth + 120 < containerWidth) {
        this.visibleTabs.push(tab);
      } else {
        this.overflowTabs.push(tab);
        console.log(this.overflowTabs)
      }
    }
  }
  toggleOverflowMenu() {
    if (this.overflowMenu && this.menuButton) {
      this.overflowMenu.toggle(this.menuButton.nativeElement);
    }
  }

  updateActiveIndex() {
    this.activeTabIndex = this.allTabs.findIndex(t => t.id === this.activeTabId);
    if (this.activeTabIndex < 0) {
      this.activeTabIndex = 0;
      this.activeTabId = this.allTabs[0]?.id ?? '';
    }
  }

  onTabChange(event: { index: number }) {
    const tabId = this.allTabs[event.index]?.id;
    if (!tabId) return;
    this.activeTabId = tabId;
    this.updateActiveIndex();
    this.executeTabFunction(tabId);
  }


  get overflowMenuItems() {
    return this.overflowTabs.map(tab => ({
      label: tab.label,
      command: () => {
        console.log('Clicked overflow tab:', tab);   // log full tab object
        console.log('Tab ID:', tab.id);              // log only id

        this.activeTabId = tab.id;
        this.updateActiveIndex();
        this.executeTabFunction(tab.id);
      }
    }));
  }


  executeTabFunction(tabId: string) {
    switch (tabId) {
      case 'summary':
        this.loadSummary();
        break;
      case 'overview':
        this.loadOverviewData();
        break;
      case 'transactions':
        this.loadTransactionsData(event);
        break;
      case 'irregularities':
        this.loadIrregularities();
        break;
      // case 'monthly-counterparty':
      //   this.loadMonthlyCounterparty();
      //   break;
      case 'counterparty':
        this.loadCounterparty();
        break;
      // case 'aml-analysis':
      //   this.loadAmlAnalysis();
      //   break;
      // case 'recurring-payments':
      //   this.loadRecurringPayments();
      //   break;
      // case 'loans':
      //   this.loadLoans();
      //   break;
      // case 'loans-analysis':
      //   this.loadLoansAnalysis();
      //   break;
      case 'daily-balance':
        this.loadDailyBalance();
        break;
      // case 'monthly-summary':
      //   this.loadMonthlySummary();
      //   break;
      case 'categories':
        this.loadCategories();
        break;
      // case 'emi-payments':
      //   this.loadEmiPayments();
      //   break;
      case 'bounced-cheques':
        this.loadBouncedCheques();
        break;
      // case 'upi-txns-analysis':
      //   this.loadUpiTxnsAnalysis();
      //   break;
      case 'cash-flow':
        this.loadCashFlow();
        break;
      // case 'cash-flow-analysis':
      //   this.loadCashFlowAnalysis();
      //   break;
      // case 'recurring-deposits':
      //   this.loadRecurringDeposits();
      //   break;
      case 'biz-cash-flow':
        this.loadBizCashFlow();
        break;
      // case 'available-balance':
      //   this.loadAvailableBalance();
      //   break;
      case 'duplicate-txns':
        this.loadDuplicateTxns();
        break;
        // case 'inter-bank-transfers':
        //   this.loadInterBankTransfers();
        //   break;
        // case 'circular-txns':
        //   this.loadCircularTxns();
        //   break;
        // case 'salary':
        //   this.loadSalary();
        //   break;
        // case 'od-cc-utilization':
        //   this.loadOdCcUtilization();
        break;
      default:
        console.warn(`No function mapped for tabId: ${tabId}`);
    }
  }

  toggleMenu(event: Event, menu: any) {
    menu.toggle(event);
    this.menuOpen = !this.menuOpen;
  }
  loadSummary() {
    this.loading = true;
    this.bankService.extractSummaryDetails("1").subscribe({
      next: (data: any[]) => {
        this.reportData = data;
        const bankAccountsSection = this.reportData.filter(
          sec => sec.sectionName === 'Bank Accounts'
        );
        if (bankAccountsSection) {
          console.log(bankAccountsSection)
          this.accountData = bankAccountsSection.find(
            (v: any) => v.setId === 2
          );
          if (this.accountData?.sectionValues) {
            console.log()
            this.bankAccountDetails = this.accountData.sectionValues.reduce(
              (acc: any, item: any) => {
                acc[item.key] = item.value || '-';
                return acc;
              },
              {}
            );
          }
        }
        this.monthwiseData = this.reportData.filter(
          sec => sec.sectionName === 'Monthwise details'
        );
        if (this.monthwiseData?.length) {
          const uniqueKeys = new Set<string>();
          this.monthwiseData.forEach(month => {
            month.sectionValues?.forEach((item: any) => uniqueKeys.add(item.key));
          });
          this.monthwiseKeys = Array.from(uniqueKeys);
          this.monthwiseMatrix = this.monthwiseData.map(month => {
            const map: any = {};
            month.sectionValues?.forEach((item: any) => {
              map[item.key] = item.value || '-';
            });
            return map;
          });
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }


  loadOverviewData() {
    this.overviewLoading = true;
    this.bankService.extractOverviewDetails("1") // replace with your API call
      .subscribe({
        next: (res) => {
          this.overviewData = res;
          this.overviewLoading = false;
        },
        error: () => {
          this.overviewData = null;
          this.overviewLoading = false;
        }
      });
  }

  loadTransactionsData(event) {
    this.transactionLoading = true;

    const page = event.first / event.rows + 1;
    const rows = event.rows;
    const sortBy = event.sortField || 'transaction_date';
    const order = event.sortOrder === 1 ? 'asc' : 'desc';
    const accountId = "1";
    const accountReferenceNumber = '1';

    // Extract filters from PrimeNG table
    const tableFilters = {};
    if (event.filters) {
      Object.keys(event.filters).forEach(field => {
        const filterMeta = event.filters[field];
        if (filterMeta && filterMeta.value) {
          tableFilters[field] = [
            {
              [field]: filterMeta.value,
              operation: filterMeta.matchMode || '='
            }
          ];
        }
      });
    }

    const params = {
      page,
      rows,
      sortBy,
      order,
      accountId,
      // accountReferenceNumber
    };

    this.bankService.extractTransactions(params, tableFilters)
      .subscribe({
        next: (res) => {
          this.transactionData = res.transactions || res; // adjust depending on API shape
          this.totalTransactions = res.pagination.totalElements || 0;
          this.transactionLoading = false;
        },
        error: () => {
          this.transactionData = [];
          this.transactionLoading = false;
        }
      });
  }



  loadIrregularities() {
    this.overviewLoading = true;
    this.bankService.extractIrregularities("1") // replace with your API call
      .subscribe({
        next: (res) => {
          this.irregularitiesData = res;
          this.overviewLoading = false;
        },
        error: () => {
          this.irregularitiesData = null;
          this.overviewLoading = false;
        }
      });
  }

  loadCounterparty() {
    this.overviewLoading = true;
    this.bankService.extractCounterparty("1") // replace with your API call
      .subscribe({
        next: (res) => {
          this.countePartyData = res;
          this.overviewLoading = false;
        },
        error: () => {
          this.countePartyData = null;
          this.overviewLoading = false;
        }
      });
  }

  loadDailyBalance() {
    console.log("daily balance")
    this.overviewLoading = true;
    this.bankService.extractDailyBalance("1") // replace with your API call
      .subscribe({
        next: (res) => {
          this.dailyBalanceData = res;
          this.transformDailyBalance()
          this.overviewLoading = false;
        },
        error: () => {
          this.dailyBalanceData = null;
          this.overviewLoading = false;
        }
      });
  }

  transformDailyBalance() {
    if (!this.dailyBalanceData || !this.dailyBalanceData.day) return;
    // Extract month headers
    this.monthList = this.dailyBalanceData.month;
    // Put "Average" at the beginning of monthList
    if (!this.monthList.includes('Average')) {
      this.monthList = ['Average', ...this.monthList];
    }
    console.log(this.monthList)
    // Transform day object into table rows
    this.dailyBalanceTable = Object.keys(this.dailyBalanceData.day).map(dayKey => {
      const row: any = { day: dayKey };
      this.dailyBalanceData.day[dayKey].forEach((entry: any) => {
        row[entry.month] = parseFloat(entry.amount);
      });
      return row;
    });
  }

  loadCategories() {
    this.overviewLoading = true;
    this.bankService.extractCategories("1") // replace with your API call
      .subscribe({
        next: (res) => {
          this.categoriesData = res; // whole object
          this.inflowCategories = (this.categoriesData.inflows || [])
            .map((cat: any) => this.mapToTreeNode(cat));
          this.outflowCategories = (this.categoriesData.outflows || [])
            .map((cat: any) => this.mapToTreeNode(cat));
          console.log(this.inflowCategories);
          this.overviewLoading = false;
        },
        error: () => {
          this.categoriesData = null;
          this.overviewLoading = false;
        }
      });
  }
  mapToTreeNode(category: any): TreeNode {
    return {
      data: {
        category: category.category,
        startDate: category.startDate,
        endDate: category.endDate,
        amount: category.amount,
        exposure: category.exposure,
        avgAmount: category.avgAmount,
        transactionCount: category.transactionCount
      },
      children: category.subCategories?.map((sub: any) => this.mapToTreeNode(sub)) || []
    };
  }

  loadBouncedCheques() {
    this.overviewLoading = true;
    this.bankService.extractBouncedChequeDetails("1") // replace with your API call
      .subscribe({
        next: (res) => {
          this.bouncedChequeData = res;
          this.chequeTabs = [
            { label: 'Outward Cheques', data: this.bouncedChequeData.outwardChequeTransactions },
            { label: 'Inward Cheques', data: this.bouncedChequeData.inwardChequeTransactions },
            { label: 'Same-Day Cheques', data: this.bouncedChequeData.sameDayChequeTransactions }
          ];

          this.overviewLoading = false;
        },
        error: () => {
          this.bouncedChequeData = null;
          this.overviewLoading = false;
        }
      });
  }

  loadCashFlow() {
    this.overviewLoading = true;
    this.bankService.extractCashFlowDetails("1") // replace with your API call
      .subscribe({
        next: (res) => {
          this.cashFlowData = res;
          // this.transformDailyBalance()
          this.overviewLoading = false;
        },
        error: () => {
          this.cashFlowData = null;
          this.overviewLoading = false;
        }
      });
  }

  loadBizCashFlow() {
    this.overviewLoading = true;
    this.bankService.extractBusinessCashFlowDetails("1") // replace with your API call
      .subscribe({
        next: (res) => {
          this.bizCashFlow = res;
          // this.transformDailyBalance()
          this.overviewLoading = false;
        },
        error: () => {
          this.bizCashFlow = null;
          this.overviewLoading = false;
        }
      });
  }

  loadDuplicateTxns() {
    this.overviewLoading = true;
    this.bankService.extractDuplicateTransactions("1") // replace with your API call
      .subscribe({
        next: (res) => {
          this.duplicateTxnsData = res;
          // this.transformDailyBalance()
          this.overviewLoading = false;
        },
        error: () => {
          this.duplicateTxnsData = null;
          this.overviewLoading = false;
        }
      });
  }
}
