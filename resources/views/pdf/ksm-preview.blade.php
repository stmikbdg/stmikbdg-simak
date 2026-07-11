
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Kartu Studi Mahasiswa</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
        }

        table {
            border-collapse: collapse;
            width: 100%;
            margin-top: 16px;
        }

        th, td {
            border: 1px solid #000;
            padding: 6px;
            text-align: left;
        }

        .header {
            text-align: end;
            margin-bottom: 12px;
            width: 100%;
        }

        .title {
            font-size: 15px;
            font-weight: bold;
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
    <div class="container">
        <div class="header-container">
            <img src="{{ $image }}" alt="STMIK Bandung" style="width: 100px; position: absolute; top: 0; left: 0;" />
            <div class="header" style="text-align: right">
                <div class="title" style="text-align: right">SEKOLAH TINGGI MANAJEMEN INFORMATIKA DAN KOMPUTER BANDUNG</div>
                <div style="text-align: right; font-size: 14px">Jl. Cikutra 113 Telp. (022) 7207777 Fax. (022) 7207777</div>
                <div style="text-align: right; font-size: 14px">BANDUNG - JAWA BARAT - INDONESIA</div>
                <div style="text-align: right">Email: <span style="text-decoration: underline; color: blue">info@stmik-bandung.ac.id</span> | Website: https://www.stmik-bandung.ac.id</div>
            </div>
        </div>

        <div
            style="
                margin-top: 12px;
                padding: 0px 0.5rem
            "
        >

            <table style="border: none; width: 62%; margin-top: 0">
                <tbody style="border: none">
                    <tr style="border: none">
                        <td style="border: none; width: 90px">
                            <strong>NIM</strong> 
                        </td>
                        <td style="border: none; width: 8px; text-align: center">
                            :
                        </td>
                        <td style="border: none">
                            {{ $nim }}
                        </td>
                        
                    </tr>
                    <tr style="border: none">
                        <td style="border: none">
                            <strong>NAMA</strong> 
                        </td>
                        <td style="border: none; text-align: center">
                            :
                        </td>
                        <td style="border: none">
                            {{ $nama }}
                        </td>
                    </tr>
                    <tr style="border: none">
                        <td style="border: none">
                            <strong>DOSEN WALI</strong> 
                        </td>
                        <td style="border: none; text-align: center">
                            :
                        </td>
                        <td style="border: none">
                            {{ $dosen_wali }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Kode</th>
                    <th>Matakuliah</th>
                    <th>SKS</th>
                    <th>Kelas</th>
                </tr>
            </thead>
            <tbody>
                @foreach($matakuliah as $index => $mk)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $mk['kd_mk'] }}</td>
                    <td>{{ $mk['nm_mk'] }}</td>
                    <td>{{ $mk['sks'] }}</td>
                    <td>{{ $mk['kelas'] }}</td>
                </tr>
                @endforeach
                <tr>
                    <td colspan="3"><strong>Jumlah SKS</strong></td>
                    <td colspan="2"><strong>{{ $total_sks }}</strong></td>
                </tr>
            </tbody>
        </table>

        <div style="position: relative; margin-top: 12px; width: 100%; min-height: 145px;">

            <div
                style="
                    border: 1px solid #000;
                    padding: 0.5rem;
                    font-size: 12px;
                    text-align: justify;
                    width: 35%;
                "
            >
                Kartu Studi Mahasiswa (KSM) ini merupakan
                bukti pendaftaran dan pengambilan mata
                kuliah yang sah. Apabila terdapat perbedaan
                antara KSM dengan data yang terdapat di
                SIMAK, maka data yang digunakan sebagai
                acuan adalah data yang terdapat di SIMAK
            </div>
            <div style="position: absolute; top: 0; right: 0; width: 30%;">
                <div class="signature">
                    Print FRS, {{ $tanggal }}<br><br>
                    Wakil Ketua Bidang Akademik<br><br><br><br><br>
                    <strong>Dani Pradana Kartaputra, M.T.</strong>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
