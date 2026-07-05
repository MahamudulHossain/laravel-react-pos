# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Build & Run
```bash
# Start development server
npm run dev

# Build production assets
npm run build

# Build with SSR support
npm run build --ssr

# Run queue listener
php artisan queue:listen

# Run tests
composer test
```

### Server Management
```bash
# Start Laravel server
php artisan serve

# Migrate database
php artisan migrate

# Generate API key
php artisan key:generate
```

## High-Level Architecture

### Laravel Backend
- **Core Structure**: Standard Laravel 13.x application with Inertia.js integration
- **Key Components**:
  - `app/Http/Controllers`: Main business logic (ProductController, CategoryController, PosController)
  - `app/Models`: Database models (Product, Category, User)
  - `routes/web.php`: Inertia.js route handling with auth middleware
  - `resources/js`: React components rendered via Inertia

### React Frontend
- **Tech Stack**: React 18 with Vite build system
- **Structure**:
  - `resources/js`: Component directory with layouts, pages, and UI components
  - Uses Tailwind CSS for styling

## Development Workflow

1. **UI Development**:
   - Edit `resources/js` components (React files)
   - Use Tailwind CSS classes in JSX

2. **Backend Development**:
   - Create/update controllers in `app/Http/Controllers`
   - Define routes in `routes/web.php`
   - Modify database models in `app/Models`

3. **Testing**:
   - Run `composer test` for unit/feature tests
   - Tests stored in `tests` directory

4. **Deployment**:
   - Build assets with `npm run build`
   - Deploy via Laravel ecosystem tools

## Important Notes
- All API requests go through Inertia.js
- Database uses MySql
- Tailswind CSS configured via `tailwind.config.js`
- Background jobs handled by Laravel queues
