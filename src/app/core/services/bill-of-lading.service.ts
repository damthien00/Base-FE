import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { User } from '../models/user.model';
import { API_CONSTANTS } from '../constants/api.constants';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BillOfLadingService {

  public url = environment.url;
  constructor(private http: HttpClient) { }

  getLadingById(id: number): Observable<any> {
    return this.http.get(`${this.url}/api/bill-of-lading/get-by-id?Id=${id}`);
  }

  updateLading(updateLadingData: any): Observable<any> {
    const url = `${this.url}/api/bill-of-lading/confilm`;
    return this.http.put(url, updateLadingData);
  }

  rejectLading(updateLadingData: any): Observable<any> {
    const url = `${this.url}/api/bill-of-lading/reject`;
    return this.http.put(url, updateLadingData);
  }
}
