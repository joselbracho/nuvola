<?php

namespace App\Http\Controllers\Api\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\User;

class SignInController extends Controller
{
    public function signIn(Request $request)
    {
        $this->validate($request, [
            'email' => 'required',
            'password' => 'required',
            'recaptcha_response' => 'required|captcha'
        ]);

        if (!$token = auth()->attempt($request->only(['email', 'password']))) {
            return response()->json([
                'errors' => [
                    'email' => ['Sorry we couldn\'t sign you in with those details.']
                ]
            ], 422);
        }        
        }
        else {
            return response()->json([
                    'errors' => [
                        'email' => ['Sorry we couldn\'t sign you in with those details.']
                    ]
            ], 422);
        }


        return (new UserResource($request->user()))
            ->additional([
                'meta' => [
                    'token' => $token
                ]
            ]);
    }
}
