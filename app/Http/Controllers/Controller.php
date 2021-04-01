<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Validator;
use Exception;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;
    private $errors;

    /**
     * Obtain Rules Validation
     */
    private function getRules($flag)
    {
        return config('rules.' . $flag);
    }

    /**
     * Validate fields
     */
    protected function validateRequest($request, $rule = '', $fields = [], $extraRules = [])
    {
        $rules = $this->getRules($rule);
        
        if (!empty($extraRules)) {
            $rules = array_merge($rules, $extraRules);
        }

        if (!empty($fields)) {
            foreach ($fields as $key => $value) {
                $rules = str_replace('{'.$key.'}', $value, $rules);
            }
        }

        $validator = Validator::make($request->all(), $rules);

        $errors = $validator->fails() ? $validator->errors() : [];
        
        if(count($errors)) {
            $this->errors = $errors;
            $errors = $errors->messages();

            $stringError = '';

            foreach ($this->errors as $error) {
                foreach ($error as $err) {
                    $stringError = $err . ' ' . $stringError;
                }
            }

            throw new Exception($stringError, 422);
        }
        return false;
    }

    /**
     * Response
     */
    public function responseApi($message = null, $result = null, $success = false, $code = 400, $errors = []) 
    {
        $response = [
            'data' => $result,
            'meta' => [
                'success' => $success,
                'message' => $message
            ],
        ];

        if ($code >= 400) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $code);
    }

    /**
     * Return Error Code in Exception
     */
    protected function getGeneralError($error)
    {
        $code = $error->getCode();
        $message = $error->getMessage();
        $line = $error->getLine();
        
        if($code >= 300 && $code <= 500) {
            return [
                'code' => $code,
                'message' => $this->errors ? __('validation.general_error') : $message,
                'errors' => $this->errors ? $this->errors : []
            ];
        }

        if ($code == 0) {
            $code = 500;
        }

        if ($code >= 500 || \is_string($code)) {
            \Log::error('Error'.$code.': '.$message.' Line:'.$line);
        }

        if (\is_string($code)) {
            $code = 500;
        }

        return [
            'code' => (env('APP_DEBUG') == 'debug') ? $code : 500,
            'message' => (env('APP_DEBUG') == 'debug') ? $message : __('validation.general_error_server'),
            'errors' => $this->errors ? $this->errors : []
        ];
    }

}
