import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  public url = environment.url;
  constructor(private http: HttpClient) { }

  getPermissionAll(PageSize: number, PageIndex: number): Observable<any> {
    let params = new HttpParams()
      .set('PageSize', PageSize.toString())
      .set('PageIndex', PageIndex.toString());
    return this.http.get<any>(
      `${this.url}/api/permission/paging`, { params: params });
  }

}
