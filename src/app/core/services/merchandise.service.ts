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

  getProductDetails(productId: number, productVariantId: number): Observable<any> {
    const url = `${this.url}/api/product-imei/getbyproductandvariant?ProductId=${productId}&ProductVariantId=${productVariantId}`;
    return this.http.get<any>(url);
  }
}
