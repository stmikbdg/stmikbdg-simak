import { Button, IconButton, InputAdornment, TextField } from "@mui/material"
import { useSidebar } from "../../context/SidebarContext"
import { useUser } from "../../context/UserContext"
import MainLayout from "../../layouts/MainLayout"
import { AccessTimeOutlined, CalendarMonthOutlined, Cancel, Check, CheckCircle, CheckCircleOutline, Close, DescriptionOutlined, FormatAlignLeftOutlined, InfoOutlined, MenuOutlined, SendOutlined } from "@mui/icons-material"
import { CustomTabItem, CustomTabs } from "../../components/CustomTabs"
import FileUploadComponent from "../../components/CustomUpload"
import CustomDataTable from "../../components/CustomDataTable"
import { useEffect, useState } from "react"
import { customSwal } from "../../components/CustomSwal"
import api_handler from "../../libs/api_handler"
import CustomLoading from "../../components/CustomLoading"
import dayjs from "dayjs"
import 'dayjs/locale/id'

export default function KRSPage({ token, base_url, role }) {

    const { setShowSidebar } = useSidebar()
    const { userdata, loadingUserdata } = useUser()
    const [listData, setListData] = useState({
        krs: {
            data: null,
            message: '',
            loading: {
                fetch: false,
                pengajuan: false
            },
            fetched: false
        },
        matakuliah: {
            data: [],
            loading: {
                fetch: false
            },
            fetched: false
        }
    })

    const aksi = {
        krs: {
            get: async () => {
                try {
                    aksi.krs.loading('fetch')

                    const response = await api_handler.get({
                        base_url,
                        token,
                        url: 'krs/check'
                    })

                    aksi.krs.loading('fetch')

                    if(response?.success) {
                        aksi.krs.set('data', response?.data)
                        aksi.krs.set('message', response?.message)
                        aksi.krs.set('fetched', true)
                        aksi.matakuliah.get(response?.data?.tahun_ajaran?.tahun_id)
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
                    krs: {
                        ...state.krs,
                        [column]: value
                    }
                }))
            },
            loading: (column) => {
                setListData(state => ({
                    ...state,
                    krs: {
                        ...state.krs,
                        loading: {
                            ...state.krs.loading,
                            [column]: !state.krs.loading[column]
                        }
                    }
                }))
            },
            pengajuan: {
                is_disabled: () => {
                    if(!listData.krs?.data?.krs?.open) {
                        return true
                    }

                    if(!listData.krs.data?.krs?.sts_tiket) {
                        return true
                    }

                    if(!listData.krs.data?.tahun_ajaran?.du_open) {
                        return true
                    }

                    const now = dayjs()

                    const date = dayjs(listData.krs.data?.tahun_ajaran?.du_sampai)

                    if(date.isAfter(now)) {
                        return true
                    }

                    return false
                }
            }
        },
        matakuliah: {
            get: async (tahun_id) => {
                try {
                    aksi.matakuliah.loading('fetch')

                    const response = await api_handler.get({
                        url: `krs/mata-kuliah?tahun_id=${tahun_id}`,
                        base_url,
                        token
                    })

                    aksi.matakuliah.loading('fetch')

                    if(response.success) {
                        aksi.matakuliah.set('fetched', true)
                        aksi.matakuliah.set('data', response?.data?.matkul_per_semester)
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
                    matakuliah: {
                        ...state.matakuliah,
                        [column]: value
                    }
                }))
            },
            loading: (column) => {
                setListData(state => ({
                    ...state,
                    matakuliah: {
                        ...state.matakuliah,
                        loading: {
                            ...state.matakuliah.loading,
                            [column]: !state.matakuliah.loading[column]
                        }
                    }
                }))
            },
        }
    }

    useEffect(() => {
        aksi.krs.get()
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
                                    Buat Kartu Rencana Studi
                                </h1>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <CustomLoading loading={listData.krs.loading.fetch} renderIf={listData.krs.fetched}>
                                    <div className="px-4 py-3 rounded-md border flex items-center gap-4 shadow border-zinc-300">
                                        <div className="w-10 h-10 rounded-md border flex items-center justify-center border-zinc-300">
                                            <AccessTimeOutlined fontSize="small" color="primary" />
                                        </div>
                                        <div className="-space-y-1">
                                            <h1 className="font-light">
                                                Tahun Ajaran
                                            </h1>
                                            <p className="text-lg lg:text-xl">
                                                {listData.krs.data?.tahun_ajaran?.tahun}
                                            </p>
                                        </div>
                                    </div>
                                </CustomLoading>
                                <CustomLoading loading={listData.krs.loading.fetch} renderIf={listData.krs.fetched}>
                                    <div className="px-4 py-3 rounded-md border flex items-center gap-4 shadow border-zinc-300">
                                        <div className="w-10 h-10 rounded-md border flex items-center justify-center border-zinc-300">
                                            <CalendarMonthOutlined fontSize="small" color="primary" />
                                        </div>
                                        <div className="-space-y-1">
                                            <h1 className="font-light">
                                                Semester
                                            </h1>
                                            <p className="text-lg lg:text-xl">
                                                {listData.krs.data?.krs?.semester % 2
                                                    ? 'Ganjil'
                                                    : 'Genap'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </CustomLoading>
                                <CustomLoading loading={listData.krs.loading.fetch} renderIf={listData.krs.fetched}>
                                    <div className="px-4 py-3 rounded-md border flex items-center gap-4 shadow border-zinc-300">
                                        <div className="w-10 h-10 rounded-md border flex items-center justify-center border-zinc-300">
                                            <Check fontSize="small" color="primary" />
                                        </div>
                                        <div className="-space-y-1">
                                            <h1 className="font-light">
                                                Status KRS
                                            </h1>
                                            <p className="text-lg lg:text-xl">
                                                {listData.krs.data?.krs?.keterangan_status}
                                            </p>
                                        </div>
                                    </div>
                                </CustomLoading>
                            </div>
                        </CustomLoading>
                    </div>

                    <div className="p-4">
                        <CustomLoading loading={listData.krs.loading.fetch} renderIf={listData.krs.fetched}>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex gap-4">
                                    <InfoOutlined fontSize="small" color="primary" className=" shrink-0" />
                                    <div className="space-y-3">
                                        {aksi.krs.pengajuan.is_disabled() && listData.krs.data?.krs?.sts_krs === 'S' && (
                                            <p>
                                                Hanya Dosen Wali yang dapat mengembalikan status KRS yang sudah disetujui 
                                            </p>
                                        )}
                                        {aksi.krs.pengajuan.is_disabled() && listData.krs.data?.krs?.sts_krs === 'P' && (
                                            <p>
                                                Pengajuan KRS anda sedang dalam tahap <b className="text-blue-600">pemeriksaan</b> atau <b className="text-blue-600">review</b>. Mohon untuk menunggu hingga selesai.
                                            </p>
                                        )}
                                        {aksi.krs.pengajuan.is_disabled() && listData.krs.data?.krs?.sts_krs === 'D' && (
                                            <>
                                                <p>
                                                    Tampaknya, Pengajuan KRS anda telah <b className="text-blue-600">ditolak</b> atau masih menjadi <b className="text-blue-600">Draf</b>. Mohon untuk melakukan pengajuan ulang. 
                                                </p>
                                                <p>
                                                    Batas Waktu Pengajuan adalah <span className="text-blue-600 font-bold">
                                                        {dayjs(listData.krs.data?.tahun_ajaran?.du_sampai).locale('id').format('DD MMMM YYYY')}
                                                    </span>
                                                </p>
                                            </>
                                        )}

                                    </div>
                                </div>
                                <Button disabled={aksi.krs.pengajuan.is_disabled()} startIcon={<SendOutlined />} variant="contained" size="small">
                                    <p className="font-jakarta text-xs">
                                        Ajukan
                                    </p>
                                </Button>
                            </div>
                        </CustomLoading>
                    </div>
                    
                    <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                        <CustomTabs>
                            <CustomTabItem label="Semester 1">
                                <CustomLoading loading={listData.krs.loading.fetch} renderIf={listData.krs.fetched}>
                                    <TabSemester semester={1} maksimal_sks={21} total_sks={21} loading={listData.matakuliah.loading.fetch} matakuliah={listData.matakuliah.data} />
                                </CustomLoading>
                            </CustomTabItem>
                            <CustomTabItem label="Semester 2">
                                <CustomLoading loading={listData.krs.loading.fetch} renderIf={listData.krs.fetched} >
                                    <TabSemester semester={2} maksimal_sks={21} total_sks={21} loading={listData.matakuliah.loading.fetch} matakuliah={listData.matakuliah.data} />
                                </CustomLoading>
                            </CustomTabItem>
                            <CustomTabItem label="Semester 3">
                                <CustomLoading loading={listData.krs.loading.fetch} renderIf={listData.krs.fetched}>
                                    <TabSemester semester={3} maksimal_sks={21} total_sks={21} loading={listData.matakuliah.loading.fetch} matakuliah={listData.matakuliah.data} />
                                </CustomLoading>
                            </CustomTabItem>
                            <CustomTabItem label="Semester 4">
                                <CustomLoading loading={listData.krs.loading.fetch} renderIf={listData.krs.fetched}>
                                    <TabSemester semester={4} maksimal_sks={21} total_sks={21} loading={listData.matakuliah.loading.fetch} matakuliah={listData.matakuliah.data} />
                                </CustomLoading>
                            </CustomTabItem>
                            <CustomTabItem label="Semester 5">
                                <CustomLoading loading={listData.krs.loading.fetch} renderIf={listData.krs.fetched}>
                                    <TabSemester semester={5} maksimal_sks={21} total_sks={21} loading={listData.matakuliah.loading.fetch} matakuliah={listData.matakuliah.data} />
                                </CustomLoading>
                            </CustomTabItem>
                            <CustomTabItem label="Semester 6">
                                <CustomLoading loading={listData.krs.loading.fetch} renderIf={listData.krs.fetched}>
                                    <TabSemester semester={6} maksimal_sks={21} total_sks={21} loading={listData.matakuliah.loading.fetch} matakuliah={listData.matakuliah.data} />
                                </CustomLoading>
                            </CustomTabItem>
                            <CustomTabItem label="Semester 7">
                                <CustomLoading loading={listData.krs.loading.fetch} renderIf={listData.krs.fetched}>
                                    <TabSemester semester={7} maksimal_sks={21} total_sks={21} loading={listData.matakuliah.loading.fetch} matakuliah={listData.matakuliah.data} />
                                </CustomLoading>
                            </CustomTabItem>
                            <CustomTabItem label="Semester 8">
                                <CustomLoading loading={listData.krs.loading.fetch} renderIf={listData.krs.fetched}>
                                    <TabSemester semester={8} maksimal_sks={21} total_sks={21} loading={listData.matakuliah.loading.fetch} matakuliah={listData.matakuliah.data} />
                                </CustomLoading>
                            </CustomTabItem>
                        </CustomTabs>
                    </CustomLoading>

                </div>
            </div>
        </MainLayout>
    )
}

function TabSemester({
    semester,
    maksimal_sks,
    total_sks,
    loading,
    matakuliah
}) {

    const aksi = {
        matakuliah: {
            get: {
                semester: (semester) => {
                    const data = matakuliah.find(item => item.semester === semester)

                    return data ? data['mata_kuliah'] : []
                }
            },
        }
    }
    return (
        <div className="p-4">
            <div className="w-full sm:w-1/2 grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <p className="text-sm opacity-70">
                        Maksimal SKS
                    </p>
                    <p className="text-lg sm:text-xl font-medium">
                        {maksimal_sks}
                    </p>
                </div>
                <div className="space-y-2">
                    <p className="text-sm opacity-70">
                        Total SKS diambil
                    </p>
                    <p className="text-lg sm:text-xl font-medium">
                        {total_sks}
                    </p>
                </div>
            </div>
            <hr className="my-2 opacity-0" />
            <CustomDataTable 
                checkbox
                isRowSelectable={(params) => params.row.krs.is_aktif && !params.row.krs.is_checked}
                pageSize={25}
                loading={loading}
                rows={aksi.matakuliah.get.semester(semester)}
                getRowId={(row) => row.kd_mk}
                columns={[
                    {
                        field: 'kd_mk',
                        headerName: 'Kode',
                        minWidth: 150
                    },
                    {
                        field: 'status',
                        headerName: 'Status Pengajuan',
                        renderCell: ({ row }) => (
                            <div className="flex items-center h-full">
                                {row?.krs?.is_checked 
                                    ? (
                                        <div className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full bg-green-700 text-white text-xs font-medium">
                                            <CheckCircle sx={{ fontSize: 16 }} />
                                            <p>
                                                Dipilih
                                            </p>
                                        </div>
                                    )
                                    : (
                                        <div className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-full bg-zinc-100 text-xs font-medium border border-zinc-300">
                                            <Cancel sx={{ fontSize: 16 }} />
                                            <p>
                                                Tidak dipilih
                                            </p>
                                        </div>
                                    )
                                }
                            </div>
                        ),
                        minWidth: 150
                    },
                    {
                        field: 'nm_mk',
                        headerName: 'Nama',
                        minWidth: 250
                    },
                    {
                        field: 'sks',
                        headerName: 'SKS',
                        align: 'center',
                        headerAlign: 'center'
                    },
                    {
                        field: 'nilai_akhir',
                        headerName: 'Nilai',
                        align: 'center',
                        headerAlign: 'center',
                        renderCell: ({ row }) => (
                            <div className="flex items-center justify-center h-full">
                                {row?.nilai_akhir?.nilai === 'A' && (
                                    <div className="flex items-center justify-center w-6 h-6 bg-green-100 font-bold text-green-700 text-xs rounded">
                                        {row?.nilai_akhir?.nilai}
                                    </div>
                                )}
                                {row?.nilai_akhir?.nilai === 'B' && (
                                    <div className="flex items-center justify-center w-6 h-6 bg-blue-100 font-bold text-blue-700 text-xs rounded">
                                        {row?.nilai_akhir?.nilai}
                                    </div>
                                )}
                                {row?.nilai_akhir?.nilai === 'C' && (
                                    <div className="flex items-center justify-center w-6 h-6 bg-amber-100 font-bold text-amber-700 text-xs rounded">
                                        {row?.nilai_akhir?.nilai}
                                    </div>
                                )}
                                {row?.nilai_akhir?.nilai === 'D' && (
                                    <div className="flex items-center justify-center w-6 h-6 bg-orange-100 font-bold text-orange-700 text-xs rounded">
                                        {row?.nilai_akhir?.nilai}
                                    </div>
                                )}
                                {row?.nilai_akhir?.nilai === 'E' && (
                                    <div className="flex items-center justify-center w-6 h-6 bg-red-100 font-bold text-red-700 text-xs rounded">
                                        {row?.nilai_akhir?.nilai}
                                    </div>
                                )}
                            </div>
                        )
                    },
                    {
                        field: 'nilai_mutu',
                        headerName: 'Mutu',
                        valueGetter: (value, row) => row?.nilai_akhir?.mutu,
                        align: 'center',
                        headerAlign: 'center'
                    }
                ]}
            />
        </div>
    )
}