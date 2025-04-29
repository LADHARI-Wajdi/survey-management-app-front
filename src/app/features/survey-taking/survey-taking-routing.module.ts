// src/app/features/survey-taking/survey-taking-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { SurveyParticipantViewComponent } from './components/survey-participant-view/survey-participant-view.component';

const routes: Routes = [
  {
    path: 'take-survey/:id',
    component: SurveyParticipantViewComponent,
    data: { title: 'Participer à l\'enquête' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SurveyTakingRoutingModule { }