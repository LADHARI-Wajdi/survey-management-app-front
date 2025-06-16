// features/survey-management/survey-management-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { SurveyListComponent } from './components/survey-list/survey-list.component';
import { SurveyCreateComponent } from './components/survey-create/survey-create.component';
import { SurveyDetailComponent } from './components/survey-detail/survey-detail.component';
import { SurveyEditComponent } from './components/survey-edit/survey-edit.component';
import { SurveySettingsComponent } from './components/survey-settings/survey-settings.component';

// Guards
import { SurveyAccessGuard } from '../../core/guards/survey-access.guard';

const routes: Routes = [
  {
    path: '',
    component: SurveyListComponent,
    data: { title: 'Mes enquêtes' }
  },
  {
    path: 'create',
    component: SurveyCreateComponent,
    data: { title: 'Créer une enquête' }
  },
  {
    path: ':id',
    component: SurveyDetailComponent,
    canActivate: [SurveyAccessGuard],
    data: { title: 'Détails de l\'enquête' }
  },
  {
    path: ':id/edit',
    component: SurveyEditComponent,
    canActivate: [SurveyAccessGuard],
    data: { title: 'Modifier l\'enquête' }
  },
  {
    path: ':id/settings',
    component: SurveySettingsComponent,
    canActivate: [SurveyAccessGuard],
    data: { title: 'Paramètres de l\'enquête' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SurveyManagementRoutingModule { }