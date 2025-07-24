<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>{{ $title }}</title>
    <style>
        .page-break {
            page-break-after: always;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #000;
            font-size: 13px;
            margin-top: 30px;
        }


        table th, table td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
        }

        table thead th {
            background-color: #007bff;
            color: white;
        }

        .column-text-center {
            text-align: center;
            vertical-align: middle;
        }

        header {
            width: 100%;
        }

        header h1 {
            font-size: 16px;
            margin: 0;
        }

        header p {
            font-size: 14px;
            margin: 12px 0;
        }

        header .title {
            font-weight: bold;
            font-size: 14px;
            margin: 4px;
        }

        header .header-content {
            border-bottom: 2px solid black;
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
        }

        header .image-wrapper {
            max-width: 100px;
        }

        header .text-wrapper {
            flex-grow: 1;
            text-align: center;
            margin-top: 30px;
        }

    </style>
</head>
<body>
    <header>
        <div class="header-content">
            {{-- Gambar Masih bermasalah --}}
            {{-- <div class="image-wrapper">
                <img src="{{ public_path('/images/favicons/android-chrome-512x512.png') }}" width="100">
            </div> --}}
            <div class="text-wrapper">
                <h1>SEKOLAH TINGGI MANAJEMEN INFORMATIKA DAN KOMPUTER BANDUNG</h1>
                <p>JL. Cikutra 113 Bandung - Jawa Barat - Indonesia</p>
                <p class="title">REKAP PERTEMUAN PER DOSEN DAN MATAKULIAH</p>
                <p class="title">PERIODE: {{ $from  . ' - ' . $to }}</p>
                <p class="title">DOSEN: {{ strtoupper(trim($data['dosen']['nm_dosen'])) }}</p>
            </div>
        </div>
    </header>
    <table class="table table-hover" id="tableRekapPertemuan">
        <thead>
            <tr>
                <th class="column-text-center">No.</th>
                <th class="column-text-center">Tanggal</th>
                <th class="column-text-center">SKS</th>
                <th class="column-text-center">Jenis Mahasiswa</th>
                <th class="column-text-center">Kode Kampus</th>
                <th class="column-text-center">Mata Kuliah</th>
            </tr>
        </thead>
        <tbody>
            @php
                $totalSKS = 0;
            @endphp
            @foreach ($data['rekap_pertemuan'] as $item)
                <tr>
                    <td class="column-text-center">{{ $loop->iteration }}</td>
                    <td class="column-text-center">{{ $item['tanggal'] }}</td>
                    <td class="column-text-center">{{ $data['matakuliah']['sks'] }}</td>
                    <td class="column-text-center">{{ $data['tahun_ajaran'][0]['jns_mhs'] }}</td>
                    <td class="column-text-center">{{ $data['tahun_ajaran'][0]['kd_kampus'] }}</td>
                    <td class="column-text-center">{{ trim($data['matakuliah']['nm_mk']) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
    <script type="text/php">
        if ( isset($pdf) ) {
            $date = date('d-m-Y');
            $pdf->page_text(500, 800, "Halaman: {PAGE_NUM} dari {PAGE_COUNT}", null, 8, array(0,0,0));
            $pdf->page_text(396, 810, "Dicetak otomatis melalui sistem pada: $date", null, 8, array(0,0,0));
        }
    </script>
</body>
</html>
