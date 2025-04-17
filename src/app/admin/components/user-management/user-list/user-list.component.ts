import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogActions } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { UserManagementService } from '../services/user-management.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserProfileModel, UserRole } from '../models/user-profile.model';
import { UserManagementModule } from '../user-management.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogActions,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    MatButtonModule,
    MatSnackBarModule,

  ],
})
export class UserListComponent implements OnInit {
  users: UserProfileModel[] = [];
  displayedColumns: string[] = [
    'username',
    'email',
    'role',
    'createdAt',
    'actions',
  ];
  isLoading = true;

  constructor(
    private userService: UserManagementService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users', error);
        this.snackBar.open(
          'Erreur lors du chargement des utilisateurs',
          'Fermer',
          {
            duration: 3000,
          }
        );
        this.isLoading = false;
      },
    });
  }

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(UserManagementModule, {
      width: '400px',
      data: { user: null },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  editUser(user: UserProfileModel): void {
    this.router.navigate(['/admin/users/edit', user.id]);
  }

  viewUserDetails(user: UserProfileModel): void {
    this.router.navigate(['/admin/users/detail', user.id]);
  }

  deleteUser(user: UserProfileModel): void {
    if (
      confirm(
        `Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.username}?`
      )
    ) {
      this.userService.deleteUser(user.id!).subscribe({
        next: () => {
          this.snackBar.open('Utilisateur supprimé avec succès', 'Fermer', {
            duration: 3000,
          });
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error deleting user', error);
          this.snackBar.open(
            "Erreur lors de la suppression de l'utilisateur",
            'Fermer',
            {
              duration: 3000,
            }
          );
        },
      });
    }
  }

  getRoleDisplayName(role: UserRole): string {
    switch (role) {
      case UserRole.ADMIN:
        return 'Administrateur';
      case UserRole.INVESTIGATOR:
        return 'Investigateur';
      case UserRole.PARTICIPANT:
        return 'Participant';
      default:
        return role;
    }
  }
}
