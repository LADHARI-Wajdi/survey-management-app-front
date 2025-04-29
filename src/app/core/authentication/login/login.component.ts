// core/authentication/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string = '/';
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    // redirect to appropriate dashboard if already logged in
    if (this.authService.currentUserValue) {
      this.authService.redirectByRole();
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false],
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService
      .login({
        email: this.f['email'].value,
        password: this.f['password'].value,
      })
      .subscribe({
        next: (data) => {
          // If remember me is checked, store user info
          if (this.f['rememberMe'].value) {
            localStorage.setItem('rememberUser', this.f['email'].value);
          } else {
            localStorage.removeItem('rememberUser');
          }
          
          // Rediriger l'utilisateur en fonction de son rôle
          this.authService.redirectByRole(this.returnUrl);
        },
        error: (error) => {
          this.error = error.error?.message || 'Identifiants invalides';
          this.loading = false;
        }
      });
  }

  forgotPassword() {
    this.router.navigate(['/auth/forgot-password']);
  }
}