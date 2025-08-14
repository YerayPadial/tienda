<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        return Product::all();
    }

    public function store(Request $request)
    {
        $product = Product::create($request->all());
        return response()->json($product, 201);
    }

    public function show(Product $product)
    {
        return $product;
    }

    public function update(Request $request, Product $product)
    {
        $product->update($request->all());
        return $product;
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json(null, 204);
    }

    public function showDetail($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['error' => 'Producto no encontrado'], 404);
        }

        // Cargar relaciones seguras
        $sizes = \App\Models\Size::select('id', 'name')->get();
        $colors = \App\Models\Color::select('id', 'name', 'hex')->get();
        $stocks = \App\Models\ProductStock::where('product_id', $id)->get();

        // Opcional: filtra solo tallas y colores que tengan stock para este producto
        $product_sizes = $stocks->pluck('size_id')->unique()->values();
        $product_colors = $stocks->pluck('color_id')->unique()->values();
        $sizes = $sizes->whereIn('id', $product_sizes)->values();
        $colors = $colors->whereIn('id', $product_colors)->values();

        return response()->json([
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'category' => $product->category,
                'gender' => $product->gender,
                'price' => $product->price,
                'images' => $product->images, 
                'sizes' => $sizes,
                'colors' => $colors,
                'stocks' => $stocks,
            ]
        ]);
    }
}
