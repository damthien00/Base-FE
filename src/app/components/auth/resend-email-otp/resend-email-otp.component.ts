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
  selector: 'app-resend-email-otp',
  templateUrl: './resend-email-otp.component.html',
  styleUrl: './resend-email-otp.component.scss',
  providers: [MessageService]
})
export class ResendEmailOtpComponent {
  messages: any[] = []; 
  loginForm: FormGroup;
  otpSent: boolean = false; 

  constructor(
      private formBuilder: FormBuilder,
      private validationService: ValidationService,
      public layoutService: LayoutService,
      private authService: AuthService,
      private router: Router,
      private messageService: MessageService
  ) {
      this.loginForm = this.formBuilder.group({
          email: [
              null,
              [
                  Validators.required,
                  Validators.email,
                  Validators.pattern(
                      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
                  ),
              ],
          ]
      });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const email = this.loginForm.get('email')?.value;

    this.authService.resendEmailOtp(email).subscribe(
      (response) => {
        this.messages = []; 
        this.messages.push({
          severity: 'success',
          summary: '',
          detail: 'Mã OTP đã được gửi đến Email của bạn.'
        });
        this.otpSent = true;
      },
      (error) => {
        this.messages = []; 
        this.messages.push({
          severity: 'error',
          summary: '',
          detail: 'Lấy mã OTP thất bại.',
        });
        this.otpSent = false;
      }
    );
  }

  navigateToSetPassword() {
    this.router.navigate(['/auth/set-password']);
  }
}
