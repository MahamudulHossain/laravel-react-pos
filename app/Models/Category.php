<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#(['name', 'slug', 'status'])
class Category extends Model
{
    use HasFactory;
    protected $table = 'categories';

}
