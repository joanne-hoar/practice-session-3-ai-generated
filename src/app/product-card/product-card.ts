import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../product';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input() product!: Product;
  @Output() addToCartEvent = new EventEmitter<number>();

  onAddToCart() {
    this.addToCartEvent.emit(this.product.id);
  }
}
