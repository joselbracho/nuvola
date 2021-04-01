<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'last_name',
        'phone',
        'email',
        'address',
        'file_path_image',
    ];
}
