<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Product::query();
        if(request("product_name")){
            $query->where("name", "like", "%".request("product_name")."%");
        }
        if(request("status")){
            $query->where("status", request("status"));
        }
        $filterColumn = request("filterColumn", 'id');
        $filterDirection = request("filterDirection", 'desc');
        $query->orderBy($filterColumn, $filterDirection);
        $products = $query->paginate(10)->onEachSide(1);

        return inertia('Product/Index', [
            // 'products' => $products,
            'products' => ProductResource::collection($products),
            'queryParams' => request()->query()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::where('status', 'active')->get();
        return inertia('Product/Create',[
            'categories' => $categories
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        // dd($request->validated());
        $data = $request->validated();
        $data['slug'] = str($data['name'])->slug();
        $data['created_by'] = auth()->user()->id;
        $data['updated_by'] = auth()->user()->id;

        // image upload
        if ($request->hasFile('image')) {
            if (!Storage::disk('public')->exists('products')) {
                Storage::disk('public')->makeDirectory('products');
            }
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            Storage::disk('public')->put('products/' . $imageName, file_get_contents($image));

            $data['image'] = $imageName;
        }
        Product::create($data);
        return redirect()->route('product.index')->with('success', 'Product created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $product->load('category');

        $product->image_url = $product->image
                            ? Storage::disk('public')->url('products/' . $product->image)
                            : null;
                            // dd($product);
        return inertia('Product/Show', [
            'product' => $product
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        $categories = Category::where('status', 'active')->get();
        $product->image_url = $product->image
                            ? Storage::disk('public')->url('products/' . $product->image)
                            : null;
        return inertia('Product/Edit', [
            'product' => $product,
            'categories' => $categories
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        // dd($request->validated());
        $data = $request->validated();
        $data['slug'] = str($data['name'])->slug();
        $data['updated_by'] = auth()->user()->id;

        if($request->hasFile('image')) {
            // delete old image
            if ($request->image) {
                Storage::disk('public')->delete('products/' . $product->image);
            }
            // upload new image
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            Storage::disk('public')->put('products/' . $imageName, file_get_contents($image));

            $data['image'] = $imageName;
        }

        $product->update($data);
        return redirect()->route('product.index')->with('success', 'Product updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        // delete existing image
        if ($product->image) {
            Storage::disk('public')->delete('products/' . $product->image);
        }

        $product->delete();
        return redirect()->route('product.index')->with('success', 'Product deleted successfully');
    }
}
