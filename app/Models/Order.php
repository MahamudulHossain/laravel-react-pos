<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['custom_order_id', 'customer_name', 'customer_phone', 'payment_method', 'notes', 'subtotal', 'tax', 'total'])]

class Order extends Model
{
    protected $table = 'orders';

    public function details()
    {
        return $this->hasMany(OrderDetails::class);
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'order_details')
            ->withPivot('selected_quantity')
            ->withTimestamps();
    }
}
