import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ChartData } from 'chart.js';
import { 
  TimeRange, 
  DashboardStats, 
  ResponseTrend, 
  CompletionRateData,
  QuestionTypeDistribution,
  DeviceBreakdown,
  DemographicBreakdown
} from '../models/analytics-data.model';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = '/api/analytics'; // Use relative URL for Angular environments
  
  constructor(private http: HttpClient) {}
  
  getDashboardStats(timeRange: TimeRange): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard-stats`, {
      params: { timeRange }
    }).pipe(
      catchError(() => {
        // Fallback to mock data if API fails
        return of({
          totalSurveys: 12,
          totalResponses: 345,
          averageCompletionRate: 78.5,
          averageTimeToComplete: 6.2
        });
      })
    );
  }
  
  getResponsesOverTime(timeRange: TimeRange): Observable<ChartData> {
    return this.http.get<ResponseTrend[]>(`${this.apiUrl}/responses-over-time`, {
      params: { timeRange }
    }).pipe(
      map(data => this.transformToLineChartData(data)),
      catchError(() => {
        // Fallback to mock data if API fails
        return of(this.getMockResponsesOverTimeData());
      })
    );
  }
  
  getCompletionRate(timeRange: TimeRange): Observable<ChartData> {
    return this.http.get<CompletionRateData>(`${this.apiUrl}/completion-rate`, {
      params: { timeRange }
    }).pipe(
      map(data => this.transformToPieChartData(data)),
      catchError(() => {
        // Fallback to mock data if API fails
        return of(this.getMockCompletionRateData());
      })
    );
  }
  
  getQuestionDistribution(timeRange: TimeRange): Observable<ChartData> {
    return this.http.get<QuestionTypeDistribution[]>(`${this.apiUrl}/question-distribution`, {
      params: { timeRange }
    }).pipe(
      map(data => this.transformToPieChartData(data)),
      catchError(() => {
        // Fallback to mock data if API fails
        return of(this.getMockQuestionDistributionData());
      })
    );
  }
  
  getAvgTimeToComplete(timeRange: TimeRange): Observable<ChartData> {
    return this.http.get<number[]>(`${this.apiUrl}/avg-time-to-complete`, {
      params: { timeRange }
    }).pipe(
      map(data => this.transformToBarChartData(data)),
      catchError(() => {
        // Fallback to mock data if API fails
        return of(this.getMockAvgTimeToCompleteData());
      })
    );
  }
  
  getDeviceBreakdown(timeRange: TimeRange): Observable<ChartData> {
    return this.http.get<DeviceBreakdown>(`${this.apiUrl}/device-breakdown`, {
      params: { timeRange }
    }).pipe(
      map(data => this.transformToPieChartData(data)),
      catchError(() => {
        // Fallback to mock data if API fails
        return of(this.getMockDeviceBreakdownData());
      })
    );
  }
  
  getUserDemographics(timeRange: TimeRange): Observable<ChartData> {
    return this.http.get<DemographicBreakdown[]>(`${this.apiUrl}/user-demographics`, {
      params: { timeRange }
    }).pipe(
      map(data => this.transformToBarChartData(data)),
      catchError(() => {
        // Fallback to mock data if API fails
        return of(this.getMockUserDemographicsData());
      })
    );
  }
  
  getChartData(chartId: string, timeRange: TimeRange): Observable<ChartData> {
    return this.http.get<any>(`${this.apiUrl}/chart/${chartId}`, {
      params: { timeRange }
    }).pipe(
      catchError(() => {
        // Fallback to mock data if API fails
        return of({
          labels: ['No Data'],
          datasets: [{
            label: 'No Data Available',
            data: [0],
            backgroundColor: '#e0e0e0'
          }]
        });
      })
    );
  }
  
  // Helper methods to transform API data to Chart.js format
  private transformToLineChartData(data: ResponseTrend[]): ChartData {
    return {
      labels: data.map(item => item.date),
      datasets: [{
        label: 'Responses',
        data: data.map(item => item.responses),
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        tension: 0.4,
        fill: true
      }]
    };
  }
  
  private transformToPieChartData(data: any): ChartData {
    if (Array.isArray(data)) {
      // For array data like question distribution
      return {
        labels: data.map(item => item.type || item.category),
        datasets: [{
          data: data.map(item => item.count || item.value),
          backgroundColor: [
            '#007bff', '#28a745', '#ffc107', '#dc3545',
            '#17a2b8', '#6610f2', '#fd7e14', '#20c997'
          ]
        }]
      };
    } else {
      // For object data like completion rate or device breakdown
      return {
        labels: Object.keys(data),
        datasets: [{
          data: Object.values(data),
          backgroundColor: [
            '#007bff', '#28a745', '#ffc107', '#dc3545',
            '#17a2b8', '#6610f2', '#fd7e14', '#20c997'
          ]
        }]
      };
    }
  }
  
  private transformToBarChartData(data: any): ChartData {
    if (Array.isArray(data)) {
      if (data.length > 0 && data[0].category) {
        // For demographic breakdown
        return {
          labels: data.map(item => item.category),
          datasets: [{
            label: 'Count',
            data: data.map(item => item.count),
            backgroundColor: '#007bff'
          }]
        };
      } else {
        // For simple array data
        return {
          labels: ['1', '2', '3', '4', '5', '6', '7'].slice(0, data.length),
          datasets: [{
            label: 'Value',
            data: data,
            backgroundColor: '#007bff'
          }]
        };
      }
    } else {
      // For object data
      return {
        labels: Object.keys(data),
        datasets: [{
          label: 'Value',
          data: Object.values(data),
          backgroundColor: '#007bff'
        }]
      };
    }
  }
  
  // Mock data methods for testing and fallback purposes
  private getMockResponsesOverTimeData(): ChartData {
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Responses',
        data: [42, 85, 101, 98, 137, 159],
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        tension: 0.4,
        fill: true
      }]
    };
  }
  
  private getMockCompletionRateData(): ChartData {
    return {
      labels: ['Completed', 'Abandoned'],
      datasets: [{
        data: [78, 22],
        backgroundColor: ['#28a745', '#dc3545']
      }]
    };
  }
  
  private getMockQuestionDistributionData(): ChartData {
    return {
      labels: ['Multiple Choice', 'Single Choice', 'Text', 'Rating', 'Other'],
      datasets: [{
        data: [45, 30, 15, 8, 2],
        backgroundColor: ['#007bff', '#28a745', '#ffc107', '#17a2b8', '#6c757d']
      }]
    };
  }
  
  private getMockAvgTimeToCompleteData(): ChartData {
    return {
      labels: ['Survey 1', 'Survey 2', 'Survey 3', 'Survey 4', 'Survey 5'],
      datasets: [{
        label: 'Minutes',
        data: [4.5, 7.2, 3.8, 9.1, 5.6],
        backgroundColor: '#007bff'
      }]
    };
  }
  
  private getMockDeviceBreakdownData(): ChartData {
    return {
      labels: ['Desktop', 'Mobile', 'Tablet'],
      datasets: [{
        data: [55, 35, 10],
        backgroundColor: ['#007bff', '#28a745', '#ffc107']
      }]
    };
  }
  
  private getMockUserDemographicsData(): ChartData {
    return {
      labels: ['18-24', '25-34', '35-44', '45-54', '55+'],
      datasets: [{
        label: 'Users',
        data: [15, 30, 25, 18, 12],
        backgroundColor: '#007bff'
      }]
    };
  }
}