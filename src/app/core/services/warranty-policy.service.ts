// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class WarrantyPolicyService {

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
export class WarrantyPolicyService {
    constructor(private http: HttpClient) {}
    public url = environment.url;

    getWarrantyPolicies(): Observable<any> {
        // const { pageSize, pageIndex, name } = optionsFilterBranch;
        let url = `${this.url}/api/warranty-policy/paging`;
        return this.http.get<any>(url);
    }

    createWarrantyPolicy(data: any): Observable<any> {
        return this.http
            .post<any>(`${this.url}/api/warranty-policy/create`, data)
            .pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse): Observable<any> {
        console.error('An error occurred:', error);
        return throwError('Something bad happened; please try again later.');
    }
}
