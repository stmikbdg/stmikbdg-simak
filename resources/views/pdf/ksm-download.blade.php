
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Kartu Studi Mahasiswa</title>
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
            table-layout: fixed;
        }

        th, td {
            border: 1px solid #222;
            padding: 5px 6px;
            text-align: left;
            vertical-align: top;
            word-wrap: break-word;
            overflow-wrap: break-word;
            word-break: break-word;
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

        .no-border {
            margin-top: 8px;
        }

        .no-border td {
            border: none;
            padding: 2px 4px;
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

        .signature-section {
            position: relative;
            margin-top: 12px;
            width: 100%;
        }

        .note {
            border: 1px solid #000;
            padding: 8px;
            font-size: 10.5px;
            text-align: justify;
            width: 42%;
        }

        .signature {
            position: absolute;
            top: 0;
            right: 0;
            width: 36%;
            text-align: left;
        }
    </style>
</head>
<body>
    <div class="container">
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
            <h1>KARTU STUDI MAHASISWA</h1>
            <p>Semester {{ filled($semester ?? null) ? $semester : '-' }}</p>
        </div>

        <table class="no-border">
            <tbody>
                <tr>
                    <td style="width: 90px"><strong>NIM</strong></td>
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

        <table class="course-table">
            <thead>
                <tr>
                    <th style="width: 32px" class="text-center">No</th>
                    <th style="width: 90px">Kode</th>
                    <th>Matakuliah</th>
                    <th style="width: 42px" class="text-center">SKS</th>
                    {{-- <th>Kelas</th> --}}
                </tr>
            </thead>
            <tbody>
                @foreach($matakuliah as $index => $mk)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td>{{ filled($mk['kd_mk'] ?? null) ? $mk['kd_mk'] : '-' }}</td>
                    <td>{{ filled($mk['nm_mk'] ?? null) ? $mk['nm_mk'] : '-' }}</td>
                    <td class="text-center">{{ $mk['sks'] ?? 0 }}</td>
                    {{-- <td>{{ $mk['kelas'] }}</td> --}}
                </tr>
                @endforeach
                <tr>
                    <td colspan="3" class="text-right"><strong>Jumlah SKS</strong></td>
                    <td class="text-center"><strong>{{ $total_sks ?? 0 }}</strong></td>
                </tr>
            </tbody>
        </table>

        <div class="signature-section">
            <div class="note">
                Kartu Studi Mahasiswa (KSM) ini merupakan
                bukti pendaftaran dan pengambilan mata
                kuliah yang sah. Apabila terdapat perbedaan
                antara KSM dengan data yang terdapat di
                SIMAK, maka data yang digunakan sebagai
                acuan adalah data yang terdapat di SIMAK
            </div>
            <div class="signature">
                Print FRS, {{ filled($tanggal ?? null) ? $tanggal : '-' }}<br><br>
                Wakil Ketua Bidang Akademik<br><br><br><br><br>
                <strong>Dani Pradana Kartaputra, M.T.</strong>
            </div>
        </div>
    </div>
</body>
</html>
