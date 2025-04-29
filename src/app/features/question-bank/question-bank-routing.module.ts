// features/question-bank/question-bank-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Composants
import { QuestionListComponent } from './components/question-list/question-list.component';
import { QuestionCreateComponent } from './components/question-create/question-create.component';

// Guards
import { authGuard } from '../../core/guards/auth.guard';
import { QuestionResponseComponent } from '../survey-taking/components/question-response/question-response.component';

const routes: Routes = [
  {
    path: '',
    component: QuestionListComponent,
    canActivate: [authGuard],
    data: { title: 'Banque de questions' },
  },
  {
    path: 'create',
    component: QuestionCreateComponent,
    canActivate: [authGuard],
    data: { title: 'Créer une question' },
  },
  {
    path: 'edit/:id',
    component:QuestionResponseComponent,
    canActivate: [authGuard],
    data: { title: 'Modifier une question' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuestionBankRoutingModule {}
