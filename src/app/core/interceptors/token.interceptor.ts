// import { Injectable } from '@angular/core';
// import {
//     HttpInterceptor,
//     HttpRequest,
//     HttpHandler,
//     HttpEvent,
// } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { AuthService } from '../services/auth.service';

// @Injectable()
// export class AuthenticationMiddlewareService implements HttpInterceptor {
//     constructor(private authService: AuthService) {}

//     intercept(
//         req: HttpRequest<any>,
//         next: HttpHandler
//     ): Observable<HttpEvent<any>> {
//         // const token = localStorage.getItem('token');
//         // const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOiIxMCIsIlVzZXJOYW1lIjoiU3RyaW5nIiwiU3RvcmVOYW1lIjoiQ-G7rWEgaMOgbmcgYSIsIlN0b3JlSWQiOiIyMCIsImV4cCI6MTc1MjU0NjU3NH0.Teetzl515v-m6MhNNNCOXdj9cP1yONfABa3p9MuTBQM`;
//         var authToken = this.authService.getAuthTokenLocalStorage();
//         if (authToken?.accessToken != null) {
//             req = req.clone({
//                 setHeaders: {
//                     Authorization: `Bearer ${authToken.accessToken}`,
//                 },
//             });
//         }
//         return next.handle(req);
//     }
// }

import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service'; // Đảm bảo đường dẫn đúng

@Injectable()
export class AuthenticationMiddlewareService implements HttpInterceptor {
    constructor(
        private authService: AuthService,
        private toastService: ToastService
    ) {}

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        // Lấy token từ AuthService
        const authToken = this.authService.getAuthTokenLocalStorage();
        if (authToken?.accessToken != null) {
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${authToken.accessToken}`,
                },
            });
        }

        // Xử lý request và bắt lỗi
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 403) {
                    this.toastService.showError(
                        'Chú ý',
                        'Bạn không có quyền truy cập!'
                    );
                }
                return throwError(error); // Bảo tồn lỗi gốc
            })
        );
    }
}
