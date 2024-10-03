import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { AuthService } from '../core/services/auth.service';
import { RefreshTokenService } from '../core/signlrs/refresh-token.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    providers: [MessageService],
})
export class AppMenuComponent implements OnInit {
    model: any[] = [];
    authToken: any = null;

    constructor(
        public layoutService: LayoutService,
        private refreshTokenService: RefreshTokenService,
        private authService: AuthService,
        private messageService: MessageService
    ) {
        this.authToken = this.authService.getAuthTokenLocalStorage();
    }

    ngOnInit() {
        this.refreshTokenService.startConnection();
        this.refreshTokenService.addActivityListener((activity) => {
            if (activity != null) {
                this.authService
                    .refreshToken({ refreshToken: this.authToken.refreshToken })
                    .subscribe((res) => {
                        if (res.status == true) {
                            this.messageService.add({
                                severity: 'warn',
                                summary: 'Cảnh báo',
                                detail: 'Bạn đã ',
                            });
                        }
                    });
            }
        });
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
                        label: 'Nhà cung cấp',
                        icon: 'pi pi-fw pi-box',
                        routerLink: ['/pages/supplier/show-supplier'],
                    },
                ],
            },
            {
                label: '',
                items: [
                    {
                        label: 'Khách hàng',
                        icon: 'pi pi-fw pi-user-plus',
                        routerLink: ['/pages/customer/show-customer'],
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
                            {
                                label: 'Tra cứu bảo hành',
                                icon: 'pi pi-fw pi-file',
                                routerLink: ['/warranty-lookup'],
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

            {
                label: '',
                items: [
                    {
                        label: 'Kích hoạt bảo hành',
                        icon: 'pi pi-fw pi-map-marker',
                        routerLink: ['/warranty-mb'],
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
                                routerLink: [
                                    '/pages/group-right/show-group-right',
                                ],
                            },
                            {
                                label: 'Quản lý tài khoản',
                                icon: 'pi pi-fw pi-circle',
                                routerLink: ['/pages/user/show-user'],
                            },
                        ],
                    },
                ],
            },
        ];
    }
}
