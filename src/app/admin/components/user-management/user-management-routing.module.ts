import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Composants
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserEditComponent } from './user-edit/user-edit.component';

// Routes pour la gestion des utilisateurs
const routes: Routes = [
  {
    path: '',
    component: UserListComponent
  },
  {
    path: 'add',
    component: UserEditComponent
  },
  {
    path: 'detail/:id',
    component: UserDetailComponent
  },
  {
    path: 'edit/:id',
    component: UserEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }