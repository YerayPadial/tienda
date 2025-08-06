<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'description',
        'category',
        'gender',
        'price',
        'images',
    ];

    protected $casts = [
        'images' => 'array',
    ];

    // Relaciones (se definirán después)
}
