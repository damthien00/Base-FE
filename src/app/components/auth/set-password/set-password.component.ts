import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import roleConstant from 'src/app/core/constants/role.constant';
import { Page } from 'src/app/core/enums/page.enum';
import { AuthService } from 'src/app/core/services/auth.service';
import { ValidationService } from 'src/app/core/utils/validation.utils';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    selector: 'app-set-password',
    templateUrl: './set-password.component.html',
    styleUrl: './set-password.component.scss'
})
export class SetPasswordComponent {
    valCheck: string[] = ['rememberMe'];
    messages: any[] = [];
    password!: string;
    resetPasswordForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private validationService: ValidationService,
        public layoutService: LayoutService,
        private authService: AuthService,
        private router: Router,
        private messageService: MessageService
    ) {
        this.resetPasswordForm = this.formBuilder.group(
            {
                email: [
                    null,
                    [
                        Validators.required,
                        Validators.pattern(
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
                        ),
                    ],
                ],
                newPassword: [null, [Validators.required]],
                confirmPassword: [null, [Validators.required]],
                otp: [null, [Validators.required]],
            },
            { validator: this.passwordMatchValidator }
        );
    }

    passwordMatchValidator(form: FormGroup) {
        const newPassword = form.get('newPassword')?.value;
        const confirmPassword = form.get('confirmPassword')?.value;

        return newPassword === confirmPassword ? null : { passwordMismatch: true };
    }

    onSubmit() {
        if (this.resetPasswordForm.invalid) {
            this.resetPasswordForm.markAllAsTouched();
            return;
        }

        const formData = this.resetPasswordForm.value;

        this.authService.setPassword(formData).subscribe({
            next: (response) => {
                // Handle success, show a PrimeNG success message

                if (response.status === false) {
                    this.messages = [];
                    this.messages.push({
                        severity: 'error',
                        summary: '',
                        detail: response.message,
                        life: 3000,
                    });
                } else {
                    // Handle success, show a PrimeNG success message
                    this.messages = [];
                    this.messages.push({
                        severity: 'success',
                        summary: '',
                        detail: 'Mật khẩu đã được thiết lập thành công!',
                        life: 3000,
                    });
                }
            },
            error: (err) => {
                // Handle error, show a PrimeNG error message
                this.messages = [];
                this.messages.push({
                    severity: 'error',
                    summary: '',
                    detail: 'Có lỗi xảy ra. Vui lòng kiểm tra lại thông tin.',
                    life: 3000,
                });
            }
        });
    }
}
