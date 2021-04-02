<?php

return [
    'create_client' => [
        'name' => 'required|max:255',
        'last_name' => 'required|max:255',
        'phone' => 'required|max:255',
        'address' => 'required|max:255',
        'email' => 'required|unique:clients,email',
        'file_path_image' => 'required|mimes:jpeg,png,gif',
    ],
    'update_client' => [
        'name' => 'required|max:255',
        'last_name' => 'required|max:255',
        'phone' => 'required|max:255',
        'address' => 'required|max:255',
        'email' => 'required|unique:clients,email,{client_id}',
        'file_path_image' => 'required|mimes:jpeg,png,gif',
    ],
    'create_travel'  => [
        'travel_date' => 'required|date',
        'country_id' => 'required|exists:countries,id',
        'city' => 'required|max:255',
        'client_email' => 'required|exists:clients,email',
    ],

];
