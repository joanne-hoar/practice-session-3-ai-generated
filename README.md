# Everyday Market App

An Angular 21 application demonstrating modern frontend development practices including standalone components, signals, routing, and dependency injection.

This project was created as part of Frontend Frameworks Module 1 practice activities and showcases:
- 🛒 Product catalog with component communication
- 🔀 Client-side routing with multiple pages
- 📦 Shopping cart service with reactive state management
- 🎨 Custom SVG graphics and favicon
- ✅ Comprehensive unit testing with Vitest

Built with [Angular CLI](https://github.com/angular/angular-cli) version 21.1.1.

## Screenshot

![Everyday Market App](Screenshot.png)

## Features

- **Home Page**: Welcome page with Angular version badge
- **Products Page**: Interactive product catalog with 6 items
- **Shopping Cart**: Add products to cart with live count display
- **Responsive Design**: Mobile-friendly layout
- **Modern Angular**: Standalone components, signals, and latest syntax (@for)

## Project Structure

- `src/app/pages/` - Route components (HomePage, ProductsPage)
- `src/app/shared/` - Shared components (Header, Footer)
- `src/app/product-card/` - Product display component
- `src/app/product-list/` - Product list container
- `src/app/services/` - Application services (CartService)
- `public/assets/` - Static assets (images, icons)

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner:

```bash
ng test
```

For continuous testing during development:

```bash
ng test --watch
```

Current test coverage: 9 tests across 8 test files ✅

## Technologies Used

- **Angular 21.1.1** - Modern web framework
- **TypeScript** - Type-safe JavaScript
- **Vitest** - Fast unit testing
- **Signals** - Reactive state management
- **Standalone Components** - Simplified architecture
- **SVG Graphics** - Scalable vector images

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
