<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Kartu Hasil Studi</title>
    <style>
        @page {
            margin: 18mm 14mm;
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 10.5px;
            color: #111;
        }

        table {
            border-collapse: collapse;
            width: 100%;
        }

        th, td {
            border: 1px solid #222;
            padding: 5px 6px;
            vertical-align: top;
        }

        th {
            background: #f1f5f9;
            font-weight: bold;
        }

        .container {
            border: 1px solid #000;
            padding: 18px;
        }

        .header-container {
            position: relative;
            width: 100%;
            min-height: 72px;
            margin-bottom: 14px;
            border-bottom: 2px solid #111;
            padding-bottom: 10px;
        }

        .logo {
            position: absolute;
            top: 0;
            left: 0;
            width: 86px;
        }

        .header {
            text-align: right;
            margin-left: 96px;
        }

        .campus-name {
            font-size: 14px;
            font-weight: bold;
        }

        .title {
            text-align: center;
            margin: 12px 0;
        }

        .title h1 {
            font-size: 15px;
            margin: 0 0 4px;
            text-decoration: underline;
        }

        .title p {
            margin: 0;
            font-size: 12px;
            font-weight: bold;
        }

        .no-border {
            margin-top: 8px;
        }

        .no-border td {
            border: none;
            padding: 2px 4px;
        }

        .summary-table {
            margin-top: 12px;
        }

        .course-table {
            margin-top: 12px;
        }

        .text-center {
            text-align: center;
        }

        .text-right {
            text-align: right;
        }

        .footer {
            margin-top: 18px;
            text-align: right;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header-container">
            <img src="{{ $image }}" alt="STMIK Bandung" class="logo" />
            <div class="header">
                <div class="campus-name">SEKOLAH TINGGI MANAJEMEN INFORMATIKA DAN KOMPUTER BANDUNG</div>
                <div>Jl. Cikutra 113 Telp. (022) 7207777 Fax. (022) 7207777</div>
                <div>BANDUNG - JAWA BARAT - INDONESIA</div>
                <div>Email: <span style="text-decoration: underline; color: blue">info@stmik-bandung.ac.id</span> | Website: https://www.stmik-bandung.ac.id</div>
            </div>
        </div>

        <div class="title">
            <h1>KARTU HASIL STUDI</h1>
            <p>Semester {{ $semester }}</p>
        </div>

        <table class="no-border">
            <tbody>
                <tr>
                    <td style="width: 90px"><strong>NIM</strong></td>
                    <td style="width: 8px">:</td>
                    <td>{{ $nim ?? '-' }}</td>
                </tr>
                <tr>
                    <td><strong>NAMA</strong></td>
                    <td>:</td>
                    <td>{{ $nama ?? '-' }}</td>
                </tr>
                <tr>
                    <td><strong>DOSEN WALI</strong></td>
                    <td>:</td>
                    <td>{{ $dosen_wali ?? '-' }}</td>
                </tr>
            </tbody>
        </table>

        <table class="summary-table">
            <thead>
                <tr>
                    <th>Total SKS</th>
                    <th>IPS</th>
                    <th>Nilai A</th>
                    <th>Nilai B</th>
                    <th>Nilai C</th>
                    <th>Nilai D</th>
                    <th>Nilai E</th>
                </tr>
            </thead>
            <tbody>
                <tr class="text-center">
                    <td>{{ $total_sks ?? 0 }}</td>
                    <td>{{ number_format((float) ($total_ip ?? 0), 2, '.', '') }}</td>
                    <td>{{ $total_nilai_a ?? 0 }}</td>
                    <td>{{ $total_nilai_b ?? 0 }}</td>
                    <td>{{ $total_nilai_c ?? 0 }}</td>
                    <td>{{ $total_nilai_d ?? 0 }}</td>
                    <td>{{ $total_nilai_e ?? 0 }}</td>
                </tr>
            </tbody>
        </table>

        <table class="course-table">
            <thead>
                <tr>
                    <th style="width: 32px" class="text-center">No</th>
                    <th style="width: 90px">Kode</th>
                    <th>Mata Kuliah</th>
                    <th style="width: 42px" class="text-center">SKS</th>
                    <th style="width: 48px" class="text-center">Nilai</th>
                    <th style="width: 48px" class="text-center">Mutu</th>
                </tr>
            </thead>
            <tbody>
                @foreach($matakuliah as $index => $mk)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td>{{ $mk['kd_mk'] ?? '-' }}</td>
                    <td>{{ $mk['nm_mk'] ?? '-' }}</td>
                    <td class="text-center">{{ $mk['sks'] ?? 0 }}</td>
                    <td class="text-center">{{ $mk['nilai'] ?? '-' }}</td>
                    <td class="text-center">{{ $mk['mutu'] ?? '-' }}</td>
                </tr>
                @endforeach
                <tr>
                    <td colspan="3" class="text-right"><strong>Jumlah SKS</strong></td>
                    <td class="text-center"><strong>{{ $total_sks ?? 0 }}</strong></td>
                    <td colspan="2"></td>
                </tr>
            </tbody>
        </table>

        <div class="footer">
            Bandung, {{ $tanggal }}<br>
            Dicetak melalui SIMAK STMIK Bandung
        </div>
    </div>
</body>
</html>
