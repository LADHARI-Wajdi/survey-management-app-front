// import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { RouterModule } from '@angular/router';

// import { CoreModule } from './core/core.module';
// import { LayoutsModule } from './layouts/layouts.module';

// import { AppComponent } from './app.component';

// import { AuthInterceptor } from './core/interceptors/auth.interceptor';
// import { DateFormatPipe } from './shared/pipes/date-format.pipe';
// import { errorInterceptor } from './core/interceptors/error.interceptor';
// import { loaderInterceptor } from './core/interceptors/loader.interceptor';
// import { AppRoutingModule } from './app.routes';


// @NgModule({
//   declarations: [
//     AppComponent,
//     // Ajoute ici tes autres composants globaux si nécessaire
//   ],
//   imports: [
//     BrowserModule,
//     BrowserAnimationsModule,
//     HttpClientModule,
//     FormsModule,
//     ReactiveFormsModule,
//     AppRoutingModule,
//     CoreModule,
//     LayoutsModule,
//     RouterModule
//   ],
//   providers: [
//     { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
//     { provide: HTTP_INTERCEPTORS, useClass:  errorInterceptor, multi: true },
//     { provide: HTTP_INTERCEPTORS, useClass: loaderInterceptor, multi: true },
//     DateFormatPipe
//   ],
//   bootstrap: [AppComponent]
// })
// export class AppModule { }
