<?php

namespace App\Exports;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class ReportExport implements FromView
{
    protected $data;
    protected $head;

    public function __construct($data)
    {
        $this->data = !empty($data) ? $data : [];
        $this->head =  !empty($data) ? array_keys($this->data[0]) : [];
    }

    public function view(): View
    {
        return view('exports.reports.general', [
            'head' => $this->head,
            'data' => $this->data
        ]);
    }
}
