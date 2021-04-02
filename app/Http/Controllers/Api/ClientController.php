<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Exception;
use App\Client;
use Storage;
use App\Http\Resources\ClientResource;
use App\Http\Resources\ClientCollection;

class ClientController extends Controller
{

	public function getClients(Request $request)
    {
        $search = $request->input('search');
        $order_by = $request->input('order_by') ? $request->input('order_by') : 'id';
        $order_type = $request->input('order_type') ? $request->input('order_type') : 'DESC';

        $queryClients = Client::select('clients.*');

        // Search
        $queryClients->when($search, function ($query, $search) {
            return $query->where('clients.name', 'LIKE', '%' . $search . '%')
                ->orWhere('clients.last_name', 'LIKE', '%' . $search . '%')
                ->orWhere('clients.email', 'LIKE', '%' . $search . '%')
                ->orWhere('clients.address', 'LIKE', '%' . $search . '%')
                ->orWhere('clients.phone', 'LIKE', '%' . $search . '%');
        });

        // Order By
        $queryClients->orderBy($order_by, $order_type);

        $clients = $queryClients->paginate(10);

        return new ClientCollection($clients);
    }

    public function getClient($id)
    {
        return (new ClientResource(Client::with('travels')->find($id)))
                ->additional([
                    'meta'     => [
                        "success" => true,
                    ]
                ]);
    }


    public function create(Request $request)
    {
        try {

            $this->validateRequest($request, 'create_client');

            if ($request->file('file_path_image')) {
                $upload_file = $request->file('file_path_image');
                $file_path_image = time().str_replace(' ', '-', $upload_file->getClientOriginalName());
                Storage::disk('local')->putFileAs(
                    '/',
                    $upload_file,
                    $file_path_image
                );
            }
          
            $client = new Client;
            $client->name = $request->input('name');
            $client->last_name = $request->input('last_name');
            $client->phone = $request->input('phone');
            $client->email = $request->input('email');
            $client->address = $request->input('address');
            $client->file_path_image = $file_path_image;
            $client->save();

            return (new ClientResource($client))
                ->additional([
                    'meta'     => [
                        "success" => true,
                    ]
                ]);
        } catch (Exception $e) {
            $error = $this->getGeneralError($e);
            return $this->responseApi($error['message'], null, false, $error['code'], $error['errors']);
        }
    }


    public function update($id, Request $request)
    {
        try {

            $this->validateRequest($request, 'update_client', ['client_id' => $id]);

            $upload_file = $request->file('file_path_image');
            $file_path_image = time().str_replace(' ', '-', $upload_file->getClientOriginalName());
            Storage::disk('local')->putFileAs(
                '/',
                $upload_file,
                $file_path_image
            );
            
          
            $client = Client::find($id);

            $client->name = $request->input('name');
            $client->last_name = $request->input('last_name');
            $client->phone = $request->input('phone');
            $client->email = $request->input('email');
            $client->address = $request->input('address');
            $client->file_path_image = $file_path_image;

            $client->save();

            return (new ClientResource($client))
                ->additional([
                    'meta'     => [
                        "success" => true,
                    ]
                ]);
        } catch (Exception $e) {
            $error = $this->getGeneralError($e);
            return $this->responseApi($error['message'], null, false, $error['code'], $error['errors']);
        }
    }

    public function delete($id)
    {
        $client = Client::find($id);

        if ($client == null) {
            return response()->json([
                "data" => [
                    "message" => "Client canno't be deleted.",
                ],
                "meta" => [
                    "success" => false,
                ],

            ]);
        }
        $client->delete();

        return response()->json([
            "data" => [
                "message" => "Client deleted correctly.",
            ],
            "meta" => [
                "success" => true,
            ],

        ]);
    }
    public function getImage($id, Request $request)
    {
        $client = Client::find($id);
        $file_path =  $client->file_path_image;
        $contents = Storage::get($file_path);
        $type = Storage::mimeType($file_path);
        if(!$request->query->has('base64')){
            $response = \Response::make($contents, 200);
            $response->header("Content-Type", $type);
            return $response;
        }
        else {

            return response()->json([
                'data' => [
                    'base64' => base64_encode($contents),
                ],
                'meta' => [
                    'success' => true,
                ],
            ],200);
        }
    }
}
