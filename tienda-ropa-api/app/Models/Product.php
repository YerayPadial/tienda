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

    // Relaciones
    public function stocks()
    {
        return $this->hasMany(ProductStock::class);
    }

    public function sizes()
    {
        return $this->belongsToMany(Size::class, 'product_stocks');
    }

    public function colors()
    {
        return $this->belongsToMany(Color::class, 'product_stocks');
    }

    public function orders()
    {
        return $this->belongsToMany(Order::class, 'order_products')
            ->withPivot(['size_id', 'color_id', 'quantity'])
            ->withTimestamps();
    }
}
