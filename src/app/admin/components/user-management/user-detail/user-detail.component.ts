import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserProfileModel } from '../models/user-profile.model';
import { UserManagementService } from '../services/user-management.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  userId: string;
  user: UserProfileModel | null = null;
  isLoading = true;
  
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

    this.userService.getUserById(this.userId).subscribe({
      next: (user) => {
        this.user = user;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement de l\'utilisateur', error);
        this.snackBar.open('Erreur lors du chargement de l\'utilisateur', 'Fermer', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }
}