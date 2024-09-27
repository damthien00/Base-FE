import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ProductImeiService {
    public url = environment.url;
    constructor(private http: HttpClient) {}
    getProoductByEmei(
        FrameNumber: string,
        EngineNumber: string
    ): Observable<any> {
        let params = new HttpParams()
            .set('FrameNumber', FrameNumber.toString())
            .set('EngineNumber', EngineNumber.toString());
        return this.http.get<any>(`${this.url}/api/product-imei/get-by-emei`, {
            params: params,
        });
    }
}