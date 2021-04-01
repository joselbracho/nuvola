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
                ->orWhere('clients.address', 'LIKE', '%' . $search . '%');
        });

        // Order By
        $queryClients->orderBy($order_by, $order_type);

        $clients = $queryClients->paginate(10);

        return new ClientCollection($clients);
    }

    public function getClient($id)
    {
        return new ClientResource(Client::find($id));
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
          
            $inci_user = new Client;
            $inci_user->name = $request->input('name');
            $inci_user->last_name = $request->input('last_name');
            $inci_user->email = $request->input('email');
            $inci_user->phone = $request->input('phone');
            $inci_user->address = $request->input('address');
            $inci_user->file_path_image = $file_path_image;
            $inci_user->save();

            return (new ClientResource($inci_user))
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
            $extraRules = null;
            if ($request->input('password')) {
                $extraRules = ['password' => 'required|string|min:8|confirmed'];
            }

            $this->validateRequest($request, 'update_inci_user', ['inci_user_id' => $id]);

            $inci_user = Client::find($id);


            $inci_user->name = $request->input('name');
            $inci_user->last_name = $request->input('last_name');
            $inci_user->email = $request->input('email');
            $inci_user->document_type_id = $request->input('document_type_id');
            $inci_user->document_number = $request->input('document_number');
            $inci_user->state_id = $request->input('state_id');
            $inci_user->municipality_id = $request->input('municipality_id');
            $inci_user->city_id = $request->input('city_id');
            $inci_user->gender_id = $request->input('gender_id');
            $inci_user->phone_number = $request->input('phone_number');
            $inci_user->mobile_number = $request->input('mobile_number');
            $inci_user->territory = $request->input('territory');
            $inci_user->educational_level = $request->input('educational_level_id');
            $inci_user->population_group_id = $request->input('population_group_id');
            //$inci_user->file_path_document = $file_path_document;
            //$inci_user->file_path_eps_certificate = $file_path_eps_certificate;
            $inci_user->password =  bcrypt($request->input('password'));

            $inci_user->save();

            return (new ClientResource($inci_user))
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
        $inci_user = Client::find($id);

        if ($inci_user == null) {
            return response()->json([
                "data" => [
                    "message" => "El usuario no puede eliminarse.",
                ],
                "meta" => [
                    "success" => false,
                ],

            ]);
        }
        $inci_user->delete();

        return response()->json([
            "data" => [
                "message" => "Usuario eleminado satisfactoriamente.",
            ],
            "meta" => [
                "success" => true,
            ],

        ]);
    }
    public function getFile($file_path)
    {

        $contents = Storage::get($file_path);
        //$file = File::get($path);
        $type = Storage::mimeType($file_path);

        $response = \Response::make($contents, 200);
        $response->header("Content-Type", $type);

        return $response;
    }
}
