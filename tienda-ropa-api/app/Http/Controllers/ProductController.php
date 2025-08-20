<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductStock;
use App\Models\Size;
use App\Models\Color;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    /**
     * Obtener todos los productos
     */
    public function index(Request $request)
    {
        try {
            $products = Product::with(['stocks.size', 'stocks.color'])
                ->orderBy('created_at', 'desc')
                ->get();

            // Agregar información de stock total
            $products = $products->map(function ($product) {
                $product->total_stock = $product->stocks->sum('stock');
                $product->available_sizes = $product->stocks->where('stock', '>', 0)->pluck('size.name')->unique()->values();
                $product->available_colors = $product->stocks->where('stock', '>', 0)->pluck('color.name')->unique()->values();
                return $product;
            });

            // Si la llamada viene del admin (con token), devolver con estructura de mensaje
            if ($request->user()) {
                return response()->json([
                    'data' => $products,
                    'message' => 'Productos obtenidos exitosamente'
                ]);
            }

            // Si es llamada pública (frontend), devolver directamente los productos
            return response()->json($products);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener productos',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Crear un nuevo producto con stocks
     */
    public function store(Request $request)
    {
        try {
            // Validar datos del producto
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'category' => 'required|string|max:255',
                'gender' => 'required|string|in:hombre,mujer,unisex',
                'price' => 'required|numeric|min:0',
                'images' => 'nullable|array',
                'images.*' => 'string',
                'stocks' => 'required|array|min:1',
                'stocks.*.size_id' => 'required|exists:sizes,id',
                'stocks.*.color_id' => 'required|exists:colors,id',
                'stocks.*.stock' => 'required|integer|min:0'
            ], [
                'name.required' => 'El nombre es obligatorio',
                'description.required' => 'La descripción es obligatoria',
                'category.required' => 'La categoría es obligatoria',
                'gender.required' => 'El género es obligatorio',
                'gender.in' => 'El género debe ser: hombre, mujer o unisex',
                'price.required' => 'El precio es obligatorio',
                'price.numeric' => 'El precio debe ser un número',
                'stocks.required' => 'Debe agregar al menos una variación de stock',
                'stocks.min' => 'Debe agregar al menos una variación de stock'
            ]);

            DB::beginTransaction();

            // Crear el producto
            $product = Product::create([
                'name' => $validatedData['name'],
                'description' => $validatedData['description'],
                'category' => $validatedData['category'],
                'gender' => $validatedData['gender'],
                'price' => $validatedData['price'],
                'images' => $validatedData['images'] ?? []
            ]);

            // Crear los stocks
            foreach ($validatedData['stocks'] as $stockData) {
                ProductStock::create([
                    'product_id' => $product->id,
                    'size_id' => $stockData['size_id'],
                    'color_id' => $stockData['color_id'],
                    'stock' => $stockData['stock']
                ]);
            }

            DB::commit();

            // Cargar el producto con sus relaciones
            $product->load(['stocks.size', 'stocks.color']);

            return response()->json([
                'data' => $product,
                'message' => 'Producto creado exitosamente'
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Datos de validación incorrectos',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al crear producto',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mostrar un producto específico
     */
    public function show(Product $product)
    {
        try {
            $product->load(['stocks.size', 'stocks.color']);

            return response()->json([
                'data' => $product,
                'message' => 'Producto obtenido exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Producto no encontrado',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Actualizar un producto
     */
    public function update(Request $request, Product $product)
    {
        try {
            // Validar datos del producto
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'category' => 'required|string|max:255',
                'gender' => 'required|string|in:hombre,mujer,unisex',
                'price' => 'required|numeric|min:0',
                'images' => 'nullable|array',
                'images.*' => 'string',
                'stocks' => 'required|array|min:1',
                'stocks.*.size_id' => 'required|exists:sizes,id',
                'stocks.*.color_id' => 'required|exists:colors,id',
                'stocks.*.stock' => 'required|integer|min:0'
            ], [
                'name.required' => 'El nombre es obligatorio',
                'description.required' => 'La descripción es obligatoria',
                'category.required' => 'La categoría es obligatoria',
                'gender.required' => 'El género es obligatorio',
                'gender.in' => 'El género debe ser: hombre, mujer o unisex',
                'price.required' => 'El precio es obligatorio',
                'price.numeric' => 'El precio debe ser un número',
                'stocks.required' => 'Debe agregar al menos una variación de stock',
                'stocks.min' => 'Debe agregar al menos una variación de stock'
            ]);

            DB::beginTransaction();

            // Actualizar el producto
            $product->update([
                'name' => $validatedData['name'],
                'description' => $validatedData['description'],
                'category' => $validatedData['category'],
                'gender' => $validatedData['gender'],
                'price' => $validatedData['price'],
                'images' => $validatedData['images'] ?? []
            ]);

            // Eliminar stocks existentes y crear nuevos
            $product->stocks()->delete();

            foreach ($validatedData['stocks'] as $stockData) {
                ProductStock::create([
                    'product_id' => $product->id,
                    'size_id' => $stockData['size_id'],
                    'color_id' => $stockData['color_id'],
                    'stock' => $stockData['stock']
                ]);
            }

            DB::commit();

            // Cargar el producto actualizado con sus relaciones
            $product->load(['stocks.size', 'stocks.color']);

            return response()->json([
                'data' => $product,
                'message' => 'Producto actualizado exitosamente'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Datos de validación incorrectos',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al actualizar producto',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar un producto
     */
    public function destroy(Product $product)
    {
        try {
            DB::beginTransaction();

            // Eliminar stocks asociados
            $product->stocks()->delete();

            // Eliminar el producto
            $product->delete();

            DB::commit();

            return response()->json([
                'message' => 'Producto eliminado exitosamente'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al eliminar producto',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener producto con detalles (público)
     */
    public function showDetail($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['error' => 'Producto no encontrado'], 404);
        }

        // Cargar relaciones seguras
        $sizes = Size::select('id', 'name')->get();
        $colors = Color::select('id', 'name', 'hex')->get();
        $stocks = ProductStock::where('product_id', $id)->get();

        // Filtra solo tallas y colores que tengan stock para este producto
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
