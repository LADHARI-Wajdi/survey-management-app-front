import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BubbleDataPoint, ChartData, ChartTypeRegistry, Point } from 'chart.js';
import { LineChartComponent } from '../line-chart/line-chart.component';
import { BarChartComponent } from '../bar-chart/bar-chart.component';
import { PieChartComponent } from '../pie-chart/pie-chart.component';
import { TimeRange } from '../../../models/analytics-data.model';
import { AnalyticsService } from '../../../services/analytics.service';



@Component({
  selector: 'app-custom-chart',
  standalone: true,
  imports: [
    CommonModule,
    LineChartComponent,
    BarChartComponent,
    PieChartComponent
  ],
  template: `
    <div class="custom-chart-container">
      <div class="chart-header">
        <h2>{{ chartTitle }}</h2>
        <div class="chart-actions">
          <button class="btn btn-sm btn-icon" (click)="refreshChart()" title="Refresh Chart">
            <i class="fas fa-sync-alt"></i>
          </button>
        </div>
      </div>
      
      <div class="chart-body">
        <div class="loading-spinner" *ngIf="isLoading">
          <div class="spinner-border text-primary" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
        
        <div class="error-message" *ngIf="error">
          <i class="fas fa-exclamation-triangle"></i>
          <span>{{ error }}</span>
        </div>
        
        <ng-container *ngIf="!isLoading && !error">
          <app-bar-chart 
            *ngIf="chartType === 'bar'" 
            [data]="chartData"
            [height]="height"
          ></app-bar-chart>
          
          <app-line-chart 
            *ngIf="chartType === 'line'" 
            [data]="chartData"
            [height]="height"
          ></app-line-chart>
          
          <app-pie-chart 
            *ngIf="chartType === 'pie' || chartType === 'doughnut'" 
            [data]="chartData"
            [height]="height"
          ></app-pie-chart>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .custom-chart-container {
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }
    
    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .chart-header h2 {
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0;
      color: #333;
    }
    
    .chart-actions .btn-icon {
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background-color: transparent;
      border: none;
      color: #6c757d;
    }
    
    .chart-actions .btn-icon:hover {
      background-color: #f8f9fa;
    }
    
    .chart-body {
      padding: 1.5rem;
      min-height: 250px;
    }
    
    .loading-spinner, .error-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 200px;
      color: #6c757d;
      text-align: center;
    }
    
    .error-message {
      color: #dc3545;
    }
    
    .error-message i {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }
  `]
})
export class CustomChartComponent implements OnInit, OnDestroy {
  @Input() chartId: string = '';
  @Input() chartType: 'bar' | 'line' | 'pie' | 'doughnut' = 'bar';
  @Input() chartTitle: string = 'Chart';
  @Input() height: number = 300;
  @Input() timeRange: TimeRange = TimeRange.LAST_30_DAYS;
  
  chartData: ChartData | null = null;
  isLoading: boolean = true;
  error: string | null = null;
  
  private destroy$ = new Subject<void>();
  
  constructor(@Inject(AnalyticsService) private analyticsService: AnalyticsService) {}
  
  ngOnInit(): void {
    this.loadChartData();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  loadChartData(): void {
    this.isLoading = true;
    this.error = null;
    
    this.analyticsService.getChartData(this.chartId, this.timeRange)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: ChartData<keyof ChartTypeRegistry, (number | [number, number] | Point | BubbleDataPoint | null)[], unknown> | null) => {
          this.chartData = data;
          this.isLoading = false;
        },
        error: (err: any) => {
          this.error = 'Failed to load chart data';
          this.isLoading = false;
          console.error('Error loading chart data:', err);
        }
      });
  }
  
  refreshChart(): void {
    this.loadChartData();
  }
}

function Inject(AnalyticsService: any): (target: typeof CustomChartComponent, propertyKey: undefined, parameterIndex: 0) => void {
  throw new Error('Function not implemented.');
}
