import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OptionsFilterWarranty } from '../DTOs/warranty/optionFilterWarranty';
import { OptionsFilterWarrantyClaims } from '../DTOs/warranty/optionFilterWarranty';
@Injectable({
    providedIn: 'root',
})
export class WarrantyService {
    constructor(private http: HttpClient) {}
    public url = environment.url;

    getWarranties(options: OptionsFilterWarranty): Observable<any> {
        console.log(options);

        let url = `${this.url}/api/warranty/paging?pageSize=${options.pageSize}&pageIndex=${options.pageIndex}`;
        if (options.CustomerKeyword) {
            url += `&customerKeyword=${options.CustomerKeyword}`;
        }
        if (options.BranchId) {
            url += `&branchId=${options.BranchId}`;
        }
        if (options.Imei) {
            url += `&imei=${options.Imei}`;
        }
        if (options.ProductName) {
            url += `&productName=${options.ProductName}`;
        }
        if (options.FrameNumber) {
            url += `&frameNumber=${options.FrameNumber}`;
        }
        if (options.EngineNumber) {
            url += `&engineNumber=${options.EngineNumber}`;
        }

        return this.http.get<any>(url);
    }

    getWarrantyClaims(options: OptionsFilterWarrantyClaims): Observable<any> {
        console.log(options);

        let url = `${this.url}/api/warranty-claim/paging?pageSize=${options.pageSize}&pageIndex=${options.pageIndex}`;
        if (options.CustomerKeyword) {
            url += `&customerKeyword=${options.CustomerKeyword}`;
        }

        if (options.StartDate) {
            url += `&startDate=${options.StartDate}`;
        }
        if (options.EndDate) {
            url += `&endDate=${options.EndDate}`;
        }

        if (options.Status) {
            url += `&status=${options.Status}`;
        }
        return this.http.get<any>(url);
    }

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

    private handleError(error: HttpErrorResponse): Observable<any> {
        console.error('An error occurred:', error);
        return throwError('Something bad happened; please try again later.');
    }

    getWarrantyByPhoneNumber(phoneNumber: string): Observable<any> {
        return this.http.get(
            `${this.url}/api/warranty/paging?PhoneNumber=${phoneNumber}`
        );
    }
}
