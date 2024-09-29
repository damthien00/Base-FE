import { OptionsFilterCustomer } from 'src/app/core/DTOs/customer/optionsFilterCustomers';
import { Customer } from 'src/app/core/models/customer';
import {
    HttpClient,
    HttpErrorResponse,
    HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable()
export class CustomerService {
    public url = environment.url;

    constructor(private http: HttpClient) {}

    private handleError(error: HttpErrorResponse): Observable<any> {
        console.error('An error occurred:', error);
        return throwError('Something bad happened; please try again later.');
    }

    CheckCustomerExistence(phoneNumber: string): Observable<boolean> {
        return this.http.get<boolean>(
            `${this.url}/api/customer/CheckExistence?phoneNumber=${phoneNumber}`
        );
    }

    getCustomerById(id: number): Observable<any> {
        const url = `${this.url}/api/customer/getone/${id}`;
        return this.http.get<any>(url);
    }

    updateCustomer(data: any): Observable<any> {
        const url = `${this.url}/api/customer/update`; // Endpoint API cho việc cập nhật thương hiệu
        return this.http.put<any>(url, data);
    }

    checkCustomerExistenceUpdate(
        phoneNumber: string,
        id: number
    ): Observable<boolean> {
        return this.http.get<boolean>(
            `${this.url}/api/customer/CheckExistenceUpdate?phoneNumber=${phoneNumber}&id=${id}`
        );
    }

    // filterCustomers(options: OptionsFilterCustomer) {
    //     return this.http.post<OptionsFilterCustomer>(`${this.url}/api/customer/filter`, options);
    // }

    getCustomers(
        optionsFilterCustomer: OptionsFilterCustomer
    ): Observable<any> {
        const { pageSize, pageIndex, name, phoneNumber, Keyword } =
            optionsFilterCustomer;
        let url = `${this.url}/api/customer/paging?pageSize=${pageSize}&pageIndex=${pageIndex}`;
        if (name) {
            url += `&name=${name}`;
        }
        if (phoneNumber) {
            url += `&phoneNumber=${phoneNumber}`;
        }
        if (Keyword) {
            url += `&Keyword=${Keyword}`;
        }
        return this.http.get<any>(url);
    }

    // filterCustomers(
    //     optionsFilterCustomer: OptionsFilterCustomer
    // ): Observable<any> {
    //     const { pageSize, pageIndex, nameOrPhoneNumber } =
    //         optionsFilterCustomer;
    //     let url = `${this.url}/api/customer/get-all?pageSize=${pageSize}&pageIndex=${pageIndex}`;
    //     return this.http.get<any>(url);
    // }

    // filterCustomers(options: OptionsFilterCustomer): Promise<any> {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             let response = await this.http
    //                 .post<OptionsFilterCustomer>(
    //                     `${this.url}/api/customer/filter`,
    //                     options
    //                 )
    //                 .toPromise();
    //             resolve(response);
    //         } catch (error) {
    //             reject(JSON.parse(JSON.stringify(error)));
    //         }
    //     });
    // }

    getAllCustomerGroups(): Observable<any[]> {
        return this.http.get<any[]>(
            `${this.url}/api/customergroups/getallcustomergroups`
        );
    }
    createCustomer(customerData: any): Observable<any> {
        return this.http
            .post<any>(`${this.url}api/customers/create`, customerData)
            .pipe(
                catchError((error) => {
                    return throwError(error);
                })
            );
    }
    deleteCustomer(id: number): Observable<any> {
        return this.http
            .delete<any>(`${this.url}/api/customer/delete/${id}`)
            .pipe(
                catchError((error) => {
                    throw new Error('Something went wrong in deleteCustomer');
                })
            );
    }

    getCustomersSmall() {
        return this.http
            .get<any>('assets/demo/data/customers-small.json')
            .toPromise()
            .then((res) => res.data as Customer[])
            .then((data) => data);
    }

    getCustomersMedium() {
        return this.http
            .get<any>('assets/demo/data/customers-medium.json')
            .toPromise()
            .then((res) => res.data as Customer[])
            .then((data) => data);
    }

    getCustomersLarge() {
        return this.http
            .get<any>('assets/demo/data/customers-large.json')
            .toPromise()
            .then((res) => res.data as Customer[])
            .then((data) => data);
    }
}
