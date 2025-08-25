import { useNavigate } from "react-router-dom"
import { useSidebar } from "../context/SidebarContext"
import { useUser } from "../context/UserContext"
import MainLayout from "../layouts/MainLayout"
import { WarningAmberOutlined, WarningOutlined } from "@mui/icons-material"
import { useBackdrop } from "../context/BackdropContext"

export default function NotMahasiswaActive({ token, base_url, role }) {
    const navigate = useNavigate()

    const { showBackdrop, setShowBackdrop } = useBackdrop()

    const goTo = (url) => {
        setShowBackdrop(true)
        window.location.href = url
    }

    return (
        <div className={`w-full flex min-h-screen items-center justify-center bg-gray-100`}>
        
            <div class="max-w-lg w-full bg-white rounded-2xl shadow-lg overflow-hidden m-2">
                
                <div class="bg-red-500/80 flex justify-center p-3">
                    <WarningAmberOutlined sx={{ fontSize: 60 }} className="text-white text-4xl" />
                </div>

                
                <div class="text-center p-6">
                    <h2 class="text-2xl font-bold text-gray-600">
                        Anda bukanlah Mahasiswa Aktif!
                    </h2>
                    <hr className="my-3 opacity-0" />
                    <p class=" text-gray-500 text-center tracking-tight">
                        Anda bukanlah mahasiswa aktif di tahun ajaran saat ini, sehingga anda tidak bisa lagi mengakses aplikasi SIMAK. Silahkan hubungi Administrasi jika terdapat kesalahan yang tidak sesuai.
                    </p>
                </div>

                
                <div class="flex justify-center items-center gap-5 pb-6">
                    <button onClick={() => goTo('/logout')} class="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-semibold cursor-pointer">
                        Keluar dari Aplikasi
                    </button>
                    <button onClick={() => goTo('/home')} class="bg-red-500/20 hover:bg-red-600/20 text-red-500 px-6 py-2 rounded-full font-semibold cursor-pointer">
                        Kembali ke Halaman Utama
                    </button>
                </div>
            </div>

        </div>
    )
  }