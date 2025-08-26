<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\OrderProduct;

class OrderProductSeeder extends Seeder
{
    public function run()
    {
        $orderProducts = [
            // Pedidos de Cliente Prueba (id=1, orders 1 y 2)
            [
                'order_id' => 1,
                'product_id' => 20, // Collar Rojo
                'size_id' => 25,    // Única
                'color_id' => 23,   // Rojo
                'quantity' => 1,
            ],
            [
                'order_id' => 1,
                'product_id' => 24, // Camiseta Blanca
                'size_id' => 22,    // M
                'color_id' => 21,   // Blanco
                'quantity' => 2,
            ],
            [
                'order_id' => 2,
                'product_id' => 21, // Sudadera Básica
                'size_id' => 21,    // S
                'color_id' => 21,   // Blanco
                'quantity' => 1,
            ],
            [
                'order_id' => 2,
                'product_id' => 25, // Gorra Verde
                'size_id' => 25,    // Única
                'color_id' => 24,   // Verde
                'quantity' => 1,
            ],

            // Pedidos de Yeray Padial (id=2, orders 3 y 4)
            [
                'order_id' => 3,
                'product_id' => 22, // Pantalón Deportivo
                'size_id' => 22,    // M
                'color_id' => 22,   // Azul
                'quantity' => 1,
            ],
            [
                'order_id' => 3,
                'product_id' => 27, // Falda Negra
                'size_id' => 25,    // Única
                'color_id' => 20,   // Negro
                'quantity' => 2,
            ],
            [
                'order_id' => 4,
                'product_id' => 23, // Vestido Elegante
                'size_id' => 25,    // Única
                'color_id' => 22,   // Azul
                'quantity' => 1,
            ],
            [
                'order_id' => 4,
                'product_id' => 29, // Polo Verde
                'size_id' => 22,    // M
                'color_id' => 24,   // Verde
                'quantity' => 2,
            ],

            // Pedidos de Admin (id=3, orders 5 y 6)
            [
                'order_id' => 5,
                'product_id' => 26, // Chaqueta Azul
                'size_id' => 21,    // S
                'color_id' => 22,   // Azul
                'quantity' => 1,
            ],
            [
                'order_id' => 5,
                'product_id' => 28, // Bufanda Azul
                'size_id' => 25,    // Única
                'color_id' => 22,   // Azul
                'quantity' => 1,
            ],
            [
                'order_id' => 6,
                'product_id' => 30, // Blusa Blanca
                'size_id' => 21,    // S
                'color_id' => 21,   // Blanco
                'quantity' => 1,
            ],
            [
                'order_id' => 6,
                'product_id' => 24, // Camiseta Blanca
                'size_id' => 20,    // XS
                'color_id' => 21,   // Blanco
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
