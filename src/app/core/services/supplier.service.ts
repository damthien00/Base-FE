import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Supplier } from '../models/suppliers';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  public url = environment.url;

  constructor(private http: HttpClient) { }

  getSuppliers(pageSize: number, pageNumber: number): Observable<any> {
    return this.http.get<any>(`${this.url}/api/supplier/get-all?pageSize=${pageSize}&pageNumber=${pageNumber}`);
  }
  createSupplier(data: any): Observable<any> {
    return this.http.post<any>(`${this.url}/api/supplier/create`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    console.error('An error occurred:', error);
    return throwError('Something bad happened; please try again later.');
  }

  CheckSupplierExistence(name: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.url}/api/supplier/CheckExistence?name=${name}`);
  }
  getSupplierById(id: number): Observable<any> {
    const url = `${this.url}/api/supplier/getbyid/${id}`;
    return this.http.get<any>(url);
  }
  updateSupplier(SupplierData: any): Observable<any> {
    const url = `${this.url}/api/supplier/update`; // Endpoint API cho việc cập nhật thương hiệu
    return this.http.post<any>(url, SupplierData);
  }
  checkSupplierExistenceUpdate(name: string, id: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.url}/api/supplier/CheckExistenceUpdate?name=${name}&id=${id}`);
  }
  updateStatus(id: number, isDeleted: number): Observable<any> {
    const url = `${this.url}/api/supplier/UpdateStatus/${id}/${isDeleted}`;
    return this.http.put<any>(url, {});
  }
  getAllSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.url}/api/supplier/getallSupplierpro`);
  }

  filterSuppliers(options: any): Observable<Supplier[]> {
    return this.http.post<Supplier[]>(`${this.url}/api/supplier/filter`, options);
  }

  searchSuppliers(pageSize: number, pageNumber: number, keySearch: string): Observable<any> {
    return this.http.get<any>(`${this.url}/api/supplier/search`, {
      params: {
        pageSize: pageSize.toString(),
        pageNumber: pageNumber.toString(),
        keySearch: keySearch
      }
    });
  }
  FilterSuppliers(pageSize: number, pageNumber: number, keySearch: string): Observable<any> {
    console.log(keySearch);
    return this.http.post<any>(`${this.url}/api/supplier/filter`, {

      pageIndex: pageNumber.toString(),
      pageSize: pageSize.toString(),
      nameOrPhone: keySearch

    });
  }

  deleteSupplier(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/api/supplier/delete/${id}`)
      .pipe(
        catchError((error) => {
          throw new Error('Something went wrong in deleteSupplier');
        })
      );
  }
}
