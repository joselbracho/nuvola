<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use DB;

class ImportCsvItems extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'importCsv:items {institution_id} {file}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Comando para importar los items de Koha desde un archivo CSV';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        // Descomentar este condicional si desea pedir confirmacion de la importación
        // if (!$this->confirm('Desea borrar los items antiguos de la BD e importar el CSV? [y|N]')) {
        //     exit("Importación cancelada. \n");
        // }

        echo "Leyendo CSV... \n";
        $file = $this->argument('file');

        $mimes = array('application/vnd.ms-excel','text/plain','text/csv','text/tsv');
        
        if(!in_array(mime_content_type($file),$mimes)){
          die("No es un CSV válido. \n");
        }
        $arrayItems = $this->import_csv_to_array($file);        

        if (empty($arrayItems)) {
            exit("Error: CSV vacío. \n");
        }

        echo "Preparando datos para importar... \n";
        $values = array();

        
        foreach ($arrayItems as $item) {
            $values[] = '("'.
                        str_replace('"', "'", $item['title']).'", "'.
                        str_replace('"', "'", $item['author']).'", "'.
                        str_replace('"', "'", $item['barcode']).'", "'.
                        str_replace('"', "'", $item['itemcallnumber']).'", "'.
                        str_replace('"', "'", $item['onloan']).'", "'.
                        str_replace('"', "'", $item['itype']).'", '.
                        (Int) $this->argument('institution_id').
                    ')';
        }

        $totalItems = count($arrayItems);
        $totalToDelete = DB::table('koha_inventory')->where('institution_id', (Int) $this->argument('institution_id'))->count();

        $executionStartTime = microtime(true);

        // Se eliminan los items viejos
        echo "Eliminando $totalToDelete items antiguos... \n";
        DB::table('koha_inventory')->where('institution_id', (Int) $this->argument('institution_id'))->delete();

        // Se importan los items nuevos
        echo "Importando $totalItems items nuevos... \n";
        $result = DB::insert('INSERT INTO koha_inventory (title, author, barcode, itemcallnumber, onloan, itype, institution_id) VALUES '.implode(', ', $values));

        $executionEndTime = microtime(true);

        // Calculo del tiempo de duracion de la importación a la BD
        $seconds = $executionEndTime - $executionStartTime;

        
        if ($result === true) {
            $totalImportedItems = DB::table('koha_inventory')->where('institution_id', (Int) $this->argument('institution_id'))->count();
        
            echo "Se importaron $totalImportedItems items de $totalItems en $seconds segundos. \n";
            exit();
        }

        exit("Importación finalizada incorrectamente. \n");
    }


    /**
     *
     * Esta función permite importar un archivo CSV y exportarlo a una matriz PHP
     *
     * @param string $file      El archivo del que quieres importar los datos
     * @param string $enclosure El tipo de recinto utilizado en el archivo CSV
     *
     * @return array            The array containing the CSV infos
     */
    public static function import_csv_to_array($file, $enclosure = '"')
    {
        // Consigamos el contenido del archivo y almacenémoslo en la cadena
        $csv_string = file_get_contents($file);

        $csv_string = str_replace("\r\n\r\n\"", "\"", $csv_string); // Borrar lineas en blanco dentro de un string
        $csv_string = str_replace("\n\n", "", $csv_string); // Borrar saltos de lineas en blanco dentro de un string
        $csv_string = str_replace("/", "", $csv_string); // Borrar backslash dentro de un string

        // Detectemos cuál es el delimitador del archivo CSV
        $delimiter = ImportCsvItems::detect_delimiter($csv_string);

        // Consigue todas las líneas de la cadena CSV
        $lines = explode("\n", $csv_string);

        // La primera línea del archivo CSV son los encabezados que usaremos como keys
        $head = str_getcsv(array_shift($lines), $delimiter, $enclosure);

        $array = array();

        // Loop de las líneas dentro del CSV
        foreach ($lines as $index => $line) {

            // A veces los archivos CSV tienen una línea vacía al final, intentamos no añadirla en el array
            if(empty($line)) {
                continue;
            }

            // Obtener los datos del CSV de la línea
            $csv = str_getcsv($line,$delimiter,$enclosure);

            // Combina el encabezado y las datos obtenidos de la linea
            $array[] = array_combine( $head, $csv );

        }

        return $array;
    }

    /**
     *
     * Esta función detecta el delimitador dentro del archivo CSV.
     *
     * Permite que la función funcione con diferentes tipos de delimitadores, ";", "," "\t", o "|"
     *
     *
     *
     * @param string $csv_string    El contenido del archivo CSV
     * @return string               El delimitador utilizado en el archivo CSV
     */
    public static function detect_delimiter($csv_string)
    {

        // Lista de delimitadores que comprobaremos
        $delimiters = array(';' => 0,',' => 0,"\t" => 0,"|" => 0);

        // Para cada delimitador, contamos el número de veces que se puede encontrar dentro de la cadena csv
        foreach ($delimiters as $delimiter => &$count) {
            $count = substr_count($csv_string,$delimiter);
        }

        // El delimitador utilizado es probablemente el que más aparece en el archivo
        return array_search(max($delimiters), $delimiters);

    }
}
