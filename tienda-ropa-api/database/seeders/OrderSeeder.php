<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;

class OrderSeeder extends Seeder
{
    public function run()
    {
        $orders = [
            // Cliente Prueba (id=1)
            [
                'id' => 1,
                'user_id' => 1,
                'status' => 'pendiente',
                'shipping_type' => 'domicilio',
                'shipping_data' => [
                    'address' => 'Avda. Ejemplo, Nº10',
                    'city' => 'Huelva',
                    'postal_code' => '21001',
                    'province' => 'Huelva',
                    'phone' => '+34 600 111 111',
                    'notes' => 'Portero automático 4ºA'
                ],
                'payment_completed' => false,
            ],
            [
                'id' => 2,
                'user_id' => 1,
                'status' => 'procesando',
                'shipping_type' => 'recogida',
                'shipping_data' => [],
                'payment_completed' => true,
            ],

            // Yeray Padial (id=2)
            [
                'id' => 3,
                'user_id' => 2,
                'status' => 'pendiente',
                'shipping_type' => 'domicilio',
                'shipping_data' => [
                    'address' => 'Calle Real, Nº22',
                    'city' => 'Granada',
                    'postal_code' => '18001',
                    'province' => 'Granada',
                    'phone' => '+34 600 222 222',
                    'notes' => 'Dejar en portería'
                ],
                'payment_completed' => false,
            ],
            [
                'id' => 4,
                'user_id' => 2,
                'status' => 'enviado',
                'shipping_type' => 'recogida',
                'shipping_data' => [],
                'payment_completed' => true,
            ],

            // Admin (id=3)
            [
                'id' => 5,
                'user_id' => 3,
                'status' => 'pendiente',
                'shipping_type' => 'domicilio',
                'shipping_data' => [
                    'address' => 'Plaza Mayor, Nº1',
                    'city' => 'Madrid',
                    'postal_code' => '28001',
                    'province' => 'Madrid',
                    'phone' => '+34 600 333 333',
                    'notes' => 'Llamar antes de entregar'
                ],
                'payment_completed' => false,
            ],
            [
                'id' => 6,
                'user_id' => 3,
                'status' => 'procesando',
                'shipping_type' => 'recogida',
                'shipping_data' => [],
                'payment_completed' => true,
            ],
        ];

        foreach ($orders as $order) {
            Order::updateOrCreate(['id' => $order['id']], $order);
        }
    }
}
