'use client'

import { AssignmentOutlined, AssignmentTwoTone, BookmarksTwoTone, BookTwoTone, CalendarMonthOutlined, CameraOutlined, ChangeCircleOutlined, ChatTwoTone, ChevronLeft, ComputerOutlined, DarkModeOutlined, DashboardTwoTone, EventAvailableOutlined, EventNoteOutlined, Home, HomeOutlined, HowToRegTwoTone, LightModeOutlined, LogoDev, Logout, LogoutOutlined, MailTwoTone, MenuBookTwoTone, MenuOutlined, NewspaperOutlined, PeopleAltTwoTone, Person, PersonOutline, QrCode2Outlined, QrCodeOutlined, SchoolTwoTone, VerifiedOutlined, WalletTwoTone } from "@mui/icons-material"
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
import CustomDropdown from "../components/CustomDropdown"

function ApplicationSection({ app }) {

    const aksi = {
        redirect: (url, newTab = false) => {
            if(newTab) {
                const tab = window.open(url, '_blank')
                if (tab) {
                    tab.focus()
                }else{
                    customSwal.error({
                        message: 'Anda perlu memberikan izin untuk Popup di Browser anda'
                    })
                }
            }else{
                window.location.href = url
            }
        }
    }

    return (
        <div className="p-4">
            <div className="flex flex-wrap justify-around gap-5">
                <Tooltip arrow title={app['kurikulum'] ? '' : 'Aplikasi ini belum ada'}>
                    <button type="button" onClick={() => app['kurikulum'] ? aksi.redirect(app['kurikulum'], true) : null} 
                        className={app['kurikulum']
                            ? "flex items-center justify-center hover:text-red-500 hover:-translate-y-1 ease-out duration-200 cursor-pointer group"
                            : "flex items-center justify-center opacity-50"
                        }
                    >
                        <div className="flex flex-col items-center gap-2">
                            <div className={`w-10 h-10 shrink-0 rounded-md bg-zinc-100 ${app['kurikulum'] ? 'group-hover:bg-red-100' : ''} flex items-center justify-center shadow-sm`}>
                                <BookTwoTone sx={{ fontSize: 28 }}/>
                            </div>
                            <h1 className="font-medium">
                                Kurikulum
                            </h1>
                        </div>
                    </button>
                </Tooltip>
                <Tooltip arrow title={app['keuangan'] ? '' : 'Aplikasi ini belum ada'}>
                    <button type="button" onClick={() => app['keuangan'] ? aksi.redirect(app['keuangan'], true) : null} 
                        className={app['keuangan']
                            ? "flex items-center justify-center hover:text-orange-500 hover:-translate-y-1 ease-out duration-200 cursor-pointer group"
                            : "flex items-center justify-center opacity-50"
                        }
                    >
                        <div className="flex flex-col items-center gap-2">
                            <div className={`w-10 h-10 shrink-0 rounded-md bg-zinc-100 ${app['keuangan'] ? 'group-hover:bg-orange-100' : ''} flex items-center justify-center shadow-sm`}>
                                <WalletTwoTone sx={{ fontSize: 28 }}/>
                            </div>
                            <h1 className="font-medium">
                                Keuangan
                            </h1>
                        </div>
                    </button>
                </Tooltip>
                <Tooltip arrow title={app['kuesioner'] ? '' : 'Aplikasi ini belum ada'}>
                    <button type="button" onClick={() => app['kuesioner'] ? aksi.redirect(app['kuesioner'], true) : null} 
                        className={app['kuesioner']
                            ? "flex items-center justify-center hover:text-yellow-500 hover:-translate-y-1 ease-out duration-200 cursor-pointer group"
                            : "flex items-center justify-center opacity-50"
                        }
                    >
                        <div className="flex flex-col items-center gap-2">
                            <div className={`w-10 h-10 shrink-0 rounded-md bg-zinc-100 ${app['kuesioner'] ? 'group-hover:bg-yellow-100' : ''} flex items-center justify-center shadow-sm`}>
                                <ChatTwoTone sx={{ fontSize: 28 }}/>
                            </div>
                            <h1 className="font-medium">
                                Kuesioner
                            </h1>
                        </div>
                    </button>
                </Tooltip>
                <Tooltip arrow title={app['sikps'] ? '' : 'Aplikasi ini belum ada'}>
                    <button type="button" onClick={() => app['sikps'] ? aksi.redirect(app['sikps'], true) : null} 
                        className={app['sikps']
                            ? "flex items-center justify-center hover:text-lime-500 hover:-translate-y-1 ease-out duration-200 cursor-pointer group"
                            : "flex items-center justify-center opacity-50"
                        }
                    >
                        <div className="flex flex-col items-center gap-2">
                            <div className={`w-10 h-10 shrink-0 rounded-md bg-zinc-100 ${app['sikps'] ? 'group-hover:bg-lime-100' : ''} flex items-center justify-center shadow-sm`}>
                                <BookmarksTwoTone sx={{ fontSize: 28 }}/>
                            </div>
                            <h1 className="font-medium">
                                SIKPS
                            </h1>
                        </div>
                    </button>
                </Tooltip>
                <Tooltip arrow title={app['bimbingan'] ? '' : 'Aplikasi ini belum ada'}>
                    <button type="button" onClick={() => app['bimbingan'] ? aksi.redirect(app['bimbingan'], true) : null} 
                        className={app['bimbingan']
                            ? "flex items-center justify-center hover:text-emerald-500 hover:-translate-y-1 ease-out duration-200 cursor-pointer group"
                            : "flex items-center justify-center opacity-50"
                        }
                    >
                        <div className="flex flex-col items-center gap-2">
                            <div className={`w-10 h-10 shrink-0 rounded-md bg-zinc-100 ${app['bimbingan'] ? 'group-hover:bg-emerald-100' : ''} flex items-center justify-center shadow-sm`}>
                                <PeopleAltTwoTone sx={{ fontSize: 28 }}/>
                            </div>
                            <h1 className="font-medium">
                                Bimbingan
                            </h1>
                        </div>
                    </button>
                </Tooltip>
                <Tooltip arrow title={app['verdig'] ? '' : 'Aplikasi ini belum ada'}>
                    <button type="button" onClick={() => app['verdig'] ? aksi.redirect(app['verdig'], true) : null} 
                        className={app['verdig']
                            ? "flex items-center justify-center hover:text-cyan-500 hover:-translate-y-1 ease-out duration-200 cursor-pointer group"
                            : "flex items-center justify-center opacity-50"
                        }
                    >
                        <div className="flex flex-col items-center gap-2">
                            <div className={`w-10 h-10 shrink-0 rounded-md bg-zinc-100 ${app['verdig'] ? 'group-hover:bg-cyan-100' : ''} flex items-center justify-center shadow-sm`}>
                                <HowToRegTwoTone sx={{ fontSize: 28 }}/>
                            </div>
                            <h1 className="font-medium">
                                Verifikasi Digital
                            </h1>
                        </div>
                    </button>
                </Tooltip>
                <Tooltip arrow title={app['wisuda'] ? '' : 'Aplikasi ini belum ada'}>
                    <button type="button" onClick={() => app['wisuda'] ? aksi.redirect(app['wisuda'], true) : null} 
                        className={app['wisuda']
                            ? "flex items-center justify-center hover:text-blue-500 hover:-translate-y-1 ease-out duration-200 cursor-pointer group"
                            : "flex items-center justify-center opacity-50"
                        }
                    >
                        <div className="flex flex-col items-center gap-2">
                            <div className={`w-10 h-10 shrink-0 rounded-md bg-zinc-100 ${app['wisuda'] ? 'group-hover:bg-blue-100' : ''} flex items-center justify-center shadow-sm`}>
                                <SchoolTwoTone sx={{ fontSize: 28 }}/>
                            </div>
                            <h1 className="font-medium">
                                Wisuda
                            </h1>
                        </div>
                    </button>
                </Tooltip>
                <Tooltip arrow title={app['pembelajaran'] ? '' : 'Aplikasi ini belum ada'}>
                    <button type="button" onClick={() => app['pembelajaran'] ? aksi.redirect(app['pembelajaran'], true) : null} 
                        className={app['pembelajaran']
                            ? "flex items-center justify-center hover:text-violet-500 hover:-translate-y-1 ease-out duration-200 cursor-pointer group"
                            : "flex items-center justify-center opacity-50"
                        }
                    >
                        <div className="flex flex-col items-center gap-2">
                            <div className={`w-10 h-10 shrink-0 rounded-md bg-zinc-100 ${app['pembelajaran'] ? 'group-hover:bg-violet-100' : ''} flex items-center justify-center shadow-sm`}>
                                <MenuBookTwoTone sx={{ fontSize: 28 }}/>
                            </div>
                            <h1 className="font-medium">
                                Pembelajaran
                            </h1>
                        </div>
                    </button>
                </Tooltip>
                <Tooltip arrow title={app['lms'] ? '' : 'Aplikasi ini belum ada'}>
                    <button type="button" onClick={() => app['lms'] ? aksi.redirect(app['lms'], true) : null} 
                        className={app['lms']
                            ? "flex items-center justify-center hover:text-fuchsia-500 hover:-translate-y-1 ease-out duration-200 cursor-pointer group"
                            : "flex items-center justify-center opacity-50"
                        }
                    >
                        <div className="flex flex-col items-center gap-2">
                            <div className={`w-10 h-10 shrink-0 rounded-md bg-zinc-100 ${app['lms'] ? 'group-hover:bg-fuchsia-100' : ''} flex items-center justify-center shadow-sm`}>
                                <AssignmentTwoTone sx={{ fontSize: 28 }}/>
                            </div>
                            <h1 className="font-medium">
                                LMS
                            </h1>
                        </div>
                    </button>
                </Tooltip>
            </div>
        </div>
    )
}

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
        <div className={`min-h-screen bg-zinc-100 jakarta text-zinc-700 text-xs sm:text-sm font-jakarta flex flex-col justify-between`}>
            <div className="w-full flex gap-3">
                {aksi.menu.for('Mahasiswa') && (
                    <div className="fixed bottom-5 right-5 sm:hidden items-center justify-center z-[40]">
                        <Fade in={showFab} timeout={200}>
                            <Tooltip arrow title='Absen'>
                                <Fab onClick={() => window.location.href = '/absenqr'} aria-label="absen" color="primary">
                                    <QrCodeOutlined />
                                </Fab>
                            </Tooltip>
                        </Fade>
                    </div>
                )}
                {/* Sidebar */}
                <div className="hidden lg:block lg:w-2/12 min-w-60 sticky top-3 h-fit pl-4 overflow-auto">
                    <SidebarContent showSidebar={showSidebar} setShowSidebar={setShowSidebar} role={role} menuFor={aksi.menu.for} token={token} />
                </div>

                {/* Mobile Sidebar */}
                <Slide direction="right" in={showSidebar} mountOnEnter unmountOnExit>
                    <div className="fixed inset-0 min-h-screen bg-white shadow-lg z-50 md:hidden p-4 overflow-auto">
                        <SidebarContent showSidebar={showSidebar} setShowSidebar={setShowSidebar} role={role} menuFor={aksi.menu.for} token={token} mobile />
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
            <div className="p-4 flex justify-center items-center gap-5 italic text-xs opacity-50">
                <p>
                    © Since 2024 - STMIK Bandung
                </p>
            </div>
        </div>
    )
}

export function MainLayout2({ children, token, base_url, role, page_title = 'Page Title', noApplications = false, app }) {
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
        <div className={`min-h-screen bg-zinc-100 jakarta text-zinc-700 text-xs sm:text-sm font-jakarta flex flex-col justify-between`}>
            <div className="w-full flex gap-3">
                {aksi.menu.for('Mahasiswa') && (
                    <div className="fixed bottom-5 right-5 sm:hidden items-center justify-center z-[40]">
                        <Fade in={showFab} timeout={200}>
                            <Tooltip arrow title='Absen'>
                                <Fab onClick={() => window.location.href = '/absenqr'} aria-label="absen" color="primary">
                                    <QrCodeOutlined />
                                </Fab>
                            </Tooltip>
                        </Fade>
                    </div>
                )}
                {/* Sidebar */}
                <div className="hidden lg:block lg:w-2/12 min-w-60 sticky top-3 h-fit pl-4 overflow-auto">
                    <SidebarContent showSidebar={showSidebar} setShowSidebar={setShowSidebar} role={role} menuFor={aksi.menu.for} token={token} />
                </div>

                {/* Mobile Sidebar */}
                <Slide direction="right" in={showSidebar} mountOnEnter unmountOnExit>
                    <div className="fixed inset-0 min-h-screen bg-white shadow-lg z-50 md:hidden p-4 overflow-auto">
                        <SidebarContent showSidebar={showSidebar} setShowSidebar={setShowSidebar} role={role} menuFor={aksi.menu.for} token={token} mobile />
                    </div>
                </Slide>

                {/* Content */}
                <div className={"w-full lg:w-10/12 relative overflow-auto p-3"}>
                    <Fade in={showAnimation} timeout={300}>
                        <div className="bg-white w-full rounded-lg border border-zinc-300 shadow-md">
                            <div className="divide-y divide-zinc-300">
            
                                <div className="p-2 lg:p-4">
                                    <div className="flex justify-between items-center ">
                                        <div className="flex items-center lg:gap-3">
                                            <div className="lg:hidden">
                                                <IconButton
                                                    onClick={() =>
                                                        setShowSidebar((state) => !state)
                                                    }
                                                >
                                                    <MenuOutlined fontSize="small" />
                                                </IconButton>
                                            </div>
                                            <h1 className="text-lg md:text-xl font-semibold tracking-wide">
                                                {page_title}
                                            </h1>
                                        </div>
                                    </div>
                                </div>
            
                                {!noApplications && (
                                    <ApplicationSection app={app} />
                                )}
            
                                {children}
                            </div>
                        </div>
                    </Fade>
                </div>
            </div>
            
            {/* Footer */}
            <div className="p-4 flex justify-center items-center gap-5 italic text-xs opacity-50">
                <p>
                    © Since 2024 - STMIK Bandung
                </p>
            </div>
        </div>
    )
}

function SidebarContent({ showSidebar, setShowSidebar, mobile = false, role, menuFor = (...args) => {}, token }) {
    
    const { pathname } = useLocation()

    const { userdata, loadingUserdata } = useUser() 
    const { goTo, showAnimation } = useRedirect()
    const { showBackdrop, setShowBackdrop } = useBackdrop()

    const aksi = {
        logout: () => {
            setShowBackdrop(true)
            goTo('/logout')
        },
        changeRole: (target_role) => {
            setShowBackdrop(true)
            goTo(`/?token=${token}&role=${target_role}`)
        }
    }

    return (
        <>
            {/* <div className={`${mobile ? 'py-4' : 'py-4'} font-jakarta `}>
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
            </div> */}
            <hr className="my-2 opacity-0" />
            <div className="space-y-4">
                <div className="space-y-1">
                    <div className="flex gap-4 justify-between">
                        <div className="">
                            <p className="text-xs font-semibold opacity-50">
                                Selamat Datang,
                            </p>
                            <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                                <p className="font-semibold text-blue-600 text-sm">
                                    {userdata?.profile?.nama || 'Loading..'}
                                </p>
                            </CustomLoading>
                        </div>
                        {mobile && (
                            <IconButton onClick={() => setShowSidebar(state => !state)}>
                                <MenuOutlined fontSize="small" />
                            </IconButton>
                        )}
                    </div>
                    <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                        <p className="px-2 py-0.5 rounded w-fit bg-blue-700/80 text-white text-xs font-medium tracking-tighter">
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
                    </CustomLoading>
                </div>
                {!role?.mahasiswa?.enable && (
                    <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                        <CustomDropdown 
                            buttonComponent={(
                                <Button startIcon={<ChangeCircleOutlined />} variant="contained" size="small" fullWidth>
                                    <p className="font-jakarta text-xs font-bold">
                                        ubah role
                                    </p>
                                </Button>
                            )}
                            menuItems={[
                                {
                                    label: 'Admin',
                                    render: userdata?.account?.is_admin,
                                    onClick: () => aksi.changeRole('is_admin')
                                },
                                {
                                    label: 'Prodi',
                                    render: userdata?.account?.is_prodi,
                                    onClick: () => aksi.changeRole('is_prodi')
                                },
                                {
                                    label: 'Dosen Wali',
                                    render: userdata?.account?.is_doswal,
                                    onClick: () => aksi.changeRole('is_doswal')
                                },
                                {
                                    label: 'Dosen',
                                    render: userdata?.account?.is_dosen,
                                    onClick: () => aksi.changeRole('is_dosen')
                                }
                            ]}
                        />
                    </CustomLoading>
                )}
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
                                        KRS
                                    </p>
                                </button>
                            </div>
                        </div>
                    )}
                    {menuFor('Mahasiswa', 'Dosen Wali', 'Dosen') && (
                        <div className="relative overflow-visible w-full">
                            <div className={`absolute top-0 left-0 w-2 rounded-md h-full bg-blue-500 ${pathname.startsWith('/surat') ? 'opacity-100' : 'opacity-0'}`}></div>
                            <div className="px-5">
                                <button onClick={() => goTo('/surat')} disabled={pathname.startsWith('/surat')} className={`p-2 w-full rounded-md ${pathname.startsWith('/surat') ? 'border border-zinc-300 bg-white' : 'hover:bg-zinc-200 ease-out duration-100'} flex items-center gap-3 `}>
                                    <MailTwoTone color={pathname.startsWith('/surat') ? 'primary' : ''} fontSize="small" />
                                    <p className="font-medium">
                                        Surat
                                    </p>
                                </button>
                            </div>
                        </div>
                    )}
                    {/* {menuFor('Prodi') && (
                        <div className="relative overflow-visible w-full">
                            <div className={`absolute top-0 left-0 w-2 rounded-md h-full bg-blue-500 ${pathname.startsWith('/rekap') ? 'opacity-100' : 'opacity-0'}`}></div>
                            <div className="px-5">
                                <button onClick={() => goTo('/rekap')} disabled={pathname.startsWith('/rekap')} className={`p-2 w-full rounded-md ${pathname.startsWith('/rekap') ? 'border border-zinc-300 bg-white' : 'hover:bg-zinc-200 ease-out duration-100'} flex items-center gap-3 `}>
                                    <MailTwoTone color={pathname.startsWith('/rekap') ? 'primary' : ''} fontSize="small" />
                                    <p className="font-medium">
                                        Rekap Presensi
                                    </p>
                                </button>
                            </div>
                        </div>
                    )} */}
                    {menuFor('Mahasiswa', 'Dosen') && (
                        <div className="relative overflow-visible w-full">
                            <div className={`absolute top-0 left-0 w-2 rounded-md h-full bg-blue-500 ${pathname === '/jadwal' ? 'opacity-100' : 'opacity-0'}`}></div>
                            <div className="px-5">
                                <button onClick={() => goTo('/jadwal')} disabled={pathname === '/jadwal'} className={`p-2 w-full rounded-md ${pathname === '/jadwal' ? 'border border-zinc-300 bg-white' : 'hover:bg-zinc-200 ease-out duration-100'} flex items-center gap-3 `}>
                                    <CalendarMonthOutlined color={pathname === '/jadwal' ? 'primary' : ''} fontSize="small" />
                                    <p className="font-medium">
                                        Jadwal
                                    </p>
                                </button>
                            </div>
                        </div>
                    )}
                    {/* {menuFor('Prodi') && (
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
                    )} */}
                </div>
            </CustomLoading>
            <hr className="my-5 border-zinc-400" />
            <p className="font-medium opacity-60 text-xs px-5">
                Pengaturan
            </p>
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
        </>
    )
}