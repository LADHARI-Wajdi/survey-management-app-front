import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

import { Question, QuestionType, QuestionOption } from '../../../../core/models/question.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { QuestionTypeLabelPipe } from '../../../../core/pipes/question-type-label.pipe';

@Component({
  selector: 'app-question-create-modal',
  templateUrl: './question-create-modal.component.html',
  styleUrls: ['./question-create-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    QuestionTypeLabelPipe
  ]
})
export class QuestionCreateModalComponent implements OnInit {
  questionForm: FormGroup;
  optionsForm: FormGroup;
  questionTypes = Object.values(QuestionType);
  showOptions = false;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<QuestionCreateModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Partial<Question>,
    private notificationService: NotificationService
  ) {
    this.isEditMode = !!data?.id;
    
    this.questionForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      type: [QuestionType.SINGLE_CHOICE, Validators.required],
      isRequired: [true],
      order: [data?.order || 1]
    });

    this.optionsForm = this.fb.group({
      options: this.fb.array([])
    });

    if (data) {
      this.questionForm.patchValue({
        title: data.title,
        description: data.description,
        type: data.type || QuestionType.SINGLE_CHOICE,
        isRequired: data.isRequired ?? true,
        order: data.order || 1
      });

      if (data.options && data.options.length > 0) {
        this.showOptions = [QuestionType.SINGLE_CHOICE, QuestionType.MULTIPLE_CHOICE].includes(data.type || QuestionType.SINGLE_CHOICE);
        data.options.forEach(option => {
          this.addOption({
            id: option.id || `opt_${Date.now()}`,
            text: option.text,
            value: option.value,
            imageUrl: option.imageUrl,
            isOther: option.isOther
          });
        });
      }
    }
  }

  ngOnInit(): void {
    this.questionForm.get('type')?.valueChanges.subscribe(type => {
      this.showOptions = [QuestionType.SINGLE_CHOICE, QuestionType.MULTIPLE_CHOICE].includes(type);
      if (!this.showOptions) {
        const optionsArray = this.optionsForm.get('options') as FormArray;
        optionsArray.clear();
      }
    });
  }

  get options() {
    return this.optionsForm.get('options') as FormArray;
  }

  addOption(option?: Partial<QuestionOption>) {
    const options = this.optionsForm.get('options') as FormArray;
    options.push(this.fb.group({
      id: [option?.id || `opt_${Date.now()}`],
      text: [option?.text || '', Validators.required],
      value: [option?.value || ''],
      imageUrl: [option?.imageUrl || ''],
      isOther: [option?.isOther || false]
    }));
  }

  removeOption(index: number) {
    const options = this.optionsForm.get('options') as FormArray;
    options.removeAt(index);
  }

  onSubmit() {
    if (this.questionForm.invalid) {
      this.questionForm.markAllAsTouched();
      return;
    }

    if (this.showOptions && this.options.length === 0) {
      this.notificationService.error('Veuillez ajouter au moins une option');
      return;
    }

    const questionData: Partial<Question> = {
      ...this.questionForm.value,
      options: this.showOptions ? this.options.value : [],
      id: this.isEditMode ? this.data.id : undefined
    };

    this.dialogRef.close(questionData);
  }

  onCancel() {
    this.dialogRef.close();
  }
} 