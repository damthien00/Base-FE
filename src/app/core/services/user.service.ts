import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { API_CONSTANTS } from '../constants/api.constants';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    public url = environment.url;
    constructor(private http: HttpClient) { }

    login(email: string, password: string): Observable<User> {
        return this.http.post<User>(
            API_CONSTANTS.BASE_URL + API_CONSTANTS.LOGIN,
            { email, password }
        );
    }

    register(user: User): Observable<User> {
        return this.http.post<User>(
            API_CONSTANTS.BASE_URL + API_CONSTANTS.REGISTER,
            user
        );
    }

    getFilters(PageSize: number, PageIndex: number, Name?: string, PhoneNumber?: string, Address?: string): Observable<any> {
        let params = new HttpParams()
            .set('PageSize', PageSize.toString())
            .set('PageIndex', PageIndex.toString());

        if (Name) {
            params = params.set('Name', Name);
        }

        if (PhoneNumber) {
            params = params.set('PhoneNumber', PhoneNumber);
        }

        if (Address) {
            params = params.set('Address', Address);
        }

        return this.http.get<any>(`${this.url}/api/user/paging`, { params: params });
    }

    createUser(userData: any): Observable<any> {
        return this.http.post(`${this.url}/api/user/create`, userData);
    }

    checkUserExists(phoneNumber: string, email: string): Observable<any> {
        const data = { phoneNumber, email };
        return this.http.post<any>(`${this.url}/api/user/check-exists`, data);
    }

    getUserById(userId: number): Observable<any> {
        const url = `${this.url}/api/user/get-by-id?UserId=${userId}`;
        return this.http.get<any>(url);
    }

    updateUser(data: any): Observable<any> {
        const url = `${this.url}/api/user/edit-user-info`; // Endpoint API cho việc cập nhật thương hiệu
        return this.http.put<any>(url, data);
    }

    assignRolesToUser(assignRolesPayload: any): Observable<any> {
        return this.http.put(`${this.url}/api/user/assign-user-to-roles`, assignRolesPayload);
    }

}
