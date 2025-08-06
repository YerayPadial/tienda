<?php

namespace App\Http\Controllers;

use App\Models\ProductStock;
use Illuminate\Http\Request;

class ProductStockController extends Controller
{
    public function index()
    {
        return ProductStock::all();
    }

    public function store(Request $request)
    {
        $stock = ProductStock::create($request->all());
        return response()->json($stock, 201);
    }

    public function show(ProductStock $productStock)
    {
        return $productStock;
    }

    public function update(Request $request, ProductStock $productStock)
    {
        $productStock->update($request->all());
        return $productStock;
    }

    public function destroy(ProductStock $productStock)
    {
        $productStock->delete();
        return response()->json(null, 204);
    }
}
