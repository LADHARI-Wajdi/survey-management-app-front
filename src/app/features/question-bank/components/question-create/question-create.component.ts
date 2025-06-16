// features/question-bank/components/question-create/question-create.component.ts
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

import { Question, QuestionType, QuestionOption } from '../../../../core/models/question.model';
import { QuestionService } from '../../services/question.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-question-create',
  templateUrl: './question-create.component.html',
  styleUrls: ['./question-create.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTooltipModule,
    MatCardModule,
    MatDividerModule
  ]
})
export class QuestionCreateComponent implements OnInit {
  @Input() editQuestion: Question | null = null;
  @Output() questionCreated = new EventEmitter<Question>();
  @Output() questionUpdated = new EventEmitter<Question>();
  @Output() cancel = new EventEmitter<void>();

  questionForm: FormGroup;
  questionTypes = Object.values(QuestionType);
  isEditMode = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private questionService: QuestionService,
    private notificationService: NotificationService
  ) {
    this.questionForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.editQuestion) {
      this.isEditMode = true;
      this.populateForm(this.editQuestion);
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: [''],
      type: [QuestionType.TEXT_SHORT, Validators.required],
      isRequired: [true],
      options: this.fb.array([]),
      settings: this.fb.group({
        placeholder: [''],
        minValue: [null],
        maxValue: [null],
        step: [null],
        allowMultipleFiles: [false],
        maxFileSize: [null],
        acceptedFileTypes: [[]],
        rows: [null],
        columns: [null],
        ratingSymbol: ['star'],
        includeNotApplicable: [false],
        shuffleOptions: [false],
        layout: ['vertical']
      })
    });
  }

  get options(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  get selectedType(): QuestionType {
    return this.questionForm.get('type')?.value;
  }

  populateForm(question: Question): void {
    this.questionForm.patchValue({
      title: question.title,
      description: question.description || '',
      type: question.type,
      isRequired: question.isRequired
    });

    // Si les paramètres existent, les ajouter
    if (question.settings) {
      this.questionForm.get('settings')?.patchValue(question.settings);
    }

    // Si des options existent, les ajouter
    if (question.options && question.options.length > 0) {
      this.clearOptions();
      question.options.forEach(option => {
        this.addOption(option);
      });
    }
  }

  addOption(option?: QuestionOption): void {
    const optionForm = this.fb.group({
      id: [option?.id || `opt${Date.now()}`],
      text: [option?.text || '', Validators.required],
      value: [option?.value || ''],
      imageUrl: [option?.imageUrl || ''],
      isOther: [option?.isOther || false]
    });

    this.options.push(optionForm);
  }

  removeOption(index: number): void {
    this.options.removeAt(index);
  }

  clearOptions(): void {
    while (this.options.length > 0) {
      this.options.removeAt(0);
    }
  }

  onTypeChange(): void {
    // Réinitialiser les options si nécessaire
    const type = this.questionForm.get('type')?.value;
    
    if (type === QuestionType.SINGLE_CHOICE || type === QuestionType.MULTIPLE_CHOICE) {
      if (this.options.length === 0) {
        // Ajouter des options par défaut pour les questions à choix
        this.addOption({ id: 'opt1', text: 'Option 1', value: 'option1' });
        this.addOption({ id: 'opt2', text: 'Option 2', value: 'option2' });
      }
    } else if (type === QuestionType.RATING) {
      // Paramètres spécifiques pour les évaluations
      this.questionForm.get('settings')?.patchValue({
        minValue: 1,
        maxValue: 5,
        ratingSymbol: 'star'
      });
    } else if (type === QuestionType.TEXT_LONG) {
      // Paramètres spécifiques pour le texte long
      this.questionForm.get('settings')?.patchValue({
        rows: 5
      });
    }
  }

  onSubmit(): void {
    if (this.questionForm.invalid) {
      this.markFormGroupTouched(this.questionForm);
      return;
    }

    const formValue = this.questionForm.value;
    const questionDistributionData: Question = {
      id: this.editQuestion?.id || `q${Date.now()}`,
      title: formValue.title,
      description: formValue.description,
      type: formValue.type,
      isRequired: formValue.isRequired,
      order: this.editQuestion?.order || 0,
      options: formValue.type === QuestionType.SINGLE_CHOICE ||
        formValue.type === QuestionType.MULTIPLE_CHOICE ?
        formValue.options : undefined,
      settings: formValue.settings,
      maxRating: 0,
      minRating: 0,
      value: null,
      skipped: undefined
    };

    this.isSubmitting = true;

    if (this.isEditMode) {
      this.updateQuestion(questionDistributionData);
    } else {
      this.createQuestion(questionDistributionData);
    }
  }

  createQuestion(question: Question): void {
    this.questionService.createQuestion(question).subscribe(
      (result) => {
        this.notificationService.success('Question créée avec succès');
        this.questionCreated.emit(result);
        this.resetForm();
        this.isSubmitting = false;
      },
      (error) => {
        this.notificationService.error('Erreur lors de la création de la question');
        console.error('Error creating question', error);
        this.isSubmitting = false;
      }
    );
  }

  updateQuestion(question: Question): void {
    this.questionService.updateQuestion(question.id, question).subscribe(
      (result) => {
        this.notificationService.success('Question mise à jour avec succès');
        this.questionUpdated.emit(result);
        this.isSubmitting = false;
      },
      (error) => {
        this.notificationService.error('Erreur lors de la mise à jour de la question');
        console.error('Error updating question', error);
        this.isSubmitting = false;
      }
    );
  }

  onCancel(): void {
    this.cancel.emit();
  }

  resetForm(): void {
    this.questionForm.reset({
      title: '',
      description: '',
      type: QuestionType.TEXT_SHORT,
      isRequired: true
    });
    this.clearOptions();
  }

  /**
   * Marque tous les contrôles d'un FormGroup comme touchés
   * Utile pour afficher les erreurs de validation
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(ctrl => {
          if (ctrl instanceof FormGroup) {
            this.markFormGroupTouched(ctrl);
          } else {
            ctrl.markAsTouched();
          }
        });
      }
    });
  }

  /**
   * Retourne le libellé d'affichage pour un type de question
   */
  getQuestionTypeLabel(type: QuestionType): string {
    const typeLabels: Record<QuestionType, string> = {
      [QuestionType.TEXT_SHORT]: 'Réponse courte',
      [QuestionType.TEXT_LONG]: 'Réponse longue',
      [QuestionType.SINGLE_CHOICE]: 'Choix unique',
      [QuestionType.MULTIPLE_CHOICE]: 'Choix multiple',
      [QuestionType.RATING]: 'Évaluation',
      [QuestionType.DATE]: 'Date',
      [QuestionType.FILE]: 'Fichier',
      [QuestionType.MATRIX]: 'Matrice',
      [QuestionType.RANKING]: 'Classement',
      [QuestionType.NUMERIC]: 'Numérique'
    };
    
    return typeLabels[type] || type;
  }

  /**
   * Vérifie si un type de question utilise des options
   */
  hasOptions(type: QuestionType): boolean {
    return type === QuestionType.SINGLE_CHOICE || 
           type === QuestionType.MULTIPLE_CHOICE || 
           type === QuestionType.RANKING;
  
  }
}