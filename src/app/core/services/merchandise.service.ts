import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { User } from '../models/user.model';
import { API_CONSTANTS } from '../constants/api.constants';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MerchandiseService {

  public url = environment.url;
  constructor(private http: HttpClient) { }

  getProductDetails(productId: number, productVariantId: number, branchId: number, IsPurchased: number = 0, IsBillOfLading: number = 0, PageSize: number = 1000, PageIndex: number = 1): Observable<any> {
    let url = `${this.url}/api/inventory-stock-detail-product-imei/get-paging?ProductId=${productId}&IsPurchased=${IsPurchased}&IsBillOfLading=${IsBillOfLading}&PageSize=${PageSize}&PageIndex=${PageIndex}`;

    if (productVariantId !== null && productVariantId !== undefined) {
      url += `&ProductVariantId=${productVariantId}`;
    }

    if (branchId !== null && branchId !== undefined) {
      url += `&BranchId=${branchId}`;
    }

    return this.http.get<any>(url);
  }

  getProductCode(productId: number, productVariantId: number, branchId: number, IsPurchased: number = 0, IsBillOfLading: number = 0, PageSize: number = 1000, PageIndex: number = 1, ProductCode: string = ''): Observable<any> {
    let url = `${this.url}/api/product-code/get-paging?ProductId=${productId}&IsPurchased=${IsPurchased}&IsBillOfLading=${IsBillOfLading}&PageSize=${PageSize}&PageIndex=${PageIndex}`;

    if (productVariantId !== null && productVariantId !== undefined) {
      url += `&ProductVariantId=${productVariantId}`;
    }

    if (branchId !== null && branchId !== undefined) {
      url += `&BranchId=${branchId}`;
    }

    if (ProductCode) {
      url += `&ProductCode=${ProductCode}`;
    }

    return this.http.get<any>(url);
  }

  getCheckQuantity(productId: number, productVariantId: number, branchId: number): Observable<any> {
    let url = `${this.url}/api/inventory/check-quantity?ProductId=${productId}`;

    if (productVariantId !== null && productVariantId !== undefined) {
      url += `&ProductVariantId=${productVariantId}`;
    }

    if (branchId !== null && branchId !== undefined) {
      url += `&BranchId=${branchId}`;
    }

    return this.http.get<any>(url);
  }

  createladingIn(data: any): Observable<any> {
    return this.http
      .post<any>(`${this.url}/api/bill-of-lading/create`, data)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    console.error('An error occurred:', error);
    return throwError('Something bad happened; please try again later.');
  }


  getFilters(PageSize: number, PageIndex: number, FromBranchId?: number, ToBranchId?: number, FromBranchName?: string, ToBranchName?: string, Code?: string, IAccepted?: string, CreatedAt?: string): Observable<any> {
    let params = new HttpParams()
      .set('PageSize', PageSize.toString())
      .set('PageIndex', PageIndex.toString());

    if (FromBranchId) {
      params = params.set('FromBranchId', FromBranchId.toString());
    }

    if (ToBranchId) {
      params = params.set('ToBranchId', ToBranchId.toString());
    }

    if (FromBranchName) {
      params = params.set('FromBranchName', FromBranchName);
    }

    if (ToBranchName) {
      params = params.set('ToBranchName', ToBranchName);
    }

    if (Code) {
      params = params.set('Code', Code);
    }

    if (IAccepted) {
      params = params.set('IAccepted', IAccepted);
    }

    if (CreatedAt) {
      params = params.set('CreatedAt', CreatedAt);
    }

    return this.http.get<any>(`${this.url}/api/bill-of-lading/paging`, { params: params });
  }

  getBillOfLadingById(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/api/bill-of-lading/get-by-id?Id=${id}`);
  }

  updateLading(updateLadingData: any): Observable<any> {
    const url = `${this.url}/api/bill-of-lading/confilm`;
    return this.http.put(url, updateLadingData);
  }

  rejectLading(updateLadingData: any): Observable<any> {
    const url = `${this.url}/api/bill-of-lading/reject`;
    return this.http.put(url, updateLadingData);
  }


}
