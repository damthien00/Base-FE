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
                        routerLink: ['/dashboard'],
                    },
                ],
            },
            // {
            //     label: '',
            //     icon: 'pi pi-fw pi-user',
            //     items: [
            //         {
            //             label: 'Login',
            //             icon: 'pi pi-fw pi-sign-in',
            //             routerLink: ['/auth/login'],
            //         },
            //         {
            //             label: 'Error',
            //             icon: 'pi pi-fw pi-times-circle',
            //             routerLink: ['/auth/error'],
            //         },
            //         {
            //             label: 'Access Denied',
            //             icon: 'pi pi-fw pi-lock',
            //             routerLink: ['/auth/access'],
            //         },
            //     ],
            // },
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
                                routerLink: ['/pages/products/show-product'],
                            },
                            {
                                label: 'Danh mục sản phẩm',
                                icon: 'pi pi-fw pi-tags',
                                routerLink: ['/pages/product-category/show'],
                            },
                            {
                                label: 'Thương hiệu',
                                icon: 'pi pi-fw pi-tags',
                                routerLink: ['/pages/brand/show-brand'],
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
                                routerLink: ['/pages/warehouse/stock-in'],
                            },
                            {
                                label: 'Chuyển hàng',
                                icon: 'pi pi-fw pi-truck',
                                routerLink: ['/pages/stock-transfer'],
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
                                routerLink: [
                                    '/pages/warranty/warranty-certificate',
                                ],
                            },
                            {
                                label: 'Yêu cầu bảo hành',
                                icon: 'pi pi-fw pi-inbox',
                                routerLink: [
                                    '/pages/warranty/warranty-request',
                                ],
                            },
                            {
                                label: 'Chính sách bảo hành',
                                icon: 'pi pi-fw pi-file',
                                routerLink: ['/pages/warranty/warranty-policy'],
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
                        routerLink: ['/pages/branch'],
                    },
                ],
            },
            // {
            //     label: '',
            //     items: [
            //         {
            //             label: 'Bán tại quầy',
            //             icon: 'pi pi-fw pi-shopping-cart',
            //             items: [
            //                 {
            //                     label: 'Bán hàng',
            //                     icon: 'pi pi-fw pi-shopping-cart',
            //                     routerLink: ['/pages/landing'],
            //                 },
            //                 {
            //                     label: 'Hóa đơn',
            //                     icon: 'pi pi-fw pi-file',
            //                 },
            //             ],
            //         },
            //     ],
            // },
        ];
    }
}
