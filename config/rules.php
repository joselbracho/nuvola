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
    'create_travel'  => [
        'travel_date' => 'required|date',
        'country_id' => 'required|exists:countries,id',
        'city' => 'required|max:255',
        'client_email' => 'required|exists:clients,email',
    ],

];
