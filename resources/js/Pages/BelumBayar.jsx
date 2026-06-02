import { useNavigate } from "react-router-dom"
import { WarningAmberOutlined, WarningOutlined } from "@mui/icons-material"
import { useBackdrop } from "../context/BackdropContext"

export default function BelumBayar({ token, base_url, role, termin }) {
    const navigate = useNavigate()

    const { showBackdrop, setShowBackdrop } = useBackdrop()

    const goTo = (url) => {
        setShowBackdrop(true)
        window.location.href = url
    }

    return (
        <div className={`w-full flex min-h-screen items-center justify-center bg-gradient-to-b to-red-100 font-jakarta`}>
        
            <div class="max-w-lg w-full bg-white rounded-2xl shadow-lg overflow-hidden m-2">
                
                <div class="bg-red-500/80 flex justify-center p-3">
                    <WarningAmberOutlined sx={{ fontSize: 60 }} className="text-white text-4xl" />
                </div>

                
                <div class="text-center p-6">
                    <h2 class="text-2xl font-bold text-gray-600">
                        Administrasi Keuangan anda belum selesai
                    </h2>
                    <hr className="my-3 opacity-0" />
                    <p class=" text-gray-500 text-center tracking-tight">
                        Maaf, Administrasi Keuangan anda masih ada yang belum selesai. Hubungi Administrasi Keuangan untuk segera menyelesaikan <b>Biaya Termin ke-{termin}</b>.
                    </p>
                </div>

                
                <div class="flex justify-center flex-col sm:flex-row items-center gap-2 sm:gap-5 pb-6">
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