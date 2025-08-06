<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\Product;
use App\Models\Size;
use App\Models\Color;
use App\Models\OrderProduct;

class OrderProductSeeder extends Seeder
{
    public function run()
    {
        $order = Order::first();
        $product = Product::first();
        $size = Size::first();
        $color = Color::first();

        OrderProduct::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'size_id' => $size->id,
            'color_id' => $color->id,
            'quantity' => 2,
        ]);
    }
}
