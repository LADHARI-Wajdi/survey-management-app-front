import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../../../core/models/user.model';
import { UserManagementService } from '../services/user-management.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ]
})
export class UserEditComponent implements OnInit {
  userForm!: FormGroup;
  userId: string = '';
  user: User | null = null;
  isLoading = false;
  availableRoles: string[] = ['admin', 'investigator', 'analyst', 'participant'];
  
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserManagementService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.userId = this.route.snapshot.paramMap.get('id') || '';
    
    if (this.userId) {
      this.loadUserData();
    } else {
      this.snackBar.open('ID utilisateur non valide', 'Fermer', { duration: 3000 });
      this.router.navigate(['/admin/users']);
    }
  }

  initForm(): void {
    this.userForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      roles: [[], Validators.required]
    });
  }

  loadUserData(): void {
    this.isLoading = true;
    this.userService.getUserById(this.userId).subscribe({
      next: (user) => {
        this.user = user;
        this.updateForm(user);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données utilisateur', error);
        this.snackBar.open('Erreur lors du chargement des données utilisateur', 'Fermer', { duration: 3000 });
        this.isLoading = false;
        this.router.navigate(['/admin/users']);
      }
    });
  }

  updateForm(user: User): void {
    this.userForm.patchValue({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email,
      username: user.username,
      roles: user.roles
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }

    this.isLoading = true;
    const userData: Partial<User> = this.userForm.value;
    
    this.userService.updateUser(this.userId, userData).subscribe({
      next: () => {
        this.snackBar.open('Utilisateur mis à jour avec succès', 'Fermer', { duration: 3000 });
        this.isLoading = false;
        this.router.navigate(['/admin/users']);
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour de l\'utilisateur', error);
        this.snackBar.open('Erreur lors de la mise à jour de l\'utilisateur', 'Fermer', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/users']);
  }
}