// features/distribution/services/distribution.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { environements } from '../../../../environements/environement';

@Injectable({
  providedIn: 'root'
})
export class DistributionService {
  private apiUrl = `${environements.apiUrl}/distribution`;

  constructor(private http: HttpClient) { }

  /**
   * Génère un QR code pour une enquête
   * @param surveyId ID de l'enquête
   * @returns URL de données du QR code
   */
  generateQrCode(surveyId: string): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/qrcode/${surveyId}`).pipe(
      catchError((error) => {
        console.error('Error generating QR code', error);
        // Mock QR code data URL pour démonstration
        return of(this.getMockQrCodeDataUrl(surveyId)).pipe(delay(500));
      })
    );
  }

  /**
   * Génère un lien pour partager l'enquête
   * @param surveyId ID de l'enquête
   * @param expirationDate Date d'expiration optionnelle
   * @returns Lien de l'enquête
   */
  generateSurveyLink(surveyId: string, expirationDate: string | null = null): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/link`, { 
      surveyId, 
      expirationDate 
    }).pipe(
      catchError((error) => {
        console.error('Error generating survey link', error);
        // Mock survey link pour démonstration
        return of(`${window.location.origin}/take-survey/${surveyId}?token=mockToken123`).pipe(delay(300));
      })
    );
  }

  /**
   * Obtient le code d'intégration iframe pour l'enquête
   * @param surveyId ID de l'enquête
   * @returns Base URL pour l'intégration iframe
   */
  getEmbedCode(surveyId: string): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/embed/${surveyId}`).pipe(
      catchError((error) => {
        console.error('Error getting embed code', error);
        // Mock embed URL pour démonstration
        return of(`${window.location.origin}/embed-survey/${surveyId}`).pipe(delay(400));
      })
    );
  }

  /**
   * Partage l'enquête sur les réseaux sociaux
   * @param surveyId ID de l'enquête
   * @param platform Plateforme sociale (facebook, twitter, linkedin)
   * @returns Statut du partage
   */
  shareSurveyOnSocial(surveyId: string, platform: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.apiUrl}/share/${platform}`, { 
      surveyId 
    }).pipe(
      catchError((error) => {
        console.error(`Error sharing survey on ${platform}`, error);
        // Mock share status pour démonstration
        return of({ success: true }).pipe(delay(600));
      })
    );
  }

  /**
   * Obtient les statistiques de distribution d'une enquête
   * @param surveyId ID de l'enquête
   * @returns Statistiques de distribution
   */
  getDistributionStats(surveyId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats/${surveyId}`).pipe(
      catchError((error) => {
        console.error('Error getting distribution stats', error);
        // Mock distribution stats pour démonstration
        return of({
          qrCodeScans: 52,
          directLinkClicks: 198,
          iframeViews: 34,
          socialShares: {
            facebook: 18,
            twitter: 12,
            linkedin: 8
          },
          deviceBreakdown: {
            desktop: 65,
            mobile: 28,
            tablet: 7
          },
          referrers: [
            { source: 'Direct', count: 87 },
            { source: 'Facebook', count: 62 },
            { source: 'Email', count: 112 },
            { source: 'Twitter', count: 23 },
            { source: 'LinkedIn', count: 36 }
          ]
        }).pipe(delay(700));
      })
    );
  }

  /**
   * Génère un QR code data URL de test
   * (Simulé - dans une application réelle, utilisez une bibliothèque comme qrcode.js)
   */
  private getMockQrCodeDataUrl(surveyId: string): string {
    // Ceci est un data URL basique simulant un QR code pour la démonstration
    return 'data:image/png;base64,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';
  }
}