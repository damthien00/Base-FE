import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerGroupsService {
  public url = environment.url;

  constructor(private http: HttpClient) { }

  getCustomerGroups(pageSize: number, pageNumber: number, keyWordName: string): Observable<any> {
    const params = new HttpParams()
      .set('pagesize', pageSize.toString())
      .set('pagenumber', pageNumber.toString())
      .set('keyWordName', keyWordName);

    return this.http.get<any>(`${this.url}/api/customergroups/search`, { params });
  }
  createCustomerGroups(data: any): Observable<any> {
    return this.http.post<any>(`${this.url}/api/customergroups/create`, data)
      .pipe(
        catchError(this.handleError)
      );
  }
  private handleError(error: HttpErrorResponse): Observable<any> {
    console.error('An error occurred:', error);
    return throwError('Something bad happened; please try again later.');
  }
  CheckCustomerGroupExistence(name: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.url}/api/customergroups/CheckExistence?name=${name}`);
  }
  getCustomerGroupById(id: number): Observable<any> {
    const url = `${this.url}/api/customergroups/get-one/${id}`;
    return this.http.get<any>(url);
  }
  updateCustomerGroup(brandData: any): Observable<any> {
    const url = `${this.url}/api/customergroups/update`; // Endpoint API cho việc cập nhật thương hiệu
    return this.http.put<any>(url, brandData);
  }
  checkCustomerGroupExistenceUpdate(name: string, id: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.url}/api/customergroups/CheckExistenceUpdate?name=${name}&id=${id}`);
  }
}
