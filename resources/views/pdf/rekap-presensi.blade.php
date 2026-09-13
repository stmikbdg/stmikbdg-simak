<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>{{ $judul }}</title>
    <style>
        @page { margin: 12mm 12mm 18mm; }
        body { font-family: Arial, sans-serif; font-size: 9px; color: #111; margin: 0; }
        table { border-collapse: collapse; width: 100%; table-layout: fixed; }
        th, td { border: 0.7px solid #222; padding: 3px 4px; vertical-align: top; word-wrap: break-word; }
        th { background: #eef2f6; font-weight: bold; text-align: center; }
        .data-table thead { display: table-header-group; }
        .data-table tbody tr, .intro { page-break-inside: avoid; }
        .header-container { position: relative; min-height: 54px; border-bottom: 1.5px solid #111; margin-bottom: 8px; padding-bottom: 7px; }
        .logo { position: absolute; top: 0; left: 0; width: 68px; }
        .header { margin-left: 78px; text-align: right; line-height: 1.25; }
        .campus-name { font-size: 11px; font-weight: bold; }
        .title { text-align: center; margin: 8px 0 7px; }
        .title h1 { font-size: 12px; margin: 0; text-decoration: underline; }
        .meta { width: 70%; table-layout: auto; margin: 0 0 7px; }
        .meta td { border: none; padding: 1.5px 3px; }
        .meta-label { width: 78px; white-space: nowrap; font-weight: bold; }
        .meta-separator { width: 8px; text-align: center; }
        .text-center { text-align: center; }
        .nowrap { white-space: nowrap; }
        .footer { position: fixed; bottom: -9mm; left: 0; right: 0; font-size: 8px; color: #666; }
        .page-number { float: right; }
        .page-number:after { content: "Halaman " counter(page); }
    </style>
</head>
<body>
    <div class="footer"><span>Dibuat {{ $dibuat }}</span><span class="page-number"></span></div>
    <div class="intro">
    <div class="header-container">
        @if($image)
        <img src="{{ $image }}" alt="STMIK Bandung" class="logo">
        @endif
        <div class="header">
            <div class="campus-name">SEKOLAH TINGGI MANAJEMEN INFORMATIKA DAN KOMPUTER BANDUNG</div>
            <div>Jl. Cikutra 113 Telp. (022) 7207777 Fax. (022) 7207777</div>
            <div>BANDUNG - JAWA BARAT - INDONESIA</div>
            <div>Email: <span style="text-decoration: underline; color: blue">info@stmik-bandung.ac.id</span> | Website: https://www.stmik-bandung.ac.id</div>
        </div>
    </div>
    <div class="title"><h1>{{ $judul }}</h1></div>
    <table class="meta">
        <tr><td class="meta-label">Tahun Ajaran</td><td class="meta-separator">:</td><td>{{ $tahun_ajaran['uraian'] ?? '-' }}</td></tr>
        <tr><td class="meta-label">Dosen</td><td class="meta-separator">:</td><td>{{ trim($dosen['nm_dosen'] ?? '-') }}</td></tr>
        <tr><td class="meta-label">Mata Kuliah</td><td class="meta-separator">:</td><td>{{ $matakuliah['nm_mk'] ?? '-' }}</td></tr>
    </table>
    </div>
    <table class="data-table">
        <thead><tr><th style="width: 28px">No</th><th style="width: 82px">NIM</th><th>Nama Mahasiswa</th><th style="width: 70px">Kehadiran</th><th style="width: 70px">Pertemuan</th><th style="width: 75px">Persentase</th></tr></thead>
        <tbody>
            @foreach($kehadiran_mahasiswa as $item)
            <tr><td class="text-center nowrap">{{ $loop->iteration }}</td><td class="nowrap">{{ $item['nim'] }}</td><td>{{ $item['nm_mhs'] }}</td><td class="text-center">{{ $item['total_kehadiran'] }}</td><td class="text-center">{{ $item['total_pertemuan'] }}</td><td class="text-center">{{ number_format((float) $item['persentase_kehadiran'], 2) }}%</td></tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
