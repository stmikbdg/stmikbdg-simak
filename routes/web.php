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
        Route::get('/khs/semester/{semester}', 'khs_per_semester');
        Route::get('/profil', 'profil');
        Route::get('/jadwal', 'jadwal');
        Route::get('/notfound', 'index');
        Route::get('/krs', 'krs');
        Route::get('/krs/approve/{mhs_id}/{krs_id}', 'krs_approve_by_dosen_wali');
        Route::get('/surat/detail/{id}', 'surat_detail_by_id');
        Route::get('/ksm/download/semester/{semester}', 'ksm_download_per_semester');
        Route::get('/ksm/preview/semester/{semester}', 'ksm_preview_per_semester');
        Route::get('/rekap/pertemuan/{options}/{pengajar_id}/{tahun_id}/{from}/{to}', 'rekap_pertemuan');
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