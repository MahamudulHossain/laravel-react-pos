<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Category::query();
        if(request("category_name")){
            $query->where("name", "like", "%".request("category_name")."%");
        }
        if(request("status")){
            $query->where("status", request("status"));
        }
        $filterColumn = request("filterColumn", 'id');
        $filterDirection = request("filterDirection", 'desc');
        $query->orderBy($filterColumn, $filterDirection);
        $categories = $query->paginate(10)->onEachSide(1);

        return inertia('Category/Index', [
            // 'categories' => $categories,
            'categories' => CategoryResource::collection($categories),
            'queryParams' => request()->query()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoryRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        //
    }
}
