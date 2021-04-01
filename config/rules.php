<?php

return [
    'create_client' => [
        'name' => 'required|max:255',
        'last_name' => 'required|max:255',
        'phone' => 'required|max:255',
        'address' => 'required|max:255',
        'email' => 'required|unique:clients,email',
        'file_path_image' => 'required|sometimes|mimes:jpeg,png,gif',
    ],
    'update_client' => [
        'name' => 'max:255',
        'last_name' => 'max:255',
        'phone' => 'required|max:255',
        'address' => 'required|max:255',
        'email' => 'unique:clients,email,{client_id}',
    ],

];
