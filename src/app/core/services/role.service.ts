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
  constructor(private http: HttpClient) {}

  getRoleAll(): Observable<any> {
    return this.http.get<any>(
        `${this.url}/api/role/paging`
    );
}
}
