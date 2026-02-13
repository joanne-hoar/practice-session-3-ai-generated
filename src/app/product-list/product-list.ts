import { Component, inject } from '@angular/core';
import { ProductCard } from '../product-card/product-card';
import { Product } from '../product';
import { CartService } from '../services/cart-service';

@Component({
  selector: 'app-product-list',
  imports: [ProductCard],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  cartService = inject(CartService);
  
  allProducts: Product[] = [
    { id: 1, name: "Laptop" },
    { id: 2, name: "Tablet" },
    { id: 3, name: "Smartphone" },
    { id: 4, name: "Headphones" },
    { id: 5, name: "Mouse" },
    { id: 6, name: "Keyboard" }
  ];

  receiveAddToCart(id: number) {
    const product = this.allProducts.find(p => p.id === id);
    if (product) {
      this.cartService.addToCart(product);
    }
  }
}
