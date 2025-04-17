// core/authentication/reset-password/reset-password.component.ts
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  resetpassword: FormGroup = new FormGroup({});
  loading = false;
  submitted = false;
  token: string;
  error = '';
  resetSuccess = false;
  resetPasswordForm: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    // Get token from URL
    this.token = this.route.snapshot.queryParams['token'] || '';

    // If no token, redirect to forgot password
    if (!this.token) {
      this.router.navigate(['/auth/forgot-password']);
    }
  }

  ngOnInit() {
    this.resetPasswordForm = this.formBuilder.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            this.passwordStrengthValidator,
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.resetPasswordForm?.controls;
  }

  // Custom validator for password strength
  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value || '';

    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]+/.test(value);
    const hasLowerCase = /[a-z]+/.test(value);
    const hasNumeric = /[0-9]+/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);

    const passwordValid =
      hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;

    return !passwordValid ? { weakPassword: true } : null;
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      return null;
    }
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (!this.resetPasswordForm || this.resetPasswordForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.resetPassword(this.token, this.resetPasswordForm?.get('password')?.value).subscribe(
      (response) => {
        this.loading = false;
        this.resetSuccess = true;
        this.notificationService.success(
          'Votre mot de passe a été réinitialisé avec succès.'
        );
      },
      (error) => {
        this.error =
          error.message ||
          'Une erreur est survenue lors de la réinitialisation du mot de passe.';
        this.loading = false;
      }
    );
  }

  navigateToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
