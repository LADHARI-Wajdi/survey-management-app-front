import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DistributionService } from '../../services/distribution.service';
import { QrCode } from '../../models/distribution.model';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-qr-code-generator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './qr-code-generator.component.html',
  styleUrl: './qr-code-generator.component.scss'
})
export class QrCodeGeneratorComponent implements OnInit {
  @Input() distributionId!: string;
  
  qrCode: QrCode | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(private distributionService: DistributionService) {}

  ngOnInit(): void {
    if (this.distributionId) {
      this.generateQRCode();
    }
  }

  generateQRCode(): void {
    this.isLoading = true;
    this.error = null;

    this.distributionService.generateQrCode(this.distributionId)
      .pipe(
        catchError(error => {
          this.error = 'Failed to generate QR code. Please try again.';
          console.error('Error generating QR code:', error);
          return of(null);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(response => {
        if (response) {
          this.qrCode = response;
        }
      });
  }

  downloadQRCode(): void {
    if (this.qrCode?.imageUrl) {
      const link = document.createElement('a');
      link.href = this.qrCode.imageUrl;
      link.download = `qr-code-${this.distributionId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
