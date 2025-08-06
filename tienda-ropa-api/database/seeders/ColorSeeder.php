<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Color;

class ColorSeeder extends Seeder
{
    public function run()
    {
        $colors = [
            ['name' => 'Rojo', 'hex' => '#FF0000'],
            ['name' => 'Azul', 'hex' => '#0000FF'],
            ['name' => 'Verde', 'hex' => '#00FF00'],
            ['name' => 'Negro', 'hex' => '#000000'],
        ];
        foreach ($colors as $color) {
            Color::create($color);
        }
    }
}
