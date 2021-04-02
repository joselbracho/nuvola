<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">

  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name=”robots” content="index, follow">
    <title>{{ config('app.name', 'Humedad Miami - Orlando - New York') }}</title>
    <script>
      window.App = {!! json_encode([
        'name' => config('app.name'),
        //'google_client_id' => config('services.google.client_id')
      ]) !!};
    </script>
    <script src="{{ asset('js/app.js') }}" defer></script>
    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
  </head>

  <body>
      <div id="app"></div>
  </body>

</html>
