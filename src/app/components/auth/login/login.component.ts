import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import roleConstant from 'src/app/core/constants/role.constant';
import { Page } from 'src/app/core/enums/page.enum';
import { AuthService } from 'src/app/core/services/auth.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `],
    providers: [MessageService],

})
export class LoginComponent {

    valCheck: string[] = ['rememberMe'];

    password!: string;

    loginRequest = {
        email: '',
        password: '',
        rememberMe: false
    }

    constructor(public layoutService: LayoutService, private authService: AuthService, private router: Router, private messageService: MessageService) { }

    handleLogin() {
        this.authService.login(this.loginRequest).subscribe(res => {
            if (res.status == true) {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Đăng nhập thành công',
                });
                this.authService.setAuthTokenLocalStorage(res.data);
                this.authService.fetchUserCurrent().subscribe(
                    (data) => {
                        this.authService.setUserCurrent(data.data);

                        if (this.authService.hasRoleAsync(data.data, roleConstant.admin)) {
                            this.router.navigate([Page.Dashboard]);

                        }
                        else {
                            this.messageService.add({
                                severity: 'warning',
                                summary: 'Cảnh báo',
                                detail: 'Bạn không có quyền',
                            });
                        }
                    }

                )
                this.router.navigate(['/'])
            }
            else {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Thất bại',
                    detail: res.message,
                });
            }
        })
    }
}
