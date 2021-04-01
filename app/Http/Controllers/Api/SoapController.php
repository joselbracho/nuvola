<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Response;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\TravelController;
use WSDL\WSDLCreator;


class SoapController extends Controller
{
	public function __construct() {
        ini_set('soap.wsdl_cache_enabled', 0);
        ini_set('soap.wsdl_cache_ttl', 0);
        ini_set('default_socket_timeout', 300);
        ini_set('max_execution_time', 0);
    }

	public function soap() {
		// define class
		$class = new TravelController();
		$wsdl = new WSDLCreator("App\Http\Controllers\Api\TravelController", \URL::to('/').'/soap/travels');
		if (isset($_GET['wsdl'])) {
		    
		    $wsdl->setNamespace(\URL::to('/').'/soap');
		    $wsdl->renderWSDL();
		    exit;
		}

		$server = new \SoapServer(null, array(
		    'uri' => \URL::to('/').'/soap/travels?wsdl'
		));

		$wsdl->renderWSDLService();
		$server->setObject($class);
	    ob_start();

	    $response = new Response();
	    $response->headers->set("Content-Type","text/xml; charset=utf-8");

	    $server->handle();
	    $response->setContent(ob_get_clean());

	    return $response;
	  }

}