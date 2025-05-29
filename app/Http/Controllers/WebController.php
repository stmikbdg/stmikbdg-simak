<?php 
namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Session;

class WebController extends Controller {

    private function render(string $component, array $props = []) {
        $token = Session::get('token');
        $role = Session::get('role');

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
            [
                'name' => 'Keuangan',
                'deskripsi' => 'Sistem Informasi dan layanan pembayaran keuangan',
                'label' => 'keuangan',
                'icon' => 'PaymentsTwoTone',
                'color' => 'blue'
            ],
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

        return Inertia::render($component, $props);
    }

    public function index() {
        return $this->render('Home');
    }

    public function dashboard() {
        return $this->render('dashboard');
    }

    public function absenqr() {
        return $this->render('absenqr');
    }

    public function khs() {
        return $this->render('khs');
    }

    public function khs_per_semester(string $semester) {
        return $this->render('khs_per_semester', [
            'semester' => $semester
        ]);
    }

    public function profil() {
        return $this->render('profil');
    }

    public function jadwal() {
        return $this->render('jadwal');
    }

    public function krs() {
        return $this->render('krs');
    }

    public function krs_approve_by_dosen_wali(Int $mhs_id, Int $krs_id) {
        return $this->render('krs_approve_by_dosen_wali', [
            'mhs_id' => $mhs_id,
            'krs_id' => $krs_id
        ]);
    }

    public function surat() {
        return $this->render('surat');
    }

    public function surat_detail_by_id(Int $id) {
        return $this->render('surat_detail_by_id', [
            'id' => $id
        ]);
    }
}

?>

