<table>
    <thead>
        <tr>
            @foreach($head as $headItem)
                @if ($headItem !== 'created_at' && $headItem !== 'updated_at')
                <th>{{ $headItem }}</th>
                @endif
            @endforeach
        </tr>
    </thead>
    <tbody>
    @foreach($data as $dataItem)
        <tr>
            @foreach($dataItem as $key => $value)
                @if($key !== 'created_at' && $key !== 'updated_at')
                <td>{{ $value }}</td>
                @endif
            @endforeach
        </tr>
    @endforeach
    </tbody>
</table>