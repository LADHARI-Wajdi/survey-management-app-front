import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container" [style.height.px]="height">
      <div class="loading-spinner" *ngIf="isLoading">
        <div class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      
      <div class="no-data-message" *ngIf="!isLoading && (!data || !hasData())">
        No data available to display
      </div>
      
      <canvas 
        #chartCanvas
        [hidden]="isLoading || !data || !hasData()"
      ></canvas>
      
      <div class="chart-legend" *ngIf="showLegend && chart && !isLoading && displayCustomLegend && data && hasData()">
        <div class="legend-item" *ngFor="let label of data.labels; let i = index">
          <span class="legend-color" [style.background-color]="getColorForIndex(i)"></span>
          <span class="legend-label">{{ label }}</span>
          <span class="legend-value" *ngIf="showValues">
            {{ getValueForIndex(i) }}
          </span>
          <span class="percentage" *ngIf="showPercentages">({{ getPercentageForIndex(i) }}%)</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chart-container {
      position: relative;
      width: 100%;
    }
    
    .loading-spinner, .no-data-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 200px;
      color: #6c757d;
      text-align: center;
    }
    
    .chart-legend {
      display: flex;
      flex-direction: column;
      margin-top: 1rem;
      max-width: 100%;
      overflow-x: auto;
    }
    
    .legend-item {
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
    }
    
    .legend-color {
      width: 16px;
      height: 16px;
      border-radius: 4px;
      margin-right: 0.5rem;
    }
    
    .legend-label {
      flex: 1;
    }
    
    .legend-value, .percentage {
      margin-left: 0.5rem;
      font-weight: 500;
    }
    
    .percentage {
      color: #6c757d;
    }
  `]
})
export class PieChartComponent implements OnInit, OnChanges {
  @Input() data: ChartData | null = null;
  @Input() options: ChartOptions | null = null;
  @Input() height: number = 300;
  @Input() isLoading: boolean = false;
  @Input() showActions: boolean = false;
  @Input() showLegend: boolean = true;
  @Input() displayCustomLegend: boolean = true;
  @Input() showValues: boolean = true;
  @Input() showPercentages: boolean = true;
  
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  
  chart: Chart | null = null;
  
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
  
  getColorForIndex(index: number): string {
    if (!this.data || !this.data.datasets || this.data.datasets.length === 0) {
      return '#cccccc';
    }
    
    const colors = this.data.datasets[0].backgroundColor;
    
    if (Array.isArray(colors)) {
      return colors[index % colors.length]?.toString() || '#cccccc';
    } else {
      return colors?.toString() || '#cccccc';
    }
  }
  
  getValueForIndex(index: number): number {
    if (!this.data || !this.data.datasets || this.data.datasets.length === 0) {
      return 0;
    }
    
    const value = this.data.datasets[0].data[index];
    return typeof value === 'number' ? value : 0;
  }
  
  getPercentageForIndex(index: number): number {
    if (!this.data || !this.data.datasets || this.data.datasets.length === 0) {
      return 0;
    }
    
    const values = this.data.datasets[0].data as number[];
    const total = values.reduce((a, b) => a + b, 0);
    const value = this.getValueForIndex(index);
    
    return total > 0 ? Math.round((value / total) * 100) : 0;
  }
  
  renderChart(): void {
    if (!this.data || !this.chartCanvas || !this.chartCanvas.nativeElement) {
      return;
    }
    
    // Destroy existing chart if it exists
    if (this.chart) {
      this.chart.destroy();
    }
    
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Unable to get canvas context');
      return;
    }
    
    // Default options
    const defaultOptions: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: this.showLegend && !this.displayCustomLegend,
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || '';
              const value = context.parsed as number;
              const total = (context.chart.data.datasets[0].data as number[])
                .reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      },
    };
    
    // Merge with custom options if provided
    const chartOptions = this.options ? { ...defaultOptions, ...this.options } : defaultOptions;
    
    // Create the chart
    this.chart = new Chart(ctx, {
      type: 'pie',
      data: this.data,
      options: chartOptions,
    });
  }
  
  // Method to be called when component is destroyed
  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}