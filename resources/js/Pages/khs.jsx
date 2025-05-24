import { Button, IconButton } from "@mui/material"
import { useRedirect } from "../context/RedirectContext"
import { useSidebar } from "../context/SidebarContext"
import { AssignmentOutlined, AutoGraphOutlined, East, MenuOutlined, StickyNote2Outlined } from "@mui/icons-material"
import MainLayout from "../layouts/MainLayout"
import { useEffect, useState } from "react"
import { customSwal } from "../components/CustomSwal"
import api_handler from "../libs/api_handler"
import CustomLoading from "../components/CustomLoading"
import { useUser } from "../context/UserContext"


export default function KHS({ token, base_url, role }) {

    const { setShowSidebar } = useSidebar()
    const { goTo } = useRedirect()
    const { userdata, loadingUserdata } = useUser() 

    const [listData, setListData] = useState({
        khs: {
            data: null,
            loading: false
        }
    })

    const aksi = {
        khs: {
            get: async () => {
                try {
                    aksi.khs.set('loading', true)

                    const response = await api_handler.get({
                        base_url,
                        token,
                        url: 'krs/ip/semester'
                    })

                    aksi.khs.set('loading', false)

                    if(response.success) {
                        aksi.khs.set('data', response?.data)
                    }else{
                        aksi.khs.set('data', null)
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
                    khs: {
                        ...state.khs,
                        [column]: value
                    }
                }))
            }
        }
    }

    useEffect(() => {
        aksi.khs.get()
    }, [])

    return (
        <MainLayout token={token} base_url={base_url} role={role}>
            <div className={`bg-white w-full rounded-lg border border-zinc-300 shadow-md `}>
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
                                    Kartu Hasil Studi
                                </h1>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    
                    
                    <div className="p-4">
                        <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <CustomLoading loading={listData.khs.loading} renderIf={listData.khs.data}>
                                        <div className="px-4 py-3 rounded-md border border-zinc-300 flex items-center gap-4 shadow">
                                            <div className="w-10 h-10 rounded-md border  flex items-center justify-center border-zinc-300">
                                                <AssignmentOutlined fontSize="small" color="primary" />
                                            </div>
                                            <div className="-space-y-1">
                                                <h1 className="font-light">
                                                    SKS Tempuh
                                                </h1>
                                                <p className="text-lg lg:text-xl">
                                                    {listData.khs.data?.total_sks}
                                                </p>
                                            </div>
                                        </div>
                                    </CustomLoading>
                                    <CustomLoading loading={listData.khs.loading} renderIf={listData.khs.data}>
                                        <div className="px-4 py-3 rounded-md border border-zinc-300 flex items-center gap-4 shadow">
                                            <div className="w-10 h-10 rounded-md border  flex items-center justify-center border-zinc-300">
                                                <AutoGraphOutlined fontSize="small" color="primary" />
                                            </div>
                                            <div className="-space-y-1">
                                                <h1 className="font-light">
                                                    Indeks Prestasi Kumulatif
                                                </h1>
                                                <p className="text-lg lg:text-xl">
                                                    {parseFloat(listData.khs.data?.total_semua_ip.toFixed(2))}
                                                </p>
                                            </div>
                                        </div>
                                    </CustomLoading>
                                </div>
                                <CustomLoading loading={listData.khs.loading} renderIf={listData.khs.data}>
                                    <div className="flex items-center justify-around flex-wrap text-xs">
                                        <div className="flex items-center border  rounded-md shadow space-x overflow-hidden relative border-green-600">
                                            <div className="w-6 h-6 bg-green-600 text-white flex items-center justify-center font-semibold">
                                                A
                                            </div>
                                            <div className="w-6 h-6 flex items-center justify-center font-medium">
                                                {listData.khs.data?.total_nilai_a}
                                            </div>
                                        </div>
                                        <div className="flex items-center border  rounded-md shadow space-x overflow-hidden relative border-blue-600">
                                            <div className="w-6 h-6 bg-blue-600 text-white flex items-center justify-center font-semibold">
                                                B
                                            </div>
                                            <div className="w-6 h-6 flex items-center justify-center font-medium">
                                                {listData.khs.data?.total_nilai_b}
                                            </div>
                                        </div>
                                        <div className="flex items-center border  rounded-md shadow space-x overflow-hidden relative border-yellow-600">
                                            <div className="w-6 h-6 bg-yellow-600 text-white flex items-center justify-center font-semibold">
                                                C
                                            </div>
                                            <div className="w-6 h-6 flex items-center justify-center font-medium">
                                                {listData.khs.data?.total_nilai_c}
                                            </div>
                                        </div>
                                        <div className="flex items-center border  rounded-md shadow space-x overflow-hidden relative border-orange-600">
                                            <div className="w-6 h-6 bg-orange-600 text-white flex items-center justify-center font-semibold">
                                                D
                                            </div>
                                            <div className="w-6 h-6 flex items-center justify-center font-medium">
                                                {listData.khs.data?.total_nilai_d}
                                            </div>
                                        </div>
                                        <div className="flex items-center border  rounded-md shadow space-x overflow-hidden relative border-red-600">
                                            <div className="w-6 h-6 bg-red-600 text-white flex items-center justify-center font-semibold">
                                                E
                                            </div>
                                            <div className="w-6 h-6 flex items-center justify-center font-medium">
                                                {listData.khs.data?.total_nilai_e}
                                            </div>
                                        </div>
                                    </div>
                                </CustomLoading>
                                
                            </div>
                        </CustomLoading>
                    </div>

                    <div className="p-4">
                        <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <CustomLoading loading={listData.khs.loading} renderIf={listData.khs.data}>
                                    {listData.khs.data?.ip_per_semester?.map(item => (
                                        <div key={item['semester']} className="border border-zinc-300 rounded-md shadow divide-y divide-zinc-300">
                                            <div className="px-4 py-3">
                                                <div className="flex items-center justify-between">
                                                    <h1 className="text-lg font-medium opacity-80">
                                                        Semester {item['semester']}
                                                    </h1>
                                                    <Button onClick={() => goTo(`/khs/semester/${item['semester']}`)} color="primary" size="small" endIcon={<East fontSize="small" />}>
                                                        <p className={`font-jakarta text-xs`}>
                                                            Lihat
                                                        </p>
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <div className="flex items-center lg:justify-center justify-around lg:gap-2 flex-wrap text-xs">
                                                    {item['total_nilai_a'] > 0 && (
                                                        <div className="flex items-center border  rounded-md shadow space-x overflow-hidden relative border-green-600">
                                                            <div className="w-6 h-6 bg-green-600 text-white flex items-center justify-center font-semibold">
                                                                A
                                                            </div>
                                                            <div className="w-6 h-6 flex items-center justify-center font-medium">
                                                                {item['total_nilai_a']}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {item['total_nilai_b'] > 0 && (
                                                        <div className="flex items-center border  rounded-md shadow space-x overflow-hidden relative border-blue-600">
                                                            <div className="w-6 h-6 bg-blue-600 text-white flex items-center justify-center font-semibold">
                                                                B
                                                            </div>
                                                            <div className="w-6 h-6 flex items-center justify-center font-medium">
                                                                {item['total_nilai_b']}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {item['total_nilai_c'] > 0 && (
                                                        <div className="flex items-center border  rounded-md shadow space-x overflow-hidden relative border-amber-600">
                                                            <div className="w-6 h-6 bg-amber-600 text-white flex items-center justify-center font-semibold">
                                                                C
                                                            </div>
                                                            <div className="w-6 h-6 flex items-center justify-center font-medium">
                                                                {item['total_nilai_c']}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {item['total_nilai_d'] > 0 && (
                                                        <div className="flex items-center border  rounded-md shadow space-x overflow-hidden relative border-orange-600">
                                                            <div className="w-6 h-6 bg-orange-600 text-white flex items-center justify-center font-semibold">
                                                                D
                                                            </div>
                                                            <div className="w-6 h-6 flex items-center justify-center font-medium">
                                                                {item['total_nilai_d']}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {item['total_nilai_e'] > 0 && (
                                                        <div className="flex items-center border  rounded-md shadow space-x overflow-hidden relative border-red-600">
                                                            <div className="w-6 h-6 bg-red-600 text-white flex items-center justify-center font-semibold">
                                                                E
                                                            </div>
                                                            <div className="w-6 h-6 flex items-center justify-center font-medium">
                                                                {item['total_nilai_e']}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="p-4 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <AutoGraphOutlined fontSize="small" color="primary" />
                                                        <p className="font-light">
                                                            Indeks Prestasi Semester
                                                        </p>
                                                    </div>
                                                    <p className="font-medium">
                                                        {parseFloat(item['total_ip'].toFixed(2))}
                                                    </p>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <StickyNote2Outlined fontSize="small" color="primary" />
                                                        <p className="font-light">
                                                            Jumlah SKS
                                                        </p>
                                                    </div>
                                                    <p className="font-medium">
                                                        {item['total_sks']}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </CustomLoading>
                            </div>
                        </CustomLoading>
                    </div>

                </div>
            </div>
        </MainLayout>
    )
}
