import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { OptionsSearchProduct, Products } from '../models/product';
import { OptionsFilterProduct } from '../models/options-filter-product';

@Injectable()
export class ProductService {
    public url = environment.url;
    constructor(private http: HttpClient) {}

    private handleError(error: HttpErrorResponse): Observable<any> {
        console.error('An error occurred:', error);
        return throwError('Something bad happened; please try again later.');
    }

    async getProducts(pageSize: number, pageNumber: number): Promise<any> {
        try {
            let response = await this.http
                .get<any>(
                    `${this.url}/api/product/get-products-for-store?pagesize=${pageSize}&pagenumber=${pageNumber}`
                )
                .toPromise();
            return response;
        } catch (error) {
            return JSON.parse(JSON.stringify(error));
        }
    }

    FilterProduct(options: OptionsFilterProduct): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await this.http
                    .post<OptionsFilterProduct>(
                        `${this.url}/api/product/filter-products-for-store`,
                        options
                    )
                    .toPromise();
                resolve(response);
            } catch (error) {
                reject(JSON.parse(JSON.stringify(error)));
            }
        });
    }

    FilterProductVariants(options: OptionsFilterProduct): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await this.http
                    .post<OptionsFilterProduct>(
                        `${this.url}/api/productvariants/filter`,
                        options
                    )
                    .toPromise();
                resolve(response);
            } catch (error) {
                reject(JSON.parse(JSON.stringify(error)));
            }
        });
    }

    SearchProductVariants(options: OptionsSearchProduct): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await this.http
                    .post<OptionsSearchProduct>(
                        `${this.url}/api/productvariants/filter`,
                        options
                    )
                    .toPromise();
                resolve(response);
            } catch (error) {
                reject(JSON.parse(JSON.stringify(error)));
            }
        });
    }

    createProduct(data: any): Observable<any> {
        return this.http
            .post<any>(`${this.url}/api/product/create-with-file`, data)
            .pipe(catchError(this.handleError));
    }

    deletProduct(idPRoduct: number): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await this.http
                    .delete<any>(`${this.url}/api/product/delete/${idPRoduct}`)
                    .toPromise();
                if (response.statusCode == 200) {
                    resolve(response);
                }
                reject(response);
            } catch (err) {
                reject(err);
            }
        });
    }
    ChangeStatusProduct(idPRoduct: number): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await this.http
                    .get<any>(
                        `${this.url}/api/product/change-product-status/${idPRoduct}`
                    )
                    .toPromise();
                if (response.statusCode == 200) {
                    resolve(response);
                }
                reject(response);
            } catch (err) {
                reject(err);
            }
        });
    }

    // Lấy thông tin của một sản phẩm dựa trên ID
    getProductbyId(id: number): Observable<Products> {
        const url = `${this.url}/api/product/get-product-and-variant/${id}`;
        return this.http.get<Products>(url).pipe(catchError(this.handleError));
    }

    updateProductAndVariant(product: any): Observable<any> {
        const url = `${this.url}/api/product/update`;
        return this.http.put<any>(url, product);
    }

    getCategoryAll(): Observable<any> {
        return this.http.get<any>(
            `${this.url}/api/productcategory/get-all-none-pagination`
        );
    }

    CheckBarcode(
        barCode: string
    ): Observable<{ data: boolean; [key: string]: any }> {
        return this.http.get<{ data: boolean; [key: string]: any }>(
            `${this.url}/api/product/checkbarcode?barCode=${barCode}`
        );
    }

    CheckSku(
        sku: string
    ): Observable<{ data: boolean; [key: string]: any }> {
        return this.http.get<{ data: boolean; [key: string]: any }>(
            `${this.url}/api/product/checksku?sku=${sku}`
        );
    }

    createStockIn(data: any): Observable<any> {
        return this.http
            .post<any>(`${this.url}/api/inventory-stock-in/create`, data)
            .pipe(catchError(this.handleError));
    }

    CheckBarcodeVariant(
        barCodeVr: string
    ): Observable<{ data: boolean; [key: string]: any }> {
        return this.http.get<{ data: boolean; [key: string]: any }>(
            `${this.url}/api/productvariants/checkbarcodevariant?barCodeVr=${barCodeVr}`
        );
    }

    CheckBarcodeSku(
        sku: string
    ): Observable<{ data: boolean; [key: string]: any }> {
        return this.http.get<{ data: boolean; [key: string]: any }>(
            `${this.url}/api/productvariants/checksku?sku=${sku}`
        );
    }

    checkBarcodeUpdate(barcode: string, productId: number) {
        const url = `${this.url}/api/product/checkbarcode?barCode=${barcode}&id=${productId}`;
        return this.http.get<any>(url);
    }

    checkSkuUpdate(sku: string, productId: number) {
        const url = `${this.url}/api/product/checksku?sku=${sku}&id=${productId}`;
        return this.http.get<any>(url);
    }

    getShipmentProductByCode(productCode: string): Observable<any> {
        const encodedProductCode = encodeURIComponent(productCode);
        return this.http.get<any>(
            `${this.url}/api/shipments/getshipmentproduct?productCode=${encodedProductCode}`
        );
    }

    getStockDetailsByProductCode(productCode: string): Observable<any> {
        return this.http.get(`${this.url}/api/inventory-stock-in/getstockindetailsbyproductcode?productCode=${productCode}`);
      }
}
