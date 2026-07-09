<?php
namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderDetails;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

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
    // dd($request->all());
        $request->validate([
            'cart' => 'required|array',
            'cartTotals' => 'required|array',
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:11',
            'payment_method' => 'required|string|in:cash,card',
            'notes' => 'nullable|string'
        ]);

        $decodedCart = $request->input('cart');
        $decodedCartTotal = $request->input('cartTotals');
        // $cart = json_decode($decodedCart, true);
        // $cartTotals = json_decode($decodedCartTotal, true);

        $orderData = [
            'custom_order_id' => 'ORD-' . time(),
            'customer_name' => $request->customer_name,
            'customer_phone' => $request->customer_phone,
            'payment_method' => $request->payment_method,
            'notes' => $request->notes,
            'subtotal' => $decodedCartTotal['subtotal'],
            'tax' => $decodedCartTotal['tax'],
            'total' => $decodedCartTotal['total']
        ];

        // Store both Order and OrderDetails in a transaction
        $order = DB::transaction(function () use ($orderData, $decodedCart) {
            // Create the main order record
            $order = Order::create($orderData);

            // Create order details for each cart item
            foreach ($decodedCart as $cartItem) {
                OrderDetails::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem['id'],
                    'selected_quantity' => $cartItem['selectedQuantity']
                ]);
            }

            return $order;
        });

        // Update the quantity of the products
        foreach ($decodedCart as $cartItem) {
            $product = Product::find($cartItem['id']);
            $product->quantity -= $cartItem['selectedQuantity'];
            $product->save();
        }

        return inertia('PrintOrder', [
            'order' => $order,
            'orderDetails' => $order->details()->with('product')->get(),
            'successMsg' => 'Order placed successfully'
        ]);
    }
    public function indexOrders(Request $request)
    {
        $query = Order::query();

        if ($request->filled('date')) {
            $query->whereDate('created_at', $request->date);
        }

        if ($request->filled('customer_name')) {
            $query->where('customer_name', 'like', '%' . $request->customer_name . '%');
        }

        if ($request->filled('customer_phone')) {
            $query->where('customer_phone', 'like', '%' . $request->customer_phone . '%');
        }

        $orders = $query->latest()->paginate(10)->withQueryString();

        return inertia('Orders', [
            'orders' => $orders,
            'queryParams' => request()->query()
        ]);
    }

    public function showOrder($id)
    {
        $order = Order::with(['details.product'])->findOrFail($id);

        return inertia('OrderDetails', [
            'order' => $order,
        ]);
    }

    }

