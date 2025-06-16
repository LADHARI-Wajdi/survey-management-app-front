// features/survey-management/survey-management.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SurveyManagementRoutingModule } from './survey-management-routing.module';
import { SharedModule } from '../../shared/shared.module';

// Components
import { SurveyListComponent } from './components/survey-list/survey-list.component';
import { SurveyCreateComponent } from './components/survey-create/survey-create.component';
import { SurveyDetailComponent } from './components/survey-detail/survey-detail.component';
import { SurveyEditComponent } from './components/survey-edit/survey-edit.component';
import { SurveySettingsComponent } from './components/survey-settings/survey-settings.component';

// Services
import { SurveyService } from './services/survey.service';
import { SurveyTemplateService } from './services/survey-template.service';

@NgModule({
  declarations: [
    // Non-standalone components would be declared here
  ],
  imports: [

    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SurveyManagementRoutingModule,
    // Import standalone components
    SurveyListComponent,
    SurveyCreateComponent,
    SurveyDetailComponent,
    SurveyEditComponent,
    SurveySettingsComponent
  ],
  providers: [
    SurveyService,
    SurveyTemplateService
  ]
})
export class SurveyManagementModule { }