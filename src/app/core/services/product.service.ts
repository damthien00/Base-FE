import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from 'src/app/core/models/product';
import { environment } from 'src/environments/environment';
// import { OptionsFilterProduct } from '../model/product-test';

import { OptionsFilterProduct } from 'src/app/core/models/product-test';

@Injectable()
export class ProductService {
    public url = environment.url;
    constructor(private http: HttpClient) {}

    FilterProduct(options: OptionsFilterProduct): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await this.http
                    .post<OptionsFilterProduct>(
                        `${this.url}/api/products/filter-products-for-store`,
                        options
                    )
                    .toPromise();
                resolve(response);
            } catch (error) {
                reject(JSON.parse(JSON.stringify(error)));
            }
        });
    }

    async getProductsTest(pageSize: number, pageNumber: number): Promise<any> {
        try {
            let response = await this.http
                .get<any>(
                    `${this.url}/api/products/get-products-for-store?pagesize=${pageSize}&pagenumber=${pageNumber}`
                )
                .toPromise();
            return response;
        } catch (error) {
            return JSON.parse(JSON.stringify(error));
        }
    }

    getProductsSmall() {
        return this.http
            .get<any>('assets/demo/data/products-small.json')
            .toPromise()
            .then((res) => res.data as Product[])
            .then((data) => data);
    }

    getProducts() {
        return this.http
            .get<any>('assets/demo/data/products.json')
            .toPromise()
            .then((res) => res.data as Product[])
            .then((data) => data);
    }

    getProductsMixed() {
        return this.http
            .get<any>('assets/demo/data/products-mixed.json')
            .toPromise()
            .then((res) => res.data as Product[])
            .then((data) => data);
    }

    getProductsWithOrdersSmall() {
        return this.http
            .get<any>('assets/demo/data/products-orders-small.json')
            .toPromise()
            .then((res) => res.data as Product[])
            .then((data) => data);
    }
}
