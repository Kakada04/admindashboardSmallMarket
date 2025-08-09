import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Product} from '../../security/service/adminservice'

@Component({
  selector: 'app-product-details',
  imports: [],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails {
  @Input() visible: boolean = false;
   @Input() product!: Product;
  @Output() close = new EventEmitter<void>();
 imageUrl: string = 'http://localhost:8000/storage/';
  hideModal() {
    this.close.emit();
  }
}