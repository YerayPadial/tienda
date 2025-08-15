<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\OrderProduct;

class OrderProductSeeder extends Seeder
{
    public function run()
    {
        $orderProducts = [
            // Pedido 2 (id=2): Sudadera Unisex, S (21), Negro (20), 2 unidades
            [
                'order_id' => 2,
                'product_id' => 20,
                'size_id' => 21,
                'color_id' => 20,
                'quantity' => 2,
            ],
            // Pedido 3 (id=3): Pantalón Deportivo, M (22), Blanco (21), 1 unidad
            [
                'order_id' => 3,
                'product_id' => 21,
                'size_id' => 22,
                'color_id' => 21,
                'quantity' => 1,
            ],
            // Pedido 4 (id=4): Vestido Elegante, Única (25), Rojo (23), 1 unidad
            [
                'order_id' => 4,
                'product_id' => 22,
                'size_id' => 25,
                'color_id' => 23,
                'quantity' => 1,
            ],
        ];

        foreach ($orderProducts as $orderProduct) {
            OrderProduct::updateOrCreate([
                'order_id' => $orderProduct['order_id'],
                'product_id' => $orderProduct['product_id'],
                'size_id' => $orderProduct['size_id'],
                'color_id' => $orderProduct['color_id'],
            ], $orderProduct);
        }
    }
}
