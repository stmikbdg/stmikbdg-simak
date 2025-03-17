<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MahasiswaController;
use App\Http\Controllers\TestController;
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
Route::middleware(['auth.token', 'auth.mahasiswa'])
    ->group(function () {
        Route::get('/home', [MahasiswaController::class, 'index'])->name('home');
        Route::get('/absenqr', [MahasiswaController::class, 'absenqr'])->name('absenqr');
        Route::get('/khs', [MahasiswaController::class, 'khs'])->name('khs');
        Route::get('/khs/semester/{semester}', [MahasiswaController::class, 'khs_per_semester'])->name('khs_per_semester');
        Route::get('/profil', [MahasiswaController::class, 'profil'])->name('profil');
        Route::get('/jadwal', [MahasiswaController::class, 'jadwal'])->name('jadwal');
        Route::get('/notfound', [MahasiswaController::class, 'index'])->name('notfound');
        Route::get('/krs', [MahasiswaController::class, 'krs'])->name('krs');
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