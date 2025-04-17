// shared/pipes/filter.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string, properties: string[]): any[] {
    if (!items) {
      return [];
    }

    if (!searchText || !properties || properties.length === 0) {
      return items;
    }

    searchText = searchText.toLowerCase();

    return items.filter((item) => {
      return properties.some((prop) => {
        const value = this.getPropertyValue(item, prop);

        if (value === null || value === undefined) {
          return false;
        }

        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchText);
        } else if (typeof value === 'number') {
          return value.toString().includes(searchText);
        } else if (value instanceof Date) {
          return value.toLocaleString().toLowerCase().includes(searchText);
        }

        return false;
      });
    });
  }

  /**
   * Get the value of a nested property using dot notation
   * e.g. "user.address.city"
   */
  private getPropertyValue(obj: any, path: string): any {
    return path.split('.').reduce((prev, curr) => {
      return prev ? prev[curr] : null;
    }, obj);
  }
}
