// src/app/layouts/layouts.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';

@NgModule({

  imports: [
    CommonModule,
    RouterModule,
    
    MainLayoutComponent,
    AdminLayoutComponent, 
    AuthLayoutComponent,
    
  ],

})
export class LayoutsModule { }