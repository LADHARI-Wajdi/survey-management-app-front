import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppComponent } from "./app.component";
import { ForgotPasswordComponent } from "./core/authentication/forgot-password/forgot-password.component";
import { LoginComponent } from "./core/authentication/login/login.component";
import { RegisterComponent } from "./core/authentication/register/register.component";
import { ResetPasswordComponent } from "./core/authentication/reset-password/reset-password.component";
import { AuthLayoutComponent } from "./layouts/auth-layout/auth-layout.component";
import { MainLayoutComponent } from "./layouts/main-layout/main-layout.component";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app.routes";
import { CoreModule } from "./core/core.module";
import { SharedModule } from "./shared/shared.module";
import { RouterModule } from "@angular/router";
import { DateFormatPipe } from "./shared/pipes/date-format.pipe";
import { NgModule } from "@angular/core";
import { LayoutsModule } from "./layouts/layouts.module";
import { AuthInterceptor } from "./core/interceptors/auth.interceptor";
import { ErrorInterceptor } from "./core/interceptors/error.interceptor";
import { LoaderInterceptor } from "./core/interceptors/loader.interceptor";
@NgModule({

    imports: [
      BrowserModule,
      BrowserAnimationsModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      AppRoutingModule,
      CoreModule,
      RouterModule 
    ],
    providers: [
      { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
      { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
      { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
      DateFormatPipe // Ajouter pour les problèmes de pipe
    ],

  })
  export class AppModule { }