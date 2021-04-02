<?php

namespace App\Http\Controllers\Api;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
class SoapController extends Controller {

    public function server() {
        require_once (base_path().'\nusoap.php');
        $server = new \nusoap_server();

        $server->configureWSDL('TravelsService', false, url('api'));

        $server->register('createTravels',
            array('input' => 'xsd:string'),
            array('output' => 'xsd:string'),
        );

        function createTravels($input){
            return $input;
        }

        $rawPostData = file_get_contents("php://input");
        return \Response::make($server->service($rawPostData), 200, array('Content-Type' => 'text/xml; charset=ISO-8859-1'));
    }

}