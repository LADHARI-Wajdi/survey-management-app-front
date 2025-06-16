// src/app/features/survey-taking/components/survey-completion/survey-completion.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Survey } from '../../../../core/models/survey.model';

@Component({
  selector: 'app-survey-completion',
  templateUrl: './survey-completion.component.html',
  styleUrls: ['./survey-completion.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class SurveyCompletionComponent implements OnInit {
  @Input() survey: Survey | null = null;
  thankYouMessage: string = 'Merci d\'avoir participé à cette enquête!';
  currentDate: Date = new Date();
  
  constructor(private router: Router) { }

  ngOnInit(): void {
    // Use custom thank you message if provided in survey settings
    if (this.survey?.settings?.thankYouMessage) {
      this.thankYouMessage = this.survey.settings.thankYouMessage;
    }
  }
  
  /**
   * Navigate back to home
   */
  goToHome(): void {
    this.router.navigate(['/']);
  }
  
  /**
   * Navigate to survey list
   */
  goToSurveys(): void {
    this.router.navigate(['/surveys']);
  }
  
  /**
   * Share the survey with others
   */
  shareSurvey(): void {
    if (!this.survey) return;
    
    // Create share data
    const shareData = {
      title: this.survey.title,
      text: this.survey.description || 'Participez à cette enquête!',
      url: window.location.href
    };
    
    // Use Web Share API if available
    if (navigator.share) {
      navigator.share(shareData)
        .then(() => console.log('Survey shared successfully'))
        .catch((error) => console.log('Error sharing survey:', error));
    } else {
      // Fallback: copy link to clipboard
      this.copyLinkToClipboard();
    }
  }
  
  /**
   * Copy survey link to clipboard
   */
  copyLinkToClipboard(): void {
    const surveyUrl = window.location.href;
    
    navigator.clipboard.writeText(surveyUrl)
      .then(() => {
        alert('Lien copié dans le presse-papier!');
      })
      .catch(err => {
        console.error('Impossible de copier le lien:', err);
      });
  }
}