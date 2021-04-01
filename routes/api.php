<?php


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::name('api.')->namespace('Api')->group(function () {
    // Unprotected routes
    Route::group(['middleware' => 'guest:api'], function () {
        // list clients
        Route::get('clients', 'ClientController@getClients')->name('clients.list');
        // create
        Route::post('clients/create', 'ClientController@create')->name('clients.create');
        // update
        Route::post('clients/update/{id}', 'ClientController@update')->name('clients.update');
        // delete
        Route::post('clients/delete/{id}', 'ClientController@delete')->name('clients.delete');
        // get client
        Route::get('clients/{id}', 'ClientController@getClient')->name('clients.get');
        // get client image
        Route::get('clients/{id}/getImage', 'ClientController@getImage')->name('clients.getImage');
        // list travels
        Route::get('travels', 'TravelController@getTravels')->name('travels.list');
        // get travel
        Route::get('travels/{id}', 'TravelController@getTravel')->name('travels.get');
        // create travel
        Route::post('travels/create', 'TravelController@create')->name('travels.create');
        // SOAP travels
        Route::any('/soap/travels','SoapController@soap');

        
    });
});
