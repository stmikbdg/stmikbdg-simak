import { Button, IconButton } from "@mui/material"
import { MainLayout2 } from "../layouts/MainLayout"
import NotAllowedPage from "./NotAllowed"
import { Approval, AttachFileTwoTone, CalendarMonthTwoTone, CategoryTwoTone, Close, DownloadTwoTone, InfoOutlined, NoteTwoTone, Person2TwoTone, West } from "@mui/icons-material"

export default function SuratDetailPage({ base_url, token, role, id }) {
    if(role?.dosen_wali?.enable) {
        // return <DosenWali_SuratPage token={token} base_url={base_url} role={role} app={app} />
        return <DosenWali base_url={base_url} token={token} role={role} id={id} />
    }

    return (
        <NotAllowedPage token={token} base_url={base_url} role={role} />
    )
}

function DosenWali({ base_url, token, role, id }) {
    return (
        <MainLayout2 token={token} base_url={base_url} role={role} noApplications page_title="Surat">
            <div className="p-4">
                <div className="flex gap-4 items-center">
                    <IconButton color="primary" >
                        <West fontSize="small" />
                    </IconButton>
                    <h1 className="text-lg sm:text-xl lg:text-2xl">
                        Ziyad Jahizh Kartiwa
                    </h1>
                </div>
            </div>
            <div className="p-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="space-y-8">
                            <div className="space-y-2">
                                <div className="flex items-center gap-4">
                                    <CalendarMonthTwoTone fontSize="small" className="opacity-50" />
                                    <p className="opacity-70">
                                        Tanggal diajukan
                                    </p>
                                </div>
                                <p className="font-bold text-zinc-600">
                                    Senin, 14 Februari 2023, 09:00 WIB
                                </p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-4">
                                    <CategoryTwoTone fontSize="small" className="opacity-50" />
                                    <p className="opacity-70">
                                        Jenis Pengajuan
                                    </p>
                                </div>
                                <p className="font-bold text-zinc-600">
                                    Magang di UNPAR
                                </p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-4">
                                    <Person2TwoTone fontSize="small" className="opacity-50" />
                                    <p className="opacity-70">
                                        Pengaju
                                    </p>
                                </div>
                                <p className="font-bold text-zinc-600">
                                    Mahasiswa
                                </p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-4">
                                    <NoteTwoTone fontSize="small" className="opacity-50" />
                                    <p className="opacity-70">
                                        Keterangan
                                    </p>
                                </div>
                                <p className="font-bold text-zinc-600">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa tempora ut exercitationem! Odio, quo reprehenderit beatae, iste placeat, itaque distinctio praesentium incidunt vel asperiores eum maxime mollitia ullam! Fugiat, consectetur!
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="space-y-2">
                            <div className="flex items-center gap-4">
                                <AttachFileTwoTone fontSize="small" className="opacity-50" />
                                <p className="opacity-70">
                                    File Terlampir
                                </p>
                            </div>
                            <div className="space-y-1">
                                <button type="button" className="pl-3 pr-4 py-2 rounded-full border hover:bg-blue-50 hover:border-blue-500 border-zinc-300 flex items-center gap-2 justify-center text-blue-500 cursor-pointer">
                                    <DownloadTwoTone fontSize="small" />
                                    <p className="font-bold">
                                        Surat Magang.docx
                                    </p>
                                </button>
                                <button type="button" className="pl-3 pr-4 py-2 rounded-full border hover:bg-blue-50 hover:border-blue-500 border-zinc-300 flex items-center gap-2 justify-center text-blue-500 cursor-pointer">
                                    <DownloadTwoTone fontSize="small" />
                                    <p className="font-bold">
                                        Surat Rekomendasi Kampus.docx
                                    </p>
                                </button>
                                <button type="button" className="pl-3 pr-4 py-2 rounded-full border hover:bg-blue-50 hover:border-blue-500 border-zinc-300 flex items-center gap-2 justify-center text-blue-500 cursor-pointer">
                                    <DownloadTwoTone fontSize="small" />
                                    <p className="font-bold">
                                        Persetujuan.pdf
                                    </p>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4">
                <div className="space-y-4">
                    <div className="flex gap-4">
                        <InfoOutlined fontSize="small" color="primary" />
                        <p>
                            Jika anda sudah merasa yakin terhadap pengajuan ini, silahkan tekan tombol <b>Approve</b> dibawah ini.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <Button variant="contained" className="w-full sm:w-fit" startIcon={<Approval />} sx={{ borderRadius: 9999 }}>
                            <p className="font-bold font-jakarta">
                                Approve
                            </p>
                        </Button>
                        <Button variant="outlined" className="w-full sm:w-fit" color="error" startIcon={<Close />} sx={{ borderRadius: 9999 }}>
                            <p className="font-medium font-jakarta">
                                Tolak
                            </p>
                        </Button>
                    </div>
                </div>
            </div>
        </MainLayout2>
    )
}