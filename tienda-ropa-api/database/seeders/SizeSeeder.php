<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Size;

class SizeSeeder extends Seeder
{
    public function run()
    {
        $sizes = [
            ['id' => 20, 'name' => 'XS'],
            ['id' => 21, 'name' => 'S'],
            ['id' => 22, 'name' => 'M'],
            ['id' => 23, 'name' => 'L'],
            ['id' => 24, 'name' => 'XL'],
            ['id' => 25, 'name' => 'Única'],
        ];
        foreach ($sizes as $size) {
            Size::updateOrCreate(['id' => $size['id']], $size);
        }
    }
}
