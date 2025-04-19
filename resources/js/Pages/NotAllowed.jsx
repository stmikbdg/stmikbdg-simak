import { useNavigate } from "react-router-dom"
import { useSidebar } from "../context/SidebarContext"
import { useUser } from "../context/UserContext"
import MainLayout from "../layouts/MainLayout"

export default function NotAllowedPage({ token, base_url, role }) {
    const navigate = useNavigate()


    return (
        <div className={`bg-white w-full rounded-lg border shadow-md border-zinc-300 min-h-svh flex items-center justify-center`}>
            <div className="space-y-8">
                <div className="flex justify-center">
                    <img src="/images/not-found.png" alt="Logo Not Found" className="w-48 grayscale opacity-70" />
                </div>
                <div className="space-y-5">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl text-center font-bold text-zinc-700">
                        400
                    </h1>
                    <p className="text-center">
                        Anda tidak memiliki akses ke halaman ini, <br />
                        Silahkan kembali ke halaman sebelumnya
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