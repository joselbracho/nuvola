<?php

namespace App\Http\Controllers\Api\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\User;
use Validator;

class MeController extends Controller
{
    public function me(Request $request)
    {
        return new UserResource($request->user());
    }

    public function updateProfile(Request $request)
    {

    	$user = \Auth::user();
        if($user == null){
            return abort(401);
        }    	
    	$data = $request->all();

     	$rules = array(
            'email' => 'email|required|unique:users,email,'.$user->id,
            'name' => 'required|regex:/^[\pL\s\-]+$/u|max:255',
        );

        if(array_key_exists('password', $data)){
            if($data['password'] != '' && $data['password'] != null){
                $rules['password'] = 'string|min:8|confirmed';
            }  
        }

        $validator  = Validator::make($data, $rules);

        if($validator ->fails())
        {

    	  	return (new UserResource($request->user()))
            ->additional([
                'meta' 	=> [
                	"success" => false,
                ],

                "errors" => $validator->errors(),
            ])
            ->response()
            ->setStatusCode(422);

        }
        $user->email = $request->email;
        $user->name  = $request->name;
        $user->entrace_id  = $request->entrace_id;
        
        if(array_key_exists('password', $rules)){
            $user->password = bcrypt($request->password);
        }
        $user->save();
        
	  	return (new UserResource($request->user()))
            ->additional([
                'meta' 	=> [
                	"success" => true,
                ]
            ]);
        
    }

    

}
