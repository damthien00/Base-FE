import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from './local-storage.service';
import { AuthToken } from '../models/identity/auth-token.interface';
import { ApiResult } from '../models/identity/api-result.interface';
import { UserCurrent } from '../models/identity/user-current.interface';
import { LocalStorage } from '../enums/local-storage.enum';
import { HttpService } from './http.service';
import { RefreshTokenRequest } from '../models/identity/refresh-token-request.interface';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private http: HttpClient, private localStorageService: LocalStorageService, private httpService: HttpService) { }

    public url = environment.url;

    isLoggedIn(): boolean {
        const token = localStorage.getItem('token');
        if (token) {
            return true;
        }

        return false;
    }


    // tny add
    login(request: any): Observable<any> {
        return this.http
            .post<any>(`${this.url}/api/auth/login-by-email`, request)
            .pipe(catchError(this.handleError));
    }
    private isInitAuthSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    isInitAuth$: Observable<boolean> = this.isInitAuthSubject.asObservable();


    private currentUserSubject = new BehaviorSubject<any>(null);
    public userCurrent = this.currentUserSubject.asObservable();

    getUserCurrent() {
        return this.currentUserSubject.value;
    }

    setUserCurrent(user: any) {
        this.currentUserSubject.next(user);
    }



    //Auth token
    getAuthTokenLocalStorage(): AuthToken | null {
        const authToken: AuthToken | null = this.localStorageService.getItem(LocalStorage.AuthToken);

        return authToken;
    }

    setAuthTokenLocalStorage(authToken: AuthToken | null) {
        this.localStorageService.setItem(LocalStorage.AuthToken, authToken);
    }


    getUserCurrentApi(): Observable<ApiResult<UserCurrent>> {
        return this.http.get<ApiResult<UserCurrent>>(`${this.url}'/api/user/user-info'`);
    }

    fetchUserCurrent(): Observable<ApiResult<UserCurrent>> {
        let headers = this.httpService.addSkipLoadingHeader();

        return this.http.get<ApiResult<UserCurrent>>(`${this.url}/api/user/user-info`, { headers });
    }


    refreshToken(request: RefreshTokenRequest): Observable<ApiResult<AuthToken>> {
        return this.http.post<ApiResult<AuthToken>>(`${this.url}/api/auth/refresh-token`, request);
    }

    hasRole(role: string): boolean {

        if (!this.currentUserSubject.value) {
            return false;
        }

        if (this.currentUserSubject.value.roles.includes(role)) {
            return true;
        } else {
            return false;
        }
    }

    hasRoleAsync(user: any, role: string): boolean {

        if (!user) {
            return false;
        }

        if (user.roles.includes(role)) {
            return true;
        } else {
            return false;
        }
    }

    logout(): Observable<ApiResult<boolean>> {
        return this.http.post<ApiResult<boolean>>(`${this.url}/api/auth/logout`, null);
    }


    private handleError(error: HttpErrorResponse): Observable<any> {
        console.error('An error occurred:', error);
        return throwError('Something bad happened; please try again later.');
    }

    // tny end add
}
