import { Component, inject } from '@angular/core';
import { ProductList } from '../../product-list/product-list';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-products-page',
  imports: [ProductList],
  templateUrl: './products-page.html',
  styleUrl: './products-page.css',
})
export class ProductsPage {
  cartService = inject(CartService);
}

