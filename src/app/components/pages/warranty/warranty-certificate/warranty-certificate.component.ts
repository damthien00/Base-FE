import { WarrantyService } from 'src/app/core/services/warranty.service';
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
import { OptionsFilterWarranty } from 'src/app/core/DTOs/warranty/optionFilterWarranty';
import { an, dA } from '@fullcalendar/core/internal-common';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';

const warrantyOrders = [
    {
        id: 1,
        code: 'PBH001',
        customerName: 'Bùi Thị Bảo Anh',
        phoneNumber: '0973952732 - 0915317043',
        productName: 'Máy cắt cỏ trục băm (Quạt cỏ) Honda TL662',
        serialNumber: 'LI42T5008',
        orderCode: 'DH0001',
        expiryDate: '09/12/2024 23:59',
        details: {
            barcode: '4511413404133',
            productName: 'Máy cắt cỏ trục băm (Quạt cỏ) Honda TL662',
            customerName: 'Bùi Thị Bảo Anh',
            orderDate: '09/01/2024',
            branch: 'Chi nhánh Yên Mỹ',
            warrantyPolicy: 'Bảo hành 12 tháng',
            warrantyDuration: '12 tháng',
            warrantyExpiryDate: '09/12/2024 23:59',
            quantity: 1,
        },
    },
];

// Cấu trúc dữ liệu giả
interface WarrantyOrder {
    id: number;
    code: string;
    customerName: string;
    phoneNumber: string;
    productName: string;
    serialNumber: string;
    orderCode: string;
    expiryDate: string;
    details: WarrantyOrderDetails;
}

interface WarrantyOrderDetails {
    barcode: string;
    productName: string;
    customerName: string;
    orderDate: string;
    branch: string;
    warrantyPolicy: string;
    warrantyDuration: string;
    warrantyExpiryDate: string;
    quantity: number;
}

@Component({
    selector: 'app-warranty-certificate',
    templateUrl: './warranty-certificate.component.html',
    styleUrls: ['./warranty-certificate.component.css'],
    providers: [MessageService],
})
export class WarrantyCertificateComponent implements OnInit {
    optionsFilterWarranty: OptionsFilterWarranty = new OptionsFilterWarranty();
    warrantyOrders: WarrantyOrder[] = warrantyOrders;
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

    totalRecords = 20;
    treeCategory: any[] = [];
    warranties: any[] = [];
    pageSize: number = 10;
    pageNumber: number = 1;
    totalRecordsCount: any;
    isLoading: boolean = true;
    warrantyInfos: any;
    userCurrent: any;
    constructor(
        private productCateogryService: CategoryService,
        private productService: ProductService,
        private messageService: MessageService,
        private warrantyService: WarrantyService,
        private authService: AuthService,
        private nodeService: NodeService,
        private router: Router
    ) {
        this.nodeService.getFiles().then((files) => (this.nodes = files));
        this.authService.userCurrent.subscribe((user) => {
            this.userCurrent = user;
            console.log(this.userCurrent);
        });

        this.loadWarranty();
    }

    async ngOnInit() {
        this.items = [{ label: 'Danh sách phiếu bảo hành' }];
    }

    loadWarranty() {
        if (this.userCurrent.branchId != 1) {
            this.optionsFilterWarranty.BranchId = this.userCurrent.branchId;
        }
        if (this.optionsFilterWarranty.CustomerKeyword === '') {
            this.optionsFilterWarranty.CustomerKeyword = null;
        }

        if (!this.optionsFilterWarranty.Imei) {
            // If Imei is null, undefined, or an empty string, reset other properties
            this.optionsFilterWarranty.Imei = null;
            this.optionsFilterWarranty.FrameNumber = null;
            this.optionsFilterWarranty.EngineNumber = null;
        } else {
            // If Imei has a value, proceed with splitting
            const imeiParts = this.optionsFilterWarranty.Imei.split('-');
            this.optionsFilterWarranty.FrameNumber = imeiParts[0] || null;
            this.optionsFilterWarranty.EngineNumber = imeiParts[1] || null;
        }

        if (this.optionsFilterWarranty.ProductName === '') {
            this.optionsFilterWarranty.ProductName = null;
        }
        this.optionsFilterWarranty.pageIndex = this.pageNumber;
        this.optionsFilterWarranty.pageSize = this.pageSize;
        this.warrantyService
            .getWarranties(this.optionsFilterWarranty)
            .subscribe((data) => {
                this.totalRecordsCount = data.data.totalRecords;
                this.warranties = data.data.items;
            });
    }

    // warrantyRequest(data: any) {
    //     // const formData = new FormData();
    //     // formData.append('Code', '');
    //     // formData.append('CustomerId', data.customer.id.toString());
    //     // formData.append('CustomerName', data.customer.name);
    //     // formData.append('PhoneNumber', data.customer.phoneNumber);
    //     // formData.append('BranchId', this.userCurrent.branchId);
    //     // formData.append('BranchName', this.userCurrent.branchName);
    //     // formData.append('TotalQuantity', '1');
    //     // this.warrantyInfos = {
    //     //     id: data.id,
    //     //     dueDate: '',
    //     // };

    //     // const warrantyInfosJson = JSON.stringify(this.warrantyInfos);
    //     // formData.append('WarrantyInfos', warrantyInfosJson);

    //     // this.warrantyService.createWarrantyClaim(formData).subscribe(
    //     //     (item) => {
    //     //         this.messageService.add({
    //     //             severity: 'success',
    //     //             summary: 'Thành công',
    //     //             detail: 'Tạo phiếu bảo hành hàng lỗi thành công',
    //     //         });
    //     //     },
    //     //     (error) => {
    //     //         console.error('Error:', error);
    //     //     }
    //     // );

    //     this.router.navigate(['/pages/warranty/warranty-request/create']);
    // }

    warrantyRequest(data: any) {
        // Chuyển đổi dữ liệu cần lưu thành JSON string và lưu vào localStorage
        // const warrantyData = {
        //     code: '',
        //     customerId: data.customer.id.toString(),
        //     customerName: data.customer.name,
        //     phoneNumber: data.customer.phoneNumber,
        //     branchId: this.userCurrent.branchId,
        //     branchName: this.userCurrent.branchName,
        //     totalQuantity: '1',
        //     warrantyInfos: {
        //         id: data.id,
        //         dueDate: '',
        //     },
        // };

        // Lưu dữ liệu vào localStorage
        localStorage.setItem('warrantyRequestData', JSON.stringify(data));

        // Điều hướng đến trang khác
        this.router.navigate(['/pages/warranty/warranty-request/create']);
    }

    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
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

    // saveProduct() {
    //     this.submitted = true;

    //     if (this.product.name?.trim()) {
    //         if (this.product.id) {
    //             // @ts-ignore
    //             this.product.inventoryStatus = this.product.inventoryStatus
    //                 .value
    //                 ? this.product.inventoryStatus.value
    //                 : this.product.inventoryStatus;
    //             this.products[this.findIndexById(this.product.id)] =
    //                 this.product;
    //             this.messageService.add({
    //                 severity: 'success',
    //                 summary: 'Successful',
    //                 detail: 'Product Updated',
    //                 life: 3000,
    //             });
    //         } else {
    //             this.product.id = this.createId();
    //             this.product.code = this.createId();
    //             this.product.image = 'product-placeholder.svg';
    //             // @ts-ignore
    //             this.product.inventoryStatus = this.product.inventoryStatus
    //                 ? this.product.inventoryStatus.value
    //                 : 'INSTOCK';
    //             this.products.push(this.product);
    //             this.messageService.add({
    //                 severity: 'success',
    //                 summary: 'Successful',
    //                 detail: 'Product Created',
    //                 life: 3000,
    //             });
    //         }

    //         this.products = [...this.products];
    //         this.productDialog = false;
    //         this.product = {};
    //     }
    // }

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

    //Paganation
    onPageChange(event: any): void {
        this.pageSize = event.rows;
        this.pageNumber = event.page + 1;
        this.loadWarranty();
    }

    goToPreviousPage(): void {
        if (this.pageNumber > 1) {
            this.pageNumber--;
            this.loadWarranty();
        }
    }

    goToNextPage(): void {
        const lastPage = Math.ceil(this.totalRecordsCount / this.pageSize);
        if (this.pageNumber < lastPage) {
            this.pageNumber++;
            this.loadWarranty();
        }
    }
}
