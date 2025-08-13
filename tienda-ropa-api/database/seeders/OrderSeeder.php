<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\User;

class OrderSeeder extends Seeder
{
    public function run()
    {
        $user = User::first();
        Order::create([
            'user_id' => $user->id,
            'status' => 'pendiente',
            'shipping_type' => 'Domicilio',
            'shipping_data' => ['Direccion' => 'Calle Ejemplo, Nº9, Provincia Huelva, CP:21610'],
            'payment_completed' => false,
        ]);
    }
}
