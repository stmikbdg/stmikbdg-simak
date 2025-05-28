<?php

return [
    'api' => [
        'base_url' => env('API_BASE_URL', null),
    ],
    'login' => [
        'base_url' => env('LOGIN_BASE_URL', null),
    ],
    'app' => [
        'kurikulum' => env('KURIKULUM_BASE_URL', null),
        'keuangan' => env('KEUANGAN_BASE_URL', null),
        'layanan_akademik' => env('LAYANAN_AKADEMIK_BASE_URL', null),
        'krs' => env('KRS_BASE_URL', null),
        'kuesioner' => env('KUESIONER_BASE_URL', null),
        'sikps' => env('SIKPS_BASE_URL', null),
        'bimbingan' => env('BIMBINGAN_BASE_URL', null),
        'verdig' => env('VERDIG_BASE_URL', null),
        'wisuda' => env('WISUDA_BASE_URL', null),
        'pembelajaran' => env('PEMBELAJARAN_BASE_URL', null),
        'lms' => env('LMS_BASE_URL', null),
        'ujian' => env('UJIAN_BASE_URL', null),
        'pendaftaran' => env('PENDAFTARAN_BASE_URL', null),
        'pengajuan' => env('PENGAJUAN_BASE_URL', null),
        'journal' => env('JOURNAL_BASE_URL', null),
    ]
];
