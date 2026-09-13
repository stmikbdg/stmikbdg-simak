<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\View;
use Tests\TestCase;

class StudentDocumentDraftViewTest extends TestCase
{
    public function test_khs_student_draft_is_marked_and_has_no_official_signatory(): void
    {
        $html = View::make('pdf.khs-download', [
            'is_draft' => true,
            'image' => null,
            'nim' => '22010001',
            'nama' => 'Mahasiswa Test',
            'dosen_wali' => 'Dosen Test',
            'summary' => [],
            'semesters' => [],
        ])->render();

        $this->assertStringContainsString('DRAFT', $html);
        $this->assertStringContainsString('TIDAK BERLAKU SEBAGAI DOKUMEN RESMI', $html);
        $this->assertStringNotContainsString('Pengesahan Prodi', $html);
    }

    public function test_ksm_student_draft_is_marked_and_has_no_official_signatory(): void
    {
        $html = View::make('pdf.ksm-download', [
            'is_draft' => true,
            'image' => null,
            'nim' => '22010001',
            'nama' => 'Mahasiswa Test',
            'dosen_wali' => 'Dosen Test',
            'semester' => 1,
            'matakuliah' => [],
            'total_sks' => 0,
        ])->render();

        $this->assertStringContainsString('DRAFT', $html);
        $this->assertStringContainsString('TIDAK BERLAKU SEBAGAI DOKUMEN RESMI', $html);
        $this->assertStringNotContainsString('Wakil Ketua Bidang Akademik', $html);
    }
}
