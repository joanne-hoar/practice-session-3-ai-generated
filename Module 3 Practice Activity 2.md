
# Front End Frameworks: Module 3: Practice Activity 2

## Angular Search and Filtering with Signals

### Learning Objectives
- Build a search form using Angular signals
- Filter and display product lists dynamically with computed signals
- Integrate search state with query parameters for bookmarking and sharing

### Prerequisites
- Complete Practice Activity 1 (Routing)

---

## Part 1: Create Search Form Component

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

---

## Part 2: Integrate Search into Products Page

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

---

## Part 3: Query Parameters for Search

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

**Next Steps:** Practice Activity 4 will cover reactive forms (required for Assignment 3) and custom validators.
