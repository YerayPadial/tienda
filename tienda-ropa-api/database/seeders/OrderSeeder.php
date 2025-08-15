<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;

class OrderSeeder extends Seeder
{
    public function run()
    {
        $orders = [
            [
                'id' => 2,
                'user_id' => 1,
                'status' => 'pendiente',
                'shipping_type' => 'Domicilio',
                'shipping_data' => json_encode(['Direccion' => 'Avda. Ejemplo, Nº10, CP:21600']),
                'payment_completed' => false,
            ],
            [
                'id' => 3,
                'user_id' => 2,
                'status' => 'pendiente',
                'shipping_type' => 'Domicilio',
                'shipping_data' => json_encode(['Direccion' => 'Calle Real, Nº22, CP:21610']),
                'payment_completed' => false,
            ],
            [
                'id' => 4,
                'user_id' => 3,
                'status' => 'pendiente',
                'shipping_type' => 'Domicilio',
                'shipping_data' => json_encode(['Direccion' => 'Plaza Mayor, Nº1, CP:21620']),
                'payment_completed' => false,
            ],
        ];

        foreach ($orders as $order) {
            Order::updateOrCreate(['id' => $order['id']], $order);
        }
    }
}
