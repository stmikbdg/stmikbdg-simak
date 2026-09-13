<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Rekap KRS Dosen Wali</title>
    <style>
        @page { margin: 12mm 12mm 18mm; }
        body { font-family: Arial, sans-serif; font-size: 8px; color: #111; }
        .header { border-bottom: 1.5px solid #111; min-height: 55px; padding-bottom: 6px; position: relative; text-align: right; }
        .logo { left: 0; position: absolute; top: 0; width: 68px; }
        .campus { font-size: 11px; font-weight: bold; }
        h1 { font-size: 12px; margin: 8px 0 5px; text-align: center; text-decoration: underline; }
        .meta { margin: 0 0 8px; table-layout: auto; width: auto; }
        .meta td { border: 0; padding: 1.5px 3px; }
        .label { font-weight: bold; white-space: nowrap; width: 88px; }
        .colon { text-align: center; width: 8px; }
        .value { min-width: 260px; }
        table { border-collapse: collapse; table-layout: fixed; width: 100%; }
        th, td { border: .7px solid #222; padding: 3px; word-wrap: break-word; }
        th { background: #eef2f6; text-align: center; }
        thead { display: table-header-group; }
        tbody tr, .intro, .signature { page-break-inside: avoid; }
        .page-number:after { content: counter(page); }
        .footer { bottom: -8mm; position: fixed; right: 0; }
        .signature { margin-left: auto; margin-top: 8px; text-align: center; width: 210px; }
        .signature-space { height: 24px; }
    </style>
</head>
<body>
    <div class="intro">
        <div class="header">
            <img class="logo" src="{{ $image }}">
            <div class="campus">SEKOLAH TINGGI MANAJEMEN INFORMATIKA DAN KOMPUTER BANDUNG</div>
            <div>Jl. Cikutra No. 113 Bandung 40124</div>
            <div>Telp. (022) 7207777 | www.stmik-bandung.ac.id</div>
        </div>
        <h1>REKAP KRS DOSEN WALI - {{ strtoupper($status_label) }}</h1>
    @php
        $jenisMahasiswa = ['R' => 'Reguler', 'K' => 'Karyawan', 'E' => 'Eksekutif'];
        $statusMahasiswa = ['A' => 'Aktif', 'C' => 'Cuti', 'N' => 'Tidak Aktif'];
    @endphp
    <table class="meta">
        <tr><td class="label">Status KRS</td><td class="colon">:</td><td class="value">{{ $status_label }}</td></tr>
        <tr><td class="label">Dosen Wali</td><td class="colon">:</td><td class="value">{{ $dosen_wali['nama_dan_gelar'] ?? $dosen_wali['nama'] ?? '-' }}{{ filled($dosen_wali['kd_dosen'] ?? $dosen_wali['nidn'] ?? null) ? ' ('.($dosen_wali['kd_dosen'] ?? $dosen_wali['nidn']).')' : '' }}</td></tr>
        <tr><td class="label">Jenis Mahasiswa</td><td class="colon">:</td><td class="value">{{ $jenisMahasiswa[$filters['jns_mhs'] ?? ''] ?? 'Semua' }}</td></tr>
        <tr><td class="label">Status Mahasiswa</td><td class="colon">:</td><td class="value">{{ $statusMahasiswa[$filters['sts_mhs'] ?? ''] ?? 'Semua' }}</td></tr>
        <tr><td class="label">Tahun Angkatan</td><td class="colon">:</td><td class="value">{{ $filters['masuk_tahun'] ?? 'Semua' }}</td></tr>
        <tr><td class="label">Semester</td><td class="colon">:</td><td class="value">{{ isset($filters['semester']) ? 'Semester '.$filters['semester'] : 'Semua' }}</td></tr>
        <tr><td class="label">Tanggal Cetak</td><td class="colon">:</td><td class="value">{{ $generated_at }}</td></tr>
    </table>
    </div>
    <table>
        <thead><tr><th style="width:3%">No</th><th style="width:9%">NIM</th><th style="width:20%">Nama Mahasiswa</th><th>Jenis Mahasiswa</th><th>Status Mahasiswa</th><th>Tahun Angkatan</th><th>Semester</th><th>Nomor KRS</th><th>Tanggal KRS</th><th>Status KRS</th></tr></thead>
        <tbody>
        @forelse ($rows as $index => $row)
            @php($krs = $row['krs_item'])
            <tr><td style="text-align:center">{{ $index + 1 }}</td><td>{{ $row['nim'] }}</td><td>{{ $row['nm_mhs'] }}</td><td>{{ $jenisMahasiswa[$row['jns_mhs']] ?? $row['jns_mhs'] }}</td><td>{{ $statusMahasiswa[$row['sts_mhs']] ?? $row['sts_mhs'] }}</td><td style="text-align:center">{{ $row['masuk_tahun'] }}</td><td style="text-align:center">{{ $krs['semester'] }}</td><td>{{ $krs['nmr_krs'] }}</td><td>{{ \Carbon\Carbon::parse($krs['tanggal'])->translatedFormat('d F Y') }}</td><td>{{ $status_label }}</td></tr>
        @empty
            <tr><td colspan="10" style="text-align:center">Tidak ada data</td></tr>
        @endforelse
        </tbody>
    </table>
    <div class="signature">
        <div>Dosen Wali,</div>
        <div class="signature-space"></div>
        <div><strong><u>{{ $dosen_wali['nama_dan_gelar'] ?? $dosen_wali['nama'] ?? '-' }}</u></strong></div>
        @if (filled($dosen_wali['kd_dosen'] ?? $dosen_wali['nidn'] ?? null))<div>{{ $dosen_wali['kd_dosen'] ?? $dosen_wali['nidn'] }}</div>@endif
    </div>
    <div class="footer">Halaman <span class="page-number"></span> | Dibuat {{ $generated_at }}</div>
</body>
</html>
