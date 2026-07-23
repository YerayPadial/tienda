<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Support\ProductImages;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();

        // Búsqueda por nombre o descripción
        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('description', 'LIKE', "%{$searchTerm}%");
            });
        }

        // Filtro por categoría
        if ($request->has('category') && !empty($request->category)) {
            $query->where('category', $request->category);
        }

        // Filtro por género
        if ($request->has('gender') && !empty($request->gender)) {
            $query->where('gender', $request->gender);
        }

        // Filtro por rango de precio
        if ($request->has('min_price') && is_numeric($request->min_price)) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->has('max_price') && is_numeric($request->max_price)) {
            $query->where('price', '<=', $request->max_price);
        }

        // Filtro por tallas
        if ($request->has('sizes') && !empty($request->sizes)) {
            $sizeIds = is_array($request->sizes) ? $request->sizes : explode(',', $request->sizes);
            $query->whereHas('stocks', function ($q) use ($sizeIds) {
                $q->whereIn('size_id', $sizeIds)->where('stock', '>', 0);
            });
        }

        // Filtro por colores
        if ($request->has('colors') && !empty($request->colors)) {
            $colorIds = is_array($request->colors) ? $request->colors : explode(',', $request->colors);
            $query->whereHas('stocks', function ($q) use ($colorIds) {
                $q->whereIn('color_id', $colorIds)->where('stock', '>', 0);
            });
        }

        // Ordenamiento
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');

        switch ($sortBy) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'name':
                $query->orderBy('name', 'asc');
                break;
            case 'popularity':
                $query->orderBy('created_at', 'desc');
                break;
            default:
                $query->orderBy($sortBy, $sortOrder);
        }

        // Paginación
        $perPage = $request->get('per_page', 10);
        $page = $request->get('page', 1);

        $products = $query->paginate($perPage, ['*'], 'page', $page);

        // Mostrar solo imágenes de variantes con stock disponible.
        $products->getCollection()->transform(function ($product) {
            $product->images = ProductImages::forAvailableColors($product);
            return $product;
        });

        return response()->json([
            'data' => $products->items(),
            'current_page' => $products->currentPage(),
            'last_page' => $products->lastPage(),
            'per_page' => $products->perPage(),
            'total' => $products->total(),
            'from' => $products->firstItem(),
            'to' => $products->lastItem(),
        ]);
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

        $cleanImages = ProductImages::forAvailableColors($product);

        return response()->json([
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'category' => $product->category,
                'gender' => $product->gender,
                'price' => $product->price,
                'images' => $cleanImages,
                'sizes' => $sizes,
                'colors' => $colors,
                'stocks' => $stocks,
            ]
        ]);
    }

    public function getFilters()
    {
        $categories = Product::select('category')
            ->distinct()
            ->whereNotNull('category')
            ->where('category', '!=', '')
            ->pluck('category')
            ->toArray();

        $genders = Product::select('gender')
            ->distinct()
            ->whereNotNull('gender')
            ->where('gender', '!=', '')
            ->pluck('gender')
            ->toArray();

        return response()->json([
            'categories' => $categories,
            'genders' => $genders,
        ]);
    }

    public function recent(Request $request)
    {
        $limit = $request->query('limit', 8); 

        $products = Product::orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($product) {
                $images = ProductImages::forAvailableColors($product);
                $imageUrl = $images[0] ?? null;

                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'image_url' => $imageUrl,
                    'created_at' => $product->created_at,
                    'category' => $product->category ? [
                        'name' => $product->category
                    ] : null
                ];
            });

        return response()->json($products);
    }
}
