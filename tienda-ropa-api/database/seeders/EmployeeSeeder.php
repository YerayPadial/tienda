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
            'name' => 'Admin',
            'email' => 'admin@empresa.com',
        ], [
            'password' => Hash::make('password'),
            'rol' => 'admin',
        ]);
    }
}
