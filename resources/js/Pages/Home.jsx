import {
    AccessTimeOutlined,
    AccountBalanceWalletTwoTone,
    Add,
    AppsTwoTone,
    ArrowRight,
    ArrowRightAlt,
    AssignmentOutlined,
    AssignmentTwoTone,
    AutoGraphOutlined,
    BookmarksTwoTone,
    BookTwoTone,
    CalendarMonthOutlined,
    CampaignTwoTone,
    ChatBubbleTwoTone,
    ChatTwoTone,
    Check,
    CheckBoxOutlineBlankTwoTone,
    CheckBoxTwoTone,
    Close,
    CollectionsBookmarkOutlined,
    DashboardTwoTone,
    Delete,
    Download,
    East,
    EastOutlined,
    EastTwoTone,
    EmergencyShareTwoTone,
    FingerprintOutlined,
    HowToRegTwoTone,
    Image,
    IndeterminateCheckBoxTwoTone,
    InfoOutlined,
    KeyboardDoubleArrowRightOutlined,
    LocationOnOutlined,
    LogoutTwoTone,
    MenuBookTwoTone,
    MenuOutlined,
    NotificationImportantTwoTone,
    NotificationsTwoTone,
    PaymentsTwoTone,
    PeopleAltTwoTone,
    PersonOutline,
    Refresh,
    RefreshOutlined,
    Remove,
    Save,
    SaveOutlined,
    SchoolTwoTone,
    SearchOutlined,
    SendOutlined,
    SubjectOutlined,
    Upload,
    VisibilityOutlined,
    WalletTwoTone,
    Warning,
} from "@mui/icons-material";
import {
    Avatar,
    Badge,
    Button,
    Checkbox,
    CircularProgress,
    Fade,
    IconButton,
    TextField,
    Tooltip,
} from "@mui/material";
import MainLayout, { MainLayout2 } from "../layouts/MainLayout";
import { useSidebar } from "../context/SidebarContext";
import { useEffect, useRef, useState } from "react";
import { useUser } from "../context/UserContext";
import { customSwal } from "../components/CustomSwal";
import api_handler from "../libs/api_handler";
import CustomLoading from "../components/CustomLoading";
import CustomGradientAreaChart from "../components/Charts/CustomGradientAreaChart";
import { CustomTabItem, CustomTabs } from "../components/CustomTabs";
import dayjs from "dayjs";
import "dayjs/locale/id";
import Modal, { modal, ModalForm } from "../components/Modal";
import { QRMaker } from "../components/CustomQRCode";
import CustomDataTable from "../components/CustomDataTable";
import CustomUpload from "../components/CustomUpload";
import { CustomControlledTextEditor, CustomTextEditor } from "../components/CustomTextEditor";
import DOMPurify from "isomorphic-dompurify";
import CustomSelectAjax from "../components/CustomSelectAjax";
import CustomSelect from "../components/CustomSelect";
import { DatePicker } from "@mui/x-date-pickers";
import BlurText from "../components/react-bits/src/blocks/TextAnimations/BlurText/BlurText";
import ShinyText from "../components/react-bits/src/blocks/TextAnimations/ShinyText/ShinyText";
import { useBackdrop } from "../context/BackdropContext";
import { MaterialIcons } from "../components/MaterialIcons";
import { da } from "@faker-js/faker";
import ScrollReveal from "../components/react-bits/src/blocks/TextAnimations/ScrollReveal/ScrollReveal";

export default function Home({ token, base_url, role, app, apps }) {

    const { showBackdrop, setShowBackdrop } = useBackdrop()

    // if (role.mahasiswa.enable) {
    //     return <MahasiswaPage token={token} base_url={base_url} role={role} app={app} />;
    // }

    // if (role.dosen.enable) {
    //     return <DosenPage token={token} base_url={base_url} role={role} app={app} />;
    // }

    // if (role.dosen_wali.enable) {
    //     return <DosenWaliPage token={token} base_url={base_url} role={role} app={app} />;
    // }

    // if (role.admin.enable) {
    //     return <AdminPage token={token} base_url={base_url} role={role} app={app} />;
    // }

    // if(role?.prodi?.enable) {
    //     return <ProdiPage token={token} base_url={base_url} role={role} app={app} />
    // }

    const [listData, setListData] = useState({
        pengumuman: {
            data: [],
            meta: null,
            loading: {
                fetch: false,
                refresh: false
            }
        },
        user_sites: {
            data: [],
            loading: false
        }
    })

    const aksi = {
        pengumuman: {
            get: async () => {
                try {
                    aksi.pengumuman.loading('fetch')

                    const response = await api_handler.get({
                        base_url,
                        token,
                        url: role?.mahasiswa?.enable 
                            ? 'pengumuman/mahasiswa/list'
                            : role?.dosen?.enable
                                ? 'pengumuman/dosen/list'
                                : role?.admin?.enable
                                    ? 'pengumuman/admin/list'
                                    : 'pengumuman/public/list'
                    })

                    aksi.pengumuman.loading('fetch')

                    console.log(response)

                    if(response?.success) {
                        aksi.pengumuman.set('data', response?.data?.list_pengumuman)
                    }else{
                        customSwal.toast.error({
                            message: response?.message
                        })
                    }
                } catch (error) {
                    customSwal.toast.error({
                        message: error?.message
                    })
                }
            },
            set: (column, value) => {
                setListData(state => ({
                    ...state,
                    pengumuman: {
                        ...state.pengumuman,
                        [column]: value
                    }
                }))
            },
            loading: (column) => {
                setListData(state => ({
                    ...state,
                    pengumuman: {
                        ...state.pengumuman,
                        loading: {
                            ...state.pengumuman.loading,
                            [column]: !state.pengumuman.loading[column]
                        }
                    }
                }))
            },
            refresh: async () => {
                try {
                    aksi.pengumuman.loading('refresh')

                    const response = await api_handler.get({
                        base_url,
                        token,
                        url: 'pengumuman/dosen/list'
                    })

                    aksi.pengumuman.loading('refresh')

                    if(response?.success) {
                        aksi.pengumuman.set('data', response?.data?.list_pengumuman)
                    }else{
                        customSwal.toast.error({
                            message: response?.message
                        })
                    }
                } catch (error) {
                    customSwal.toast.error({
                        message: error?.message
                    })
                }
            },
            terkini: {
                admin: () => {
                    return listData.pengumuman.data
                        .filter(item => item?.target === 0)
                        .filter(item => 
                            dayjs(item?.tgl_dikirim).isAfter(dayjs().subtract(7, 'day'))
                        )
                },
                matakuliah: () => {
                    return listData.pengumuman.data
                        .filter(item => item?.target !== 0)
                        .filter(item => 
                            dayjs(item?.tgl_dikirim).isAfter(dayjs().subtract(7, 'day'))
                        )
                }
            }
        },
        user_sites: {
            get: async () => {
                try {
                    aksi.user_sites.loading('fetch')

                    const response = await api_handler.get({
                        base_url,
                        token,
                        url: 'sso/sites/user-access'
                    })

                    aksi.user_sites.loading('fetch')

                    console.log(response)

                    if(response?.success) {
                        aksi.user_sites.set('data', response?.data?.user_sites)
                    }else{
                        customSwal.toast.error({
                            message: response?.message
                        })
                    }
                } catch (error) {
                    customSwal.toast.error({
                        message: error?.message
                    })
                }
            },
            set: (column, value) => {
                setListData(state => ({
                    ...state,
                    user_sites: {
                        ...state.user_sites,
                        [column]: value
                    }
                }))
            },
            loading: (column) => {
                setListData(state => ({
                    ...state,
                    user_sites: {
                        ...state.user_sites,
                        loading: {
                            ...state.user_sites.loading,
                            [column]: !state.user_sites.loading[column]
                        }
                    }
                }))
            },
        },
        navigate: (url) => {
            setShowBackdrop(true)
            window.location.href = url
        }
    }

    useEffect(() => {
        (async () => {
            Promise.all([
                aksi.pengumuman.get(),
                aksi.user_sites.get()
            ])
        })();
    }, []);

    return (
        <div className="w-full min-h-screen bg-zinc-100 font-jakarta">
            
            <div className=" bg-gradient-to-l from-violet-700  to-blue-500 text-white">

                {/* Navbar */}
                <div className="flex items-center justify-between w-full p-4">
                    <div className="hidden sm:flex items-center gap-4">
                        <div className="w-16 aspect-square border rounded-2xl border-white/50 shadow-white/30 bg-white/30 flex items-center shadow-md justify-center">
                            <SchoolTwoTone fontSize="large"  className="text-white" />
                        </div>
                        <div className="">
                            <h1 className="text-2xl font-extrabold tracking-tighter">
                                SIMAK
                            </h1>
                            <p>
                                Sistem Informasi Manajemen Akademik dan Keuangan
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-fit">
                        <button type="button" onClick={() => aksi.navigate("/dashboard")} className="w-full grow sm:w-fit px-4 py-2 rounded-lg border border-white/50 bg-white/20 hover:bg-white/30 shadow-md font-medium tracking-tighter flex items-center justify-center gap-4 cursor-pointer active:bg-white/50 ease-out duration-100">
                            <DashboardTwoTone fontSize="small" />
                            Dashboard
                        </button>
                        <button type="button" onClick={() => aksi.navigate("/logout")} className="w-full grow sm:w-fit px-4 py-2 rounded-lg border border-white/50  shadow-md font-medium tracking-tighter flex items-center justify-center gap-4 cursor-pointer active:bg-white/30 ease-out duration-100">
                            <LogoutTwoTone fontSize="small" />
                            Keluar
                        </button>
                    </div>
                </div>

                {aksi.pengumuman.terkini.admin().length > 0 && (
                    <hr className="py-10 opacity-0" />
                )}

            </div>

            <div className="px-4" >
                <div className="flex justify-center">
                    <div className={`w-full max-w-screen-2xl ${aksi.pengumuman.terkini.admin().length > 0 && '-translate-y-12'}`}>

                        {/* Notifikasi Pengumuman Penting */}
                        {aksi.pengumuman.terkini.admin().length > 0 ? (
                            <>
                                <div className="flex justify-center">
                                    <div className="max-w-2xl w-full">
                                        <div className="relative bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 rounded-2xl p-1 mb-8 shadow-2xl z-[50] ">
                                            <div className="bg-white rounded-xl p-6 relative overflow-hidden">
                                                <div className="absolute bottom-0 left-0 w-full z-[1] flex justify-center translate-y-16">
                                                    {/* <div className="w-60 h-60 rounded-full bg-gradient-to-br from-red-500 to-violet-500 blur-[150px]"></div> */}
                                                </div>
                                                <div className="flex items-center flex-col justify-center space-y-4 mb-4 relative z-[2]">
                                                    <div className="relative">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                                                            <NotificationsTwoTone className="w-6 h-6 text-white" />
                                                        </div>
                                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full"></div>
                                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full animate-ping"></div>
                                                    </div>
                                                    <div className="text-center space-y-2">
                                                        <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                                                            Pengumuman Penting!
                                                        </h2>
                                                        <p className="text-gray-600 italic font-medium sm:text-lg">
                                                            Perhatian, terdapat pengumuman informasi terbaru untuk seluruh sivitas akademika!
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-center relative z-[2]">
                                                    <Badge onClick={() => window.location.href = "#pengumuman"} className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full font-semibold cursor-pointer hover:opacity-80">
                                                        {aksi.pengumuman.terkini.admin().length} Pengumuman Baru
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <hr className="my-8 opacity-0" />
                            </>
                        ):(
                            <hr className="my-8 opacity-0" />
                        )}

                        

                        {/* <hr className="my-8 opacity-0" /> */}

                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 ">
                                <div className="w-10 aspect-square bg-gradient-to-br from-blue-500 to-pink-500 rounded-xl flex items-center justify-center">
                                    <AppsTwoTone className="text-white" />
                                </div>
                                <h1 className="font-medium tracking-tighter text-3xl opacity-80">
                                    Aplikasi Tersedia
                                </h1>
                            </div>
                            <div className="flex items-center justify-center">
                                <div className="p-0.5 rounded-full w-1/3 bg-gradient-to-r from-blue-500 to-pink-500 "></div>
                            </div>
                            <div className="flex justify-center items-center gap-4  text-center">
                                <p className="italic opacity-70">
                                    Akses layanan akademik lainnya dalam
                                    <br />
                                    satu platform yang terintegrasi
                                </p>
                            </div>
                        </div>

                        <hr className="my-8 opacity-0" />

                        <div className="flex justify-center">
                            <div className="max-w-5xl w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

                                {apps?.map((item) => (
                                    <div key={item['label']} className="p-4 bg-white rounded-xl  group hover:shadow-md ease-out duration-300 hover:-translate-y-1">
                                        <div className="flex flex-col justify-between h-full gap-4">
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <div className={`w-10 group-hover:scale-110 aspect-square ease-out duration-300 flex items-center justify-center bg-blue-700 relative overflow-hidden rounded-lg`}>
                                                        <div className="absolute -top-2 -left-2 bg-blue-100 w-8 aspect-square rounded-full blur-lg z-10"></div>
                                                        <div className="relative z-50">
                                                            {/* <PaymentsTwoTone className="text-white" /> */}
                                                            <MaterialIcons icon={item['icon']} className="text-white" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <h1 className={`text-xl font-semibold opacity-80 group-hover:text-blue-500 ease-out duration-300`}>
                                                    {item['name']}
                                                </h1>
                                                <p>
                                                    {item['deskripsi']}
                                                </p>
                                            </div>
                                            <button type="button" onClick={() => window.open(item['label'] === 'pembelajaran' ? '/dashboard' : app[item['label']], '_blank')} className={`flex items-center justify-center gap-4 border shadow border-zinc-300 hover:border-blue-500 hover:bg-blue-100/50 hover:text-blue-500 w-full px-3 py-2 rounded-full ease-out duration-300 cursor-pointer text-zinc-500 hover:shadow-md active:scale-95`}>
                                                Buka Aplikasi
                                                {/* <EastTwoTone fontSize="small" /> */}
                                                <MaterialIcons icon={'EastTwoTone'} fontSize="small" />
                                            </button>
                                        </div>
                                    </div>
                                ))}



                            </div>
                        </div>

                        <hr className="my-8 opacity-0" />

                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 ">
                                <div className="w-10 aspect-square bg-gradient-to-br from-blue-500 to-pink-500 rounded-xl flex items-center justify-center">
                                    <NotificationsTwoTone className="text-white" />
                                </div>
                                <h1 className="font-medium tracking-tighter text-3xl opacity-80">
                                    Pengumuman Terkini
                                </h1>
                            </div>
                            <div className="flex items-center justify-center">
                                <div className="p-0.5 rounded-full w-1/3 bg-gradient-to-r from-blue-500 to-pink-500 "></div>
                            </div>
                        </div>

                        <hr className="my-8 opacity-0" />

                        <div className="flex justify-center w-full" id="pengumuman">
                            <div className="max-w-5xl w-full">
                                <div className={`grid ${role?.mahasiswa?.enable || role?.dosen?.enable || role?.admin?.enable ? 'grid-cols-1 lg:grid-cols-2' : ' grid-cols-1'} gap-4 relative w-full`}>
                                    <div className={`sm:sticky top-24 space-y-4 h-fit `}>
                                        <CustomLoading 
                                            loading={listData.pengumuman.loading.fetch} 
                                            sketch={(
                                                <>
                                                    <div className="w-full h-40"></div>
                                                </>
                                            )}
                                        >
                                            {aksi.pengumuman.terkini.admin().length > 0 ? (
                                                <>
                                                    {aksi.pengumuman.terkini.admin().map(item => (
                                                        <div key={item?.pengumuman_id} className=" overflow-hidden relative rounded-xl shadow-xl  border-red-600 border">
                                                            <div className="p-1 bg-gradient-to-r from-red-600 to-orange-600"></div>
                                                            <div className="p-4 bg-white">
                                                                <div className="space-y-4">

                                                                    <div className="flex justify-between ">
                                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                                                            <div className="w-10 aspect-square rounded-lg bg-gradient-to-br from-red-500/80 to-yellow-500/80 flex items-center justify-center text-white">
                                                                                <EmergencyShareTwoTone fontSize="small" />
                                                                            </div>
                                                                            <div className=" items-center gap-4 hidden sm:flex">
                                                                                <Avatar 
                                                                                    src={item?.avatar_pengirim}
                                                                                />
                                                                                <p className="font-semibold opacity-80">
                                                                                    {item?.nm_pengirim}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex gap-4 translate-y-2">
                                                                            <p className="font-bold text-red-400 w-fit px-3 py-1 rounded-full border bg-red-500/10 text-xs tracking-tighter h-fit ">
                                                                                Penting
                                                                            </p>
                                                                            <p className="font-bold text-white w-fit px-3 py-1 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-xs tracking-tighter h-fit ">
                                                                                Admin
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className=" items-center gap-4 flex sm:hidden">
                                                                        <Avatar 
                                                                            src={item?.avatar_pengirim}
                                                                        />
                                                                        <p className="font-semibold opacity-80">
                                                                            {item?.nm_pengirim}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <hr className="my-2 opacity-0" />
                                                                <div className=""dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item?.message)}}></div>
                                                                {item?.image && (
                                                                    <>
                                                                        <hr className="my-2 opacity-0" />
                                                                        <img className="aspect-video object-cover object-center w-full" src={item?.image} alt="" />
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </>
                                            ):(
                                                <div className="flex flex-col items-center gap-4 justify-center h-40 italic opacity-50 text-center">
                                                    <Close fontSize="small" />
                                                    Saat ini, belum ada pengumuman dari admin.
                                                </div>
                                            )}
                                        </CustomLoading>
                                    </div>
                                    {(role?.mahasiswa?.enable || role?.dosen?.enable || role?.admin?.enable) && (
                                        <div className="space-y-4">
                                            <CustomLoading 
                                                loading={listData.pengumuman.loading.fetch}
                                                sketch={(
                                                    <>
                                                        <div className="w-full h-40"></div>
                                                    </>
                                                )}
                                            >
                                                {aksi.pengumuman.terkini.matakuliah().length > 0 ? (
                                                    <>
                                                        {aksi.pengumuman.terkini.matakuliah().map(item => (
                                                            <div key={item?.pengumuman_id} className=" overflow-hidden relative rounded-xl shadow-xl  border-blue-600 border">
                                                                <div className="p-1 bg-gradient-to-r from-blue-600 to-cyan-600"></div>
                                                                <div className="p-4 bg-white">
                                                                    <div className="space-y-4">

                                                                        <div className="flex justify-between ">
                                                                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                                                                <div className="w-10 aspect-square rounded-lg bg-gradient-to-br from-blue-500/80 to-cyan-500/80 flex items-center justify-center text-white">
                                                                                    <NotificationImportantTwoTone fontSize="small" />
                                                                                </div>
                                                                                <div className=" items-center gap-4 hidden sm:flex">
                                                                                    <Avatar 
                                                                                        src={item?.avatar_pengirim}
                                                                                    />
                                                                                    <p className="font-semibold opacity-80">
                                                                                        {item?.nm_pengirim}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex gap-4 translate-y-2 items-center">
                                                                                <p className="font-bold text-blue-400 w-fit text-center px-3 py-1 rounded-full border bg-blue-500/10 text-xs tracking-tighter h-fit ">
                                                                                    {item?.matakuliah}
                                                                                </p>
                                                                                <p className="font-bold text-white w-fit px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-xs tracking-tighter h-fit ">
                                                                                    Dosen
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <div className=" items-center gap-4 flex sm:hidden">
                                                                            <Avatar 
                                                                                src={item?.avatar_pengirim}
                                                                            />
                                                                            <p className="font-semibold opacity-80">
                                                                                {item?.nm_pengirim}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <hr className="my-2 opacity-0" />
                                                                    <p>
                                                                        {item?.message}
                                                                    </p>
                                                                    {item?.image && (
                                                                        <>
                                                                            <hr className="my-2 opacity-0" />
                                                                            <img className=" object-cover object-center w-full" src={item?.image} alt="" />
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </>
                                                ):(
                                                    <div className="flex flex-col items-center gap-4 justify-center h-40 italic opacity-50 text-center">
                                                        <Close fontSize="small" />
                                                        Saat ini, belum ada pengumuman dari dosen pengajar mata kuliah anda.
                                                    </div>
                                                )}
                                            </CustomLoading>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 text-white">
                <div className="p-4 flex justify-center items-center gap-5 italic text-xs">
                    <div className="w-full flex flex-col sm:flex-row sm:justify-between items-center gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-4">
                                <img src="/images/stmik.png" className="w-12" />
                                <div className="">
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold tracking-tight text-sm text-blue-200">
                                            SIMAK
                                        </p>
                                        <p>
                                            //
                                        </p>
                                        <p className="font-bold tracking-tight text-sm text-blue-200">
                                            STMIK Bandung
                                        </p>
                                    </div>
                                    <p className="opacity-70">
                                        Sistem Informasi Manajemen Akademik
                                    </p>
                                </div>
                            </div>
                            
                        </div>
                        <div className="w-full sm:w-fit opacity-70">
                            <p>© Since 2024 - STMIK Bandung</p>
                        </div>
                        <div className="w-full sm:w-fit">
                            <div className="flex items-start sm:items-center gap-6 flex-col sm:flex-row">
                                <a href="/report" className="hover:text-blue-300 hover:underline w-fit cursor-pointer">
                                    Laporkan Bug
                                </a>
                                <p className="text-xs opacity-50 hidden sm:block">//</p>
                                <a href="https://stmik-bandung.ac.id" target="_blank" className="hover:text-blue-300 hover:underline w-fit cursor-pointer">
                                    Web Utama
                                </a>
                                <p className="text-xs opacity-50 hidden sm:block">//</p>
                                <a href="/update" className="hover:text-blue-300 hover:underline w-fit cursor-pointer">
                                    Updates & Patches
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    )
}
