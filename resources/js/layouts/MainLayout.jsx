'use client'

import { AssignmentOutlined, CalendarMonthOutlined, CameraOutlined, ChevronLeft, ComputerOutlined, DarkModeOutlined, EventAvailableOutlined, EventNoteOutlined, Home, HomeOutlined, LightModeOutlined, LogoDev, Logout, LogoutOutlined, MenuOutlined, NewspaperOutlined, Person, PersonOutline, QrCode2Outlined, QrCodeOutlined, VerifiedOutlined } from "@mui/icons-material"
import { Avatar, Button, Fab, Fade, IconButton, Slide, SpeedDial, SpeedDialAction, SpeedDialIcon, Tooltip } from "@mui/material"
import { useEffect, useState } from "react"
import { useSidebar } from "../context/SidebarContext"
import { useRedirect } from "../context/RedirectContext"
import { useLocation } from "react-router-dom"
import { useUser } from "../context/UserContext"
import { customSwal } from "../components/CustomSwal"
import api_handler from "../libs/api_handler"
import CustomLoading from "../components/CustomLoading"
import { useBackdrop } from "../context/BackdropContext"

export default function MainLayout({ children, token, base_url, role }) {
    const { showSidebar, setShowSidebar } = useSidebar()
    const { userdata, setUserdata, loadingUserdata, setLoadingUserdata } = useUser() 
    const { goTo, showAnimation } = useRedirect()

    const [showFab, setShowFab] = useState(true)
    let timeout

    useEffect(() => {
        const handleScroll = () => {
            setShowFab(true)

            clearTimeout(timeout)
            timeout = setTimeout(() => {
                setShowFab(false)
            }, 500) // Hides after 1.5 seconds of inactivity
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])
    

    const aksi = {
        userdata: {
            get: async () => {
                try {
                    setLoadingUserdata(true)

                    const response = await api_handler.get({
                        url: 'users/me',
                        token,
                        base_url
                    })

                    setLoadingUserdata(false)

                    if(response?.success) {
                        setUserdata(response?.data)
                    }else{
                        setUserdata(null)
                        customSwal.toast.error({
                            message: response?.message
                        })
                    }
                } catch (error) {
                    customSwal.toast.error({
                        message: error?.message
                    })
                }
            }
        },
        menu: {
            for: (...args) => {
                return args.some(item => 
                    Object.values(role).some(v =>
                        v.label === item && v.enable
                    )
                )
            }
        }
    }

    useEffect(() => {
        aksi.userdata.get()
    }, [])

    return (
        <div className={`min-h-screen bg-zinc-100 jakarta text-zinc-700 text-xs sm:text-sm font-jakarta`}>
            <div className="w-full flex gap-3">
                <div className="fixed bottom-5 right-5 sm:hidden items-center justify-center z-[40]">
                    <Fade in={showFab} timeout={200}>
                        <Tooltip arrow title='Absen'>
                            <Fab onClick={() => window.location.href = '/absenqr'} aria-label="absen" color="primary">
                                <QrCodeOutlined />
                            </Fab>
                        </Tooltip>
                    </Fade>
                </div>
                {/* Sidebar */}
                <div className="hidden lg:block lg:w-2/12 min-w-60 sticky top-3 h-fit pl-4 overflow-auto">
                    <SidebarContent showSidebar={showSidebar} setShowSidebar={setShowSidebar} role={role} menuFor={aksi.menu.for} />
                </div>

                {/* Mobile Sidebar */}
                <Slide direction="right" in={showSidebar} mountOnEnter unmountOnExit>
                    <div className="fixed inset-0 min-h-screen bg-white shadow-lg z-50 md:hidden p-4 overflow-auto">
                        <SidebarContent showSidebar={showSidebar} setShowSidebar={setShowSidebar} role={role} menuFor={aksi.menu.for} mobile />
                    </div>
                </Slide>

                {/* Content */}
                <div className={"w-full lg:w-10/12 relative overflow-auto p-3"}>
                    <Fade in={showAnimation} timeout={300}>
                        {children}
                    </Fade>
                </div>
            </div>
            
            {/* Footer */}
            <div className="p-20">
                Footer disini
            </div>
        </div>
    )
}

function SidebarContent({ showSidebar, setShowSidebar, mobile = false, role, menuFor = (...args) => {} }) {
    
    const { pathname } = useLocation()

    const { userdata, loadingUserdata } = useUser() 
    const { goTo, showAnimation } = useRedirect()
    const { showBackdrop, setShowBackdrop } = useBackdrop()

    const aksi = {
        logout: () => {
            setShowBackdrop(true)
            goTo('/logout')
        }
    }

    return (
        <>
            <div className={`${mobile ? 'py-4' : 'py-4'} font-jakarta `}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/images/stmik.png" alt="Logo STMIK" className="w-12" />
                        <div className="">
                            <h1 className={`font-semibold text-blue-700 font-jakarta`}>
                                Sistem Informasi Manajamen Akademik
                            </h1>
                            <p className="text-xs italic opacity-60">
                                STMIK Bandung
                            </p>
                        </div>
                    </div>
                    {mobile && (
                        <IconButton onClick={() => setShowSidebar(state => !state)}>
                            <MenuOutlined fontSize="small" />
                        </IconButton>
                    )}
                </div>
            </div>
            <hr className="my-5 border-zinc-400" />
            <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                <div className="overflow-hidden relative">
                    <p className="font-medium opacity-60 text-xs px-5">
                        Menu Utama
                    </p>
                    <hr className="my-1 opacity-0" />
                    <div className="relative overflow-clip w-full">
                        <div className={`absolute top-0 left-0 w-2 h-full rounded-md bg-blue-500 ${pathname === '/home' ? 'opacity-100' : 'opacity-0'}`}></div>
                        <div className="px-5">
                            <button onClick={() => goTo('/home')} disabled={pathname === '/home'} className={`p-2 w-full rounded-md ${pathname === '/home' ? 'border bg-white border-zinc-300' : 'hover:bg-zinc-200 ease-out duration-100'} flex items-center gap-3 `}>
                                <HomeOutlined color={pathname === '/home' ? 'primary' : ''} fontSize="small" />
                                <p className="font-medium">
                                    Dashboard
                                </p>
                            </button>
                        </div>
                    </div>
                    {menuFor('Mahasiswa') && (
                        <div className="relative overflow-visible w-full">
                            <div className={`absolute top-0 left-0 w-2 rounded-md h-full bg-blue-500 ${pathname === '/absenqr' ? 'opacity-100' : 'opacity-0'}`}></div>
                            <div className="px-5">
                                <button onClick={() => goTo('/absenqr')} disabled={pathname === '/absenqr'} className={`p-2 w-full rounded-md ${pathname === '/absenqr' ? 'border border-zinc-300 bg-white' : 'hover:bg-zinc-200 ease-out duration-100'} flex items-center gap-3 `}>
                                    <QrCode2Outlined color={pathname === '/absenqr' ? 'primary' : ''} fontSize="small" />
                                    <p className="font-medium">
                                        Absen QR
                                    </p>
                                </button>
                            </div>
                        </div>
                    )}
                    {menuFor('Mahasiswa', 'Dosen Wali') && (
                        <div className="relative overflow-visible w-full">
                            <div className={`absolute top-0 left-0 w-2 rounded-md h-full bg-blue-500 ${pathname === '/krs' ? 'opacity-100' : 'opacity-0'}`}></div>
                            <div className="px-5">
                                <button onClick={() => goTo('/krs')} disabled={pathname === '/krs'} className={`p-2 w-full rounded-md ${pathname === '/krs' ? 'border border-zinc-300 bg-white' : 'hover:bg-zinc-200 ease-out duration-100'} flex items-center gap-3 `}>
                                    <EventNoteOutlined color={pathname === '/krs' ? 'primary' : ''} fontSize="small" />
                                    <p className="font-medium">
                                        Kartu Rencana Studi
                                    </p>
                                </button>
                            </div>
                        </div>
                    )}
                    {menuFor('Mahasiswa') && (
                        <div className="relative overflow-visible w-full">
                            <div className={`absolute top-0 left-0 w-2 rounded-md h-full bg-blue-500 ${pathname.startsWith('/khs') ? 'opacity-100' : 'opacity-0'}`}></div>
                            <div className="px-5">
                                <button onClick={() => goTo('/khs')} disabled={pathname.startsWith('/khs')} className={`p-2 w-full rounded-md ${pathname.startsWith('/khs') ? 'border border-zinc-300 bg-white' : 'hover:bg-zinc-200 ease-out duration-100'} flex items-center gap-3 `}>
                                    <EventAvailableOutlined color={pathname.startsWith('/khs') ? 'primary' : ''} fontSize="small" />
                                    <p className="font-medium">
                                        Kartu Hasil Studi
                                    </p>
                                </button>
                            </div>
                        </div>
                    )}
                    {menuFor('Mahasiswa') && (
                        <div className="relative overflow-visible w-full">
                            <div className={`absolute top-0 left-0 w-2 rounded-md h-full bg-blue-500 ${pathname === '/jadwal' ? 'opacity-100' : 'opacity-0'}`}></div>
                            <div className="px-5">
                                <button onClick={() => goTo('/jadwal')} disabled={pathname === '/jadwal'} className={`p-2 w-full rounded-md ${pathname === '/jadwal' ? 'border border-zinc-300 bg-white' : 'hover:bg-zinc-200 ease-out duration-100'} flex items-center gap-3 `}>
                                    <CalendarMonthOutlined color={pathname === '/jadwal' ? 'primary' : ''} fontSize="small" />
                                    <p className="font-medium">
                                        Jadwal Kuliah
                                    </p>
                                </button>
                            </div>
                        </div>
                    )}
                    {menuFor('Admin', 'Dosen', 'Dosen Wali') && (
                        <div className="relative overflow-visible w-full">
                            <div className={`absolute top-0 left-0 w-2 rounded-md h-full bg-blue-500 ${pathname === '/berita' ? 'opacity-100' : 'opacity-0'}`}></div>
                            <div className="px-5">
                                <button onClick={() => goTo('/berita')} disabled={pathname === '/berita'} className={`p-2 w-full rounded-md ${pathname === '/berita' ? 'border border-zinc-300 bg-white' : 'hover:bg-zinc-200 ease-out duration-100'} flex items-center gap-3 `}>
                                    <NewspaperOutlined color={pathname === '/berita' ? 'primary' : ''} fontSize="small" />
                                    <p className="font-medium">
                                        Berita Acara
                                    </p>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </CustomLoading>
            <hr className="my-5 border-zinc-400" />
            <p className="font-medium opacity-60 text-xs px-5">
                Profil dan Pengaturan
            </p>
            <hr className="my-1 opacity-0" />
            <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                <div className="flex w-full text-start items-center justify-between px-3 py-2 rounded-md border border-zinc-300 bg-blue-600 text-white">
                    <div className="flex items-center gap-3">
                        <Avatar 
                            sx={{
                                width: 27,
                                height: 27
                            }}
                        />
                        <div className="">
                            <p className="text-xs">
                                {role?.admin?.enable 
                                    ? 'Admin' 
                                    : role?.dosen?.enable
                                        ? 'Dosen' 
                                        : role?.dosen_wali?.enable
                                            ? 'Dosen Wali' 
                                            : role?.prodi?.enable
                                                ? 'Prodi' 
                                                : role?.developer?.enable
                                                    ? 'Developer' 
                                                    : 'Mahasiswa'
                                }
                            </p>
                            <p className="font-medium">
                                {userdata?.profile?.nama}
                            </p>
                        </div>
                    </div>
                </div>
            </CustomLoading>
            <hr className="my-1 opacity-0" />
            
            <div className="relative overflow-visible w-full">
                <div className={`absolute top-0 left-0 w-2 rounded-md h-full bg-blue-500 ${pathname === '/profil' ? 'opacity-100' : 'opacity-0'}`}></div>
                <div className="px-5">
                    <button onClick={() => goTo('/profil')} disabled={pathname === '/profil'} className={`p-2 w-full rounded-md ${pathname === '/profil' ? 'border border-zinc-300 bg-white' : 'hover:bg-zinc-200 ease-out duration-100'} flex items-center gap-3 `}>
                        <PersonOutline color={pathname === '/profil' ? 'primary' : ''} fontSize="small" />
                        <p className="font-medium">
                            Profil Saya
                        </p>
                    </button>
                </div>
            </div>
            <div className="relative overflow-visible w-full">
                <div className="px-5">
                    <button type="button" onClick={() => aksi.logout()} className="p-2 w-full rounded-md hover:bg-zinc-200 ease-out duration-100 flex items-center gap-3 text-red-500">
                        <LogoutOutlined fontSize="small" />
                        <p className="font-medium">
                            Keluar
                        </p>
                    </button>
                </div>
            </div>
            {/* <div className="flex justify-between items-center w-full pt-1">
                <p className="font-medium pl-8">
                    Ubah Tema
                </p>
                <div className="flex justify-center items-center rounded-full border border-zinc-300 bg-white w-fit">
                    <div className="w-6 h-6 rounded-full border border-zinc-300 flex items-center justify-center bg-zinc-700 text-white">
                        <ComputerOutlined sx={{ fontSize: 12 }} />
                    </div>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center">
                        <DarkModeOutlined sx={{ fontSize: 12 }} />
                    </div>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center">
                        <LightModeOutlined sx={{ fontSize: 12 }} />
                    </div>
                </div>
            </div> */}
        </>
    )
}