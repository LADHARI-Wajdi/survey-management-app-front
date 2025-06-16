// src/app/features/question-bank/question-bank.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { QuestionBankRoutingModule } from './question-bank-routing.module';
import { QuestionService } from './services/question.service';

// Import des composants standalone
import { QuestionCreateComponent } from './components/question-create/question-create.component';
import { QuestionListComponent } from './components/question-list/question-list.component';
import { TextQuestionComponent } from './components/question-types/text-question/text-question.component';
import { ChoiceQuestionComponent } from './components/question-types/choice-question/choice-question.component';
import { ScaleQuestionComponent } from './components/question-types/scale-question/scale-question.component';
import { DateQuestionComponent } from './components/question-types/date-question/date-question.component';
import { FileQuestionComponent } from './components/question-types/file-question/file-question.component';
import { QuestionResponseComponent } from '../survey-taking/components/question-response/question-response.component';
import { Routes } from '@angular/router';
import { QuestionEditComponent } from './components/question-edit/question-edit.component';

const routes: Routes = [
  { path: '', component: QuestionListComponent },
  { path: 'create', component: QuestionCreateComponent },
  { path: ':id/edit', component: QuestionEditComponent }
];
@NgModule({
  declarations: [],

 
  imports: [
    CommonModule,
    QuestionBankRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    // Importer les composants standalone
    QuestionCreateComponent,
    QuestionListComponent,
    QuestionResponseComponent,
    TextQuestionComponent,
    ChoiceQuestionComponent,
    ScaleQuestionComponent,
    DateQuestionComponent,
    FileQuestionComponent
  ],
  providers: [
    QuestionService
  ],
  exports: [
    // Exporter uniquement les composants qu'on a importés (qui sont standalone)
    
  ]
})
export class QuestionBankModule { }