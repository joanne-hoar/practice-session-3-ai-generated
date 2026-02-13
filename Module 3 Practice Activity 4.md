
# Front End Frameworks: Module 3: Practice Activity 4

## Angular Reactive Forms with Custom Validation

### Learning Objectives
- Build and validate Angular reactive forms
- Create and apply custom validator functions
- Implement programmatic navigation after form submission

### Prerequisites
- Complete Module 1 Practice Activities and Practice Activity 1

---

## Part 1: Add Product Review Form

Continue in your `practice-session` project. We'll add a review form to the product detail page to practice reactive forms and validation.

### Step 1: Understand the Goal

We'll create a form where users can submit product reviews with:
- Reviewer name (text validation)
- Rating (number validation)

This demonstrates the **same concepts** you'll need for Assignment 3, but in a different context.

### Step 2: Make ProductCard Reusable (Optional Display Modes)

The `ProductCard` component now supports flexible display modes:

* Inputs:
	* `showLink` (default: true): Show link to detail page
	* `showAddButton` (default: true): Show add to cart button
	* `showDescription` (default: false): Show full description

Example usage:

```html
<app-product-card
	[product]="product"
	[showLink]="false"
	[showAddButton]="true"
	[showDescription]="true"
	(addToCartEvent)="cartService.addToCart(product)"
></app-product-card>
```

---

## Part 2: Create the Review Form Template

Update `product-detail.html` to include the product info AND the review form:

```html
<div class="product-detail-container">
	@if (product(); as prod) {
		<!-- Reuse ProductCard component with custom display options! -->
		<div class="product-info">
			<app-product-card 
				[product]="prod"
				[showLink]="false"
				[showAddButton]="false"
				[showDescription]="true"
			></app-product-card>
      
			<p class="category"><strong>Category:</strong> {{ prod.category }}</p>
			<button (click)="goBack()">Back to Products</button>
		</div>

		<!-- Review Form Section -->
		<div class="review-section">
			<h2>Write a Review</h2>
      
			<form [formGroup]="reviewForm" (ngSubmit)="onSubmitReview()">
        
				<!-- Reviewer Name Field -->
				<div class="form-group">
					<label for="reviewerName">Your Name *</label>
					<input 
						id="reviewerName"
						type="text" 
						formControlName="reviewerName"
						placeholder="Enter your name"
						[class.invalid]="reviewForm.get('reviewerName')?.touched && reviewForm.get('reviewerName')?.invalid"
					/>
					@if (reviewForm.get('reviewerName')?.touched && reviewForm.get('reviewerName')?.invalid) {
						<div class="error">
							@if (reviewForm.get('reviewerName')?.errors?.['required']) {
								<span>Name is required.</span>
							}
							@if (reviewForm.get('reviewerName')?.errors?.['minlength']) {
								<span>Name must be at least 3 characters.</span>
							}
							@if (reviewForm.get('reviewerName')?.errors?.['pattern']) {
								<span>Name can only contain letters and spaces.</span>
							}
						</div>
					}
				</div>


				<!-- Rating Field -->
				<div class="form-group">
					<label for="rating">Rating (1-5) *</label>
					<input 
						id="rating"
						type="number" 
						formControlName="rating"
						min="1"
						max="5"
						placeholder="5"
						[class.invalid]="reviewForm.get('rating')?.touched && reviewForm.get('rating')?.invalid"
					/>
					@if (reviewForm.get('rating')?.touched && reviewForm.get('rating')?.invalid) {
						<div class="error">
							@if (reviewForm.get('rating')?.errors?.['required']) {
								<span>Rating is required.</span>
							}
							@if (reviewForm.get('rating')?.errors?.['min'] || reviewForm.get('rating')?.errors?.['max']) {
								<span>Rating must be between 1 and 5.</span>
							}
						</div>
					}
				</div>


				<!-- Submit Button -->
				<button 
					type="submit" 
					[disabled]="!reviewForm.valid"
				>
					Submit Review
				</button>
			</form>
		</div>
    
	} @else {
		<div class="error">
			<h2>Product Not Found</h2>
			<button (click)="goBack()">Back to Products</button>
		</div>
	}
</div>
```

---

## Part 3: Style the Form

Update `product-detail.css`:

```css
.form-group {
	margin-bottom: 1rem;
}
label {
	display: block;
	margin-bottom: 0.25rem;
}
input[type="text"],
input[type="number"] {
	width: 100%;
	padding: 0.5rem;
	box-sizing: border-box;
}
.error {
	color: red;
	font-size: 0.9em;
}
button[type="submit"] {
	margin-top: 1rem;
}
```

---

## Part 4: Add Custom Validators

Now let's create custom validators for more complex validation rules.

### Step 1: Create Validators File

Create `src/app/validators/review-validators.ts`:

```typescript
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Custom validator to ensure rating is within valid range
 * More flexible than min/max for teaching purposes
 */
export function ratingRangeValidator(min: number, max: number): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		if (!control.value) {
			return null;
		}
    
		const value = Number(control.value);
    
		if (value < min || value > max) {
			return { ratingRange: { min, max, actual: value } };
		}
    
		return null;
	};
}
```


### Step 2: Use Custom Validators in the Review Form

To use your custom validator, import it and add it to the `rating` field in your form group:

```typescript
import { ratingRangeValidator } from '../validators/review-validators';

reviewForm: FormGroup = this.fb.group({
	reviewerName: ['', [
		Validators.required,
		Validators.minLength(3),
		Validators.pattern('^[a-zA-Z ]+$')
	]],
	rating: ['', [
		Validators.required,
		ratingRangeValidator(1, 5)
	]],
});
```

This ensures the rating must be between 1 and 5, using your custom logic. You can add other custom validators (like `noProfanityValidator`) as needed.


## Part 5: Test Your Review Form

### Testing Checklist:

1. **Required Field Validation (Built-in):**
   - Try submitting the empty form → Both fields should show "required" errors when touched.

2. **Reviewer Name Field (Built-in Validators):**
   - Try "Jo" → Should fail (minLength error)
   - Try "John123" → Should fail (pattern error: only letters and spaces allowed)
   - Try "John" → Should pass (valid)

3. **Rating Field (Built-in and Custom Validators):**
   - Try leaving blank → Should fail (required error)
   - Try "0" or "6" → Should fail (custom range validator)
   - Try "3" → Should pass (valid)

4. **Form Submission:**
   - Fill both fields with valid values → Submit button should be enabled
   - Click submit → Form should reset and show a success message


**Key Concepts for Assignment 3:**
- Same reactive forms approach works for ANY form
- Custom validators are functions that return `ValidatorFn`
- Validators can be simple (no params) or parameterized
- Always check if value exists before validating
- Use modern `@if` syntax for error messages
- Reuse components by making them flexible with optional `@Input()` properties

---

**Next Steps:** Save all files for this activity. You now have a basic Angular app with reactive forms, custom validation, and programmatic navigation. We will deploy this app to Azure in Module 4.