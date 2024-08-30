import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { API_CONSTANTS } from '../constants/api.constants';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(private http: HttpClient) {}

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
}
