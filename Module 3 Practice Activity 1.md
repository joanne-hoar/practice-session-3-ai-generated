
# Front End Frameworks: Module 3: Practice Activity 1

## Advanced Angular Routing

### Learning Objectives
- Master advanced Angular routing, including route parameters and redirects
- Use component input binding with routes
- Navigate programmatically in Angular

**Note:** Search form and filtering are now covered only in Practice Activity 2.

### Prerequisites
- Complete Module 1 Practice Activities (basic routing, components, and services)

---

## Part 1: Review Basic Routing from Module 1

In Module 1 Practice Activity 3, you learned the fundamentals of Angular routing:

**What You've Already Built:**
- Basic routes configured in `app.routes.ts`
- Navigation with `routerLink` directive
- `RouterOutlet` to display routed components
- Active route styling with `routerLinkActive`

**Quick Review Exercise:**

1. Open your `app.routes.ts` and review your existing routes:
	 ```typescript
	 export const routes: Routes = [
		 { path: '', redirectTo: '/home', pathMatch: 'full' },
		 { path: 'home', component: HomePage },
		 { path: 'products', component: ProductsPage }
	 ];
	 ```

2. Verify your header navigation is working:
	 ```html
	 <a routerLink="/home" routerLinkActive="activebutton">Home</a>
	 <a routerLink="/products" routerLinkActive="activebutton">Products</a>
	 ```

**Now let's take routing to the next level!**

---

## Part 2: Route Parameters with `withComponentInputBinding()`

Now we'll create a product detail page that displays a single product based on the product ID in the URL.

> **Note:** This section uses the `ProductsDataService` that you created in Module 1 Practice Activity 3. If you haven't created it yet, use `ng generate service services/products-data` and add your product data with methods like `getProduct(id: number)`.

### Step 1: Create Product Detail Component

```bash
ng generate component pages/product-detail
```

### Step 2: Add Route with Parameter

Update `app.routes.ts` to include a route with an `:id` parameter:

```typescript
import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home-page';
import { ProductsPage } from './pages/products-page/products-page';
import { ProductDetail } from './pages/product-detail/product-detail';

export const routes: Routes = [
	{ path: '', redirectTo: '/home', pathMatch: 'full' },
	{ path: 'home', component: HomePage },
	{ path: 'products', component: ProductsPage },
	{ path: 'products/:id', component: ProductDetail }
];
```

### Step 3: Enable `withComponentInputBinding()`

This modern Angular feature automatically maps route parameters to component `@Input()` properties!

Update `app.config.ts`:

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes, withComponentInputBinding())  // Add this!
	]
};
```

### Step 4: Implement Product Detail Component

Now you can receive route parameters as `@Input()` properties:

```typescript
import { Component, input, inject, computed } from '@angular/core';
import { ProductService } from '../../services/product-service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-product-detail',
	standalone: true,
	imports: [],
	templateUrl: './product-detail.html',
	styleUrl: './product-detail.css'
})
export class ProductDetail {
	// Route parameter automatically bound with Angular 17+ input!
	id = input<string>();

	productService = inject(ProductService);
	router = inject(Router);
  
	// Computed signal automatically updates when id changes
	product = computed(() => {
		const productId = this.id();
		return productId ? this.productService.getProduct(Number(productId)) : undefined;
	});

	goBack() {
		this.router.navigate(['/products']);
	}
}
```

### Step 5: Create Product Detail Template

In `product-detail.html`:

```html
<div class="product-detail-container">
	@if (product(); as prod) {
		<div class="product-detail">
			<img [src]="'assets/products/' + prod.image" [alt]="prod.name" />
			<h1>{{ prod.name }}</h1>
			<p class="category">Category: {{ prod.category }}</p>
			<p class="description">{{ prod.description }}</p>
			<button (click)="goBack()">Back to Products</button>
		</div>
	} @else {
		<div class="error">
			<h2>Product Not Found</h2>
			<button (click)="goBack()">Back to Products</button>
		</div>
	}
</div>
```

### Step 6: Link to Product Details

Update `product-card.html` to link to the detail page:

```html
<div class="product-card">
	<a [routerLink]="['/products', product.id]">
		<img [src]="'assets/products/' + product.image" [alt]="product.name" />
		<h3>{{ product.name }}</h3>
	</a>
	<button (click)="onAddToCart()">Add to Cart</button>
</div>
```

Update imports in `product-card.ts`:

```typescript
import { RouterLink } from '@angular/router';

@Component({
	// ...
	imports: [RouterLink],
	// ...
})
```

**Test it!** Click on a product and verify the URL changes to `/products/1` and the detail page displays.

---



