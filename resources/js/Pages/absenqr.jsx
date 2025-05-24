import { useEffect, useState } from "react"
import { useSidebar } from "../context/SidebarContext"
import { CircularProgress, createTheme, Fade, Grow, IconButton, useMediaQuery } from "@mui/material"
import MainLayout from "../layouts/MainLayout"
import { Check, Close, MenuOutlined } from "@mui/icons-material"
import QRScanner from "../components/CustomQRCode"
import { Scanner } from "@yudiel/react-qr-scanner"
import api_handler from "../libs/api_handler"

export default function AbsenQR({ token, base_url, role}) {

    const { setShowSidebar } = useSidebar()
    const theme = createTheme({
        components: {
            MuiUseMediaQuery: {
                defaultProps: {
                    noSsr: true
                }
            }
        }
    })

    const [listData, setListData] = useState({
        absen: {
            loading: false,
            error: null,
            success: false
        }
    })

    const aksi = {
        absen: {
            submit: async (data) => {
                try {

                    if(!data) return

                    const [kelas, pin, unique] = data.split('-')

                    if(!kelas || !pin || !unique) return

                    aksi.absen.set('error', null)
                    aksi.absen.set('loading', true)

                    const response = await api_handler.get({
                        base_url,
                        token,
                        url: `kelas-kuliah/mahasiswa/presensi/qrcode?kelas=${kelas}&pin=${pin}${unique === '1' ? '&unique_pin=true' : ''}`
                    })

                    aksi.absen.set('loading', false)

                    if(response?.success) {
                        aksi.absen.set('success', true)
                        setTimeout(() => {
                            aksi.absen.set('success', false)
                        }, 5000)
                    }else{
                        aksi.absen.set('error', response?.message)
                        setTimeout(() => {
                            aksi.absen.set('error', null)
                        }, 5000)
                    }
                } catch (error) {
                    aksi.absen.set('loading', false)
                    aksi.absen.set('success', false)
                    aksi.absen.set('error', error?.message || "Terjadi kesalahan saat memproses.")
                    setTimeout(() => {
                        aksi.absen.set('error', null)
                    }, 5000)
                }
            },
            set: (column, value) => {
                setListData(state => ({
                    ...state,
                    absen: {
                        ...state.absen,
                        [column]: value
                    }
                }))
            }
        }
    }

    const matches = {
        lg: useMediaQuery(theme.breakpoints.up('lg'))
    }

    return (
        <MainLayout token={token} base_url={base_url} role={role}>
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
                                {listData.absen.loading
                                    ? (
                                        <div className="p-4">
                                            <div className="w-full aspect-square flex items-center justify-center">
                                                <Grow in timeout={1000} style={{ transformOrigin: '0 12 0' }}>
                                                    <CircularProgress size={50} />
                                                </Grow>
                                            </div>
                                        </div>
                                    ): listData.absen.success || listData.absen.error ? (
                                        <div className="p-4">
                                            <div className="w-full aspect-square flex items-center justify-center">
                                                {listData.absen.success
                                                    ? (
                                                        <div className="flex flex-col items-center gap-4">
                                                            <Grow in timeout={1000} style={{ transformOrigin: '0 12 0' }}>
                                                                <Check sx={{ fontSize: 120 }} color="success" />
                                                            </Grow>
                                                            <Grow in timeout={1000}  style={{ transformOrigin: '12 0 0', transitionDelay: '500ms' }}>
                                                                <h1 className="text-4xl font-extrabold tracking-tighter text-green-700">
                                                                    Yay!
                                                                </h1>
                                                            </Grow>
                                                            <Grow in timeout={1000}  style={{ transformOrigin: '12 0 0', transitionDelay: '500ms' }}>
                                                                <p className="text-center text-lg tracking-tighter opacity-70">
                                                                    Anda telah berhasil melakukan Presensi
                                                                </p>
                                                            </Grow>
                                                        </div>
                                                    ):(
                                                        <div className="flex flex-col items-center gap-4">
                                                            <Grow in timeout={1000} style={{ transformOrigin: '0 12 0' }}>
                                                                <Close sx={{ fontSize: 120 }} color="error" />
                                                            </Grow>
                                                            <Grow in timeout={1000}  style={{ transformOrigin: '12 0 0', transitionDelay: '500ms' }}>
                                                                <h1 className="text-4xl font-extrabold tracking-tighter text-red-700">
                                                                    Oops!
                                                                </h1>
                                                            </Grow>
                                                            <Grow in timeout={1000}  style={{ transformOrigin: '12 0 0', transitionDelay: '500ms' }}>
                                                                <p className="text-center text-lg tracking-tighter opacity-70">
                                                                    {listData.absen.error}
                                                                </p>
                                                            </Grow>
                                                        </div>
    
                                                    )
                                                }
                                            </div>
                                        </div>
                                    ):(
                                        <QRScanner
                                            onScanned={(data) => {
                                                if (!listData.absen.loading) aksi.absen.submit(data)
                                            }}
                                            facingMode={'environment'}
                                            onError={(error) => console.log({ error })}
                                        />
                                    )}
                            </>
                        )
                    }
                </div>
            </div>
        </MainLayout>
    )
}