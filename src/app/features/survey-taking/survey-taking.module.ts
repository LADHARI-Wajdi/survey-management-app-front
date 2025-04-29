import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SurveyTakingRoutingModule } from './survey-taking-routing.module';
import { SurveyParticipantViewComponent } from './components/survey-participant-view/survey-participant-view.component';
import { QuestionResponseComponent } from './components/question-response/question-response.component';
import { SurveyCompletionComponent } from './components/survey-completion/survey-completion.component';
import { SurveyProgressService } from './services/survey-progress.service';

// Création du service manquant ou utilisation d'un autre service existant
import { SurveyProgressService as SurveyResponseService } from './services/survey-progress.service';

@NgModule({
  declarations: [

  ],
  imports: [
    SurveyParticipantViewComponent,
    QuestionResponseComponent,
    SurveyCompletionComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SurveyTakingRoutingModule
  ],
  providers: [
    SurveyProgressService,
    SurveyResponseService
  ]
})
export class SurveyTakingModule { }