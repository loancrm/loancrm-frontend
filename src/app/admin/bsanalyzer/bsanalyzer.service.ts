import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { map, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BsanalyzerService {
  baseUrl = projectConstantsLocal.BASE_URL
  constructor(private http: HttpClient) { }

  searchBanks(search: string) {
    return this.http.get<any[]>('api/banks?search=' + search);
  }

  // extractBankDetails(file: File) {
  //   const formData = new FormData();
  //   formData.append('file', file);

  //   return this.http.post<any>('api/extract-bank-details', formData);
  // }
  extractSummaryDetails(params) {
    return this.http.get<any>(`${this.baseUrl}api/summary`, {
      params
    });
  }

  extractOverviewDetails(params) {

    return this.http.get<any>(`${this.baseUrl}api/overview`, {
      params
    });
  }
  extractTransactions(params, filters) {
    return this.http.post<any>(`${this.baseUrl}api/transactions`, filters, { params });
  }
  extractIrregularities(params) {
    return this.http.get<any>(`${this.baseUrl}api/irregularities`, {
      params
    });
  }

  extractCounterparty(params) {
    return this.http.get<any>(`${this.baseUrl}api/counterparty`, {
      params
    });
  }
  extractDailyBalance(params) {
    return this.http.get<any>(`${this.baseUrl}api/dailyBalance`, {
      params
    });
  }
  extractCategories(params) {
    return this.http.get<any>(`${this.baseUrl}api/categories`, {
      params
    });
  }
  extractBouncedChequeDetails(params) {
    return this.http.get<any>(`${this.baseUrl}api/bouncedCheque`, {
      params
    });
  }
  extractCashFlowDetails(params) {
    return this.http.get<any>(`${this.baseUrl}api/cashflow`, {
      params
    });
  }

  extractBusinessCashFlowDetails(params) {
    return this.http.get<any>(`${this.baseUrl}api/businessCashFlow`, {
      params
    });
  }
  extractDuplicateTransactions(params) {
    return this.http.get<any>(`${this.baseUrl}api/duplicateTxns`, {
      params
    });
  }

  extractPatternDetails(params) {
    return this.http.get<any>(`${this.baseUrl}api/patterns`, {
      params
    });
  }
  extractOdCCUtilization(params) {
    return this.http.get<any>(`${this.baseUrl}api/utilization`, {
      params
    });
  }
  extractAvailableBalance(params) {
    return this.http.get<any>(`${this.baseUrl}api/closingBalance`, {
      params
    });
  }
  extractTransactionSummary(params) {
    return this.http.get<any>(`${this.baseUrl}api/transactionSummary`, {
      params
    });
  }

  extractAMLAnalysis(params) {
    return this.http.get<any>(`${this.baseUrl}api/amlAnalysis`, {
      params
    });
  }
  extractUPIAnalysis(params) {
    return this.http.get<any>(`${this.baseUrl}api/UPIAnalysis`, {
      params
    });
  }
  extractCashFlowAnalysis(params) {
    return this.http.get<any>(`${this.baseUrl}api/cashflowAnalysis`, {
      params
    });
  }
  // downloadCamFile(accountId?: string) {
  //   return this.http.get(`${this.baseUrl}api/camdownload`, {
  //     params: {
  //       accountId: accountId ?? '',
  //     },
  //     responseType: 'arraybuffer' // 👈 important for file download
  //   });
  // }
  downloadCamFile(params): Observable<Blob> {
    return this.http.get(`${this.baseUrl}api/camdownload`, {
      params,
      responseType: 'blob'  // MUST be 'blob'
    });
  }
  extractBankDetails(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(`${this.baseUrl}api/extract-bank-details`, formData);
  }

  /**
   * Searches banks by query string
   */
  fetchBanks(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}api/extract-bank`, {
      params: { q: query }
    });
  }

  /**
   * Creates a report with JSON + attached files
   */
  createReport(report: any, files: File[]): Observable<any> {
    const formData = new FormData();

    // JSON → plain string field
    formData.append('report', JSON.stringify(report));

    // Files
    files.forEach(f => {
      formData.append('file', f, f.name);
    });

    return this.http.post<any>(`${this.baseUrl}api/create-report`, formData, {
      reportProgress: true,
      observe: 'body'
    });
  }
  updateReport(report: any, files: File[]): Observable<any> {
    const formData = new FormData();

    // JSON → plain string field
    formData.append('report', JSON.stringify(report));

    // Files
    files.forEach(f => {
      formData.append('file', f, f.name);
    });

    // Use PUT or PATCH depending on backend API
    return this.http.post<any>(`${this.baseUrl}api/update-report`, formData, {
      reportProgress: true,
      observe: 'body'
    });
  }
  fetchReport(params): Observable<any> {



    return this.http.get<any>(`${this.baseUrl}api/fetch-report`, { params });
  }
}
