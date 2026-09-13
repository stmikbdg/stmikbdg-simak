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
            font-size: 9px;
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
            padding: 3px 4px;
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
            min-height: 54px;
            border-bottom: 1.5px solid #111;
            margin-bottom: 8px;
            padding-bottom: 7px;
        }

        .logo {
            position: absolute;
            top: 0;
            left: 0;
            width: 68px;
        }

        .header {
            margin-left: 78px;
            text-align: right;
            line-height: 1.25;
        }

        .campus-name {
            font-size: 11px;
            font-weight: bold;
        }

        .title {
            text-align: center;
            margin: 8px 0 7px;
        }

        .title h1 {
            font-size: 12px;
            margin: 0;
            text-decoration: underline;
        }

        .profile-table {
            width: auto;
            min-width: 360px;
            table-layout: auto;
            margin-top: 4px;
            margin-bottom: 7px;
        }

        .profile-table td {
            border: none;
            padding: 1.5px 3px;
        }

        .profile-label {
            width: 76px;
            white-space: nowrap;
        }

        .profile-separator {
            width: 8px;
            text-align: center;
        }

        .profile-value {
            width: 250px;
        }

        .summary-table {
            margin-bottom: 9px;
        }

        .semester-block {
            margin-top: 8px;
        }

        .semester-block:first-of-type {
            margin-top: 6px;
        }

        .semester-title {
            font-size: 9.5px;
            font-weight: bold;
            margin: 0 0 4px;
        }

        .semester-summary {
            margin-bottom: 4px;
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

        .signature-section {
            position: relative;
            margin-top: 12px;
            width: 100%;
            min-height: 92px;
        }

        .note {
            border: 1px solid #000;
            padding: 8px;
            font-size: 9px;
            text-align: justify;
            width: 42%;
        }

        .signature {
            position: absolute;
            top: 0;
            right: 0;
            width: 36%;
            text-align: left;
            line-height: 1.35;
        }

        .page-number {
            position: fixed;
            bottom: -9mm;
            right: 0;
            font-size: 8px;
            color: #666;
        }

        .page-number:after {
            content: "Halaman " counter(page);
        }

        .draft-watermark {
            position: fixed;
            top: 42%;
            left: 12%;
            width: 76%;
            text-align: center;
            font-size: 36px;
            font-weight: bold;
            color: #b91c1c;
            opacity: 0.16;
            transform: rotate(-28deg);
        }

        .draft-banner {
            border: 1px solid #b91c1c;
            color: #b91c1c;
            font-size: 9px;
            font-weight: bold;
            text-align: center;
            padding: 4px;
            margin-bottom: 7px;
        }
    </style>
</head>
<body>
    @if(!empty($is_draft))
    <div class="draft-watermark">DRAFT</div>
    <div class="draft-banner">DRAFT — TIDAK BERLAKU SEBAGAI DOKUMEN RESMI</div>
    @endif
    <div class="page-number"></div>

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
    </div>

    @if(!empty($mode_semester_label))
    <div style="text-align:center; margin-top:-4px; margin-bottom:6px; font-size:9px; color:#555;">
        ({{ $mode_semester_label }})
    </div>
    @endif

    <table class="profile-table">
        <tbody>
            <tr>
                <td class="profile-label"><strong>NIM</strong></td>
                <td class="profile-separator">:</td>
                <td class="profile-value">{{ filled($nim ?? null) ? $nim : '-' }}</td>
            </tr>
            <tr>
                <td class="profile-label"><strong>NAMA</strong></td>
                <td class="profile-separator">:</td>
                <td class="profile-value">{{ filled($nama ?? null) ? $nama : '-' }}</td>
            </tr>
            <tr>
                <td class="profile-label"><strong>DOSEN WALI</strong></td>
                <td class="profile-separator">:</td>
                <td class="profile-value">{{ filled($dosen_wali ?? null) ? $dosen_wali : '-' }}</td>
            </tr>
        </tbody>
    </table>

    <table class="summary-table">
        <thead>
            <tr>
                <th>Total SKS</th>
                <th>IPK</th>
                <th>Nilai A</th>
                <th>Nilai B</th>
                <th>Nilai C</th>
                <th>Nilai D</th>
                <th>Nilai E</th>
            </tr>
        </thead>
        <tbody>
            <tr class="text-center">
                <td>{{ $summary['total_sks'] ?? 0 }}</td>
                <td>{{ number_format((float) ($summary['total_semua_ip'] ?? 0), 2, '.', '') }}</td>
                <td>{{ $summary['total_nilai_a'] ?? 0 }}</td>
                <td>{{ $summary['total_nilai_b'] ?? 0 }}</td>
                <td>{{ $summary['total_nilai_c'] ?? 0 }}</td>
                <td>{{ $summary['total_nilai_d'] ?? 0 }}</td>
                <td>{{ $summary['total_nilai_e'] ?? 0 }}</td>
            </tr>
        </tbody>
    </table>

    @foreach($semesters as $semesterData)
    <div class="semester-block">
        <p class="semester-title">Semester {{ filled($semesterData['semester'] ?? null) ? $semesterData['semester'] : '-' }}</p>

        <table class="semester-summary">
            <thead>
                <tr>
                    <th>SKS Semester</th>
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
                    <td>{{ $semesterData['total_sks'] ?? 0 }}</td>
                    <td>{{ number_format((float) ($semesterData['total_ip'] ?? 0), 2, '.', '') }}</td>
                    <td>{{ $semesterData['total_nilai_a'] ?? 0 }}</td>
                    <td>{{ $semesterData['total_nilai_b'] ?? 0 }}</td>
                    <td>{{ $semesterData['total_nilai_c'] ?? 0 }}</td>
                    <td>{{ $semesterData['total_nilai_d'] ?? 0 }}</td>
                    <td>{{ $semesterData['total_nilai_e'] ?? 0 }}</td>
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
                @foreach(($semesterData['matakuliah'] ?? []) as $index => $mk)
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
                    <td colspan="3" class="text-right">Jumlah SKS Semester</td>
                    <td class="text-center">{{ $semesterData['total_sks'] ?? 0 }}</td>
                    <td colspan="2"></td>
                </tr>
            </tbody>
        </table>
    </div>
    @endforeach

    @if(empty($is_draft))
    <div class="signature-section">
        <div class="note">
            Kartu Hasil Studi (KHS) ini merupakan bukti hasil studi mahasiswa yang sah. Apabila terdapat perbedaan antara KHS dengan data yang terdapat di SIMAK, maka data yang digunakan sebagai acuan adalah data yang terdapat di SIMAK.
        </div>
        <div class="signature">
            Print KHS, {{ filled($tanggal ?? null) ? $tanggal : '-' }}<br><br>
            Pengesahan Prodi<br>
            {{ filled($prodi ?? null) ? $prodi : '-' }}<br><br><br><br>
            <strong>{{ filled($pengesahan_prodi ?? null) ? $pengesahan_prodi : '________________________' }}</strong>
        </div>
    </div>
    @endif
</body>
</html>
