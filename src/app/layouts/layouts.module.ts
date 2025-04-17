// src/app/layouts/layout.module.ts (créez-le si nécessaire)
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { Component } from '@angular/core';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout/main-layout.component.html',
  styleUrls: ['./main-layout/main-layout.component.css'],
})
export class MainLayoutComponent {
[x: string]: any;
}

@NgModule({
  imports: [CommonModule, RouterModule, SharedModule],

})
export class LayoutsModule {}
