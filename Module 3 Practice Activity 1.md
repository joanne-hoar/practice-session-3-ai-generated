
# Front End Frameworks: Module 3: Practice Activity 1

## Advanced Angular Routing

### Learning Objectives
- Master advanced Angular routing, including route parameters and redirects
- Use component input binding with routes
- Navigate programmatically in Angular

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

## Part 3: Search Form with Model Signal

Now let's add a simple search form to filter products by name, demonstrating modern Angular form binding with signals.

### Step 1: Create Search Form Component

```bash
ng generate component search-form
```

### Step 2: Implement Search with Model Signal (Angular 17+)

Update `search-form.ts`:

```typescript
import { Component, output, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'app-search-form',
	standalone: true,
	imports: [FormsModule],
	templateUrl: './search-form.html',
	styleUrl: './search-form.css'
})
export class SearchForm {
	// Two-way binding with model signal (Angular 17+)
	searchQuery = model<string>('');
  
	// Output to notify parent of search changes
	searchChange = output<string>();

	onSearchChange() {
		this.searchChange.emit(this.searchQuery());
	}
}
```

### Step 3: Create Search Form Template

In `search-form.html`:

```html
<div class="search-form">
	<div class="form-group">
		<label for="search">Search Products:</label>
		<input 
			id="search"
			type="text"
			[(ngModel)]="searchQuery"
			(input)="onSearchChange()"
			placeholder="Type to search by name..."
		/>
	</div>
</div>
```

### Step 4: Integrate Search into Products Page

Update `products-page.ts`:

```typescript
import { Component, inject, signal, computed } from '@angular/core';
import { ProductService } from '../../services/product-service';
import { ProductList } from '../../product-list/product-list';
import { SearchForm } from '../../search-form/search-form';

@Component({
	selector: 'app-products-page',
	standalone: true,
	imports: [ProductList, SearchForm],
	templateUrl: './products-page.html',
	styleUrl: './products-page.css'
})
export class ProductsPage {
	productService = inject(ProductService);
	searchQuery = signal('');
  
	// Computed signal automatically filters when search changes
	filteredProducts = computed(() => {
		const query = this.searchQuery().toLowerCase().trim();
		if (!query) {
			return this.productService.products();
		}
		return this.productService.products().filter(p => 
			p.name.toLowerCase().includes(query) ||
			p.description.toLowerCase().includes(query)
		);
	});

	onSearchChange(query: string) {
		this.searchQuery.set(query);
	}
}
```

Update `products-page.html`:

```html
<div class="products-page">
	<h1>Products</h1>
  
	<app-search-form (searchChange)="onSearchChange($event)"></app-search-form>
  
	@if (searchQuery()) {
		<p class="search-info">Searching for: "{{ searchQuery() }}"</p>
	}
  
	@if (filteredProducts().length > 0) {
		<div class="products-grid">
			@for (product of filteredProducts(); track product.id) {
				<app-product-card [product]="product"></app-product-card>
			}
		</div>
	} @else {
		<p class="no-results">No products found matching "{{ searchQuery() }}"</p>
	}
</div>
```

## Part 4: Query Parameters for Search

Query parameters allow you to share and bookmark search results. Let's sync the search with the URL.

### Step 1: Update ProductsPage to Use Query Parameters (Angular 17+)

Modify `products-page.ts`:

```typescript
import { Component, inject, signal, computed, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductService } from '../../services/product-service';
import { SearchForm } from '../../search-form/search-form';
import { ProductList } from '../../product-list/product-list';

@Component({
	selector: 'app-products-page',
	standalone: true,
	imports: [SearchForm, ProductList],
	templateUrl: './products-page.html',
	styleUrl: './products-page.css'
})
export class ProductsPage {
	productService = inject(ProductService);
	route = inject(ActivatedRoute);
	router = inject(Router);
  
	// Convert query params to signal
	queryParams = toSignal(this.route.queryParams, { initialValue: {} });
  
	searchQuery = signal('');

	// Sync search signal with query params using effect
	constructor() {
		effect(() => {
			const params = this.queryParams();
			this.searchQuery.set(params['search'] || '');
		});
	}

	// Computed signal for filtered products
	filteredProducts = computed(() => {
		const query = this.searchQuery().toLowerCase().trim();
		if (!query) {
			return this.productService.products();
		}
		return this.productService.products().filter(p => 
			p.name.toLowerCase().includes(query) ||
			p.description.toLowerCase().includes(query)
		);
	});

	// Update URL when search changes
	onSearchChange(query: string) {
		this.router.navigate([], {
			queryParams: { search: query || null },
			queryParamsHandling: 'merge'
		});
	}
}
```

### Step 2: Update Products Page Template

Update `products-page.html`:

```html
<div class="products-page">
	<h1>Products</h1>
  
	<app-search-form (searchChange)="onSearchChange($event)"></app-search-form>
  
	@if (searchQuery()) {
		<p class="search-info">Searching for: "{{ searchQuery() }}"</p>
	}
  
	@if (filteredProducts().length > 0) {
		<div class="products-grid">
			@for (product of filteredProducts(); track product.id) {
				<app-product-card [product]="product"></app-product-card>
			}
		</div>
	} @else {
		<p class="no-results">No products found matching "{{ searchQuery() }}"</p>
	}
</div>
```

### Step 3: Test Query Parameters

**Try these URLs:**
- `/products` - All products
- `/products?search=laptop` - Search for "laptop"
- `/products?search=gaming` - Search for "gaming" (finds Laptop and Headphones)

Notice how the URL updates when you search, and you can bookmark or share these search results!

**Next Steps:** Practice Activity 2 will cover reactive forms (required for Assignment 3) and custom validators.
