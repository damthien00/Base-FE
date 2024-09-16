import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OptionsFilterStockIn } from '../DTOs/stock-in/optionFilterStockIn';

@Injectable({
    providedIn: 'root',
})
export class StockInService {
    public url = environment.url;
    constructor(private http: HttpClient) {}

    private handleError(error: HttpErrorResponse): Observable<any> {
        console.error('An error occurred:', error);
        return throwError('Something bad happened; please try again later.');
    }

    createStockIn(data: any): Observable<any> {
        return this.http
            .post<any>(`${this.url}/api/inventory-stock-in/create`, data)
            .pipe(catchError(this.handleError));
    }

    getStockInLists(
        optionsFilterStockIn: OptionsFilterStockIn
    ): Observable<any> {
        const {
            pageSize,
            pageIndex,
            CreatedById,
            StartDate,
            Code,
            EndDate,
            TrackingNumber,
        } = optionsFilterStockIn;

        // Khởi tạo URL với các tham số cơ bản
        let url = `${this.url}/api/inventory-stock-in/paging?pageSize=${
            pageSize ?? 100
        }&pageIndex=${pageIndex ?? 1}`;

        // Thêm tham số CreatedById nếu có
        if (CreatedById !== null && CreatedById !== undefined) {
            url += `&CreatedById=${CreatedById}`;
        }

        // Thêm tham số StartDate nếu có
        if (StartDate !== null && StartDate !== undefined) {
            url += `&StartDate=${StartDate.toISOString()}`;
        }

        if (Code !== null && Code !== undefined) {
            url += `&Code=${Code}`;
        }

        // Thêm tham số EndDate nếu có
        if (EndDate !== null && EndDate !== undefined) {
            url += `&EndDate=${EndDate.toISOString()}`;
        }

        // Thêm tham số TrackingNumber nếu có
        if (TrackingNumber) {
            url += `&TrackingNumber=${encodeURIComponent(TrackingNumber)}`;
        }

        return this.http.get<any>(url);
    }

    getStockInById(id: any): Observable<any> {
        // Khởi tạo URL với các tham số cơ bản
        let url = `${this.url}/api/inventory-stock-in/get-by-id?id=${id}`;

        // Gửi yêu cầu GET tới URL đã khởi tạo
        return this.http.get<any>(url);
    }

    checkExistEngineAndFrame(
        frameNumber: any,
        engineNumber: any
    ): Observable<any> {
        console.log('work');
        // Khởi tạo URL
        let url = `${this.url}/api/inventory-stock-in/check-exist-emei`;

        // Dữ liệu để gửi trong body của yêu cầu POST
        let body = {
            frameNumber: frameNumber,
            engineNumber: engineNumber,
        };

        // Gửi yêu cầu POST với URL và body đã khởi tạo
        return this.http.post<any>(url, body);
    }
}
