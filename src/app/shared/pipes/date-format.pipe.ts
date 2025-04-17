// shared/pipes/date-format.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'dateFormat',
})
export class DateFormatPipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}

  transform(
    value: Date | string | number,
    format: string = 'mediumDate',
    timezone?: string,
    locale: string = 'fr-FR'
  ): string | null {
    if (!value) {
      return '';
    }

    // If the format is "fromNow", calculate a relative date like "il y a 5 minutes"
    if (format === 'fromNow') {
      return this.getRelativeTime(new Date(value));
    }

    return this.datePipe.transform(value, format, timezone, locale);
  }

  /**
   * Get a relative time string like "il y a 5 minutes" or "dans 3 jours"
   */
  private getRelativeTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const isInPast = diff > 0;
    const absDiff = Math.abs(diff);

    const seconds = Math.floor(absDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    const prefix = isInPast ? 'il y a ' : 'dans ';

    if (seconds < 60) {
      return isInPast ? "à l'instant" : 'dans un instant';
    } else if (minutes < 60) {
      return `${prefix}${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else if (hours < 24) {
      return `${prefix}${hours} heure${hours > 1 ? 's' : ''}`;
    } else if (days < 30) {
      return `${prefix}${days} jour${days > 1 ? 's' : ''}`;
    } else if (months < 12) {
      return `${prefix}${months} mois`;
    } else {
      return `${prefix}${years} an${years > 1 ? 's' : ''}`;
    }
  }
}
