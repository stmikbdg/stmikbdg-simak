import { IconButton } from "@mui/material";
import MainLayout from "../layouts/MainLayout";
import { MenuOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function NotFound({ token, base_url, role}) {
    const navigate = useNavigate()


    return (
        <div className={`bg-white w-full rounded-lg border shadow-md border-zinc-300 min-h-svh flex items-center justify-center`}>
            <div className="space-y-8">
                <div className="flex justify-center">
                    <img src="/images/not-found.png" alt="Logo Not Found" className="w-48" />
                </div>
                <div className="space-y-5">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl text-center font-bold text-zinc-700">
                        404
                    </h1>
                    <p className="text-center">
                        Halaman yang Anda cari sepertinya tidak ada. Namun jangan khawatir, <br />
                        Anda bisa kembali ke halaman utama
                    </p>
                    <div className="flex items-center gap-1 justify-center">
                        <button onClick={() => navigate(-1)} type="button" className="px-3 py-1 rounded bg-zinc-700 text-white hover:bg-zinc-800 active:bg-zinc-900 cursor-pointer">
                            Kembali
                        </button>
                        <button type="button" className="px-3 py-1 rounded bg-zinc-100 hover:bg-zinc-200 active:bg-zinc-300 cursor-pointer">
                            Laporkan Masalah
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}