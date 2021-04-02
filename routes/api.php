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
        Route::any('soap/travels', function() {
            require_once (base_path().'\nusoap.php');
            $server = new \nusoap_server();

            $server->configureWSDL('TravelsService', false, url('api/travels/create'));

            $server->register('createTravels',
                array(
                    'travel_date' => 'xsd:string',
                    'country_id' => 'xsd:string',
                    'city' => 'xsd:string',
                    'client_email' => 'xsd:string',
                ),
                array('output' => 'xsd:string'),
            );

            function createTravels($travel_date){
                dd('hola');
                return $travel_date;
            }

            $rawPostData = file_get_contents("php://input");
            return \Response::make($server->service($rawPostData), 200, array('Content-Type' => 'text/xml; charset=ISO-8859-1'));
        });
        
    });
});
