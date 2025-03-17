import { useState } from "react"
import { useSidebar } from "../context/SidebarContext"
import { createTheme, IconButton, useMediaQuery } from "@mui/material"
import MainLayout from "../layouts/MainLayout"
import { MenuOutlined } from "@mui/icons-material"
import QRScanner from "../components/CustomQRCode"



export default function Page() {

    const { setShowSidebar } = useSidebar()
    const [data, setData] = useState(null)
    const theme = createTheme({
        components: {
            MuiUseMediaQuery: {
                defaultProps: {
                    noSsr: true
                }
            }
        }
    })
    const matches = {
        lg: useMediaQuery(theme.breakpoints.up('lg'))
    }

    return (
        <MainLayout>
            <div className={`bg-white w-full rounded-lg border shadow-md border-zinc-300`}>
                <div className="divide-y divide-zinc-300">

                    {/* Header */}
                    <div className="p-2 lg:p-4">
                        <div className="flex justify-between items-center ">
                            <div className="flex items-center lg:gap-3">
                                <div className="lg:hidden">
                                    <IconButton onClick={() => setShowSidebar(state => !state)}>
                                        <MenuOutlined fontSize="small" />
                                    </IconButton>
                                </div>
                                <h1 className="text-lg md:text-xl font-semibold tracking-wide">
                                    Absen QR
                                </h1>
                            </div>
                        </div>
                    </div>

                    {matches.lg
                        ? (
                            <div className="p-4">
                                <div className="border-l-4 border-amber-500 p-3 bg-amber-50 space-y-3 hidden lg:block">
                                    <h1 className="font-bold text-amber-500">
                                        Perhatian
                                    </h1>
                                    <p className=" text-justify">
                                        Fitur ini hanya berlaku untuk anda yang menggunakan Mobile/Handphone. Untuk anda yang menggunakan PC/Laptop, silahkan absen menggunakan PIN.
                                    </p>
                                </div>
                            </div>
                        )
                        : (
                            <>
                                <div className="p-4 space-y-4">
                                    <div className="border-l-4 border-blue-500 p-3 bg-blue-50 space-y-3 ">
                                        <h1 className="font-bold text-blue-500">
                                            Cara Penggunaan
                                        </h1>
                                        <p className=" text-justify">
                                            Pastikan bahwa QR Code di dalam sekeliling garis kotak merah, dan jangan tepat mengenai garis merah tersebut.
                                        </p>
                                        <p className=" text-justify">
                                            Pastikan bahwa Chrome/Browser sudah memberikan izin/akses untuk menggunakan kamera anda.
                                        </p>
                                    </div>
                                </div>
                                <QRScanner
                                    onScanned={(data) => setData(data)}
                                    facingMode={'environment'}
                                    onError={(error) => setData(error.message)}
                                />

                                <div className="p-4">
                                    {data}
                                </div>
                            </>
                        )
                    }
                </div>
            </div>
        </MainLayout>
    )
}