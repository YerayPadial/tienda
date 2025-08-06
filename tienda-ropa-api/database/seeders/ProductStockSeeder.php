<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Size;
use App\Models\Color;
use App\Models\ProductStock;

class ProductStockSeeder extends Seeder
{
    public function run()
    {
        $product = Product::first();
        $sizes = Size::all();
        $colors = Color::all();

        foreach ($sizes as $size) {
            foreach ($colors as $color) {
                ProductStock::create([
                    'product_id' => $product->id,
                    'size_id' => $size->id,
                    'color_id' => $color->id,
                    'stock' => rand(5, 20),
                ]);
            }
        }
    }
}
