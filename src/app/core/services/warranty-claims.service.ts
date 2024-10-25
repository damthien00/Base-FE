// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class WarrantyClaimsService {

// constructor() { }

// }
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OptionsFilterBranch } from '../DTOs/branch/optionsFilterBranchs';

@Injectable({
    providedIn: 'root',
})
export class WarrantyClaimsService {
    constructor(private http: HttpClient) {}
    public url = environment.url;

    getBranchs(optionsFilterBranch: OptionsFilterBranch): Observable<any> {
        const { pageSize, pageIndex, name } = optionsFilterBranch;
        let url = `${this.url}/api/branch/paging?pageSize=${pageSize}&pageIndex=${pageIndex}`;
        if (name) {
            url += `&name=${name}`;
        }
        return this.http.get<any>(url);
    }

    getWarrantyClaimById(id: any): Observable<any> {
        let url = `${this.url}/api/warranty-claim/get-by-id?Id=${id}`;
        return this.http.get<any>(url);
    }

    updateWarrantyClaimsStatus(data) {
        return this.http
            .put<any>(`${this.url}/api/warranty-claim/update`, data)
            .pipe(catchError(this.handleError));
    }

    getBranchsAll(PageSize: number = 1000): Observable<any> {
        return this.http.get<any>(
            `${this.url}/api/branch/paging?pageSize=${PageSize}`
        );
    }

    createBranch(data: any): Observable<any> {
        return this.http
            .post<any>(`${this.url}/api/branch/create`, data)
            .pipe(catchError(this.handleError));
    }

    updateBranch(data: any): Observable<any> {
        return this.http
            .put<any>(`${this.url}/api/branch/update`, data)
            .pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse): Observable<any> {
        console.error('An error occurred:', error);
        return throwError('Something bad happened; please try again later.');
    }
}
