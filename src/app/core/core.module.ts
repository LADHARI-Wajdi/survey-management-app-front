// core/core.module.ts
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { SurveyAccessGuard } from './guards/survey-access.guard';

// Services
import { ApiService } from './services/api.service';
import { LoaderService } from './services/loader.service';
import { NotificationService } from './services/notification.service';
import { ThemeService } from './services/theme.service';
import { LoggerService } from './services/logger.service';

// Auth services
import { AuthService } from './authentication/services/auth.service';
import { TokenService } from './authentication/services/token.service';

// Interceptors
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { LoaderInterceptor } from './interceptors/loader.interceptor';
import { AuthenticationModule } from './authentication/authentication.module';
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AuthenticationModule
  ],
  providers: [
    // Services
    ApiService,
    LoaderService,
    NotificationService,
    ThemeService,
    LoggerService,
    AuthService,
    TokenService,

    // Guards
    AuthGuard,
    RoleGuard,
    SurveyAccessGuard,
  ],
  exports: [
    // Modules that should be available everywhere
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AuthenticationModule
  ],
})
export class CoreModule { 
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only.'
      );
    }
  }
}

