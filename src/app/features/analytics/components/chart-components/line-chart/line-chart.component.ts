import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container" [style.height.px]="height">
      <div class="loading-spinner" *ngIf="isLoading">
        <div class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      
      <div class="error-message" *ngIf="error">
        <i class="fas fa-exclamation-triangle"></i>
        <span>{{ error }}</span>
      </div>
      
      <div class="no-data-message" *ngIf="!isLoading && (!data || !hasData())">
        No data available to display
      </div>
      
      <canvas 
        #chartCanvas
        [hidden]="isLoading || !data || !hasData()"
      ></canvas>
    </div>
  `,
  styles: [`
    .chart-container {
      position: relative;
      width: 100%;
    }
    
    .loading-spinner, .error-message, .no-data-message {
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
export class LineChartComponent implements OnInit, OnChanges {
  @Input() data: ChartData | null = null;
  @Input() options: ChartOptions | null = null;
  @Input() height: number = 300;
  @Input() isLoading: boolean = false;
  
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  
  chart: Chart | null = null;
  error: string | null = null;
  
  constructor() {}
  
  ngOnInit(): void {
    // Initialization will happen in ngAfterViewInit or ngOnChanges
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.chartCanvas && this.chartCanvas.nativeElement) {
      this.renderChart();
    }
  }
  
  ngAfterViewInit(): void {
    if (this.data && this.chartCanvas && this.chartCanvas.nativeElement) {
      this.renderChart();
    }
  }
  
  hasData(): boolean {
    if (!this.data || !this.data.datasets) {
      return false;
    }
    
    // Check if any dataset has data
    return this.data.datasets.some(dataset => 
      dataset.data && Array.isArray(dataset.data) && dataset.data.length > 0);
  }
  
  renderChart(): void {
    if (!this.data || !this.chartCanvas || !this.chartCanvas.nativeElement) {
      return;
    }
    
    try {
      // Destroy existing chart if it exists
      if (this.chart) {
        this.chart.destroy();
      }
      
      const ctx = this.chartCanvas.nativeElement.getContext('2d');
      if (!ctx) {
        this.error = 'Unable to get canvas context';
        return;
      }
      
      // Default options for line chart
      const defaultOptions: ChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
            }
          },
          x: {
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
            }
          }
        },
        elements: {
          line: {
            tension: 0.4
          },
          point: {
            radius: 4,
            hoverRadius: 6
          }
        }
      };
      
      // Merge with custom options if provided
      const chartOptions = this.options ? { ...defaultOptions, ...this.options } : defaultOptions;
      
      // Create the chart
      this.chart = new Chart(ctx, {
        type: 'line',
        data: this.data,
        options: chartOptions,
      });
      
      this.error = null;
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Error rendering chart:', err);
    }
  }
  
  // Method to be called when component is destroyed
  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}