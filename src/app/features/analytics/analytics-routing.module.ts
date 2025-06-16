// features/analytics/analytics-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import composants
import { AnalyticsDashboardComponent } from './components/analytics-dashboard/analytics-dashboard.component';
import { SurveyResultsComponent } from './components/survey-results/survey-results.component';
import { QuestionStatisticsComponent } from './components/question-statistics/question-statistics.component';
import { authGuard } from '../../core/guards/auth.guard';

// Import guards

const routes: Routes = [
  {
    path: '',
    component: AnalyticsDashboardComponent,
    canActivate: [authGuard],
    data: { title: 'Tableau de bord d\'analyses' }
  },
  {
    path: 'survey/:id',
    component: SurveyResultsComponent,
    canActivate: [authGuard],
    data: { title: 'Résultats de l\'enquête' }
  },
  {
    path: 'survey/:surveyId/question/:questionId',
    component: QuestionStatisticsComponent,
    canActivate: [authGuard],
    data: { title: 'Statistiques de question' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyticsRoutingModule { }