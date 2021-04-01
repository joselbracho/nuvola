<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Exception;
use App\Travel;
use Storage;
use App\Http\Resources\TravelResource;
use App\Http\Resources\TravelCollection;

class TravelController extends Controller
{

	public function getTravels(Request $request)
    {
        $search = $request->input('search');
        $order_by = $request->input('order_by') ? $request->input('order_by') : 'id';
        $order_type = $request->input('order_type') ? $request->input('order_type') : 'DESC';

        $queryTravels = Travel::select('travels.*');

        // Search
        $queryTravels->when($search, function ($query, $search) {
            return $query->where('travels.name', 'LIKE', '%' . $search . '%')
                ->orWhere('travels.last_name', 'LIKE', '%' . $search . '%')
                ->orWhere('travels.email', 'LIKE', '%' . $search . '%')
                ->orWhere('travels.address', 'LIKE', '%' . $search . '%');
        });

        // Order By
        $queryTravels->orderBy($order_by, $order_type);

        $travels = $queryTravels->paginate(10);

        return new TravelCollection($travels);
    }

    public function getTravel($id)
    {
        return new TravelResource(Travel::find($id));
    }

    /**
     * @WebMethod
     * @param string $id
     * @return string $resultado
     */
    public function create($id)
    {
        try {
            $this->validateRequest($request, 'create_travel');
          
            $travel = new Travel;
            $travel->travel_date = $request->input('travel_date');
            $travel->country_id = $request->input('country_id');
            $travel->city = $request->input('city');
            $travel->client_email = $request->input('client_email');
            $travel->save();

            return (new TravelResource($inci_user))
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


    
}
