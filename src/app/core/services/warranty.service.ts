import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
// import { OptionsFilterWarranty } from '../DTOs/Warranty/optionsFilterWarrantys';

@Injectable({
    providedIn: 'root',
})
export class WarrantyService {
    constructor(private http: HttpClient) {}
    public url = environment.url;

    getWarrantyById(id: number): Observable<any> {
        let url = `${this.url}/api/warranty/paging?id=${id}`;
        return this.http.get<any>(url);
    }

    getWarrantyByCustomer(id: number): Observable<any> {
        let url = `${this.url}/api/warranty/paging?customerId=${id}`;
        return this.http.get<any>(url);
    }

    createWarranty(data: any): Observable<any> {
        return this.http
            .post<any>(`${this.url}/api/warranty/create`, data)
            .pipe(catchError(this.handleError));
    }

    updatePurchased(data: any): Observable<any> {
        return this.http
            .put<any>(
                `${this.url}/api/inventory-stock-detail-product-imei/update-is-purchased`,
                data
            )
            .pipe(catchError(this.handleError));
    }

    createWarrantyClaim(data: any): Observable<any> {
        return this.http
            .post<any>(`${this.url}/api/warranty-claim/create`, data)
            .pipe(catchError(this.handleError));
    }

    // updateWarranty(data: any): Observable<any> {
    //     return this.http
    //         .put<any>(`${this.url}/api/Warranty/update`, data)
    //         .pipe(catchError(this.handleError));
    // }

    private handleError(error: HttpErrorResponse): Observable<any> {
        console.error('An error occurred:', error);
        return throwError('Something bad happened; please try again later.');
    }

    getWarrantyByPhoneNumber(phoneNumber: string): Observable<any> {
        return this.http.get(`${this.url}/api/warranty/paging?PhoneNumber=${phoneNumber}`);
      }
}
