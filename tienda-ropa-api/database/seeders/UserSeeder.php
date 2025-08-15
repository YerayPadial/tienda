<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        User::updateOrCreate([
            'id' => 1,
        ], [
            'name' => 'Cliente Prueba',
            'email' => 'cliente@correo.com',
            'password' => Hash::make('password'),
        ]);
        User::updateOrCreate([
            'id' => 2,
        ], [
            'name' => 'Yeray Padial',
            'email' => 'yeray@gmail.com',
            'password' => Hash::make('password'),
        ]);
        User::updateOrCreate([
            'id' => 3,
        ], [
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('12345678'),
        ]);
    }
}
