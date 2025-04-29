// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Components
import { AppComponent } from './app.component';

// Modules
import { AppRoutingModule } from './app.routes';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { LayoutsModule } from './layouts/layouts.module';

// Interceptors
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

// Services
import { DateFormatPipe } from './shared/pipes/date-format.pipe';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loaderInterceptor } from './core/interceptors/loader.interceptor';

@NgModule({
  declarations: [

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    CoreModule,
    LayoutsModule,
    RouterModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useValue: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useValue: errorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useValue: loaderInterceptor, multi: true },
    DateFormatPipe
  ],

})
export class AppModule { }