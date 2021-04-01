<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Travel extends Model
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
    
    protected $table = 'travels';

    protected $fillable = [
        'travel_date',
        'country_id',
        'city',
        'client_email',
    ];

    public function client(): BelongsToo
    {
        return $this->belongsTo(User::class);
    }
}
