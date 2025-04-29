// src/app/admin/components/user-management/user-list/user-list.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { UserManagementService } from '../services/user-management.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserEditComponent } from '../user-edit/user-edit.component';
import { User, UserRole} from '../../../../core/authentication/models/user.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ]
})
export class UserListComponent implements OnInit {
  users: User[] = [];
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
    const dialogRef = this.dialog.open(UserEditComponent, {
      width: '400px',
      data: { user: null },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  editUser(user: User): void {
    this.router.navigate(['/admin/users/edit', user.id]);
  }

  viewUserDetails(user: User): void {
    this.router.navigate(['/admin/users/detail', user.id]);
  }

  deleteUser(user: User): void {
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