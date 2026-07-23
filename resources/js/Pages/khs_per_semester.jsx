import { useSidebar } from "../context/SidebarContext"
import { useRedirect } from "../context/RedirectContext"
import MainLayout from "../layouts/MainLayout"
import { Button, IconButton } from "@mui/material"
import { DownloadOutlined, MenuOutlined, West } from "@mui/icons-material"
import CustomDataTable from "../components/CustomDataTable"
import CustomLoading from "../components/CustomLoading"
import { useUser } from "../context/UserContext"
import { useEffect, useState } from "react"
import api_handler from "../libs/api_handler"
import { customSwal } from "../components/CustomSwal"


export default function KHSPerSemester({ semester, token, base_url, role }) {
    const { setShowSidebar } = useSidebar()
    const { goTo, showAnimation } = useRedirect()
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
                        url: `krs/ip/semester?s=${semester}`
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
                                    Kartu Hasil Studi
                                </h1>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center gap-4">
                                <IconButton color="primary" onClick={() => goTo('/khs')}>
                                    <West fontSize="small" />
                                </IconButton>
                                <h1 className=" text-lg">
                                    Semester {semester}
                                </h1>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <Button
                                    size="small"
                                    variant="outlined"
                                    disabled={listData.khs.loading || !listData.khs.data?.matakuliah?.length}
                                    onClick={() => window.open(`/khs/preview/semester/${semester}`, '_blank', 'noopener,noreferrer')}
                                >
                                    <p className="font-jakarta text-xs">Preview</p>
                                </Button>
                                <Button
                                    size="small"
                                    variant="contained"
                                    startIcon={<DownloadOutlined fontSize="small" />}
                                    disabled={listData.khs.loading || !listData.khs.data?.matakuliah?.length}
                                    onClick={() => window.open(`/khs/download/semester/${semester}`, '_blank', 'noopener,noreferrer')}
                                >
                                    <p className="font-jakarta text-xs">Unduh PDF</p>
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 space-y-8">
                        <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                            <div className="space-y-3">
                                <p className="font-medium">
                                    Daftar Nilai Kumulatif
                                </p>
                                <div className="w-full sm:w-2/3 lg:w-1/3">
                                    <CustomLoading loading={listData.khs.loading} renderIf={listData.khs.data}>
                                        <div className="flex items-center gap-3 flex-wrap text-xs">
                                            <div className="flex items-center border rounded-md shadow space-x overflow-hidden relative border-green-600">
                                                <div className="w-6 h-6 bg-green-600 text-white flex items-center justify-center font-semibold">
                                                    A
                                                </div>
                                                <div className="w-6 h-6 flex items-center justify-center font-medium">
                                                    {listData.khs.data?.total_nilai_a}
                                                </div>
                                            </div>
                                            <div className="flex items-center border rounded-md shadow space-x overflow-hidden relative border-blue-600">
                                                <div className="w-6 h-6 bg-blue-600 text-white flex items-center justify-center font-semibold">
                                                    B
                                                </div>
                                                <div className="w-6 h-6 flex items-center justify-center font-medium">
                                                    {listData.khs.data?.total_nilai_b}
                                                </div>
                                            </div>
                                            <div className="flex items-center border rounded-md shadow space-x overflow-hidden relative border-yellow-600">
                                                <div className="w-6 h-6 bg-yellow-600 text-white flex items-center justify-center font-semibold">
                                                    C
                                                </div>
                                                <div className="w-6 h-6 flex items-center justify-center font-medium">
                                                    {listData.khs.data?.total_nilai_c}
                                                </div>
                                            </div>
                                            <div className="flex items-center border rounded-md shadow space-x overflow-hidden relative border-orange-600">
                                                <div className="w-6 h-6 bg-orange-600 text-white flex items-center justify-center font-semibold">
                                                    D
                                                </div>
                                                <div className="w-6 h-6 flex items-center justify-center font-medium">
                                                    {listData.khs.data?.total_nilai_d}
                                                </div>
                                            </div>
                                            <div className="flex items-center border rounded-md shadow space-x overflow-hidden relative border-red-600">
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
                            </div>
                            <div className="space-y-3">
                                <p className="font-medium">
                                    Daftar Mata Kuliah
                                </p>
                                <CustomDataTable 
                                    loading={listData.khs.loading}
                                    rows={listData.khs.data 
                                        ? listData.khs.data?.matakuliah
                                        : []
                                    }
                                    pageSize={25}
                                    getRowId={(row) => row.kd_mk}
                                    columns={[
                                        {
                                            field: 'kd_mk',
                                            headerName: 'Kode',
                                            minWidth: 150
                                        },
                                        {
                                            field: 'nama',
                                            headerName: 'Nama',
                                            valueGetter: (value, row) => row.nm_mk,
                                            minWidth: 300
                                        },
                                        {
                                            field: 'sks',
                                            headerName: 'SKS',
                                            align: 'center',
                                            headerAlign: 'center'
                                        },
                                        {
                                            field: 'nilai',
                                            headerName: 'Nilai',
                                            align: 'center',
                                            headerAlign: 'center',
                                            renderCell: ({ row }) => (
                                                <div className="flex items-center justify-center h-full">
                                                    {row.nilai === 'A' && (
                                                        <div className="flex items-center justify-center w-6 h-6 bg-green-100 font-bold text-green-700 text-xs rounded">
                                                            {row.nilai}
                                                        </div>
                                                    )}
                                                    {row.nilai === 'B' && (
                                                        <div className="flex items-center justify-center w-6 h-6 bg-blue-100 font-bold text-blue-700 text-xs rounded">
                                                            {row.nilai}
                                                        </div>
                                                    )}
                                                    {row.nilai === 'C' && (
                                                        <div className="flex items-center justify-center w-6 h-6 bg-amber-100 font-bold text-amber-700 text-xs rounded">
                                                            {row.nilai}
                                                        </div>
                                                    )}
                                                    {row.nilai === 'D' && (
                                                        <div className="flex items-center justify-center w-6 h-6 bg-orange-100 font-bold text-orange-700 text-xs rounded">
                                                            {row.nilai}
                                                        </div>
                                                    )}
                                                    {row.nilai === 'E' && (
                                                        <div className="flex items-center justify-center w-6 h-6 bg-red-100 font-bold text-red-700 text-xs rounded">
                                                            {row.nilai}
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        },
                                        {
                                            field: 'mutu',
                                            headerName: 'Mutu',
                                            align: 'center',
                                            headerAlign: 'center'
                                        }
                                    ]}
                                />
                            </div>
                        </CustomLoading>
                        
                        
                    </div>

                </div>
            </div>
        </MainLayout>
    )
}

