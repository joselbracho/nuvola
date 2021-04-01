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

    protected $appends = ['image'];

    public function getImageAttribute()
    {
        $contents = \Storage::get($this->file_path_image);
        $type = \Storage::mimeType($this->file_path_image);
        return 'data:'.$type.';charset=utf-8;base64,'.base64_encode($contents);
    }

    public function travels() {
        return $this->hasMany('App\Travel', 'client_email','email');
    }
    
}
