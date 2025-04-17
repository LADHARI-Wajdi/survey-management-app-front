import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { SurveyService } from '../../services/survey.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Question } from '../../../../core/models/question.model';
import { Survey, SurveyStatus } from '../../../../core/models/survey.model';

@Component({
  selector: 'app-survey-create',
  templateUrl: './survey-create.component.html',
  styleUrls: ['./survey-create.component.scss'],
})
export class SurveyCreateComponent implements OnInit {
  currentStep = 1;
  surveyInfoForm: FormGroup;
  surveySettingsForm: FormGroup;
  questions: Question[] = [];
  publishOption = 'now';

  constructor(
    private fb: FormBuilder,
    private surveyService: SurveyService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.surveyInfoForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      type: ['survey'],
    });

    this.surveySettingsForm = this.fb.group({
      allowAnonymous: [true],
      showProgressBar: [true],
      allowIncomplete: [false],
      shuffleQuestions: [false],
      responseLimit: [''],
      notifyOnResponse: [false],
      thankYouMessage: ['Merci pour votre participation à cette enquête!'],
    });
  }

  ngOnInit(): void {}

  nextStep(): void {
    if (this.currentStep === 1 && this.surveyInfoForm.invalid) {
      this.surveyInfoForm.markAllAsTouched();
      this.notificationService.error(
        'Veuillez remplir tous les champs obligatoires'
      );
      return;
    }

    if (this.currentStep === 2 && this.questions.length === 0) {
      this.notificationService.error('Veuillez ajouter au moins une question');
      return;
    }

    if (this.currentStep < 5) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  addQuestion(): void {
    // Dans une application réelle, cette méthode ouvrirait un modal de création de question
    // Pour l'exemple, ajoutons une question fictive
    const newQuestion: Question = {
      id: `q${this.questions.length + 1}`,
      title: `Question ${this.questions.length + 1}`,
      description: 'Description de la question',
      type: 'single_choice',
      isRequired: true,
      order: this.questions.length + 1,
      options: [
        { id: 'opt1', text: 'Option 1', value: 'opt1' },
        { id: 'opt2', text: 'Option 2', value: 'opt2' },
        { id: 'opt3', text: 'Option 3', value: 'opt3' },
      ],
    };

    this.questions.push(newQuestion);
    this.notificationService.success('Question ajoutée avec succès');
  }

  editQuestion(question: Question): void {
    // Cette méthode ouvrirait normalement un modal d'édition de question
    console.log('Édition de la question:', question);
    // Dans une application réelle, on ouvrirait un modal d'édition
    this.notificationService.info(
      "Fonction d'édition de question à implémenter"
    );
  }

  deleteQuestion(question: Question): void {
    this.questions = this.questions.filter((q) => q.id !== question.id);
    this.notificationService.success('Question supprimée avec succès');
  }

  saveDraft(): void {
    const survey = this.prepareSurveyData();
    survey.status = SurveyStatus.DRAFT;

    this.surveyService.createSurvey(survey).subscribe(
      (result) => {
        this.notificationService.success('Brouillon enregistré avec succès');
      },
      (error) => {
        this.notificationService.error(
          "Erreur lors de l'enregistrement du brouillon"
        );
        console.error(error);
      }
    );
  }

  publishSurvey(): void {
    const survey = this.prepareSurveyData();
    survey.status = SurveyStatus.PUBLISHED;

    this.surveyService.createSurvey(survey).subscribe(
      (result) => {
        this.notificationService.success('Enquête publiée avec succès');
        this.router.navigate(['/surveys']);
      },
      (error) => {
        this.notificationService.error(
          "Erreur lors de la publication de l'enquête"
        );
        console.error(error);
      }
    );
  }

  getQuestionTypeLabel(type: string): string {
    const types: { [key: string]: string } = {
      text_short: 'Réponse courte',
      text_long: 'Réponse longue',
      single_choice: 'Choix unique',
      multiple_choice: 'Choix multiple',
      rating: 'Évaluation',
      date: 'Date',
      file: 'Fichier',
    };

    return types[type] || type;
  }

  private prepareSurveyData(): Survey {
    const settings = this.surveySettingsForm.value;

    return {
      id: '', // Sera généré par le backend
      title: this.surveyInfoForm.value.title,
      description: this.surveyInfoForm.value.description,
      type: this.surveyInfoForm.value.type,
      status: SurveyStatus.DRAFT,
      createdBy: '', // Sera défini par le backend
      creationDate: new Date(),
      sections: [
        {
          id: 's1',
          title: 'Section principale',
          description: '',
          order: 1,
          questions: this.questions.map((q) => q.id),
        },
      ],
      settings: {
        allowAnonymous: settings.allowAnonymous,
        showProgressBar: settings.showProgressBar,
        allowIncomplete: settings.allowIncomplete,
        shuffleQuestions: settings.shuffleQuestions,
        responseLimit: settings.responseLimit,
        notifyOnResponse: settings.notifyOnResponse,
        thankYouMessage: settings.thankYouMessage,
      },
    };
  }
}
