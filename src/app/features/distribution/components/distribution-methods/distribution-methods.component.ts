// features/distribution/components/distribution-methods/distribution-methods.component.ts
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DistributionService } from '../../services/distribution.service';
import { InvitationService } from '../../services/invitation.service';
import { SurveyService } from '../../../survey-management/services/survey.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Survey } from '../../../../core/models/survey.model';
import {
  DistributionStatistics,
  DistributionMethod,
} from '../../models/distribution.model';

@Component({
  selector: 'app-distribution-methods',
  templateUrl: './distribution-methods.component.html',
  styleUrls: ['./distribution-methods.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
})
export class DistributionMethodsComponent implements OnInit {
  // Tab management
  activeTab: string = 'email';

  // Survey information
  currentSurvey: Survey | null = null;
  surveyId: string = '';

  // Email tab
  emailForm: FormGroup;
  invitationStats = {
    sentCount: 0,
    openCount: 0,
    openRate: 0,
  };

  // QR Code tab
  qrCodeDataUrl: string | null = null;

  // Link tab
  surveyLink: string = '';
  expirationDate: string | null = null;

  // iFrame tab
  iframeWidth: number = 600;
  iframeHeight: number = 450;
  iframeCodeText: string = '';

  // Distribution statistics
  distributionStats: DistributionStatistics | null = null;
  isLoading: boolean = true;

  // ViewChild references
  @ViewChild('linkInput') linkInput!: ElementRef;
  @ViewChild('iframeCode') iframeCode!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private distributionService: DistributionService,
    private invitationService: InvitationService,
    private surveyService: SurveyService,
    private notificationService: NotificationService,
    private sanitizer: DomSanitizer
  ) {
    // Initialize email form
    this.emailForm = this.fb.group({
      recipients: ['', Validators.required],
      subject: ['Invitation à participer à notre enquête', Validators.required],
      template: ['standard'],
      customMessage: [''],
    });
  }

  ngOnInit(): void {
    // Get survey ID from URL
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.surveyId = params['id'];
        this.loadSurvey(this.surveyId);
      } else {
        this.notificationService.error("ID d'enquête manquant");
        this.router.navigate(['/surveys']);
      }
    });
  }

  /**
   * Load survey details
   */
  loadSurvey(id: string): void {
    this.isLoading = true;
    this.surveyService.getSurveyById(id).subscribe(
      (survey) => {
        this.currentSurvey = survey;

        // Initialize tab data
        this.generateSurveyLink();
        this.loadInvitationStats();
        this.loadDistributionStats();

        // Update the email subject with survey title
        this.emailForm.patchValue({
          subject: `Invitation à participer à l'enquête: ${survey.title}`,
        });

        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading survey', error);
        this.notificationService.error(
          "Erreur lors du chargement des détails de l'enquête"
        );
        this.isLoading = false;
        this.router.navigate(['/surveys']);
      }
    );
  }

  /**
   * Set active tab and initialize tab-specific data
   */
  setActiveTab(tab: string): void {
    this.activeTab = tab;

    // Initialize tab-specific data
    switch (tab) {
      case 'qrcode':
        if (!this.qrCodeDataUrl) {
          this.generateQrCode();
        }
        break;
      case 'link':
        if (!this.surveyLink) {
          this.generateSurveyLink();
        }
        break;
      case 'iframe':
        if (!this.iframeCodeText) {
          this.generateIframeCode();
        }
        break;
    }
  }

  /**
   * Load invitation statistics
   */
  loadInvitationStats(): void {
    this.invitationService.getInvitationStatistics(this.surveyId).subscribe(
      (stats) => {
        this.invitationStats = {
          sentCount: stats.sentCount || 0,
          openCount: stats.openCount || 0,
          openRate: stats.openRate || 0,
        };
      },
      (error) => {
        console.error('Error loading invitation statistics', error);
      }
    );
  }

  /**
   * Load distribution statistics
   */
  loadDistributionStats(): void {
    this.distributionService.getDistributionStats(this.surveyId).subscribe(
      (stats) => {
        this.distributionStats = stats;
      },
      (error) => {
        console.error('Error loading distribution statistics', error);
      }
    );
  }

  //
  // Email Tab Methods
  //

  /**
   * Handle template selection change
   */
  onTemplateChange(): void {
    if (this.emailForm.get('template')?.value === 'custom') {
      const defaultMessage = `Bonjour,\n\nVous êtes invité(e) à participer à notre enquête "${this.currentSurvey?.title}".\n\nMerci de prendre quelques minutes pour y répondre.\n\nCordialement,\nL'équipe ${this.currentSurvey?.createdBy}`;
      this.emailForm.get('customMessage')?.setValue(defaultMessage);
    }
  }

  /**
   * Generate HTML preview of the email template
   */
  getTemplatePreview(): SafeHtml {
    const template = this.emailForm.get('template')?.value;
    let content = '';

    switch (template) {
      case 'standard':
        content = `<p>Bonjour,</p>
                   <p>Vous êtes invité(e) à participer à notre enquête "${this.currentSurvey?.title}".</p>
                   <p>Merci de prendre quelques minutes pour y répondre.</p>
                   <p>Cordialement,<br>L'équipe Survey Management</p>`;
        break;
      case 'formal':
        content = `<p>Madame, Monsieur,</p>
                   <p>Nous vous invitons à participer à notre enquête intitulée "${this.currentSurvey?.title}".</p>
                   <p>Votre contribution est essentielle pour nous aider à améliorer nos services.</p>
                   <p>Nous vous remercions par avance pour votre participation.</p>
                   <p>Veuillez agréer nos salutations distinguées,<br>L'équipe Survey Management</p>`;
        break;
      case 'friendly':
        content = `<p>Salut !</p>
                   <p>On aimerait avoir ton avis sur "${this.currentSurvey?.title}" !</p>
                   <p>Ça ne prendra que quelques minutes et ton retour est vraiment important pour nous.</p>
                   <p>Merci d'avance !<br>L'équipe Survey Management</p>`;
        break;
      case 'reminder':
        content = `<p>Bonjour,</p>
                   <p>Nous vous rappelons que vous êtes invité(e) à participer à notre enquête "${this.currentSurvey?.title}".</p>
                   <p>Votre avis compte beaucoup pour nous et il ne vous faudra que quelques minutes pour répondre.</p>
                   <p>Merci pour votre participation,<br>L'équipe Survey Management</p>`;
        break;
      case 'custom':
        const customMessage = this.emailForm.get('customMessage')?.value || '';
        content = customMessage.replace(/\n/g, '<br>');
        break;
    }

    // Add button
    content += `<p style="text-align: center; margin-top: 20px;">
                <a href="${this.surveyLink}" style="background-color: #3F51B5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
                  Répondre à l'enquête
                </a>
              </p>`;

    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  /**
   * Show email preview
   */
  previewEmail(): void {
    // In a real app, this would open a modal with a complete preview
    this.notificationService.info("Fonction d'aperçu à implémenter");
  }

  /**
   * Send email invitations
   */
  sendInvitations(): void {
    if (this.emailForm.invalid) {
      this.notificationService.error(
        'Veuillez remplir tous les champs obligatoires'
      );
      return;
    }

    const formValue = this.emailForm.value;
    const recipients = formValue.recipients
      .split(',')
      .map((email: string) => email.trim());

    const invitationData = {
      surveyId: this.surveyId,
      subject: formValue.subject,
      template: formValue.template,
      customMessage: formValue.customMessage,
      recipients: recipients,
    };

    this.invitationService
      .sendInvitations(this.surveyId, invitationData)
      .subscribe(
        (response) => {
          this.notificationService.success(
            `Invitations envoyées à ${recipients.length} destinataires`
          );
          this.loadInvitationStats();
        },
        (error) => {
          this.notificationService.error(
            "Erreur lors de l'envoi des invitations"
          );
          console.error(error);
        }
      );
  }

  //
  // QR Code Tab Methods
  //

  /**
   * Generate QR code
   */
  generateQrCode(): void {
    if (!this.surveyId) return;

    this.distributionService.generateQrCode(this.surveyId).subscribe(
      (dataUrl) => {
        this.qrCodeDataUrl = dataUrl;
      },
      (error) => {
        this.notificationService.error(
          'Erreur lors de la génération du QR Code'
        );
        console.error(error);
      }
    );
  }

  /**
   * Download QR code
   */
  downloadQrCode(): void {
    if (!this.qrCodeDataUrl) return;

    const a = document.createElement('a');
    a.href = this.qrCodeDataUrl;
    a.download = `qrcode-${this.currentSurvey?.title || 'survey'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  /**
   * Print QR code
   */
  printQrCode(): void {
    if (!this.qrCodeDataUrl) return;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - ${this.currentSurvey?.title || 'Survey'}</title>
            <style>
              body { display: flex; justify-content: center; align-items: center; height: 100vh; }
              img { max-width: 80%; }
            </style>
          </head>
          <body>
            <img src="${this.qrCodeDataUrl}" alt="QR Code">
            <script>
              window.onload = function() { window.print(); }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  }

  //
  // Link Tab Methods
  //

  /**
   * Generate survey link
   */
  generateSurveyLink(): void {
    if (!this.surveyId) return;

    this.distributionService
      .generateSurveyLink(this.surveyId, this.expirationDate)
      .subscribe(
        (link) => {
          this.surveyLink = link;
        },
        (error) => {
          this.notificationService.error(
            'Erreur lors de la génération du lien'
          );
          console.error(error);
        }
      );
  }

  /**
   * Copy link to clipboard
   */
  copyLink(input: HTMLInputElement): void {
    input.select();
    document.execCommand('copy');
    this.notificationService.success('Lien copié dans le presse-papier');
  }

  /**
   * Update link with new expiration date
   */
  updateLink(): void {
    this.generateSurveyLink();
  }

  /**
   * Share survey on social media
   */
  shareOnSocial(platform: string): void {
    if (!this.surveyLink) return;

    let url = '';
    const text = `Participez à notre enquête: ${this.currentSurvey?.title}`;

    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          this.surveyLink
        )}&quote=${encodeURIComponent(text)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          this.surveyLink
        )}&text=${encodeURIComponent(text)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
          this.surveyLink
        )}&title=${encodeURIComponent(text)}`;
        break;
    }

    window.open(url, '_blank');
  }

  //
  // iFrame Tab Methods
  //

  /**
   * Generate iframe embed code
   */
  generateIframeCode(): void {
    if (!this.surveyId) return;

    this.distributionService.getEmbedCode(this.surveyId).subscribe(
      (baseUrl) => {
        this.iframeCodeText = `<iframe src="${baseUrl}" width="${this.iframeWidth}" height="${this.iframeHeight}" frameborder="0" allowfullscreen></iframe>`;
      },
      (error) => {
        this.notificationService.error(
          "Erreur lors de la génération du code d'intégration"
        );
        console.error(error);
      }
    );
  }

  /**
   * Copy iframe code to clipboard
   */
  copyIframeCode(textarea: HTMLTextAreaElement): void {
    textarea.select();
    document.execCommand('copy');
    this.notificationService.success(
      "Code d'intégration copié dans le presse-papier"
    );
  }
}
