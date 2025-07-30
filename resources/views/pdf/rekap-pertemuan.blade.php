<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Rekap Kehadiran Dosen</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #000; padding: 4px; text-align: center; }
        .ttd { margin-top: 40px; text-align: center; }
        .text-left { text-align: left; }
        .no-border td { border: none; }
        .header {
            text-align: end;
            margin-bottom: 12px;
            width: 100%;
        }

        .title {
            font-size: 15px;
            /* font-weight: bold; */
        }

        .info {
            margin-top: 12px;
        }

        .signature {
            text-align: left;
        }

        .header-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            position: relative;
            width: 100%;
        }

        .container {
            border: 1px solid #000;
            padding: 2rem 1.25rem;
        }
    </style>
</head>
<body>
    <div style="width: 100%; position: relative; padding-bottom: 5rem;">
        <img src="{{ $image }}" alt="STMIK Bandung" style="width: 100px; position: absolute; top: 0; left: 0;" />
        <div style="position: absolute; top: 0; right: 0; width: 80%">
            <div style="text-align: center; width: 100%;">
                <p>
                    <span class="title">
                        Sekolah Tinggi Manajemen Informatika dan Komputer Bandung
                    </span>
                    <br>
                    <span class="title">
                        Jl. Cikutra 113 Bandung - Jawa Barat - Indonesia
                    </span>
                    <br>
                    <span class="title" >
                        <b>
                            REKAP PERKULIAHAN PER DOSEN
                        </b>
                    </span>
                    <br>
                    <span class="title" >
                        <b>
                            PERIODE : {{ $from }} - {{ $to }}
                        </b>
                    </span>
                </p>
            </div>
        </div>
        
    </div>
    {{-- <h4 style="text-align: center;">
        REKAP KEHADIRAN PER DOSEN<br>
        KELAS REGULER<br>
        PERIODE: 26/04/2025 - 25/05/2025
    </h4> --}}

    <p>
        <strong>
            Dosen: {{ $dosen }}
        </strong>
    </p>
    {{-- <p><strong>Mata Kuliah:</strong> {{ $matakuliah }}</p> --}}

    <table>
        <thead>
            <tr>
                <th style="">
                    Tanggal
                </th>
                <th style="">
                    SKS
                </th>
                <th style="">
                    Kelas Program
                </th>
                <th style="">
                    Kelas
                </th>
                <th style="width: 100%">
                    Nama Mata Kuliah
                </th>
            </tr>
        </thead>
        <tbody>
            @foreach ($kehadiran as $data)
                <tr>
                    <td>{{ $data['tanggal'] }}</td>
                    <td>{{ $data['sks'] }}</td>
                    <td>{{ $data['program'] }}</td>
                    <td>{{ $data['kegiatan'] }}</td>
                    <td>{{ $data['kelas'] }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    {{-- <hr style="opacity: 0%"> --}}
    
    <table class="no-border">
        <tr >
            <td style="width: calc(1/3 * 100%);">
                <p style="text-align: left;">
                    <strong>
                        Jumlah SKS:
                    </strong>
                    {{ $totalSks }}
                </p>
            </td>
            <td style="width: calc(1/3 * 100%);">
                
            </td>
            <td style="width: calc(1/3 * 100%);">
                <p style="text-align: center;">
                    <strong>
                        Bandung, {{ $tanggal }}
                    </strong>
                </p>
            </td>
        </tr>
        <tr >
            <td style="width: calc(1/3 * 100%);">
                <p>
                    <strong>
                        Wakil Ketua II
                    </strong>
                </p>
            </td>
            <td style="width: calc(1/3 * 100%);">
                <p>
                    <strong>
                        Dosen
                    </strong>
                </p>
            </td>
            <td style="width: calc(1/3 * 100%);">
                <p>
                    <strong>
                        Pembuat Laporan
                    </strong>
                </p>
            </td>
        </tr>
        <tr><td colspan="3" style="height: 50px;"></td></tr>
        <tr >
            <td style="width: calc(1/3 * 100%);">
                <p>
                    <strong>
                        ( {{ $wakilKetua }} )
                    </strong>
                </p>
            </td>
            <td style="width: calc(1/3 * 100%);">
                <p>
                    <strong>
                        ( {{ $dosen }} )
                    </strong>
                </p>
            </td>
            <td style="width: calc(1/3 * 100%);">
                <p>
                    <strong>
                        ( {{ $pembuat }} )
                    </strong>
                </p>
            </td>
        </tr>
        <tr>
            <td colspan="3">
                <p style="text-align: right; font-style: italic; opacity: 70%">
                    * Catatan: Bila ada kesalahan, segera menghubungi BAAK
                </p>
            </td>
        </tr>
    </table>
    

    
</body>
</html>
