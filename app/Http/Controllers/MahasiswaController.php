<?php 
namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Session;

class MahasiswaController extends Controller {

    private function render(string $component, array $props = []) {
        $token = Session::get('token');
        $role = Session::get('role');

        $props['token'] = $token ?? null;
        $props['role'] = [
            'dosen' => [
                'enable' => $role['is_dsn'] ?? false,
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

        return Inertia::render($component, $props);
    }

    public function index() {
        return $this->render('Home');
    }

    public function absenqr() {
        return $this->render('mahasiswa/absenqr');
    }

    public function khs() {
        return $this->render('mahasiswa/khs');
    }

    public function khs_per_semester(string $semester) {
        return $this->render('mahasiswa/khs_per_semester', [
            'semester' => $semester
        ]);
    }

    public function profil() {
        return $this->render('mahasiswa/profil');
    }

    public function jadwal() {
        return $this->render('mahasiswa/jadwal');
    }

    public function krs() {
        return $this->render('mahasiswa/krs');
    }
}

?>

