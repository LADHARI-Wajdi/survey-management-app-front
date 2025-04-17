// core/authentication/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginform: FormGroup = new FormGroup({});
  loading = false;
  submitted = false;
  returnUrl: string | undefined;
  error = '';
  loginForm: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.loginform = this.formBuilder.group({
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
        email: this.f.email.value,
        password: this.f.password.value,
      })
      .subscribe(
        (data) => {
          // If remember me is checked, store user info
          if (this.f.rememberMe.value) {
            localStorage.setItem('rememberUser', this.f.email.value);
          } else {
            localStorage.removeItem('rememberUser');
          }
          this.router.navigate([this.returnUrl]);
        },
        (error) => {
          this.error = error.error?.message || 'Invalid credentials';
          this.loading = false;
        }
      );
  }

  forgotPassword() {
    this.router.navigate(['/auth/forgot-password']);
  }
}
