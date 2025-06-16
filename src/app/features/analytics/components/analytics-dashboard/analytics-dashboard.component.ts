import { Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AnalyticsService } from '../../services/analytics.service';
import { BarChartComponent } from '../chart-components/bar-chart/bar-chart.component';
import { PieChartComponent } from '../chart-components/pie-chart/pie-chart.component';
import { BubbleDataPoint, ChartData, ChartDataset, ChartTypeRegistry, Point } from 'chart.js';
import { LineChartComponent } from '../chart-components/line-chart/line-chart.component';
import { TimeRange } from '../../models/analytics-data.model';

@Component({
  selector: 'app-analytics-dashboard',
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    LineChartComponent,
    BarChartComponent,
    PieChartComponent
  ]

})
export class AnalyticsDashboardComponent implements OnInit, OnDestroy {
  // Chart data properties
  responsesOverTimeData: ChartData<keyof ChartTypeRegistry, (number | [number, number] | Point | BubbleDataPoint | null)[], unknown> | null = null;
  completionRateData: ChartData | null = null;
  questionDistributionData: ChartData | null = null;
  avgTimeToCompleteData: ChartData | null = null;
  deviceBreakdownData: ChartData | null = null;
  userDemographicsData: ChartData | null = null;
  
  // Time range filter
  selectedTimeRange: TimeRange = TimeRange.LAST_30_DAYS;
  
  // Loading states
  isLoading = true;
  hasError = false;
  errorMessage = '';
  
  // Dashboard stats
  totalSurveys = 0;
  totalResponses = 0;
  averageCompletionRate = 0;
  averageTimeToComplete = 0;
  
  // Time range options
  timeRangeOptions = [
    { value: TimeRange.LAST_7_DAYS, label: 'Last 7 Days' },
    { value: TimeRange.LAST_30_DAYS, label: 'Last 30 Days' },
    { value: TimeRange.LAST_90_DAYS, label: 'Last 90 Days' },
    { value: TimeRange.LAST_12_MONTHS, label: 'Last 12 Months' },
    { value: TimeRange.ALL_TIME, label: 'All Time' }
  ];
  
  private destroy$ = new Subject<void>();
  
  constructor(private analyticsService: AnalyticsService) {}
  
  ngOnInit(): void {
    this.loadDashboardData();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  loadDashboardData(): void {
    this.isLoading = true;
    this.hasError = false;
    
    // Load dashboard stats
    this.analyticsService.getDashboardStats(this.selectedTimeRange)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats) => {
          this.totalSurveys = stats.totalSurveys;
          this.totalResponses = stats.totalResponses;
          this.averageCompletionRate = stats.averageCompletionRate;
          this.averageTimeToComplete = stats.averageTimeToComplete;
        },
        error: (error) => {
          console.error('Error loading dashboard stats', error);
          this.hasError = true;
          this.errorMessage = 'Failed to load dashboard statistics.';
        }
      });
    
    // Load chart data
    this.loadChartData();
  }
  
  loadChartData(): void {
    // Load responses over time chart
    this.analyticsService.getResponsesOverTime(this.selectedTimeRange)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: ChartData<keyof ChartTypeRegistry, (number | [number, number] | Point | BubbleDataPoint | null)[], unknown> | null) => {
          this.responsesOverTimeData = data;
        },
        error: (error: any) => {
          console.error('Error loading responses over time chart', error);
          this.hasError = true;
          this.errorMessage = 'Failed to load chart data.';
        }
      });
    
    // Load completion rate chart
    this.analyticsService.getCompletionRate(this.selectedTimeRange)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: ChartData<keyof ChartTypeRegistry, (number | [number, number] | Point | BubbleDataPoint | null)[], unknown> | null) => {
          this.completionRateData = data;
        },
        error: (error: any) => {
          console.error('Error loading completion rate chart', error);
        }
      });
    
    // Load question distribution chart
    this.analyticsService.getQuestionDistribution(this.selectedTimeRange)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: ChartData<keyof ChartTypeRegistry, (number | [number, number] | Point | BubbleDataPoint | null)[], unknown> | null) => {
          this.questionDistributionData = data;
        },
        error: (error: any) => {
          console.error('Error loading question distribution chart', error);
        }
      });
    
    // Load average time to complete chart
    this.analyticsService.getAvgTimeToComplete(this.selectedTimeRange)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: ChartData<keyof ChartTypeRegistry, (number | [number, number] | Point | BubbleDataPoint | null)[], unknown> | null) => {
          this.avgTimeToCompleteData = data;
        },
        error: (error: any) => {
          console.error('Error loading time to complete chart', error);
        }
      });
    
    // Load device breakdown chart
    this.analyticsService.getDeviceBreakdown(this.selectedTimeRange)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: ChartData<keyof ChartTypeRegistry, (number | [number, number] | Point | BubbleDataPoint | null)[], unknown> | null) => {
          this.deviceBreakdownData = data;
        },
        error: (error: any) => {
          console.error('Error loading device breakdown chart', error);
        }
      });
    
    // Load user demographics chart
    this.analyticsService.getUserDemographics(this.selectedTimeRange)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: ChartData<keyof ChartTypeRegistry, (number | [number, number] | Point | BubbleDataPoint | null)[], unknown> | null) => {
          this.userDemographicsData = data;
        },
        error: (error: any) => {
          console.error('Error loading user demographics chart', error);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }
  
  onTimeRangeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedTimeRange = selectElement.value as unknown as TimeRange;
    this.loadDashboardData();
  }
  
  refreshData(): void {
    this.loadDashboardData();
  }
  
  formatTime(minutes: number): string {
    if (minutes < 60) {
      return `${Math.round(minutes)} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = Math.round(minutes % 60);
      return `${hours} h ${remainingMinutes} min`;
    }
  }
  
  formatPercentage(value: number): string {
    return `${Math.round(value)}%`;
  }
}