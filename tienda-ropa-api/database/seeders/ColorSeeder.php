<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Color;

class ColorSeeder extends Seeder
{
    public function run()
    {
        $colors = [
            ['id' => 20, 'name' => 'Negro', 'hex' => '#000000'],
            ['id' => 21, 'name' => 'Blanco', 'hex' => '#FFFFFF'],
            ['id' => 22, 'name' => 'Azul', 'hex' => '#0000FF'],
            ['id' => 23, 'name' => 'Rojo', 'hex' => '#FF0000'],
            ['id' => 24, 'name' => 'Verde', 'hex' => '#00FF00'],
        ];
        foreach ($colors as $color) {
            Color::updateOrCreate(['id' => $color['id']], $color);
        }
    }
}
