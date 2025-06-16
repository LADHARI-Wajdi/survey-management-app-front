import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

import { QuestionService } from '../../services/question.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { QuestionType } from '../../../../core/models/question.model';

@Component({
  selector: 'app-question-edit',
  templateUrl: './question-edit.component.html',
  styleUrls: ['./question-edit.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule
  ]
})
export class QuestionEditComponent implements OnInit {
  questionForm!: FormGroup;
  questionId: string = '';
  isLoading: boolean = false;
  questionTypes = Object.values(QuestionType);
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private questionService: QuestionService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.initForm();
    
    this.questionId = this.route.snapshot.paramMap.get('id') || '';
    if (this.questionId) {
      this.loadQuestion();
    }
    
    // Listen to question type changes to update form validation
    this.questionForm.get('type')?.valueChanges.subscribe(type => {
      this.updateFormBasedOnType(type);
    });
  }

  initForm(): void {
    this.questionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      type: [QuestionType.TEXT_SHORT, Validators.required],
      isRequired: [true],
      options: this.fb.array([]),
      settings: this.fb.group({
        placeholder: [''],
        minValue: [null],
        maxValue: [null],
        step: [1],
        allowMultipleFiles: [false],
        maxFileSize: [5], // 5MB default
        acceptedFileTypes: [''],
      })
    });
  }

  loadQuestion(): void {
    this.isLoading = true;
    this.questionService.getQuestionById(this.questionId).subscribe({
      next: (question) => {
        // Clear existing options array
        while (this.optionsArray.length) {
          this.optionsArray.removeAt(0);
        }
        
        // Add options if they exist
        if (question.options && question.options.length > 0) {
          question.options.forEach(option => {
            this.addOption(option.text, option.value, option.isOther || false);
          });
        }
        
        // Update the form with question data
        this.questionForm.patchValue({
          title: question.title,
          description: question.description || '',
          type: question.type,
          isRequired: question.isRequired,
          settings: { ...question.settings }
        });
        
        this.isLoading = false;
      },
      error: (err) => {
        this.notificationService.error('Erreur lors du chargement de la question');
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  // Convenience getter for options form array
  get optionsArray(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  addOption(text: string = '', value: string = '', isOther: boolean = false): void {
    const optionGroup = this.fb.group({
      text: [text, Validators.required],
      value: [value || this.generateOptionValue(text)],
      isOther: [isOther]
    });
    
    this.optionsArray.push(optionGroup);
  }

  removeOption(index: number): void {
    this.optionsArray.removeAt(index);
  }

  private generateOptionValue(text: string): string {
    return text.toLowerCase().replace(/\s+/g, '_');
  }

  updateFormBasedOnType(type: QuestionType): void {
    // Reset options array if type is not choice-based
    if (type !== QuestionType.SINGLE_CHOICE && type !== QuestionType.MULTIPLE_CHOICE) {
      while (this.optionsArray.length) {
        this.optionsArray.removeAt(0);
      }
    } else if (this.optionsArray.length === 0) {
      // Add some initial options for choice questions
      this.addOption('Option 1');
      this.addOption('Option 2');
    }
    
    // Update settings validation based on type
    const settingsGroup = this.questionForm.get('settings') as FormGroup;
    
    // Reset settings to default values
    settingsGroup.patchValue({
      placeholder: '',
      minValue: null,
      maxValue: null,
      step: 1,
      allowMultipleFiles: false,
      maxFileSize: 5,
      acceptedFileTypes: '',
    });
    
    // Apply specific validations based on type
    switch (type) {
      case QuestionType.NUMERIC:
        settingsGroup.get('minValue')?.setValidators(Validators.required);
        settingsGroup.get('maxValue')?.setValidators(Validators.required);
        break;
      case QuestionType.FILE:
        settingsGroup.get('maxFileSize')?.setValidators(Validators.required);
        settingsGroup.get('acceptedFileTypes')?.setValidators(Validators.required);
        break;
      default:
        // Remove validators for other types
        settingsGroup.get('minValue')?.clearValidators();
        settingsGroup.get('maxValue')?.clearValidators();
        settingsGroup.get('maxFileSize')?.clearValidators();
        settingsGroup.get('acceptedFileTypes')?.clearValidators();
    }
    
    // Update validators
    Object.keys(settingsGroup.controls).forEach(key => {
      settingsGroup.get(key)?.updateValueAndValidity();
    });
  }
  
  getTypeLabel(type: string): string {
    const typeLabels: { [key: string]: string } = {
      text_short: 'Texte court',
      text_long: 'Texte long',
      single_choice: 'Choix unique',
      multiple_choice: 'Choix multiple',
      rating: 'Évaluation',
      date: 'Date',
      file: 'Fichier',
      matrix: 'Matrice',
      ranking: 'Classement',
      numeric: 'Numérique'
    };
    
    return typeLabels[type] || type;
  }
  
  onSubmit(): void {
    if (this.questionForm.invalid) {
      this.markFormGroupTouched(this.questionForm);
      this.notificationService.warning('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    this.isLoading = true;
    const questionData = this.prepareQuestionData();
    
    const saveOperation = this.questionId
      ? this.questionService.updateQuestion(this.questionId, questionData)
      : this.questionService.createQuestion(questionData);
      
    saveOperation.subscribe({
      next: () => {
        const message = this.questionId 
          ? 'Question mise à jour avec succès'
          : 'Question créée avec succès';
        this.notificationService.success(message);
        this.router.navigate(['/question-bank']);
        this.isLoading = false;
      },
      error: (err) => {
        this.notificationService.error('Erreur lors de l\'enregistrement de la question');
        this.isLoading = false;
        console.error(err);
      }
    });
  }
  
  prepareQuestionData(): any {
    const formValue = this.questionForm.value;
    
    // Filter out settings that are not relevant to the question type
    const settings: any = {};
    
    switch (formValue.type) {
      case QuestionType.TEXT_SHORT:
      case QuestionType.TEXT_LONG:
        settings.placeholder = formValue.settings.placeholder;
        break;
      case QuestionType.NUMERIC:
        settings.minValue = formValue.settings.minValue;
        settings.maxValue = formValue.settings.maxValue;
        settings.step = formValue.settings.step;
        break;
      case QuestionType.FILE:
        settings.allowMultipleFiles = formValue.settings.allowMultipleFiles;
        settings.maxFileSize = formValue.settings.maxFileSize;
        settings.acceptedFileTypes = formValue.settings.acceptedFileTypes;
        break;
      // Add other type-specific settings as needed
    }
    
    return {
      title: formValue.title,
      description: formValue.description,
      type: formValue.type,
      isRequired: formValue.isRequired,
      options: formValue.type === QuestionType.SINGLE_CHOICE || formValue.type === QuestionType.MULTIPLE_CHOICE
        ? formValue.options
        : [],
      settings: settings,
      order: 0 // This would typically be set by the backend or when adding to a survey
    };
  }
  
  cancel(): void {
    this.router.navigate(['/question-bank']);
  }
  
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        for (let i = 0; i < control.length; i++) {
          const arrayControl = control.at(i);
          if (arrayControl instanceof FormGroup) {
            this.markFormGroupTouched(arrayControl);
          } else {
            arrayControl.markAsTouched();
          }
        }
      }
    });
  }
}