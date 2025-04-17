// core/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * GET request
   * @param endpoint - API endpoint path
   * @param params - Optional HTTP parameters
   * @param headers - Optional HTTP headers
   * @returns Observable of response data
   */
  get<T>(endpoint: string, params: any = {}, headers: any = {}): Observable<T> {
    const options = {
      params: this.buildParams(params),
      headers: this.buildHeaders(headers),
    };

    return this.http.get<T>(`${this.apiUrl}/${endpoint}`, options);
  }

  /**
   * POST request
   * @param endpoint - API endpoint path
   * @param body - Request body
   * @param headers - Optional HTTP headers
   * @returns Observable of response data
   */
  post<T>(endpoint: string, body: any, headers: any = {}): Observable<T> {
    const options = {
      headers: this.buildHeaders(headers),
    };

    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, body, options);
  }

  /**
   * PUT request
   * @param endpoint - API endpoint path
   * @param body - Request body
   * @param headers - Optional HTTP headers
   * @returns Observable of response data
   */
  put<T>(endpoint: string, body: any, headers: any = {}): Observable<T> {
    const options = {
      headers: this.buildHeaders(headers),
    };

    return this.http.put<T>(`${this.apiUrl}/${endpoint}`, body, options);
  }

  /**
   * PATCH request
   * @param endpoint - API endpoint path
   * @param body - Request body
   * @param headers - Optional HTTP headers
   * @returns Observable of response data
   */
  patch<T>(endpoint: string, body: any, headers: any = {}): Observable<T> {
    const options = {
      headers: this.buildHeaders(headers),
    };

    return this.http.patch<T>(`${this.apiUrl}/${endpoint}`, body, options);
  }

  /**
   * DELETE request
   * @param endpoint - API endpoint path
   * @param headers - Optional HTTP headers
   * @returns Observable of response data
   */
  delete<T>(endpoint: string, headers: any = {}): Observable<T> {
    const options = {
      headers: this.buildHeaders(headers),
    };

    return this.http.delete<T>(`${this.apiUrl}/${endpoint}`, options);
  }

  /**
   * Builds HttpParams from object
   * @param params - Object containing parameters
   * @returns HttpParams
   */
  private buildParams(params: any): HttpParams {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }

    return httpParams;
  }

  /**
   * Builds HttpHeaders from object
   * @param headers - Object containing headers
   * @returns HttpHeaders
   */
  private buildHeaders(headers: any): HttpHeaders {
    let httpHeaders = new HttpHeaders();

    if (headers) {
      Object.keys(headers).forEach((key) => {
        if (headers[key] !== null && headers[key] !== undefined) {
          httpHeaders = httpHeaders.set(key, headers[key].toString());
        }
      });
    }

    return httpHeaders;
  }
}
