import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
@Injectable({
  providedIn: 'root'
})
export class BsanalyzerService {
  baseUrl = projectConstantsLocal.BASE_URL
  constructor(private http: HttpClient) { }

  searchBanks(search: string) {
    return this.http.get<any[]>('api/banks?search=' + search);
  }

  extractBankDetails(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>('api/extract-bank-details', formData);
  }
  extractSummaryDetails(accountId: string) {
    return this.http.get<any>(`${this.baseUrl}api/summary`, {
      params: {
        accountId: accountId ?? '',
      }
    });

  }

  extractOverviewDetails(accountId: string) {
    return this.http.get<any>(`${this.baseUrl}api/overview`, {
      params: {
        accountId: accountId ?? '',
      }
    });
  }
  extractTransactions(params, filters) {
    return this.http.post<any>(`${this.baseUrl}api/transactions`, filters, { params });
  }
  extractIrregularities(accountId: string) {
    return this.http.get<any>(`${this.baseUrl}api/irregularities`, {
      params: {
        accountId: accountId ?? '',
      }
    });
  }

  extractCounterparty(accountId: string) {
    return this.http.get<any>(`${this.baseUrl}api/counterparty`, {
      params: {
        accountId: accountId ?? '',
      }
    });
  }
  extractDailyBalance(accountId: string) {
    return this.http.get<any>(`${this.baseUrl}api/dailyBalance`, {
      params: {
        accountId: accountId ?? '',
      }
    });
  }
  extractCategories(accountId: string) {
    return this.http.get<any>(`${this.baseUrl}api/categories`, {
      params: {
        accountId: accountId ?? '',
      }
    });
  }
  extractBouncedChequeDetails(accountId: string) {
    return this.http.get<any>(`${this.baseUrl}api/bouncedCheque`, {
      params: {
        accountId: accountId ?? '',
      }
    });
  }
  extractCashFlowDetails(accountId: string) {
    return this.http.get<any>(`${this.baseUrl}api/cashflow`, {
      params: {
        accountId: accountId ?? '',
      }
    });
  }

  extractBusinessCashFlowDetails(accountId: string) {
    return this.http.get<any>(`${this.baseUrl}api/businessCashFlow`, {
      params: {
        accountId: accountId ?? '',
      }
    });
  }
  extractDuplicateTransactions(accountId: string) {
    return this.http.get<any>(`${this.baseUrl}api/duplicateTxns`, {
      params: {
        accountId: accountId ?? '',
      }
    });
  }
}
