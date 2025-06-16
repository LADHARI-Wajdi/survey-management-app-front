import { Pipe, PipeTransform } from '@angular/core';
import { QuestionType } from '../models/question.model';

@Pipe({
  name: 'questionTypeLabel',
  standalone: true
})
export class QuestionTypeLabelPipe implements PipeTransform {
  transform(type: QuestionType): string {
    const types: { [key in QuestionType]: string } = {
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

    return types[type] || type;
  }
} 