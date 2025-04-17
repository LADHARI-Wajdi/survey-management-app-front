// core/authentication/forgot-password/forgot-password.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotpasswordForm: FormGroup = new FormGroup({});
  loading = false;
  submitted = false;
  emailSent = false;
  error = '';
  forgotPasswordForm: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.forgotPasswordForm!.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.forgotPasswordForm!.invalid) {
      return;
    }

    this.loading = true;
    this.authService.forgotPassword(this.f['email'].value).subscribe(
      () => {
        this.emailSent = true;
        this.notificationService.success(
          'Un email contenant les instructions pour réinitialiser votre mot de passe a été envoyé à votre adresse email.'
        );
      },
      (error) => {
        this.error =
          error.message ||
          'Une erreur est survenue. Veuillez réessayer plus tard.';
        this.loading = false;
      }
    );
  }

  backToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
