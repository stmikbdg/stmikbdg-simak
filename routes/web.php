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
    ->group(function () {
        Route::get('/home', [WebController::class, 'index'])->name('home');
        Route::get('/dashboard', [WebController::class, 'dashboard'])->name('dashboard');
        Route::get('/absenqr', [WebController::class, 'absenqr'])->name('absenqr');
        // Route::get('/khs', [WebController::class, 'khs'])->name('khs');
        Route::get('/khs/semester/{semester}', [WebController::class, 'khs_per_semester'])->name('khs_per_semester');
        Route::get('/profil', [WebController::class, 'profil'])->name('profil');
        Route::get('/jadwal', [WebController::class, 'jadwal'])->name('jadwal');
        Route::get('/notfound', [WebController::class, 'index'])->name('notfound');
        Route::get('/krs', [WebController::class, 'krs'])->name('krs');
        Route::get('/krs/approve/{mhs_id}/{krs_id}', [WebController::class, 'krs_approve_by_dosen_wali'])->name('krs_approve_by_dosen_wali');
        // Route::get('/surat', [WebController::class, 'surat'])->name('surat');
        Route::prefix('/surat')
            ->group(function () {
                Route::get('/', [WebController::class, 'surat'])->name('surat');
                Route::get('/detail/{id}', [WebController::class, 'surat_detail_by_id'])->name('surat_detail_by_id');
            });
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