<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Employee;
use Illuminate\Support\Facades\Hash;

class EmployeeSeeder extends Seeder
{
    public function run()
    {
        Employee::updateOrCreate([
            'email' => 'admin@empresa.com',
        ], [
            'name' => 'Admin',
            'password' => Hash::make('password'),
            'rol' => 'admin',
            'is_active' => true,
        ]);
    }
}
