// shared/pipes/truncate.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  transform(
    value: string,
    limit: number = 100,
    completeWords: boolean = false,
    ellipsis: string = '...'
  ): string {
    if (!value) {
      return '';
    }

    if (value.length <= limit) {
      return value;
    }

    if (completeWords) {
      // Find the last complete word within the limit
      let truncated = value.substring(0, limit);
      const lastSpaceIndex = truncated.lastIndexOf(' ');

      if (lastSpaceIndex !== -1) {
        truncated = truncated.substring(0, lastSpaceIndex);
      }

      return truncated + ellipsis;
    } else {
      return value.substring(0, limit) + ellipsis;
    }
  }
}
