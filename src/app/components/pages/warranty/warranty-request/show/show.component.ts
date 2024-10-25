import { OptionsFilterWarrantyClaims } from './../../../../../core/DTOs/warranty/optionFilterWarranty';
import { WarrantyService } from './../../../../../core/services/warranty.service';
// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-show',
//   templateUrl: './show.component.html',
//   styleUrls: ['./show.component.css']
// })
// export class ShowComponent implements OnInit {

//   constructor() { }

//   ngOnInit() {
//   }

// }

import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MenuItem } from 'primeng/api';
import { Table } from 'primeng/table';

import { ProductService } from 'src/app/core/services/product.service';
import { CategoryService } from 'src/app/core/services/category.service';
import { NodeService } from 'src/app/core/services/node.service';
import { TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { Product } from 'src/app/core/models/order';
import { OptionsFilterProduct } from 'src/app/core/models/options-filter-product';

@Component({
    selector: 'app-show',
    templateUrl: './show.component.html',
    styleUrls: ['./show.component.css'],
    providers: [MessageService],
})
export class ShowComponent implements OnInit {
    optionsFillerProduct: OptionsFilterProduct = new OptionsFilterProduct();
    optionsFilterWarrantyClaims: OptionsFilterWarrantyClaims =
        new OptionsFilterWarrantyClaims();
    nodes!: any[];
    optionsStatus: any[] = [
        { name: 'Ẩn', value: 0 },
        { name: 'Hoạt động', value: 1 },
        { name: 'Hết hàng', value: 2 },
    ];
    selectedNodes: any;
    statusFilter: any;
    expandedRows = {};

    expandAll() {
        this.expandedRows = this.products.reduce(
            (acc, p) => (acc[p.id] = true) && acc,
            {}
        );
    }
    collapseAll() {
        this.expandedRows = {};
    }

    items: MenuItem[] | undefined;

    home: MenuItem | undefined;

    productDialog: boolean = false;

    deleteProductDialog: boolean = false;

    deleteProductsDialog: boolean = false;

    products: Product[] = [];

    product: Product = {};

    selectedProducts: Product[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];
    pageSize = 30;
    pageNumber = 1;
    totalRecords = 20;
    treeCategory: any[] = [];

    warrantyClaims: any[] = [];

    constructor(
        private productCateogryService: CategoryService,
        private productService: ProductService,
        private messageService: MessageService,
        private nodeService: NodeService,
        private warrantyService: WarrantyService
    ) {
        this.nodeService.getFiles().then((files) => (this.nodes = files));
        this.optionsFillerProduct.pageIndex = this.pageNumber;
        this.optionsFillerProduct.pageSize = this.pageSize;
    }

    async ngOnInit() {
        this.items = [{ label: 'Danh sách yêu cầu bảo hành' }];
        // let response = await this.productService.FilterProduct(
        //     this.optionsFillerProduct
        // );
        // let responseGetTreeCategory =
        //     await this.productCateogryService.getTreeCategory();
        // this.treeCategory = responseGetTreeCategory.data;
        // this.products = response.data;
        // this.totalRecords = response.totalRecordsCount;
        this.loadWarrantyClaims();
    }

    loadWarrantyClaims() {
        this.warrantyService
            .getWarrantyClaims(this.optionsFilterWarrantyClaims)
            .subscribe((response) => {
                this.warrantyClaims = response.data.items;
            });
    }

    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }

    onClear() {
        this.optionsFillerProduct.CategoryId = null;
        let label = document.querySelector(
            '.category-select .p-treeselect-label'
        );
        if (label) {
            label.innerHTML = 'Chọn danh mục';
        }
    }

    onNodeSelect(event: any) {
        console.log(event);
        this.optionsFillerProduct.CategoryId = this.selectedNodes?.id;
        let label = document.querySelector(
            '.category-select .p-treeselect-label'
        );
        if (label) {
            label.innerHTML = this.selectedNodes?.name || '';
        }
    }

    deleteSelectedProducts() {
        this.deleteProductsDialog = true;
    }

    editProduct(product: Product) {
        this.product = { ...product };
        this.productDialog = true;
    }

    deleteProduct(product: Product) {
        this.deleteProductDialog = true;
        this.product = { ...product };
    }

    confirmDeleteSelected() {
        this.deleteProductsDialog = false;
        this.products = this.products.filter(
            (val) => !this.selectedProducts.includes(val)
        );
        this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Products Deleted',
            life: 3000,
        });
        this.selectedProducts = [];
    }

    confirmDelete() {
        this.deleteProductDialog = false;
        this.products = this.products.filter(
            (val) => val.id !== this.product.id
        );
        this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Product Deleted',
            life: 3000,
        });
        this.product = {};
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        const chars =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    onRowExpand(event: TableRowExpandEvent) {
        this.messageService.add({
            severity: 'info',
            summary: 'Product Expanded',
            detail: event.data.name,
            life: 3000,
        });
    }

    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warning';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return '';
        }
    }

    getStatusSeverity(status: string) {
        switch (status) {
            case 'PENDING':
                return 'warning';
            case 'DELIVERED':
                return 'success';
            case 'CANCELLED':
                return 'danger';
            default:
                return '';
        }
    }

    onRowCollapse(event: TableRowCollapseEvent) {
        this.messageService.add({
            severity: 'success',
            summary: 'Product Collapsed',
            detail: event.data.name,
            life: 3000,
        });
    }
    async EvenFilter() {
        this.optionsFillerProduct.Status = this.statusFilter
            ? this.statusFilter.value
            : null;
        this.optionsFillerProduct.pageIndex = 1;

        await this.productService
            .FilterProduct(this.optionsFillerProduct)
            .then((response) => {
                this.products = response.data;
                this.totalRecords = response.totalRecordsCount;
            });
    }
}
