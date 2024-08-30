import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/core/models/product';
import { MessageService } from 'primeng/api';
import { MenuItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { OptionsFilterProduct } from 'src/app/core/models/product-test';

import { ProductService } from 'src/app/core/services/product.service';
import { CategoryService } from 'src/app/core/services/category.service';
import { NodeService } from 'src/app/core/services/node.service';
import { TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';

@Component({
    templateUrl: './show.component.html',
    providers: [MessageService],
})
export class ShowComponent implements OnInit {
    optionsFillerProduct: OptionsFilterProduct = new OptionsFilterProduct();
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

    constructor(
        private productCateogryService: CategoryService,
        private productService: ProductService,
        private messageService: MessageService,
        private nodeService: NodeService
    ) {
        this.nodeService.getFiles().then((files) => (this.nodes = files));
        this.optionsFillerProduct.pageIndex = this.pageNumber;
        this.optionsFillerProduct.pageSize = this.pageSize;
    }

    async ngOnInit() {
        this.items = [
            { label: 'Sản phẩm', route: '/products/show' },
            { label: 'Danh sách sản phẩm' },
        ];
        // this.loading = true;
        let response = await this.productService.FilterProduct(
            this.optionsFillerProduct
        );
        let responseGetTreeCategory =
            await this.productCateogryService.getTreeCategory();
        // this.loading = false;
        console.log(responseGetTreeCategory);
        this.treeCategory = responseGetTreeCategory.data;
        this.products = response.data;
        this.totalRecords = response.totalRecordsCount;
        // console.log(b);
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

    saveProduct() {
        this.submitted = true;

        if (this.product.name?.trim()) {
            if (this.product.id) {
                // @ts-ignore
                this.product.inventoryStatus = this.product.inventoryStatus
                    .value
                    ? this.product.inventoryStatus.value
                    : this.product.inventoryStatus;
                this.products[this.findIndexById(this.product.id)] =
                    this.product;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Updated',
                    life: 3000,
                });
            } else {
                this.product.id = this.createId();
                this.product.code = this.createId();
                this.product.image = 'product-placeholder.svg';
                // @ts-ignore
                this.product.inventoryStatus = this.product.inventoryStatus
                    ? this.product.inventoryStatus.value
                    : 'INSTOCK';
                this.products.push(this.product);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Created',
                    life: 3000,
                });
            }

            this.products = [...this.products];
            this.productDialog = false;
            this.product = {};
        }
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

        console.log(this.optionsFillerProduct);
        // this.loading = true;
        await this.productService
            .FilterProduct(this.optionsFillerProduct)
            .then((response) => {
                this.products = response.data;
                this.totalRecords = response.totalRecordsCount;
                //   for (let index = 0; index < this.products.length; index++) {
                //     this.showAllVariants.set(this.products[index].id, this.products[index].productVariants.length > 3 ? 1 : 0);
                //    }
            });
        // this.loading = false;
    }

    checkStartPriceValue() {
        if (this.optionsFillerProduct.StartPrice != null) {
            if (this.optionsFillerProduct.StartPrice < 1000) {
                this.optionsFillerProduct.StartPrice = null;
            }
        }
    }
    checkEndPriceValue() {
        if (this.optionsFillerProduct.EndPrice != null) {
            if (this.optionsFillerProduct.EndPrice < 1000) {
                this.optionsFillerProduct.EndPrice = null;
            }
        }
    }
}
