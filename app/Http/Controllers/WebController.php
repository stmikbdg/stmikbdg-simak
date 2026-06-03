<?php 
namespace App\Http\Controllers;

use App\Models\WebService;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Session;

class WebController extends Controller {

    protected $service;
    public function __construct()
    {
        $this->service = new WebService();
    }

    private function render(string $component, array $props = [], $cekMahasiswaActive = false, $cekKeuangan = false) {
        $token = Session::get('token');
        $role = Session::get('role');

        $profile = Session::get('profile');
        $account = Session::get('account');
        $keuangan = Session::get('keuangan');

        $props['token'] = $token ?? null;
        $props['role'] = [
            'dosen' => [
                'enable' => $role['is_dosen'] ?? false,
                'label' => 'Dosen'
            ],
            'admin' => [
                'enable' => $role['is_admin'] ?? false,
                'label' => 'Admin'
            ],
            'mahasiswa' => [
                'enable' => $role['is_mhs'] ?? false,
                'label' => 'Mahasiswa'
            ],
            'developer' => [
                'enable' => $role['is_dev'] ?? false,
                'label' => 'Developer'
            ],
            'dosen_wali' => [
                'enable' => $role['is_doswal'] ?? false,
                'label' => 'Dosen Wali'
            ],
            'prodi' => [
                'enable' => $role['is_prodi'] ?? false,
                'label' => 'Prodi'
            ]
        ];
        $props['base_url'] = config('myconfig.api.base_url');

        $app = config('myconfig.app');
        $props['app'] = $app;

        $props['apps'] = [
            [
                'name' => 'Pembelajaran',
                'deskripsi' => 'Sistem pembelajaran daring kampus',
                'label' => 'pembelajaran',
                'icon' => 'SchoolTwoTone',
                'color' => 'indigo'
            ],
            // [
            //     'name' => 'Keuangan',
            //     'deskripsi' => 'Sistem Informasi dan layanan pembayaran keuangan',
            //     'label' => 'keuangan',
            //     'icon' => 'PaymentsTwoTone',
            //     'color' => 'blue'
            // ],
            [
                'name' => 'LMS',
                'deskripsi' => 'Sistem Pembelajaran dan Ujian Daring (Learning Management System)',
                'label' => 'lms',
                'icon' => 'AssignmentTwoTone',
                'color' => 'green'
            ],
            // [
            //     'name' => 'Journal',
            //     'deskripsi' => 'Pengelolaan publikasi jurnal ilmiah kampus',
            //     'label' => 'journal',
            //     'icon' => 'BookmarkAddedTwoTone',
            //     'color' => 'amber'
            // ],
            // [
            //     'name' => 'Verdig',
            //     'deskripsi' => 'Verifikasi digital dokumen akademik',
            //     'label' => 'verdig',
            //     'icon' => 'HowToRegTwoTone',
            //     'color' => 'fuchsia'
            // ],
            [
                'name' => 'Bimbingan',
                'deskripsi' => 'Sistem Informasi dan Layanan pembimbingan akademik',
                'label' => 'bimbingan',
                'icon' => 'CallSplitTwoTone',
                'color' => 'teal'
            ],
            [
                'name' => 'Pendaftaran',
                'deskripsi' => 'Pendaftaran sidang skripsi atau kerja praktek',
                'label' => 'pendaftaran_sidang_skripsi_kp',
                'icon' => 'SchoolTwoTone',
                'color' => 'orange'
            ],
            [
                'name' => 'Pengajuan',
                'deskripsi' => 'Pengelolaan berbagai jenis permohonan akademik',
                'label' => 'pengajuan',
                'icon' => 'FeedTwoTone',
                'color' => 'violet'
            ],
            // [
            //     'name' => 'Kuesioner',
            //     'deskripsi' => 'Survei dan evaluasi layanan atau pembelajaran',
            //     'label' => 'kuesioner',
            //     'icon' => 'PollTwoTone',
            //     'color' => 'red'
            // ],            
        ];

        if($cekMahasiswaActive) {
            if(strpos($account['kd_user'], "MHS-") !== false) {
                if(isset($account['is_mhs'])) {
                    if($account['is_mhs']) {
                        if($role['is_mhs']) {
                            if($profile['sts_mhs'] != 'A') {
                                return Inertia::render('NotMahasiswaActive', $props);
                            }
                        }
                    }
                }
            }
        }

        // if($cekKeuangan) {
        //     if(strpos($account['kd_user'], "MHS-") !== false) {
        //         if(isset($account['is_mhs'])) {
        //             if($account['is_mhs']) {
        //                 if($role['is_mhs']) {
        //                     if(isset($keuangan)) {
        //                         if(!$keuangan['success']) {
        //                             return Inertia::render('BelumBayar', array_merge($props, $keuangan));
        //                         }
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // }

        return Inertia::render($component, $props);
    }

    public function index() {
        return $this->render('Home');
    }

    public function dashboard() {
        return $this->render('dashboard', [], true, true);
    }

    public function absenqr() {
        return $this->render('absenqr', [], true, true);
    }

    public function khs() {
        return $this->render('khs', [], true, true);
    }

    public function khs_per_semester(string $semester) {
        return $this->render('khs_per_semester', [
            'semester' => $semester
        ], true, true);
    }

    public function profil() {
        return $this->render('profil', [], true, true);
    }

    public function jadwal() {
        return $this->render('jadwal', [], true, true);
    }

    public function krs() {
        return $this->render('krs', [], true, true);
    }

    private function pdfLogoPath(): ?string {
        $logoPath = public_path('images/stmik.png');

        return file_exists($logoPath) ? $logoPath : null;
    }

    public function krs_approve_by_dosen_wali(Int $mhs_id, Int $krs_id) {
        return $this->render('krs_approve_by_dosen_wali', [
            'mhs_id' => $mhs_id,
            'krs_id' => $krs_id
        ]);
    }

    private function khsDownloadViewData($image) {

        $user = Session::get('profile');

        Carbon::setLocale('id');

        $summaryResponse = $this->service->get(null, 'krs/ip/semester')->getData('data');

        if($summaryResponse['status'] != 'success') {
            return abort(404);
        }

        $summary = $summaryResponse['data'];

        if(! $summary) {
            return abort(404);
        }

        $semesters = [];

        for($semester = 1; $semester <= 8; $semester++) {
            $detailResponse = $this->service->get(null, 'krs/ip/semester?s='.$semester)->getData('data');

            if($detailResponse['status'] != 'success') {
                continue;
            }

            $detail = $detailResponse['data'];
            $matakuliah = $detail['matakuliah'] ?? [];

            if($detail && count($matakuliah) > 0) {
                $detail['matakuliah'] = $matakuliah;
                $semesters[] = $detail;
            }
        }

        if(count($semesters) < 1) {
            return abort(404);
        }

        return [
            'nim' => $user['nim'] ?? '-',
            'nama' => $user['nama'] ?? '-',
            'dosen_wali' => $user['dosen_wali'] ?? '-',
            'summary' => $summary,
            'semesters' => $semesters,
            'tanggal' => Carbon::parse(Carbon::now())->translatedFormat('d F Y'),
            'image' => $image
        ];
    }

    private function khsSemesterViewData(int $semester, $image) {

        if($semester < 1 || $semester > 8) {
            return abort(404);
        }

        $user = Session::get('profile');

        Carbon::setLocale('id');

        $response = $this->service->get(null, 'krs/ip/semester?s='.$semester)->getData('data');

        if($response['status'] != 'success') {
            return abort(404);
        }

        $response_data = $response['data'];
        $matakuliah = $response_data['matakuliah'] ?? [];

        if(! $response_data || count($matakuliah) < 1) {
            return abort(404);
        }

        return [
            'nim' => $user['nim'] ?? '-',
            'nama' => $user['nama'] ?? '-',
            'dosen_wali' => $user['dosen_wali'] ?? '-',
            'semester' => $semester,
            'total_sks' => $response_data['total_sks'] ?? 0,
            'total_ip' => $response_data['total_ip'] ?? 0,
            'total_nilai_a' => $response_data['total_nilai_a'] ?? 0,
            'total_nilai_b' => $response_data['total_nilai_b'] ?? 0,
            'total_nilai_c' => $response_data['total_nilai_c'] ?? 0,
            'total_nilai_d' => $response_data['total_nilai_d'] ?? 0,
            'total_nilai_e' => $response_data['total_nilai_e'] ?? 0,
            'matakuliah' => $matakuliah,
            'tanggal' => Carbon::parse(Carbon::now())->translatedFormat('d F Y'),
            'image' => $image
        ];
    }

    public function khs_download() {

        $data = $this->khsDownloadViewData($this->pdfLogoPath());

        $pdf = Pdf::loadView('pdf/khs-download', $data)->setPaper('A4', 'portrait');
        return $pdf->stream('Kartu Hasil Studi - '.$data['nim'].' - '.$data['nama'].'.pdf');
    }

    public function khs_download_per_semester(int $semester) {

        $data = $this->khsSemesterViewData($semester, $this->pdfLogoPath());

        $pdf = Pdf::loadView('pdf/khs-semester-download', $data)->setPaper('A4', 'portrait');
        return $pdf->stream('Kartu Hasil Studi - '.$data['nim'].' - '.$data['nama'].' - Semester '.$semester.'.pdf');
    }

    public function khs_preview() {

        $data = $this->khsDownloadViewData(asset('images/stmik.png'));

        return view('pdf/khs-download', $data);
    }

    public function khs_preview_per_semester(int $semester) {

        $data = $this->khsSemesterViewData($semester, asset('images/stmik.png'));

        return view('pdf/khs-semester-download', $data);
    }

    public function surat() {
        return $this->render('surat', []);
    }

    public function surat_detail_by_id(Int $id) {
        return $this->render('surat_detail_by_id', [
            'id' => $id
        ]);
    }

    public function ksm_download_per_krs_id(int $krs_id) {

        $user = Session::get('profile');

        Carbon::setLocale('id');

        $response = $this->service->get(null, 'krs/riwayat?krs_id='.$krs_id)->getData('data');

        if($response['status'] != 'success') {
            return abort(404);
        }

        // if(!isset($response['data']['matakuliah'])) {
        //     return abort(404);
        // }

        $response_data = $response['data'];

        // dd($response_data);

        $krs_matkul = $response_data['krs_matkul'] ?? [];

        if(count($krs_matkul) < 1) {
            return abort(404);
        }

        $total_sks = 0;
        foreach ($krs_matkul as $item) {
            $total_sks += $item['mata_kuliah']['sks'] ?? 0;
        }

        $data = [
            'nim' => $user['nim'] ?? '-',
            'nama' => $user['nama'] ?? '-',
            'dosen_wali' => $user['dosen_wali'] ?? '-',
            'semester' => $response_data['semester'] ?? '-',
            'matakuliah' => array_map(function($item) {
                return $item['mata_kuliah'] ?? [];
            }, $krs_matkul),
            'total_sks' => $total_sks,
            'tanggal' => Carbon::parse(Carbon::now())->translatedFormat('d F Y'),
            'image' => $this->pdfLogoPath()
        ];

        $pdf = Pdf::loadView('pdf/ksm-download', $data)->setPaper('A4', 'portrait');
        return $pdf->stream('Kartu Studi Mahasiswa - '.($user['nim'] ?? '-').' - '.($user['nama'] ?? '-').' - Semester '.($response_data['semester'] ?? '-').'.pdf');
    }

    public function ksm_preview_per_semester(int $semester) {

        $user = Session::get('profile');

        Carbon::setLocale('id');

        $response = $this->service->get(null, 'krs/ip/semester?s='.$semester)->getData('data');

        if($response['status'] != 'success') {
            return abort(404);
        }

        if(!isset($response['data']['matakuliah'])) {
            return $this->render('NotFound');
        }

        $response_data = $response['data'];

        $data = [
            'nim' => $user['nim'],
            'nama' => $user['nama'],
            'dosen_wali' => $user['dosen_wali'],
            'matakuliah' => array_map(function($item) {
                $item['kelas'] = '-';

                return $item;
            }, $response_data['matakuliah']),
            'total_sks' => $response_data['total_sks'],
            'tanggal' => Carbon::parse(Carbon::now())->translatedFormat('d F Y'),
            'image' => asset('images/stmik.png')
        ];

        return view('pdf/ksm-preview', $data);
    }

    public function rekap_pertemuan(string $options, int $pengajar_id, int $tahun_id, string $from, string $to) {

        $user = Session::get('profile');

        Carbon::setLocale('id');

        $response = $this->service->get(null, 'rekap/pertemuan/v2?pengajar_id='.$pengajar_id.'&tahun_id='.$tahun_id.'&from='.$from.'&to='.$to)->getData('data');

        // dd($response);

        if($response['status'] != 'success') {
            return abort(404);
        }

        $dataPertemuan = $response['data'];

        if (empty($dataPertemuan)) {
            return abort(404);
        }

        // Ambil data dosen dan matakuliah pertama sebagai representatif
        $first = $dataPertemuan[0];

        // $dosenNama = trim($first['kelas_kuliah']['dosen']['nm_dosen']) . ', ' . $first['kelas_kuliah']['dosen']['gelar'];
        $dosenNama = trim($first['kelas_kuliah']['dosen']['nm_dosen']);
        $matakuliahNama = $first['kelas_kuliah']['matakuliah']['nm_mk'];

        $kehadiran = [];
        $totalSks = 0;

        // dd($user);

        foreach ($dataPertemuan as $item) {
            $raw = $item['tanggal']; // keep original for sorting
            $kehadiran[] = [
                'tanggal'      => Carbon::parse($raw)->format('d/m/Y'),
                'tanggal_raw'  => $raw, // <-- add this
                'sks'          => $item['kelas_kuliah']['matakuliah']['sks'],
                'program'      => $item['kelas_kuliah']['jns_mhs'],
                'kegiatan'     => $item['kelas_kuliah']['kelas_kuliah'],
                'kelas'        => $item['kelas_kuliah']['matakuliah']['nm_mk'],
            ];

            $totalSks += $item['kelas_kuliah']['matakuliah']['sks'];
        }

        // sort by kegiatan (A→Z), then by tanggal (oldest→newest)
        usort($kehadiran, function ($a, $b) {
            $cmp = strcmp($a['kelas'], $b['kelas']);
            if ($cmp !== 0) return $cmp;

            return Carbon::parse($a['tanggal_raw'])->timestamp <=> Carbon::parse($b['tanggal_raw'])->timestamp;
        });

        // clean up helper field
        $kehadiran = array_map(function ($item) {
            unset($item['tanggal_raw']);
            return $item;
        }, $kehadiran);
        
        $data = [
            'dosen' => $dosenNama,
            'matakuliah' => $matakuliahNama,
            'kehadiran' => $kehadiran,
            'totalSks' => $totalSks,
            'catatan' => 'Tidak ada',
            'tanggalCetak' => now()->translatedFormat('d F Y'),
            'wakilKetua' => 'Linda Apriyanti, S.Kom., M.T',
            'pembuat' => $user['nama_dan_gelar'],
            'tanggal' => Carbon::parse(Carbon::now())->translatedFormat('d F Y'),
            'image' => $options === 'download' ? public_path('images/stmik.png') : asset('images/stmik.png'),
            'from' => Carbon::parse($from)->translatedFormat('d F Y'),
            'to' => Carbon::parse($to)->translatedFormat('d F Y'),
            // 'jenis_kelas' => '',
        ];

        if($options === 'download') {
            $pdf = Pdf::loadView('pdf/rekap-pertemuan', $data)->setPaper('a4', 'portrait');
            return $pdf->stream('REKAP PERTEMUAN DOSEN - '.$dosenNama.' - '.$from.' to '.$to.'.pdf');
        }else{
            return view('pdf.rekap-pertemuan', $data);
        }
    }

    public function bap_dosen_rekap(int $kelas_kuliah_id) {
        return $this->render('berita_acara', [
            'kelas_kuliah_id' => $kelas_kuliah_id
        ]);
    }

    /**
     * KHS Mahasiswa - Dosen Wali Feature (Phase 3)
     */

    // Main page render
    public function khs_mahasiswa() {
        $this->abortIfNotDosenWali();
        return $this->render('khs_mahasiswa', [], false, false);
    }

    // Single PDF download
    public function khs_mahasiswa_download(Request $request, int $mhs_id) {
        $this->abortIfNotDosenWali();

        $semesters = $this->normalizeSemesterSelection($request->query('semesters', 'all'));
        
        $apiData = $this->fetchDosenWaliKHS($mhs_id, $semesters);
        
        if (!$apiData) {
            abort(404, 'Data KHS tidak ditemukan');
        }

        $data = $this->khsMahasiswaDosenWaliViewData($apiData, $semesters, $this->pdfLogoPath());

        $pdf = Pdf::loadView('pdf/khs-download', $data)->setPaper('A4', 'portrait');
        
        $filename = $this->generateKhsFilename($data['nim'], $data['nama'], $semesters);
        
        return $pdf->stream($filename);
    }

    // HTML preview
    public function khs_mahasiswa_preview(Request $request, int $mhs_id) {
        $this->abortIfNotDosenWali();

        $semesters = $this->normalizeSemesterSelection($request->query('semesters', 'all'));
        
        $apiData = $this->fetchDosenWaliKHS($mhs_id, $semesters);
        
        if (!$apiData) {
            abort(404, 'Data KHS tidak ditemukan');
        }

        $data = $this->khsMahasiswaDosenWaliViewData($apiData, $semesters, asset('images/stmik.png'));

        return view('pdf/khs-download', $data);
    }

    // Bulk ZIP download
    public function khs_mahasiswa_download_bulk(Request $request) {
        $this->abortIfNotDosenWali();

        $validated = $request->validate([
            'mhs_ids' => 'required|array|min:1|max:50',
            'mhs_ids.*' => 'required|integer',
            'semesters' => 'required|string'
        ]);

        $mhsIds = $validated['mhs_ids'];
        $semesters = $this->normalizeSemesterSelection($validated['semesters']);

        $tempDir = storage_path('app/khs-exports');
        if (!file_exists($tempDir)) {
            mkdir($tempDir, 0755, true);
        }

        $zipFilename = 'KHS-Mahasiswa-' . date('Y-m-d-His') . '-' . $this->getSemesterModeLabel($semesters) . '.zip';
        $zipPath = $tempDir . '/' . $zipFilename;

        $zip = new \ZipArchive();
        if ($zip->open($zipPath, \ZipArchive::CREATE | \ZipArchive::OVERWRITE) !== true) {
            abort(500, 'Gagal membuat file ZIP');
        }

        $successCount = 0;
        foreach ($mhsIds as $mhsId) {
            try {
                $apiData = $this->fetchDosenWaliKHS($mhsId, $semesters);
                
                if (!$apiData) {
                    continue;
                }

                $data = $this->khsMahasiswaDosenWaliViewData($apiData, $semesters, $this->pdfLogoPath());

                $pdf = Pdf::loadView('pdf/khs-download', $data)->setPaper('A4', 'portrait');
                
                $filename = $this->generateKhsFilename($data['nim'], $data['nama'], $semesters);
                
                $pdfContent = $pdf->output();
                $zip->addFromString($filename, $pdfContent);
                
                $successCount++;
            } catch (\Exception $e) {
                continue;
            }
        }

        $zip->close();

        if ($successCount === 0) {
            @unlink($zipPath);
            abort(404, 'Tidak ada data KHS yang berhasil diunduh');
        }

        return response()->download($zipPath, $zipFilename)->deleteFileAfterSend(true);
    }

    /**
     * Helper Methods for KHS Mahasiswa Dosen Wali
     */

    private function abortIfNotDosenWali() {
        $role = Session::get('role');
        if (!isset($role['is_doswal']) || !$role['is_doswal']) {
            abort(403, 'Akses ditolak. Hanya dosen wali yang dapat mengakses halaman ini.');
        }
    }

    private function normalizeSemesterSelection($semesters) {
        if ($semesters === 'all' || $semesters === 'semua') {
            return 'all';
        }

        if (is_array($semesters)) {
            $semesters = implode(',', $semesters);
        }

        $semesters = trim($semesters);
        
        if (empty($semesters)) {
            return 'all';
        }

        $semesterArray = array_map('intval', explode(',', $semesters));
        $semesterArray = array_filter($semesterArray, function($s) {
            return $s >= 1 && $s <= 8;
        });
        $semesterArray = array_unique($semesterArray);
        sort($semesterArray);

        if (empty($semesterArray)) {
            return 'all';
        }

        return implode(',', $semesterArray);
    }

    private function fetchDosenWaliKHS(int $mhsId, string $semesters) {
        try {
            $endpoint = 'krs/mahasiswa/' . $mhsId . '/khs?semesters=' . $semesters;
            $response = $this->service->get(null, $endpoint)->getData('data');

            if (!isset($response['status']) || $response['status'] !== 'success') {
                return null;
            }

            return $response['data'] ?? null;
        } catch (\Exception $e) {
            return null;
        }
    }

    private function khsMahasiswaDosenWaliViewData(array $apiData, string $semesters, $image) {
        Carbon::setLocale('id');

        return [
            'nim' => $apiData['nim'] ?? '-',
            'nama' => $apiData['nama'] ?? '-',
            'dosen_wali' => $apiData['dosen_wali'] ?? '-',
            'summary' => $apiData['summary'] ?? [],
            'semesters' => $apiData['semesters'] ?? [],
            'mode_semester_label' => $this->getSemesterModeLabel($semesters),
            'tanggal' => Carbon::now()->translatedFormat('d F Y'),
            'image' => $image
        ];
    }

    private function getSemesterModeLabel(string $semesters): string {
        if ($semesters === 'all') {
            return 'Semua-Semester';
        }

        $semesterArray = explode(',', $semesters);
        
        if (count($semesterArray) === 1) {
            return 'Semester-' . $semesterArray[0];
        }

        return 'Semester-' . str_replace(',', '-', $semesters);
    }

    private function generateKhsFilename(string $nim, string $nama, string $semesters): string {
        $namaSlug = $this->sanitizeFilename($nama);
        $semesterLabel = $this->getSemesterModeLabel($semesters);
        
        return $nim . '-' . $namaSlug . '-' . $semesterLabel . '.pdf';
    }

    private function sanitizeFilename(string $name): string {
        $name = preg_replace('/[^a-zA-Z0-9\s\-]/', '', $name);
        $name = preg_replace('/\s+/', '-', trim($name));
        $name = preg_replace('/-+/', '-', $name);
        $name = trim($name, '-');
        
        return $name;
    }
}

?>
