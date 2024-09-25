import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class WarrantyService {
    public url = environment.url;
    constructor(private http: HttpClient) {}
    createWarranty(data: any): Observable<any> {
        return this.http
            .post<any>(`${this.url}/api/warranty/create`, data)
            .pipe(catchError(this.handleError));
    }
    private handleError(error: HttpErrorResponse): Observable<any> {
        console.error('An error occurred:', error);
        return throwError('Something bad happened; please try again later.');
    }
}
