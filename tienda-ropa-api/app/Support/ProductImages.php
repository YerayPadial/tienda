<?php

namespace App\Support;

use App\Models\Product;

class ProductImages
{
    private const BASE_URL = 'https://padiyera.ososportgym.es/ecommerce-api/storage/products/';

    private const SLUGS = [
        20 => 'collar',
        21 => 'sudadera-basica',
        22 => 'pantalon-deportivo',
        23 => 'vestido-elegante',
        24 => 'camiseta',
        25 => 'gorra',
        26 => 'chaqueta',
        27 => 'falda',
        28 => 'bufanda',
        29 => 'polo',
        30 => 'blusa',
    ];

    public static function forAvailableColors(Product $product): array
    {
        $slug = self::SLUGS[$product->id] ?? str($product->name)->slug()->toString();

        $colors = $product->stocks()
            ->where('stock', '>', 0)
            ->with('color')
            ->get()
            ->pluck('color.name')
            ->filter()
            ->unique()
            ->map(fn (string $name) => str($name)->lower()->ascii()->slug()->toString())
            ->values();

        if ($colors->isEmpty()) {
            return [];
        }

        return $colors
            ->map(fn (string $color) => self::BASE_URL . "{$slug}-{$color}.svg")
            ->all();
    }
}
