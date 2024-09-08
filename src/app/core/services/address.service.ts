// import { Injectable } from '@angular/core';

// @Injectable({
//     providedIn: 'root',
// })
// export class AddressService {
//     constructor() {}
// }

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OptionsFilterBranch } from '../DTOs/branch/optionsFilterBranchs';
import { OptionsFilterDistrict } from '../DTOs/address/optionsFilterDistrict';
import { OptionsFilterWard } from '../DTOs/address/optionsFilterWard';

@Injectable({
    providedIn: 'root',
})
export class AddressService {
    constructor(private http: HttpClient) {}
    public url = environment.url;

    getDistricts(keyword: any): Observable<any> {
        // const { cityName, name } = optionsFilterDistrict;
        let url = `${this.url}/api/address/get-districts?`;
        if (keyword) {
            url += `&cityName=${keyword}`;
        }
        // if (name) {
        //     url += `&cityName=${cityName}`;
        // }
        return this.http.get<any>(url);
    }

    getWards(districtId: number): Observable<any> {
        let url = `${this.url}/api/address/get-wards?districtId=${districtId}`;
        return this.http.get<any>(url);
    }
}
