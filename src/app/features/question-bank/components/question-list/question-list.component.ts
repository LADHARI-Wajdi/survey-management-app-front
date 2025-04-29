// features/question-bank/components/question-list/question-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

import { Question, QuestionType } from '../../../../core/models/question.model';
import { QuestionService } from '../../services/question.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { QuestionCreateComponent } from '../question-create/question-create.component';
import { ConfirmDialogComponent, ConfirmDialogOptions } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { FilterPipe } from '../../../../shared/pipes/filter.pipe';
import { TruncatePipe } from '../../../../shared/pipes/truncate.pipe';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    MatChipsModule,
    MatMenuModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSelectModule,
    MatDividerModule,
    DragDropModule,
    QuestionCreateComponent,
    TruncatePipe
]
})
export class QuestionListComponent implements OnInit {
onQuestionCreated($event: Question) {
throw new Error('Method not implemented.');
}
  questions: Question[] = [];
  filteredQuestions: Question[] = [];
  selectedQuestion: Question | null = null;
  
  // État de l'interface
  isLoading = false;
  isCreatingQuestion = false;
  isEditingQuestion = false;
  searchQuery = '';
  
  // Pagination
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 20, 50];
  
  // Filtres
  selectedTypes: QuestionType[] = [];
  questionTypes = Object.values(QuestionType);
  
  // Mode tri
  sortMode: 'name' | 'date' | 'type' = 'name';

  constructor(
    private questionService: QuestionService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadQuestions();
  }

  /**
   * Charge la liste des questions
   */
  loadQuestions(): void {
    this.isLoading = true;
    this.questionService.getAllQuestions().subscribe(
      (questions) => {
        this.questions = questions;
        this.applyFilters();
        this.isLoading = false;
      },
      (error) => {
        this.notificationService.error('Erreur lors du chargement des questions');
        console.error('Error loading questions', error);
        this.isLoading = false;
      }
    );
  }

  /**
   * Applique les filtres de recherche et tri
   */
  applyFilters(): void {
    // Filtrer par type si des types sont sélectionnés
    let filtered = this.questions;
    if (this.selectedTypes.length > 0) {
      filtered = filtered.filter(q => this.selectedTypes.includes(q.type));
    }

    // Filtrer par texte de recherche
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        q => q.title.toLowerCase().includes(query) || 
             (q.description && q.description.toLowerCase().includes(query))
      );
    }

    // Trier les résultats
    filtered = this.sortQuestions(filtered, this.sortMode);

    this.filteredQuestions = filtered;
  }

  /**
   * Tri les questions selon le mode sélectionné
   */
  sortQuestions(questions: Question[], mode: 'name' | 'date' | 'type'): Question[] {
    return [...questions].sort((a, b) => {
      switch (mode) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'date':
          // Dans une implémentation réelle, on utiliserait un timestamp
          return a.order - b.order;
        default:
          return 0;
      }
    });
  }

  /**
   * Gère le changement de page
   */
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
  }

  /**
   * Filtre les questions par type
   */
  onTypeFilterChange(): void {
    this.applyFilters();
  }

  /**
   * Recherche de questions
   */
  onSearch(): void {
    this.applyFilters();
  }

  /**
   * Change le mode de tri
   */
  changeSortMode(mode: 'name' | 'date' | 'type'): void {
    this.sortMode = mode;
    this.applyFilters();
  }

  /**
   * Crée une nouvelle question
   */
  createQuestion(): void {
    this.isCreatingQuestion = true;
    this.isEditingQuestion = false;
    this.selectedQuestion = null;
  }

  /**
   * Ouvre l'éditeur pour modifier une question
   */
  editQuestion(question: Question): void {
    this.selectedQuestion = question;
    this.isEditingQuestion = true;
    this.isCreatingQuestion = true;
  }

  /**
   * Duplique une question
   */
  duplicateQuestion(question: Question): void {
    this.questionService.duplicateQuestion(question.id).subscribe(
      (duplicated: Question) => {
        this.notificationService.success('Question dupliquée avec succès');
        this.questions.push(duplicated);
        this.applyFilters();
      },
      (error: any) => {
        this.notificationService.error('Erreur lors de la duplication de la question');
        console.error('Error duplicating question', error);
      }
    );
  }

  /**
   * Supprime une question après confirmation
   */
  deleteQuestion(question: Question): void {
    const options: ConfirmDialogOptions = {
      title: 'Supprimer la question',
      message: `Êtes-vous sûr de vouloir supprimer la question "${question.title}" ? Cette action est irréversible.`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      confirmType: 'danger'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: options
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.questionService.deleteQuestion(question.id).subscribe(
          () => {
            this.notificationService.success('Question supprimée avec succès');
            this.questions = this.questions.filter(q => q.id !== question.id);
            this.applyFilters();
          },
          (error): void => {
            this.notificationService.error('Erreur lors de la suppression de la question');
            console.error('Error deleting question', error);
          }
        );
      }
    });
  }

  /**
   * Gère l'événement de création de question
   */
  someMethod() {
    this.questions.push(this.questions[0]);      
    this.applyFilters();
    this.isCreatingQuestion = false;    
    this.notificationService.success('Question créée avec succès');
  }

  /**
   * Gère l'événement de mise à jour de question
   */
  onQuestionUpdated(question: Question): void {
    const index = this.questions.findIndex(q => q.id === question.id);
    if (index !== -1) {
      this.questions[index] = question;
      this.applyFilters();
    }
    this.isCreatingQuestion = false;
    this.isEditingQuestion = false;
    this.selectedQuestion = null;
    this.notificationService.success('Question mise à jour avec succès');
  }

  /**
   * Annule la création/édition d'une question
   */
  onCancelQuestion(): void {
    this.isCreatingQuestion = false;
    this.isEditingQuestion = false;
    this.selectedQuestion = null;
  }

  /**
   * Gère le réarrangement des questions par drag & drop
   */
  onDrop(event: CdkDragDrop<Question[]>): void {
    if (event.previousIndex === event.currentIndex) return;

    moveItemInArray(this.filteredQuestions, event.previousIndex, event.currentIndex);
    
    // Mettre à jour l'ordre des questions
    const questionIds = this.filteredQuestions.map(q => q.id);
    this.questionService['updateQuestionOrder'](questionIds).subscribe(
      () => {
        this.notificationService.success('Ordre des questions mis à jour avec succès');
      },  
      (error: any) => {
        this.notificationService.error('Erreur lors de la mise à jour de l\'ordre des questions');
        console.error('Error reordering questions', error);
      }
    );
  }

  /**
   * Retourne un libellé lisible pour un type de question
   */
  getQuestionTypeLabel(type: QuestionType): string {
    const typeLabels: Record<QuestionType, string> = {
      [QuestionType.TEXT_SHORT]: 'Réponse courte',
      [QuestionType.TEXT_LONG]: 'Réponse longue',
      [QuestionType.SINGLE_CHOICE]: 'Choix unique',
      [QuestionType.MULTIPLE_CHOICE]: 'Choix multiple',
      [QuestionType.RATING]: 'Évaluation',
      [QuestionType.DATE]: 'Date',
      [QuestionType.FILE]: 'Fichier',
      [QuestionType.MATRIX]: 'Matrice',
      [QuestionType.RANKING]: 'Classement',
      [QuestionType.NUMERIC]: 'Numérique'
    };
    
    return typeLabels[type] || type;
  }

  /**
   * Retourne la couleur de la puce pour un type de question
   */
  getTypeChipColor(type: QuestionType): string {
    switch (type) {
      case QuestionType.TEXT_SHORT:
      case QuestionType.TEXT_LONG:
        return 'primary';
      case QuestionType.SINGLE_CHOICE:
      case QuestionType.MULTIPLE_CHOICE:
        return 'accent';
      case QuestionType.RATING:
        return 'warn';
      default:
        return 'basic';
    }     
  }
}