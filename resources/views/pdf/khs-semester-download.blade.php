<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Kartu Hasil Studi</title>
    <style>
        @page {
            margin: 12mm 12mm 14mm;
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 9.5px;
            color: #111;
            margin: 0;
        }

        table {
            border-collapse: collapse;
            width: 100%;
            table-layout: fixed;
        }

        th, td {
            border: 0.7px solid #222;
            padding: 4px 5px;
            vertical-align: top;
            word-wrap: break-word;
        }

        th {
            background: #eef2f6;
            font-weight: bold;
            text-align: center;
        }

        .header-container {
            position: relative;
            min-height: 56px;
            border-bottom: 1.5px solid #111;
            margin-bottom: 10px;
            padding-bottom: 8px;
        }

        .logo {
            position: absolute;
            top: 0;
            left: 0;
            width: 70px;
        }

        .header {
            margin-left: 80px;
            text-align: right;
            line-height: 1.25;
        }

        .campus-name {
            font-size: 11.5px;
            font-weight: bold;
        }

        .title {
            text-align: center;
            margin: 10px 0 8px;
        }

        .title h1 {
            font-size: 13px;
            margin: 0 0 3px;
            text-decoration: underline;
        }

        .title p {
            margin: 0;
            font-size: 10px;
            font-weight: bold;
        }

        .profile-table {
            margin-top: 4px;
            margin-bottom: 9px;
        }

        .profile-table td {
            border: none;
            padding: 1.5px 3px;
        }

        .summary-table {
            margin-bottom: 10px;
        }

        .course-table tbody tr {
            page-break-inside: avoid;
        }

        .text-center {
            text-align: center;
        }

        .text-right {
            text-align: right;
        }

        .nowrap {
            white-space: nowrap;
        }

        .semester-total td {
            background: #fafafa;
            font-weight: bold;
        }

        .footer {
            margin-top: 14px;
            text-align: right;
            line-height: 1.35;
        }
    </style>
</head>
<body>
    <div class="header-container">
        @if($image)
        <img src="{{ $image }}" alt="STMIK Bandung" class="logo" />
        @endif
        <div class="header">
            <div class="campus-name">SEKOLAH TINGGI MANAJEMEN INFORMATIKA DAN KOMPUTER BANDUNG</div>
            <div>Jl. Cikutra 113 Telp. (022) 7207777 Fax. (022) 7207777</div>
            <div>BANDUNG - JAWA BARAT - INDONESIA</div>
            <div>Email: <span style="text-decoration: underline; color: blue">info@stmik-bandung.ac.id</span> | Website: https://www.stmik-bandung.ac.id</div>
        </div>
    </div>

    <div class="title">
        <h1>KARTU HASIL STUDI</h1>
        <p>Semester {{ filled($semester ?? null) ? $semester : '-' }}</p>
    </div>

    <table class="profile-table">
        <tbody>
            <tr>
                <td style="width: 92px"><strong>NIM</strong></td>
                <td style="width: 8px">:</td>
                <td>{{ filled($nim ?? null) ? $nim : '-' }}</td>
            </tr>
            <tr>
                <td><strong>NAMA</strong></td>
                <td>:</td>
                <td>{{ filled($nama ?? null) ? $nama : '-' }}</td>
            </tr>
            <tr>
                <td><strong>DOSEN WALI</strong></td>
                <td>:</td>
                <td>{{ filled($dosen_wali ?? null) ? $dosen_wali : '-' }}</td>
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
                <th style="width: 28px">No</th>
                <th style="width: 64px">Kode</th>
                <th>Mata Kuliah</th>
                <th style="width: 34px">SKS</th>
                <th style="width: 42px">Nilai</th>
                <th style="width: 48px">Mutu</th>
            </tr>
        </thead>
        <tbody>
            @foreach($matakuliah as $index => $mk)
            <tr>
                <td class="text-center nowrap">{{ $index + 1 }}</td>
                <td class="nowrap">{{ filled($mk['kd_mk'] ?? null) ? $mk['kd_mk'] : '-' }}</td>
                <td>{{ filled($mk['nm_mk'] ?? null) ? $mk['nm_mk'] : '-' }}</td>
                <td class="text-center nowrap">{{ $mk['sks'] ?? 0 }}</td>
                <td class="text-center nowrap">{{ filled($mk['nilai'] ?? null) ? $mk['nilai'] : '-' }}</td>
                <td class="text-center nowrap">{{ is_numeric($mk['mutu'] ?? null) ? number_format((float) $mk['mutu'], 2, '.', '') : '-' }}</td>
            </tr>
            @endforeach
            <tr class="semester-total">
                <td colspan="3" class="text-right">Jumlah SKS</td>
                <td class="text-center">{{ $total_sks ?? 0 }}</td>
                <td colspan="2"></td>
            </tr>
        </tbody>
    </table>

    <div class="footer">
        Bandung, {{ filled($tanggal ?? null) ? $tanggal : '-' }}<br>
        Dicetak melalui SIMAK STMIK Bandung
    </div>
</body>
</html>
