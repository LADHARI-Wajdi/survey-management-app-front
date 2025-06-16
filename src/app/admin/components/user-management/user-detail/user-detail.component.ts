// src/app/admin/components/user-management/user-detail/user-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserManagementService } from '../services/user-management.service';
import { forkJoin } from 'rxjs';
import { SurveyResultsComponent } from '../../../../features/analytics/components/survey-results/survey-results.component';
import { User, UserRole } from '../../../../core/authentication/models/user.model';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  static parseUser(user: User): import("../../../../core/authentication/models/user.model").UserAuth | null {
    throw new Error('Method not implemented.');
  }
  userId: string;
  user: UserRole | null = null;
  isLoading = true;
  userActivity: any[] = [];
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserManagementService,
    private snackBar: MatSnackBar
  ) {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    if (!this.userId) {
      this.snackBar.open('ID utilisateur manquant', 'Fermer', { duration: 3000 });
      this.router.navigate(['/admin/users']);
      return;
    }

    this.isLoading = true;

    // Utiliser forkJoin pour charger l'utilisateur et ses activités en parallèle
//
  }
}