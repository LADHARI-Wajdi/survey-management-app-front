// shared/components/confirm-dialog/confirm-dialog.component.ts
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

export interface ConfirmDialogOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmType?: 'primary' | 'danger' | 'success' | 'warning';
  dialogClass?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  @Input() isOpen = false;
  @Input() options: ConfirmDialogOptions = {
    title: 'Confirmation',
    message: 'Êtes-vous sûr de vouloir effectuer cette action?',
    confirmText: 'Confirmer',
    cancelText: 'Annuler',
    confirmType: 'primary',
    dialogClass: ''
  };
  
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  onConfirm(): void {
    this.confirm.emit();
    this.isOpen = false;
  }

  onCancel(): void {
    this.cancel.emit();
    this.isOpen = false;
  }

  onClose(): void {
    this.close.emit();
    this.isOpen = false;
  }

  /**
   * Prevent click events inside the dialog from closing it
   */
  onDialogClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}