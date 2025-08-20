<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'status',
        'shipping_type',
        'shipping_data',
        'payment_completed',
        'ticket_path',
    ];

    protected $casts = [
        'shipping_data' => 'array',
        'payment_completed' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'order_products')
            ->withPivot(['size_id', 'color_id', 'quantity'])
            ->withTimestamps();
    }

    public function items()
    {
        return $this->hasMany(OrderProduct::class);
    }

    public function calculateTotal()
    {
        return $this->items->sum(function ($item) {
            return $item->product->price * $item->quantity;
        });
    }

    public function getFormattedTotalAttribute()
    {
        return number_format($this->calculateTotal(), 2, '.', '');
    }
}
