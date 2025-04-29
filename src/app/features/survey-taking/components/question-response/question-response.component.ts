// src/app/features/survey-taking/components/question-response/question-response.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Question, QuestionOption, QuestionType } from '../../../../core/models/question.model';

@Component({
  selector: 'app-question-response',
  templateUrl: './question-response.component.html',
  styleUrls: ['./question-response.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class QuestionResponseComponent implements OnInit {
  @Input() question!: Question;
  @Input() responseValue: any = null;
  @Input() showValidation = false;
  @Output() responseChange = new EventEmitter<any>();
  
  responseForm!: FormGroup;
  isRequired = false;
  QuestionType = QuestionType; // For template use
  
  constructor(private fb: FormBuilder) {}
  
  ngOnInit(): void {
    this.initForm();
    
    // Set initial value if provided
    if (this.responseValue) {
      this.setResponseValue(this.responseValue);
    }
    
    this.isRequired = this.question.isRequired;
  }
  
  private initForm(): void {
    // Create different form controls based on question type
    switch(this.question.type) {
      case QuestionType.TEXT_SHORT:
      case QuestionType.TEXT_LONG:
        this.responseForm = this.fb.group({
          response: [null, this.isRequired ? Validators.required : null]
        });
        break;
        
      case QuestionType.SINGLE_CHOICE:
        this.responseForm = this.fb.group({
          response: [null, this.isRequired ? Validators.required : null]
        });
        break;
        
      case QuestionType.MULTIPLE_CHOICE:
        // Create a form group with a form control for each option
        const optionControls: {[key: string]: FormControl} = {};
        
        if (this.question.options) {
          this.question.options.forEach(option => {
            optionControls[option.id] = new FormControl(false);
          });
        }
        
        this.responseForm = this.fb.group(optionControls);
        
        // Add validator if required - at least one option must be selected
        if (this.isRequired) {
          this.responseForm.setValidators(this.atLeastOneOptionSelected.bind(this) as ValidatorFn);
        }
        break;
        
      case QuestionType.RATING:
        this.responseForm = this.fb.group({
          response: [null, this.isRequired ? Validators.required : null]
        });
        break;
        
      case QuestionType.DATE:
        this.responseForm = this.fb.group({
          response: [null, this.isRequired ? Validators.required : null]
        });
        break;
        
      case QuestionType.FILE:
        this.responseForm = this.fb.group({
          response: [null, this.isRequired ? Validators.required : null]
        });
        break;
        
      case QuestionType.NUMERIC:
        this.responseForm = this.fb.group({
          response: [null, [
            this.isRequired ? Validators.required : null,
            Validators.pattern('^-?[0-9]\\d*(\\.\\d+)?$')
          ].filter(Boolean)]
        });
        break;
        
      default:
        this.responseForm = this.fb.group({
          response: [null]
        });
    }
    
    // Subscribe to form value changes to emit the new response
    this.responseForm.valueChanges.subscribe(value => {
      const responseValue = this.getResponseValue();
      this.responseChange.emit(responseValue);
    });
  }
  
  // Custom validator for multiple choice - at least one option must be selected
  private atLeastOneOptionSelected(group: FormGroup): {[key: string]: any} | null {
    const controls = group.controls;
    const isSelected = Object.keys(controls).some(key => controls[key].value === true);
    
    return isSelected ? null : { atLeastOneOption: true };
  }
  
  setResponseValue(value: any): void {
    if (!value) return;
    
    switch(this.question.type) {
      case QuestionType.MULTIPLE_CHOICE:
        // For multiple choice, set each option's checked state
        if (Array.isArray(value)) {
          const formValue: {[key: string]: boolean} = {};
          
          // Initialize all to false
          if (this.question.options) {
            this.question.options.forEach(option => {
              formValue[option.id] = false;
            });
          }
          
          // Set selected options to true
          value.forEach(selectedId => {
            if (formValue.hasOwnProperty(selectedId)) {
              formValue[selectedId] = true;
            }
          });
          
          this.responseForm.patchValue(formValue);
        }
        break;
        
      default:
        // For other types, just set the response value
        this.responseForm.patchValue({ response: value });
    }
  }
  
  getResponseValue(): any {
    switch(this.question.type) {
      case QuestionType.MULTIPLE_CHOICE:
        // For multiple choice, return an array of selected option IDs
        const formValue = this.responseForm.value;
        return Object.keys(formValue).filter(key => formValue[key] === true);
        
      default:
        // For other types, return the response value
        return this.responseForm.value.response;
    }
  }
  
  isValid(): boolean {
    return this.responseForm.valid;
  }
  
  // Helper method to get star rating display
  getRatingArray(max: number = 5): number[] {
    return Array(max).fill(0).map((_, i) => i + 1);
  }
  
  // Handle file uploads
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length) {
      const files = Array.from(input.files);
      this.responseForm.patchValue({ response: files });
      this.responseChange.emit(files);
    }
  }
  
  // Helper for text display in multiple choice
  getOptionText(option: QuestionOption): string {
    return option.text || option.value || '';
  }
}