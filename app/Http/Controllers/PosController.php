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
        $query = Product::where('quantity', '>', 0)->where('status', 'active');

        if ($request->filled('category') && $request->category !== 'all_categories') {
            $query->where('category_id', $request->category);
        }

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $products = $query->latest()->paginate(10)->withQueryString();

        // Adding image url na category name

        foreach ($products as $product) {
            $product->category_name = Category::find($product->category_id)->name;
            $product->image_url = $product->image
                                ? Storage::disk('public')->url('products/' . $product->image)
                                : null;
        }
        // dd($products);
        return inertia('Pos',[
            'categories' => $categories,
            'products' => $products,
            'queryParams' => request()->query()
        ]);
    }

    public function checkout(Request $request)
    {
        $decodedCart = $request->input('cart');
        $decodedCartTotal = $request->input('cartTotals');

        // Decode JSON strings from frontend
        if ($decodedCart && $decodedCartTotal) {
            $cart = json_decode($decodedCart, true);
            $cartTotals = json_decode($decodedCartTotal, true);
        } else {
            $cart = $request->input('cart', []);
            $cartTotals = $request->input('cartTotals', []);
        }

        return inertia('Checkout',[
            'cart' => $cart,
            'cartTotals' => $cartTotals
        ]);
    }

    public function storeOrder(Request $request)
    {
        dd($request->all());
        $request->validate([
            'cart' => 'required|string',
            'cartTotals' => 'required|string',
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'nullable|string|max:20',
            'payment_method' => 'required|string|in:cash,card',
            'notes' => 'nullable|string'
        ]);

        $decodedCart = $request->input('cart');
        $decodedCartTotal = $request->input('cartTotals');
        $cart = json_decode($decodedCart, true);
        $cartTotals = json_decode($decodedCartTotal, true);

        // Store the order using cart, totals, and customer info
        // In a real implementation, you would save to database
        // For now, return success response

        return response()->json([
            'success' => true,
            'message' => 'Order placed successfully',
            'order_id' => time() // simple order ID
        ]);
    }
}
