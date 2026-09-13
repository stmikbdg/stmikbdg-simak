<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\WebController;
use Illuminate\Support\Facades\Route;

/**
 * ! Jangan ubah route yang ada dalam group ini
 * */
Route::controller(AuthController::class)
    ->group(function () {
        Route::get('/', 'checkToken')->name('check');
        Route::get('/logout', 'logout')->name('logout'); // gunakan untuk logout
        Route::get('/roles', 'changeUserRole')->middleware('auth.token');
    });

/**
 * ! Jadikan route di bawah sebagai halaman utama dari web
 * ! harap tidak mengubah nilai pada name();
 */
Route::middleware(['auth.token'])
    ->controller(WebController::class)
    ->group(function () {
        Route::get('/home', 'index')->name('home');
        Route::get('/dashboard', 'dashboard')->name('dashboard');
        Route::get('/absenqr', 'absenqr')->name('absenqr');
        Route::get('/khs', 'khs');
        Route::get('/khs/semester/{semester}', 'khs_per_semester');
        Route::get('/khs/download', 'khs_download');
        Route::get('/khs/download/semester/{semester}', 'khs_download_per_semester');
        Route::get('/khs/preview', 'khs_preview');
        Route::get('/khs/preview/semester/{semester}', 'khs_preview_per_semester');
        Route::get('/profil', 'profil');
        Route::get('/jadwal', 'jadwal');
        Route::get('/notfound', 'index');
        Route::get('/krs', 'krs');
        Route::get('/krs/approve/{mhs_id}/{krs_id}', 'krs_approve_by_dosen_wali');
        Route::get('/surat/detail/{id}', 'surat_detail_by_id');
        Route::get('/ksm/download/krs_id/{krs_id}', 'ksm_download_per_krs_id');
        Route::get('/ksm/preview/krs_id/{krs_id}', 'ksm_preview_per_krs_id');
        Route::get('/rekap/pertemuan/{options}/{pengajar_id}/{tahun_id}/{from}/{to}', 'rekap_pertemuan');
        Route::get('/berita-acara/{kelas_kuliah_id}', 'bap_dosen_rekap');
        Route::get('/khs-mahasiswa', 'khs_mahasiswa');
        Route::get('/khs-mahasiswa/download/{mhs_id}', 'khs_mahasiswa_download');
        Route::post('/khs-mahasiswa/download/bulk', 'khs_mahasiswa_download_bulk');
        Route::get('/khs-mahasiswa/preview/{mhs_id}', 'khs_mahasiswa_preview');
    });

/**
 * * Buat route-route baru di bawah ini
 * * Pastikan untuk selalu menggunakan middleware('auth.token')
 * * middleware tersebut digunakan untuk verifikasi access pengguna dengan web
 *
 * * Bisa juga ditambahkan dengan middleware lainnya.
 * * Berikut adalah beberapa middleware lain yang telah tersedia,
 * * dapat digunakan untuk mengatur akses route berdasarkan role user
 *
 * 1.) auth.admin -> biasa digunakan untuk akses route untuk manage user lain
 * 2.) auth.mahasiswa -> akses route untuk user dengan role mahasiswa
 * 3.) auth.dosen -> akses route untuk user dengan role dosen
 * 4.) auth.developer -> akses route untuk user developer
 *
 * ? contoh penggunaan: middleware(['auth.token', 'auth.mahasiswa'])
 */