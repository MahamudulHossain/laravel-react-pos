<?php
namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PosController extends Controller
{
    public function index(Request $request)
    {
        $categories = Category::where('status', 'active')->get();
        $query = Product::where('quantity', '>', 0);

        if ($request->filled('category') && $request->category !== 'All Categories') {
            $query->where('category_id', $request->category);
        }

        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%');
            });
        }

        $products = $query->latest()->paginate(10)->withQueryString();

        // Adding image url na category name

        foreach ($products as $product) {
            $product->category_name = Category::find($product->category_id)->name;
            $product->image_url = $product->image
                                ? Storage::disk('public')->url('products/' . $product->image)
                                : null;
        }
        return inertia('Pos',[
            'categories' => $categories,
            'dbProducts' => $products
        ]);
    }
}
