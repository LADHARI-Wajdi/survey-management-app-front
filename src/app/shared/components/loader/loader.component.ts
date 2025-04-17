// shared/components/loader/loader.component.ts
import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../core/services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {
  isLoading = false;

  constructor(private loaderService: LoaderService) {}

  ngOnInit(): void {
    this.loaderService.loading$.subscribe((isLoading) => {
      // Small delay to prevent flashing for very quick operations
      if (isLoading) {
        this.isLoading = true;
      } else {
        setTimeout(() => {
          this.isLoading = false;
        }, 200);
      }
    });
  }
}
