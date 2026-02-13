
import { ProductDetail } from './pages/product-detail/product-detail';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomePage },
  { path: 'products', component: ProductsPage },
  { path: 'products/:id', component: ProductDetail }
];
