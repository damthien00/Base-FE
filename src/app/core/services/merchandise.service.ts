import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { API_CONSTANTS } from '../constants/api.constants';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MerchandiseService {

  public url = environment.url;
  constructor(private http: HttpClient) { }

  getProductDetails(productId: number, productVariantId: number, branchId: number): Observable<any> {
    let url = `${this.url}/api/inventory-stock-detail-product-imei/get-paging?ProductId=${productId}`;

    if (productVariantId !== null && productVariantId !== undefined) {
      url += `&ProductVariantId=${productVariantId}`;
    }

    if (branchId !== null && branchId !== undefined) {
      url += `&BranchId=${branchId}`;
    }

    return this.http.get<any>(url);
  }

  // getProductDetails(productId: number, productVariantId: number): Observable<any> {
  //   let params = new HttpParams()
  //     .set('productId', productId.toString())
  //     .set('productVariantId', productVariantId.toString());
  //   return this.http.get<any>(
  //     `${this.url}/api/product-imei/getbyproductandvariant`, { params: params });
  // }
}
