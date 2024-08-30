import {
    HttpClient,
    HttpErrorResponse,
    HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Brand } from '../models/brands';

@Injectable({
    providedIn: 'root',
})
export class BrandService {
    public url = environment.url;

    constructor(private http: HttpClient) {}

    getBrands(pageSize: number, pageNumber: number): Observable<any> {
        return this.http.get<any>(
            `${this.url}/api/brand/get-all?pageSize=${pageSize}&pageNumber=${pageNumber}`
        );
    }
    createBrand(data: any): Observable<any> {
        return this.http
            .post<any>(`${this.url}/api/brand/create`, data)
            .pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse): Observable<any> {
        console.error('An error occurred:', error);
        return throwError('Something bad happened; please try again later.');
    }

    CheckBrandExistence(name: string): Observable<boolean> {
        return this.http.get<boolean>(
            `${this.url}/api/brand/CheckExistence?name=${name}`
        );
    }
    getBrandById(id: number): Observable<any> {
        const url = `${this.url}/api/brand/get-one/${id}`;
        return this.http.get<any>(url);
    }
    updateBrand(brandData: any): Observable<any> {
        const url = `${this.url}/api/brand/update`; // Endpoint API cho việc cập nhật thương hiệu
        return this.http.put<any>(url, brandData);
    }
    checkBrandExistenceUpdate(name: string, id: number): Observable<boolean> {
        return this.http.get<boolean>(
            `${this.url}/api/brand/CheckExistenceUpdate?name=${name}&id=${id}`
        );
    }
    updateStatus(id: number, isDeleted: number): Observable<any> {
        const url = `${this.url}/api/brand/UpdateStatus/${id}/${isDeleted}`;
        return this.http.put<any>(url, {});
    }
    getAllBrands(): Observable<any[]> {
        return this.http.get<any[]>(`${this.url}/api/brand/getallbrandpro`);
    }
    searchBrands(
        pageSize: number,
        pageNumber: number,
        keySearch: string
    ): Observable<any> {
        return this.http.get<any>(`${this.url}/api/brand/search`, {
            params: {
                pageSize: pageSize.toString(),
                pageNumber: pageNumber.toString(),
                keySearch: keySearch,
            },
        });
    }
}
