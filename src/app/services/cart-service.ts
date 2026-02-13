import { Injectable, signal } from '@angular/core';
import { Product } from '../product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  items = signal<Product[]>([]);

  addToCart(product: Product): void {
    this.items.set([...this.items(), product]);
  }
}
