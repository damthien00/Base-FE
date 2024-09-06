import {
    HttpClient,
    HttpErrorResponse,
    HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TreeNode } from 'primeng/api';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class CategoryService {
    public url = environment.url;

    constructor(private http: HttpClient) { }
    getTreeCategory(): Promise<any> {
        return this.http
            .get<any>(`${this.url}/api/productcategory/get-all-tree-category`)
            .toPromise();
    }
    getCategorys(pageSize: number, pageNumber: number): Observable<any> {
        return this.http.get<any>(
            `${this.url}/api/productcategory/get-all?pageSize=${pageSize}&pageNumber=${pageNumber}`
        );
    }
    getCategoryAll(): Observable<any> {
        return this.http.get<any>(
            `${this.url}/api/productcategory/get-all-none-pagination`
        );
    }

    createCategory(data: any): Observable<any> {
        return this.http
            .post<any>(`${this.url}/api/productcategory/create`, data)
            .pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse): Observable<any> {
        console.error('An error occurred:', error);
        return throwError('Something bad happened; please try again later.');
    }

    CheckCategoryExistence(name: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await this.http
                    .get<any>(
                        `${this.url}/api/productcategory/get-by-name?name=${name}`
                    )
                    .toPromise();
                resolve(response);
            } catch (error) {
                let response = error as any;
                if (response.error.statusCode === 400) {
                    resolve(response);
                }
                reject(JSON.parse(JSON.stringify(error)));
            }
        });
    }
    getCategoryById(id: number): Observable<any> {
        const url = `${this.url}/api/productcategory/get-one/${id}`;
        return this.http.get<any>(url);
    }
    updateCategory(categoryData: any): Observable<any> {
        const url = `${this.url}/api/productcategory/update`; // Endpoint API cho việc cập nhật thương hiệu
        return this.http.put<any>(url, categoryData);
    }
    checkCategoryExistenceUpdate(
        name: string,
        id: number
    ): Observable<boolean> {
        return this.http.get<boolean>(
            `${this.url}/api/productcategory/CheckExistenceUpdate?name=${name}&id=${id}`
        );
    }
    updateStatus(id: number, isDeleted: number): Observable<any> {
        const url = `${this.url}/api/productcategory/UpdateStatus/${id}/${isDeleted}`;
        return this.http.put<any>(url, {});
    }

    searchCategories(term: string): Observable<any[]> {
        return this.http.get<any[]>(
            `${this.url}/api/productcategory/filter-with-name-or-id?name_or_id=${term}`
        );
    }

    searchBrands(
        pageSize: number,
        pageNumber: number,
        keySearch: string
    ): Observable<any> {
        return this.http.get<any>(`${this.url}/api/brand/search`, {
            params: {
                pageSize: pageSize.toString(),
                pageNumber: pageNumber.toString(),
                keySearch: keySearch,
            },
        });
    }

    getSubcategories(parentId?: number): Observable<any> {
        const url = `${this.url}/api/productcategory/get-all-immediate-child/${parentId}`;
        return this.http.get<any>(url);
    }

    getCategoriesAndChild(): Observable<TreeNode[]> {
        return this.http
            .get<any>(`${this.url}/api/productcategory/get-all-tree-category`)
            .pipe(map((response: any) => this.mapToTreeNodes(response.data)));
    }

    // Phương thức để chuyển đổi dữ liệu API thành định dạng TreeNode[]
    private mapToTreeNodes(data: any[]): TreeNode[] {
        return data.map((category) => ({
            label: category.name,
            data: category,
            leaf: !category.children || category.children.length === 0,
            children: this.mapToTreeNodes(category.children),
        }));
    }
}
