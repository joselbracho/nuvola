<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\User;
use App\Building;
use App\Http\Resources\UserResource;
use App\Http\Resources\UserCollection;

use Exception;

class UserController extends Controller
{

	public function getUsers(Request $request) {
		$search = $request->input('search');
		$order_by = $request->input('order_by') ? $request->input('order_by') : 'id';
		$order_type = $request->input('order_type') ? $request->input('order_type') : 'DESC';

		$queryUsers = User::select('users.*', 'roles.name AS role_name')

			->join('roles', function ($join) {
				$join->on('roles.id', '=', 'users.role_id');
			})
			->when($request->current_institution === null, function($query) {
				$query->whereNull('users.institution_id');
			})
			->when($request->current_institution, function($query) use ($request) {
				$query->where('users.institution_id', '=', $request->current_institution->id);
			});
		
		// Search
		$queryUsers->when($search, function ($query, $search) {
			return $query->where( 'users.name' ,'LIKE', '%'.$search.'%');
		});

		// order by
		$queryUsers->orderBy($order_by, $order_type);
		
		$users = $queryUsers->paginate(5);
		return new UserCollection($users);
	}

    public function delete($id){
    	$user = User::find($id);
    	$user->delete();

    	return response()->json([
			"data" => [
				"message" => "Nota eleminada satisfactoriamente.",
				],
			"meta" => [
				"success" => true,
			],

		]);
    }

    public function create(Request $request){
        try {

			$this->validateRequest($request, 'create_user');
			$building = Building::where('institution_id', '=', $request->current_institution->id)->first();
			$first_entrace = $building->entraces->first();
			$user = new User;
			$user->name = $request->name;
			$user->email = $request->email;
			$user->password = bcrypt($request->password);
			$user->institution_id = $request->current_institution->id;
			$user->role_id = $request->role_id;
			$user->entrace_id = $first_entrace->id;
			$user->save();
            
			return (new UserResource($user))
				->additional([
					'meta' 	=> [
						"success" => true,
					]
				]);

        } catch(Exception $e) {

			$error = $this->getGeneralError($e);
			return $this->responseApi($error['message'], null, false, $error['code'], $error['errors']);
        }
    }

    public function update($id, Request $request){

        try {
        	
			$this->validateRequest($request, 'update_user', ['user_id' => $id]);

			$user = User::find($id);
			$user->name = $request->name;
			$user->email = $request->email;
			if ($request->input('password')) {
				$user->password = bcrypt($request->password);
			}
			$user->role_id = $request->role_id;
			$user->save();
			return (new UserResource($user))
				->additional([
					'meta' 	=> [
						"success" => true,
					]
				]);

        } catch(Exception $e) {
			$error = $this->getGeneralError($e);
			return $this->responseApi($error['message'], null, false, $error['code'], $error['errors']);
        }
    }

    public function getUser($id){
    	return new UserResource(User::find($id));
    }

}
