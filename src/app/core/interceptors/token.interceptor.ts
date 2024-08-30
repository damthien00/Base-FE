import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticationMiddlewareService implements HttpInterceptor {
    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        // const token = localStorage.getItem('token');
        const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOiIxMCIsIlVzZXJOYW1lIjoiU3RyaW5nIiwiU3RvcmVOYW1lIjoiQ-G7rWEgaMOgbmcgYSIsIlN0b3JlSWQiOiIyMCIsImV4cCI6MTc1MjU0NjU3NH0.Teetzl515v-m6MhNNNCOXdj9cP1yONfABa3p9MuTBQM`;
        if (token) {
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                },
            });
        }
        return next.handle(req);
    }
}
