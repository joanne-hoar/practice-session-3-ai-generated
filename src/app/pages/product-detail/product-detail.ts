import { Input } from '@angular/core';
import { Product } from '../../product';

export class ProductDetail {
  @Input() id!: number;
  product?: Product;

  // You will inject ProductsDataService and fetch product by id
}
