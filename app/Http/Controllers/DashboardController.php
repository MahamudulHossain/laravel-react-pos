<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderDetails;
use App\Models\Product;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $totalCategories = Category::count();
        $totalProducts = Product::count();
        $totalSales = Order::count();
        $totalUniqueUsers = Order::distinct('customer_phone')->count('customer_phone');

        // Sales data for the last 7 days
        $salesData = Order::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            // ->where('created_at', '>=', now()->subDays(360))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Top 5 products by sold quantity
        $topProducts = OrderDetails::join('products', 'order_details.product_id', '=', 'products.id')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->selectRaw('products.name, categories.name as category_name, SUM(order_details.selected_quantity) as sold_count')
            ->groupBy('products.id', 'products.name', 'categories.name')
            ->orderByDesc('sold_count')
            ->limit(5)
            ->get();

        return inertia('Dashboard', [
            'totalCategories' => $totalCategories,
            'totalProducts' => $totalProducts,
            'totalSales' => $totalSales,
            'totalUniqueUsers' => $totalUniqueUsers,
            'salesData' => $salesData,
            'topProducts' => $topProducts,
        ]);
    }
}
