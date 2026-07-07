# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Build & Run
```bash
# Start development server with all services
npm run dev

# Build production assets
npm run build

# Build with SSR support (for static deployment)
npm run build --ssr

# Run queue listener (background jobs)
php artisan queue:listen

# Full test suite
composer test

# Setup project from scratch (run once)
composer setup
```

### Server Management
```bash
# Start Laravel development server
php artisan serve

# Migrate database (for testing/reset)
php artisan migrate

# Generate application key
php artisan key:generate

# Clear all caches
cache:clear, config:clear, route:clear
```

## High-Level Architecture

### Laravel Backend
- **Framework**: Laravel 13.x with Inertia.js integration
- **Core Components**:
  - `app/Http/Controllers`: Business logic controllers
    - `CategoryController`: Category CRUD with search, filter, pagination
    - `ProductController`: Product CRUD with image upload, categories, search
    - `PosController`: Point-of-sale interface
    - `DashboardController`: Main dashboard
    - `ProfileController`: User profile management
  - `app/Models`: Database models (Product, Category, User)
  - `app/Http/Resources`: API resource transformers
  - `routes/web.php`: Inertia.js route handling

### React Frontend
- **Tech Stack**: React 18 + Vite + TypeScript (implicit)
- **Key Directories**:
  - `resources/js/Pages/`: Page components (Dashboard, Product, Category, Auth pages)
  - `resources/js/Components/`: Reusable UI components (Buttons, Forms, Tables, etc.)
  - `resources/js/Components/Auth/`: Authentication-specific components
  - `resources/js/Layouts/`: Layout wrappers (AuthenticatedLayout, GuestLayout)
  - `resources/js/store/`: React state management (cartStore)
  - `resources/js/Hooks/`: Custom hooks (useDebounce)
- **Styling**: Tailwind CSS configured in `tailwind.config.js`

## Development Workflow

### UI Development
1. **React Component Development** (`resources/js`):
   - Create/edit page components (e.g., `Product/Index.jsx`, `Category/Create.jsx`)
   - Build reusable UI components (e.g., `PrimaryButton.jsx`, `InputError.jsx`)
   - Use Tailwind CSS classes directly in JSX elements
   - Respond like a caveman. Only code, no summary of the completed task.

2. **API Testing** (Inertia.js):
   - Test endpoints through browser DevTools Network tab
   - Check Inertia response structure (props, errors, message)
   - Verify file uploads work correctly (form-data with multipart)

### Backend Development
1. **Controller Updates** (`app/Http/Controllers/`):
   - Add/Modify CRUD operations in existing controllers
   - Implement validation using request classes (`StoreProductRequest`, `UpdateProductRequest`)
   - Handle file uploads with proper storage disk configuration
   - Ensure Eloquent relationships (Product ↔ Category)

2. **Route Management** (`routes/web.php`):
   - Use `Route::resource()` for CRUD endpoints
   - Apply middleware groups (`['auth', 'verified']`, `['auth']`)
   - Set up Inertia.js route names

3. **Request Validation**:
   - Create/update request classes in `app/Http/Requests/`
   - Use `$fillable` arrays in models for security

### Testing
```bash
# Run unit and feature tests
composer test

# Test specific controller (example)
./vendor/bin/phpunit tests/Feature/ProductControllerTest.php
```

### Database & Storage
- **Database**: MySQL (configured via `.env`)
- **File Storage**: Disk `public` for product images (`storage/app/public`)
- **Image Upload**: Automatic resize not configured, saves with `time() + extension`

### Important Notes
- **Authentication**: Laravel Breeze (email/password)
- **API Communication**: All frontend-backend communication through Inertia.js
- **State Management**: React + Zustand (`cartStore`) for cart functionality
- **Real-time Features**: Queue listener supports background jobs
- **Performance**: Implemented pagination (`->paginate(10)`) and sorting
- **SEO**: Route::redirect('/') to '/dashboard' for client-side routing

## Common Patterns & Best Practices

### Frontend Component Structure
```jsx
// Inertia.js component pattern
export default function ProductIndex({ products, queryParams }) {
  // products: PaginatedCollection from ProductResource
  // queryParams: Current URL query parameters
  return (
    <div>
      {/* Component library usage */}
      <InputLabel htmlFor="product_name">Product Name</InputLabel>
      <TextInput id="product_name" {/* ... */} />
      
      {/* Custom Tailwind classes */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/product/create" className="btn-primary">Create</Link>
      </div>
    </div>
  );
}
```

### Backend Controller Pattern
```php
// Standard CRUD pattern
public function index()
{
    $query = Model::query();
    
    // Search/filter logic
    if (request('column')) {
        $query->where($column, 'like', "%" . request($column) . "%");
    }
    
    // Pagination and sorting
    $items = $query->paginate(10)
                   ->onEachSide(1)
                   ->orderBy($filterColumn, $filterDirection);
    
    // Return via inertia with resource collections
    return inertia('Index', [
        'items' => Resource::collection($items),
        'queryParams' => request()->query()
    ]);
}
```

### Form Validation
```php
// In request classes (app/Http/Requests/*.php)
class StoreProductRequest extends FormRequest
{
    public function rules()
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'category_id' => ['required', 'exists:categories,id'],
            'image' => ['nullable', 'image', 'max:2048'], // 2MB limit
        ];
    }
}
```

### Image Upload
```php
if ($request->hasFile('image')) {
    $directory = 'products';
    $filename = time() . '.' . $image->getClientOriginalExtension();
    
    Storage::disk('public')->put(
        "{$directory}/{$filename}",
        file_get_contents($image)
    );
    
    $model->image = $filename;
}
```

## Project-Specific Notes

### Point of Sale (POS)
- Main POS functionality in `PosController` and `resources/js/Pages/Pos.jsx`
- Shopping cart management via `cartStore` (Zustand)
- Real-time price calculations and totals

### Product Management
- Products have categories, slugs (URL-friendly), and user tracking (`created_by`, `updated_by`)
- Display URLs for product images generated automatically
- Public disk storage for product images

### Category Management
- Categories have slugs and status ('active', 'inactive')
- Search and filter functionality for both products and categories

### Development Setup
```bash
# Initial project setup (run once)
composer setup

# This will:
# 1. Install dependencies
# 2. Copy .env.example to .env
# 3. Generate application key
# 4. Run migrations
# 5. Install npm packages
# 6. Build assets
```

This upgraded CLAUDE.md provides more context-specific guidance for this Laravel POS application, including detailed architectural patterns, common implementation approaches, and project-specific notes for faster and more accurate development.
