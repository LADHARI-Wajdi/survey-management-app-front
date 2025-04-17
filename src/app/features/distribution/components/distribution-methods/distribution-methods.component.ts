import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { DistributionService } from '../../services/distribution.service';
import { InvitationService } from '../../services/invitation.service';
import { SurveyService } from '../../../survey-management/services/survey.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Survey } from '../../../../core/models/survey.model';

@Component({
  selector: 'app-distribution-methods',
  templateUrl: './distribution-methods.component.html',
  styleUrls: ['./distribution-methods.component.scss'],
})
export class DistributionMethodsComponent implements OnInit {
  activeTab: string = 'email';
  currentSurvey: Survey | null = null;

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

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private distributionService: DistributionService,
    private invitationService: InvitationService,
    private surveyService: SurveyService,
    private notificationService: NotificationService,
    private sanitizer: DomSanitizer
  ) {
    this.emailForm = this.fb.group({
      recipients: ['', Validators.required],
      subject: ['Invitation à participer à notre enquête', Validators.required],
      template: ['standard'],
      customMessage: [''],
    });
  }

  ngOnInit(): void {
    // Récupérer l'ID de l'enquête depuis l'URL
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.loadSurvey(params['id']);
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;

    // Initialiser les données spécifiques à l'onglet
    switch (tab) {
      case 'qrcode':
        this.generateQrCode();
        break;
      case 'link':
        this.generateSurveyLink();
        break;
      case 'iframe':
        this.generateIframeCode();
        break;
    }
  }

  // Méthodes pour l'onglet Email

  onTemplateChange(): void {
    if (this.emailForm.get('template')?.value === 'custom') {
      const defaultMessage = `Bonjour,\n\nVous êtes invité(e) à participer à notre enquête "${this.currentSurvey?.title}".\n\nMerci de prendre quelques minutes pour y répondre.\n\nCordialement,\nL'équipe ${this.currentSurvey?.createdBy}`;
      this.emailForm.get('customMessage')?.setValue(defaultMessage);
    }
  }

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

    // Ajouter le bouton
    content += `<p style="text-align: center; margin-top: 20px;">
                <a href="${this.surveyLink}" style="background-color: #3F51B5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
                  Répondre à l'enquête
                </a>
              </p>`;

    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  previewEmail(): void {
    // Cette méthode ouvrirait normalement une modal avec un aperçu complet de l'email
    this.notificationService.info("Fonction d'aperçu à implémenter");
  }

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
      surveyId: this.currentSurvey?.id,
      subject: formValue.subject,
      template: formValue.template,
      customMessage: formValue.customMessage,
      recipients: recipients,
    };

    this.invitationService
      .sendInvitations(this.currentSurvey?.id || '', invitationData)
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

  // Méthodes pour l'onglet QR Code

  generateQrCode(): void {
    if (!this.currentSurvey) return;

    this.distributionService.generateQrCode(this.currentSurvey.id).subscribe(
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

  downloadQrCode(): void {
    if (!this.qrCodeDataUrl) return;

    const a = document.createElement('a');
    a.href = this.qrCodeDataUrl;
    a.download = `qrcode-${this.currentSurvey?.title || 'survey'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

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

  // Méthodes pour l'onglet Lien

  generateSurveyLink(): void {
    if (!this.currentSurvey) return;

    this.distributionService
      .generateSurveyLink(this.currentSurvey.id, this.expirationDate)
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

  copyLink(input: HTMLInputElement): void {
    input.select();
    document.execCommand('copy');
    this.notificationService.success('Lien copié dans le presse-papier');
  }

  updateLink(): void {
    this.generateSurveyLink();
  }

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

  // Méthodes pour l'onglet iFrame

  generateIframeCode(): void {
    if (!this.currentSurvey) return;

    this.distributionService.getEmbedCode(this.currentSurvey.id).subscribe(
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

  copyIframeCode(textarea: HTMLTextAreaElement): void {
    textarea.select();
    document.execCommand('copy');
    this.notificationService.success(
      "Code d'intégration copié dans le presse-papier"
    );
  }

  // Méthodes communes

  private loadSurvey(id: string): void {
    this.surveyService.getSurveyById(id).subscribe(
      (survey) => {
        this.currentSurvey = survey;

        // Initialiser tous les onglets
        this.generateSurveyLink();
        this.loadInvitationStats();
      },
      (error) => {
        this.notificationService.error(
          "Erreur lors du chargement des détails de l'enquête"
        );
        console.error(error);
      }
    );
  }

  private loadInvitationStats(): void {
    if (!this.currentSurvey) return;

    this.invitationService
      .getInvitationStatistics(this.currentSurvey.id)
      .subscribe(
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
}
