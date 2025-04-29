import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AnalyticsDashboardComponent } from './components/analytics-dashboard/analytics-dashboard.component';
import { LineChartComponent } from './components/chart-components/line-chart/line-chart.component';
import { BarChartComponent } from './components/chart-components/bar-chart/bar-chart.component';
import { PieChartComponent } from './components/chart-components/pie-chart/pie-chart.component';

import { AnalyticsRoutingModule } from './analytics-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    AnalyticsRoutingModule,
    AnalyticsDashboardComponent,
    LineChartComponent,
    BarChartComponent,
    PieChartComponent
  ],
  exports: [
    AnalyticsDashboardComponent,
    LineChartComponent,
    BarChartComponent,
    PieChartComponent
  ]
})
export class AnalyticsModule { }