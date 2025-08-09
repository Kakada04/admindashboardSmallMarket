
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import {CommonModule} from '@angular/common'


@Component({
  selector: 'app-delete-confirmation',
  imports: [CommonModule],
  templateUrl: './delete-confirmation.html',
  styleUrl: './delete-confirmation.css',
  
})
export class DeleteConfirmation {
  @Input() isOpen = signal(false);
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  confirm() {
    this.confirmed.emit();
    this.isOpen.set(false);
  }

  cancel() {
    this.cancelled.emit();
    this.isOpen.set(false);
  }
}