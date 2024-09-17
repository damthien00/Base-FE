import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
    model: any[] = [];

    constructor(public layoutService: LayoutService) {}

    ngOnInit() {
        this.model = [
            {
                label: '',
                items: [
                    {
                        label: 'Tổng quan',
                        icon: 'pi pi-fw pi-chart-line',
                        routerLink: ['/'],
                    },
                ],
            },
            {
                label: '',
                items: [
                    {
                        label: 'Sản phẩm',
                        icon: 'pi pi-fw pi-box',
                        items: [
                            {
                                label: 'Sản phẩm',
                                icon: 'pi pi-fw pi-box',
                                routerLink: ['/products/show-product'],
                            },
                            {
                                label: 'Danh mục sản phẩm',
                                icon: 'pi pi-fw pi-tags',
                                routerLink: ['/product-category/show'],
                            },
                            {
                                label: 'Thương hiệu',
                                icon: 'pi pi-fw pi-tags',
                                routerLink: ['/brand/show-brand'],
                            },
                        ],
                    },
                ],
            },
            {
                label: '',
                items: [
                    {
                        label: 'Kho hàng',
                        icon: 'pi pi-fw pi-home',
                        items: [
                            {
                                label: 'Nhập kho',
                                icon: 'pi pi-fw pi-box',
                                routerLink: ['warehouse/stock-in'],
                            },
                            {
                                label: 'Chuyển hàng',
                                icon: 'pi pi-fw pi-truck',
                                routerLink: ['/stock-transfer'],
                            },
                        ],
                    },
                ],
            },
            {
                label: '',
                items: [
                    {
                        label: 'Bảo hành',
                        icon: 'pi pi-fw pi-shield',
                        items: [
                            {
                                label: 'Phiếu bảo hành',
                                icon: 'pi pi-fw pi-file',
                                routerLink: ['/warranty/warranty-certificate'],
                            },
                            {
                                label: 'Yêu cầu bảo hành',
                                icon: 'pi pi-fw pi-inbox',
                                routerLink: ['/warranty/warranty-request'],
                            },
                            {
                                label: 'Chính sách bảo hành',
                                icon: 'pi pi-fw pi-file',
                                routerLink: ['/warranty/warranty-policy'],
                            },
                        ],
                    },
                ],
            },
            {
                label: '',
                items: [
                    {
                        label: 'Chi nhánh',
                        icon: 'pi pi-fw pi-map-marker',
                        routerLink: ['/branch'],
                    },
                ],
            },
            {
                label: '',
                items: [
                    {
                        label: 'Bán tại quầy',
                        icon: 'pi pi-fw pi-shopping-cart',
                        items: [
                            {
                                label: 'Bán hàng',
                                icon: 'pi pi-fw pi-shopping-cart',
                                routerLink: ['/landing'],
                            },
                            {
                                label: 'Hóa đơn',
                                icon: 'pi pi-fw pi-file',
                            },
                        ],
                    },
                ],
            },
            {
                label: '',
                items: [
                    {
                        label: 'Quản trị hệ thống',
                        icon: 'pi pi-fw pi-users',
                        items: [
                            {
                                label: 'Nhóm quyền',
                                icon: 'pi pi-fw pi-circle',
                                
                            },
                            {
                                label: 'Quản lý tài khoản',
                                icon: 'pi pi-fw pi-circle',
                                routerLink: ['/user/show-user'],
                            }
                        ],
                    },
                ],
            }
        ];
    }
}
