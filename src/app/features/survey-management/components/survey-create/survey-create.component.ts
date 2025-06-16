import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

import { SurveyService } from '../../services/survey.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Question, QuestionType } from '../../../../core/models/question.model';
import { Survey, SurveyStatus, SurveyType } from '../../../../core/models/survey.model';
import { QuestionCreateModalComponent } from '../question-create-modal/question-create-modal.component';

@Component({
  selector: 'app-survey-create',
  templateUrl: './survey-create.component.html',
  styleUrls: ['./survey-create.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class SurveyCreateComponent implements OnInit {
  currentStep = 1;
  surveyInfoForm: FormGroup;
  surveySettingsForm: FormGroup;
  questions: Question[] = [];
  publishOption = 'now';
  isLoading = false;
  SurveyType = SurveyType;
  surveyTypes = Object.values(SurveyType);

  constructor(
    private fb: FormBuilder,
    private surveyService: SurveyService,
    private notificationService: NotificationService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.surveyInfoForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      type: [SurveyType.GENERAL, Validators.required],
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
    const dialogRef = this.dialog.open(QuestionCreateModalComponent, {
      width: '600px',
      data: {
        order: this.questions.length + 1
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.questions.push({
          ...result,
          id: `temp-${Date.now()}`, // Temporary ID until survey is saved
          order: this.questions.length + 1
        });
        this.notificationService.success('Question ajoutée avec succès');
      }
    });
  }

  editQuestion(question: Question): void {
    const dialogRef = this.dialog.open(QuestionCreateModalComponent, {
      width: '600px',
      data: {
        id: question.id,
        title: question.title,
        description: question.description,
        type: question.type,
        isRequired: question.isRequired,
        order: question.order,
        options: question.options
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.questions.findIndex(q => q.id === question.id);
        if (index !== -1) {
          this.questions[index] = {
            ...result,
            id: question.id,
            order: question.order
          };
          this.notificationService.success('Question modifiée avec succès');
        }
      }
    });
  }

  deleteQuestion(question: Question): void {
    this.questions = this.questions.filter(q => q.id !== question.id);
    // Reorder remaining questions
    this.questions = this.questions.map((q, index) => ({
      ...q,
      order: index + 1
    }));
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

  async publishSurvey(): Promise<void> {
    if (this.surveyInfoForm.invalid) {
      this.surveyInfoForm.markAllAsTouched();
      this.notificationService.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (this.questions.length === 0) {
      this.notificationService.error('Veuillez ajouter au moins une question');
      return;
    }

    this.isLoading = true;
    const survey = this.prepareSurveyData();
    survey.status = SurveyStatus.PUBLISHED;

    try {
      const result = await this.surveyService.createSurvey(survey).toPromise();
      this.notificationService.success('Enquête publiée avec succès');
      this.router.navigate(['/surveys']);
    } catch (error) {
      this.notificationService.error("Erreur lors de la publication de l'enquête");
      console.error(error);
    } finally {
      this.isLoading = false;
    }
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

  private prepareSurveyData(): Partial<Survey> {
    const settings = this.surveySettingsForm.value;

    return {
      title: this.surveyInfoForm.value.title,
      description: this.surveyInfoForm.value.description,
      type: this.surveyInfoForm.value.type,
      status: SurveyStatus.DRAFT,
      creationDate: new Date(),
      sections: [
        {
          id: 's1',
          title: 'Section principale',
          description: '',
          order: 1,
          questions: this.questions.map(q => ({
            id: q.id,
            title: q.title,
            description: q.description,
            type: q.type,
            isRequired: q.isRequired,
            order: q.order,
            options: q.options?.map(opt => ({
              id: opt.id || `opt_${Date.now()}`,
              text: opt.text,
              value: opt.value,
              imageUrl: opt.imageUrl,
              isOther: opt.isOther
            })),
            settings: q.settings,
            conditionalLogic: q.conditionalLogic,
            validations: q.validations,
            value: q.value,
            survey: q.survey,
            skipped: q.skipped,
            maxRating: q.maxRating,
            minRating: q.minRating
          }))
        }
      ],
      settings: {
        allowAnonymous: settings.allowAnonymous,
        showProgressBar: settings.showProgressBar,
        allowIncomplete: settings.allowIncomplete,
        shuffleQuestions: settings.shuffleQuestions,
        responseLimit: settings.responseLimit,
        notifyOnResponse: settings.notifyOnResponse,
        thankYouMessage: settings.thankYouMessage,
      }
    };
  }
}
