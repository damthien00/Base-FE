import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { API_CONSTANTS } from '../constants/api.constants';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  public url = environment.url;
  constructor(private http: HttpClient) { }

  getRoleAll(PageSize: number, PageIndex: number): Observable<any> {
    let params = new HttpParams()
      .set('PageSize', PageSize.toString())
      .set('PageIndex', PageIndex.toString());
    return this.http.get<any>(
      `${this.url}/api/role/paging`, { params: params });
  }

  getFiltersRoles(PageSize: number, PageIndex: number, Name?: string): Observable<any> {
    let params = new HttpParams()
      .set('PageSize', PageSize.toString())
      .set('PageIndex', PageIndex.toString());

    if (Name) {
      params = params.set('Name', Name);
    }

    return this.http.get<any>(`${this.url}/api/role/paging`, { params: params });
  }

  createRoles(userData: any): Observable<any> {
    return this.http.post(`${this.url}/api/role/create`, userData);
  }

  getGroupRoleById(Id: number): Observable<any> {
    const url = `${this.url}/api/role/get-by-id?Id=${Id}`;
    return this.http.get<any>(url);
  }
}
