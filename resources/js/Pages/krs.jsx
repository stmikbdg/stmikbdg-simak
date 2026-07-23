import { Button, CircularProgress, IconButton, InputAdornment, TextField, Tooltip } from "@mui/material"
import { useSidebar } from "../context/SidebarContext"
import { useUser } from "../context/UserContext"
import MainLayout from "../layouts/MainLayout"
import { AccessTimeOutlined, AssignmentOutlined, AutoGraphOutlined, CalendarMonthOutlined, Cancel, Check, CheckCircle, CheckCircleOutline, Close, DangerousTwoTone, DescriptionOutlined, Download, DownloadOutlined, DownloadTwoTone, East, EastOutlined, FormatAlignLeftOutlined, InfoOutlined, MenuOutlined, SendOutlined, StickyNote2Outlined, Visibility, WarningTwoTone } from "@mui/icons-material"
import { CustomTabItem, CustomTabs } from "../components/CustomTabs"
import FileUploadComponent from "../components/CustomUpload"
import CustomDataTable from "../components/CustomDataTable"
import { useEffect, useState } from "react"
import { customSwal } from "../components/CustomSwal"
import api_handler from "../libs/api_handler"
import CustomLoading from "../components/CustomLoading"
import dayjs from "dayjs"
import 'dayjs/locale/id'
import { useRedirect } from "../context/RedirectContext"
import Modal, { modal } from "../components/Modal"
import NotAllowedPage from "./NotAllowed"
import { useNavigate } from "react-router-dom"
import { CustomControlledTabItem, CustomControlledTabs } from "../components/CustomControlledTabs"

export default function Page({ token, base_url, role }) {
    if(role.mahasiswa.enable) {
        return <Mahasiswa_KRSPage token={token} base_url={base_url} role={role} />
    }

    if(role.dosen_wali.enable) {
        return <DosenWaliPage token={token} base_url={base_url} role={role} />
    }

    return (
        <NotAllowedPage />
    )
}

function DosenWaliPage({ token, base_url, role }) {
    const { setShowSidebar } = useSidebar()
    const { userdata, loadingUserdata } = useUser()
    const navigate = useNavigate()
    
    const [listData, setListData] = useState({
        krs: {
            data: [],
            loading: {
                fetch: false
            },
            detail: {
                data: []
            }
        }
    })

    const aksi = {
        krs: {
            get: async () => {
                try {
                    aksi.krs.loading('fetch')

                    const response = await api_handler.get({
                        url: 'krs/mahasiswa/list',
                        base_url,
                        token
                    })

                    aksi.krs.loading('fetch')

                    if(response?.success) {
                        aksi.krs.set('data', response?.data?.list_krs_mahasiswa)
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
            set: (column, value) => {
                setListData(state => ({
                    ...state,
                    krs: {
                        ...state.krs,
                        [column]: value
                    }
                }))
            },
            detail: (mhs_id) => {
                const data = listData.krs.data.find(item => item.mhs_id === mhs_id)?.krs

                setListData(state => ({
                    ...state,
                    krs: {
                        ...state.krs,
                        detail: {
                            data
                        }
                    }
                }))

                modal.show('detail_krs')
            }
        }
    }

    useEffect(() => {
        aksi.krs.get()
    }, [])

    return (
        <MainLayout token={token} base_url={base_url} role={role}>
            <div className={`bg-white w-full rounded-lg border shadow-md border-zinc-300`}>
                <div className="divide-y divide-zinc-300">

                    <Modal modalId="detail_krs" title="Detail" modalBoxClassname="max-w-2xl">
                        <CustomDataTable 
                            onModal="detail_krs"
                            getRowId={(row) => row.krs_id}
                            rows={listData.krs.detail.data}
                            toolbar={{}}
                            columns={[
                                {
                                    field: 'krs_id',
                                    headerName: 'ID',
                                    maxWidth: 75
                                },
                                {
                                    field: 'nmr_krs',
                                    headerName: 'Nomor KRS',
                                    minWidth: 125
                                },
                                {
                                    field: 'tanggal',
                                    headerName: 'Tanggal',
                                    minWidth: 125,
                                    valueGetter: (value, row) => dayjs(row.tanggal).locale('id').format('DD MMMM YYYY')
                                },
                                {
                                    field: 'semester',
                                    headerName: 'Semester',
                                    minWidth: 75
                                },
                                {
                                    field: 'sts_krs',
                                    headerName: 'Status KRS',
                                    valueGetter: (value, row) => row.sts_krs === 'P'
                                        ? 'Pengajuan'
                                        : row.sts_krs === 'S'
                                            ? 'Disetujui'
                                            : 'Ditolak'
                                },
                                {
                                    field: 'aksi',
                                    headerName: '',
                                    renderCell: ({ row }) => (
                                        <div className="flex items-center justify-center h-full">
                                            <IconButton onClick={() => window.location.href = `/krs/approve/${row.mhs_id}/${row.krs_id}`} size="small" color="primary">
                                                <EastOutlined fontSize="small" />
                                            </IconButton>
                                        </div>
                                    )
                                }
                            ]}
                        />
                    </Modal>

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
                                    Cek KRS
                                </h1>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    

                    <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                        <CustomDataTable 
                            getRowId={(row) => row.mhs_id}
                            loading={listData.krs.loading.fetch}
                            rows={listData.krs.data}
                            columns={[
                                {
                                    field: 'mhs_id',
                                    headerName: 'NIM',
                                    valueGetter: (value, row) => row.nim,
                                    minWidth: 120
                                },
                                {
                                    field: 'nm_mhs',
                                    headerName: 'Nama Mahasiswa',
                                    minWidth: 350
                                },
                                {
                                    field: 'masuk_tahun',
                                    headerName: 'Angkatan',
                                    minWidth: 100
                                },
                                {
                                    field: 'status',
                                    headerName: 'Status Mahasiswa',
                                    minWidth: 150,
                                    valueGetter: (value, row) => row.sts_mhs === 'A'
                                        ? 'Aktif'
                                        : row.sts_mhs === 'C'
                                            ? 'Cuti'
                                            : 'Tidak Aktif'
                                },
                                {
                                    field: 'aksi',
                                    headerName: '',
                                    renderCell: ({ row }) => (
                                        <div className="flex items-center justify-center h-full">
                                            <IconButton onClick={() => aksi.krs.detail(row.mhs_id)} size="small" color="primary">
                                                <EastOutlined fontSize="small" />
                                            </IconButton>
                                        </div>
                                    )
                                }
                            ]}
                        />
                    </CustomLoading>
                    
                    

                </div>
            </div>
        </MainLayout>
    )
}

function Mahasiswa_KRSPage({ token, base_url, role }) {

    const { setShowSidebar } = useSidebar()
    const { userdata, loadingUserdata } = useUser()
    const [listData, setListData] = useState({
        krs: {
            data: null,
            message: '',
            loading: {
                fetch: false,
                pengajuan: false,
                draft: false
            },
            fetched: false,
            draft: null
        },
        matakuliah: {
            data: [],
            loading: {
                fetch: false
            },
            fetched: false
        },
        tabs: {
            current: 1
        }
    })

    const [formData, setFormData] = useState({
        pengajuan_krs: {
            pengajuan_catatan: '',
            mata_kuliah: [],
            loading: false,
            error: null
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

                        if(response?.data?.krs?.sts_krs === 'D') {
                            await aksi.draft.get()
                        }
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

                    if(now.isAfter(date) || now.isSame(date)) {
                        return true
                    }

                    return false
                },
                message: () => {

                    if(!listData.krs?.data?.krs?.open) {
                        return listData?.krs?.data?.krs?.keterangan_status === 'Ditutup'
                            ? 'Anda tidak bisa melakukan Pengajuan karena KRS belum dibuka.'
                            : 'Anda tidak bisa melakukan Pengajuan kembali. Hanya Dosen Wali yang bisa mengembalikan Status KRS anda.'
                    }

                    if(!listData.krs.data?.krs?.sts_tiket) {
                        return 'Anda tidak bisa melakukan Pengajuan. Silahkan hubungi bagian Administrasi Keuangan'
                    }

                    if(!listData.krs.data?.tahun_ajaran?.du_open) {
                        return 'Anda tidak bisa melakukan Pengajuan karena KRS belum dibuka.'
                    }

                    const now = dayjs()

                    const date = dayjs(listData.krs.data?.tahun_ajaran?.du_sampai)

                    if(now.isAfter(date) || now.isSame(date)) {
                        return "Anda tidak bisa melakukan Pengajuan karena sudah melewati batas pengajuan KRS."
                    }

                    return listData?.krs?.data?.krs?.message
                }
            },
            is_aktif: () => {
                return listData.krs?.data?.krs?.sts_krs
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
            get_selected: (mk_id) => {
                let matkul = listData.matakuliah.data.find(item => item?.mata_kuliah?.find(mk => mk_id?.includes(mk?.mk_id)))
                let data = matkul?.mata_kuliah?.find(mk => mk_id?.includes(mk?.mk_id))

                if(matkul) {
                    data['semester'] = matkul['semester']
                }

                return data
            },
            selected: {
                total_sks: () => {
                    const mk_id = formData.pengajuan_krs.mata_kuliah.length > 0 ? formData.pengajuan_krs.mata_kuliah?.map(item => item?.mk_id).join(',').split(',') : []
                    // console.log(mk_id)

                    let data = 0
                    // let matkul = listData.matakuliah.data.find(item => item?.mata_kuliah?.find(mk => mk_id?.includes(String(mk?.mk_id))))
                    // matkul?.mata_kuliah?.filter(mk => mk_id?.includes(String(mk?.mk_id)))?.map(mk => {
                    //     console.log(mk)
                    //     data += mk?.sks
                    // })

                    listData.matakuliah.data?.map(item => {
                        item?.mata_kuliah?.filter(mk => mk_id?.includes(String(mk?.mk_id)))?.map(mk => {
                            data += mk?.sks
                        })
                    })

                    return data

                }
            }
        },
        formData: {
            pengajuan_krs: {
                loading: () => {
                    setFormData(state => ({
                        ...state,
                        pengajuan_krs: {
                            ...state.pengajuan_krs,
                            loading: !state.pengajuan_krs.loading
                        }
                    }))
                },
                set: (column, value) => {
                    setFormData(state => ({
                        ...state,
                        pengajuan_krs: {
                            ...state.pengajuan_krs,
                            [column]: value
                        }
                    }))
                },
                error: (message) => {
                    aksi.formData.pengajuan_krs.set('error', message)
                },

                submit: async (draft = false) => {
                    try {

                        if(formData.pengajuan_krs.mata_kuliah.length < 1) {
                            aksi.formData.pengajuan_krs.error('Anda belum mengambil / Memilih mata kuliah. Silahkan pilih terlebih dahulu.')
                            return
                        }

                        aksi.formData.pengajuan_krs.error(null)
                        
                        aksi.formData.pengajuan_krs.loading()

                        const payload = {
                            tahun_id: listData.krs.data?.tahun_ajaran?.tahun_id,
                            mata_kuliah: formData.pengajuan_krs.mata_kuliah.map(v => v.mk_id?.join(',')).join(',').split(',').map(v => ({
                                mk_id: parseInt(v)
                            })),
                            pengajuan_catatan: formData.pengajuan_krs.pengajuan_catatan
                        }


                        const response = await api_handler.post({
                            base_url,
                            token,
                            url: `krs/mata-kuliah/${draft ? 'draft' : 'pengajuan'}`,
                            payload
                        })

                        aksi.formData.pengajuan_krs.loading()

                        if(response?.success) {
                            modal.close('modal_pengajuan_krs')
                            customSwal.toast.success({
                                message: `Berhasil ${draft ? 'Menyimpan KRS sebagai Draft' : 'mengajukan KRS'}`
                            })

                            await aksi.krs.get()
                        }else{
                            aksi.formData.pengajuan_krs.error(response?.message)
                        }
                    } catch (error) {
                        aksi.formData.pengajuan_krs.error(error?.message)
                    }
                },
                matakuliah: {
                    set: (semester, value) => {
                        setFormData(state => {
                            const matakuliah_index = state.pengajuan_krs.mata_kuliah.findIndex(item => item.semester === semester)

                            if(matakuliah_index > -1) {
                                return {
                                    ...state,
                                    pengajuan_krs: {
                                        ...state.pengajuan_krs,
                                        mata_kuliah: [
                                            ...state.pengajuan_krs.mata_kuliah.slice(0, matakuliah_index),
                                            {
                                                ...state.pengajuan_krs.mata_kuliah[matakuliah_index],
                                                mk_id: value
                                            }
                                        ]
                                    }
                                }
                            }else{
                                return {
                                    ...state,
                                    pengajuan_krs: {
                                        ...state.pengajuan_krs,
                                        mata_kuliah: [
                                            ...state.pengajuan_krs.mata_kuliah,
                                            {
                                                semester,
                                                mk_id: value
                                            }
                                        ]
                                    }
                                }
                            }
                        })
                    }
                }
            }
        },
        draft: {
            get: async () => {
                try {
                    aksi.krs.loading('fetch')

                    const response = await api_handler.get({
                        base_url,
                        token,
                        url: 'krs/mata-kuliah/draft'
                    })

                    aksi.krs.loading('fetch')

                    if(response?.success) {
                        const data = []
                        response?.data?.krs?.krs_matkul?.map(mk => {
                            const index = data.findIndex(item => item.semester === mk?.detail_matkul?.semester)

                            if(index > -1) {
                                data[index].mk_id = [
                                    ...data[index].mk_id,
                                    mk.mk_id
                                ]
                            }else{
                                data.push({
                                    semester: mk?.detail_matkul?.semester,
                                    mk_id: [mk.mk_id]
                                })
                            }
                        })

                        data.map(v => {
                            aksi.formData.pengajuan_krs.matakuliah.set(v.semester, v.mk_id)
                        })
                        aksi.krs.set('draft', response?.data)
                        aksi.krs.set('message', response?.message)
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
            }
        },
        tabs: {
            set: (event, newValue) => {
                setListData(state => ({
                    ...state,
                    tabs: {
                        ...state.tabs,
                        current: newValue
                    }
                }))
            }
        },
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
                                    KRS / KHS
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

                    
                    <Modal modalId="modal_pengajuan_krs" title="Ajukan KRS">
                        {formData.pengajuan_krs.error && (
                            <div className="p-4 rounded-md bg-red-700/80 text-white font-jakarta text-medium">
                                {formData.pengajuan_krs.error}
                            </div>
                        )}
                        <CustomTabs>
                            <CustomTabItem label="Keterangan Pengajuan">

                                <form onSubmit={e => e.preventDefault()} className="p-4 space-y-4">
                                    <TextField 
                                        fullWidth 
                                        size="small" 
                                        value={formData.pengajuan_krs.pengajuan_catatan} 
                                        onChange={e => aksi.formData.pengajuan_krs.set('pengajuan_catatan', e.target.value)} 
                                        multiline 
                                        minRows={1} 
                                        label="Berikan Keterangan untuk Pengajuan KRS" 
                                        required 
                                        helperText={
                                            formData.pengajuan_krs.pengajuan_catatan.length > 50
                                                ? "Maksimal 50 karakter"
                                                : "Contoh: Pengajuan untuk KRS Tahun Ajaran 2025/2026 Semester Ganjil"
                                        }
                                        error={formData.pengajuan_krs.pengajuan_catatan.length > 50}
                                    />
                                    <hr className="opacity-0" />
                                    <div className="flex items-center gap-4">
                                        <Button type="submit" onClick={() => aksi.formData.pengajuan_krs.submit()} variant="contained" size="small" 
                                            disabled={formData.pengajuan_krs.loading || formData.pengajuan_krs.pengajuan_catatan.length > 50} startIcon={formData.pengajuan_krs.loading ? <CircularProgress size={15} className="grayscale" /> : <SendOutlined />}>
                                            <p className="font-jakarta font-medium">
                                                {formData.pengajuan_krs.loading
                                                    ? 'Sedang diproses..'
                                                    : 'Ajukan'
                                                }
                                            </p>
                                        </Button>
                                    </div>
                                </form>
                            </CustomTabItem>
                            <CustomTabItem label="Mata Kuliah yang dipilih">
                                <div className="divide-y divide-zinc-300 ">
                                    {/* {formData.pengajuan_krs.mata_kuliah} */}
                                    <div className="p-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <p>
                                                Total SKS
                                            </p>
                                            <p className="font-bold">
                                                {aksi.matakuliah.selected.total_sks()}
                                            </p>
                                        </div>
                                    </div>
                                    <CustomDataTable 
                                        rows={formData.pengajuan_krs.mata_kuliah.length > 0 ? formData.pengajuan_krs.mata_kuliah?.map(item => item?.mk_id).join(',').split(',').map(item => ({ mk_id: item})) : []}
                                        getRowId={(row) => row.mk_id}
                                        columns={[
                                            {
                                                field: 'mk_id',
                                                headerName: 'Mata Kuliah',
                                                minWidth: 350,
                                                valueGetter: (value, row) => aksi.matakuliah.get_selected(row?.mk_id)?.nm_mk || '-'
                                            },
                                            {
                                                field: 'semester',
                                                headerName: 'Semester',
                                                maxWidth: 150,
                                                valueGetter: (value, row) => aksi.matakuliah.get_selected(row?.mk_id)?.semester || '-'
                                            },
                                            {
                                                field: 'mk',
                                                headerName: 'SKS',
                                                maxWidth: 150,
                                                headerAlign: 'center',
                                                align: 'center',
                                                valueGetter: (value, row) => aksi.matakuliah.get_selected(row?.mk_id)?.sks || '-'
                                            }
                                        ]}
                                    />
                                </div>
                            </CustomTabItem>
                        </CustomTabs>
                    </Modal>
                    
                    <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                        <CustomTabs>
                            <CustomTabItem label="KRS">
                                <CustomTabs>
                                    <CustomTabItem label="Pengajuan">
                                        <div className="p-4">
                                            <CustomLoading loading={listData.krs.loading.fetch} renderIf={listData.krs.fetched}>
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                    {!listData.krs.data?.krs?.sts_tiket
                                                        ? (
                                                            <div className="flex gap-4 p-3 rounded-lg bg-red-50 text-red-700">
                                                                <DangerousTwoTone fontSize="small" color="error" className=" shrink-0" />
                                                                <div className="space-y-3">
                                                                    <p className="text-sm">
                                                                        Anda belum melakukan aktivasi keuangan. Silahkan hubungi bagian Administrasi Keuangan. 
                                                                    </p>
                                                                    <Button variant="contained" color="error" onClick={() => window.open('https://wa.me/+628112332113', '_blank')}>
                                                                        <p className="font-jakarta font-bold text-xs">
                                                                            Hubungi Administrasi
                                                                        </p>
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )
                                                        : dayjs().isAfter(dayjs(listData.krs.data?.tahun_ajaran?.du_sampai)) || dayjs().isSame(dayjs(listData.krs.data?.tahun_ajaran?.du_sampai))
                                                            ? (
                                                                <div className="flex gap-4 bg-red-50 text-red-700 p-3 rounded-lg">
                                                                    <WarningTwoTone fontSize="small" color="error" className=" shrink-0" />
                                                                    <div className="space-y-3 text-sm">
                                                                        <p>
                                                                            Anda tidak bisa melakukan Pengajuan karena <b>sudah melewati batas pengajuan KRS.</b>
                                                                        </p>
                                                                        <Button variant="contained" color="error" onClick={() => window.open('https://wa.me/+6287739859278', '_blank')}>
                                                                            <p className="font-jakarta font-bold text-xs">
                                                                                Hubungi Administrasi
                                                                            </p>
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            )
                                                            : (
                                                                <div className="flex gap-4">
                                                                    <InfoOutlined fontSize="small" color="primary" className=" shrink-0" />
                                                                    <div className="space-y-3 text-sm">
                                                                        {aksi.krs.pengajuan.is_disabled()
                                                                            ? aksi.krs.pengajuan.message()
                                                                            : 'Silahkan pilih mata kuliah untuk KRS anda'
                                                                        }

                                                                    </div>
                                                                </div>
                                                            )
                                                    }
                                                    
                                                    <div className="flex items-center gap-2 *:grow *:sm:grow-0">
                                                        {listData.krs.data?.krs?.krs_id && listData.krs.data?.krs?.sts_krs === 'S' && (
                                                            <Button
                                                                startIcon={<DownloadOutlined fontSize="small" />}
                                                                variant="outlined"
                                                                size="small"
                                                                onClick={() => window.open(`/ksm/download/krs_id/${listData.krs.data?.krs?.krs_id}`, '_blank', 'noopener,noreferrer')}
                                                            >
                                                                <p className="font-jakarta text-xs">
                                                                    Unduh KSM
                                                                </p>
                                                            </Button>
                                                        )}
                                                        <Button disabled={aksi.krs.pengajuan.is_disabled()} onClick={() => modal.show('modal_pengajuan_krs')} startIcon={<SendOutlined />} variant="contained" size="small">
                                                            <p className="font-jakarta text-xs">
                                                                Ajukan
                                                            </p>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CustomLoading>
                                        </div>
                                        <CustomTabs>
                                            <CustomTabItem label="Semua Semester">
                                                {listData.krs.loading.fetch 
                                                    ? (
                                                        <div className="flex items-center justify-center w-full h-80">
                                                            <CircularProgress size={30} color="primary" />
                                                        </div>
                                                    )
                                                    : (
                                                        <div className="divide-y divide-zinc-300">
                                                            {Array.from({ length: 8 }).map((_, index) => index + 1).map(semester => (
                                                                
                                                                <TabSemester key={semester} semester={semester} maksimal_sks={21} total_sks={21} loading={listData.matakuliah.loading.fetch} matakuliah={listData.matakuliah.data} krs_disabled={aksi.krs.pengajuan.is_disabled()} status_krs={listData.krs.data?.krs?.sts_krs} selected_matakuliah={formData.pengajuan_krs.mata_kuliah} onSelect_matakuliah={(value) => aksi.formData.pengajuan_krs.matakuliah.set(semester, value)} />
                                                            ))}
                                                        </div>
                                                    )
                                                }
                                            </CustomTabItem>
                                            <CustomTabItem label="Per Semester">
                                                <CustomControlledTabs value={listData.tabs.current} onChange={aksi.tabs.set}>
                                                    <CustomControlledTabItem label="1" value={1}></CustomControlledTabItem>
                                                    <CustomControlledTabItem label="2" value={2}></CustomControlledTabItem>
                                                    <CustomControlledTabItem label="3" value={3}></CustomControlledTabItem>
                                                    <CustomControlledTabItem label="4" value={4}></CustomControlledTabItem>
                                                    <CustomControlledTabItem label="5" value={5}></CustomControlledTabItem>
                                                    <CustomControlledTabItem label="6" value={6}></CustomControlledTabItem>
                                                    <CustomControlledTabItem label="7" value={7}></CustomControlledTabItem>
                                                    <CustomControlledTabItem label="8" value={8}></CustomControlledTabItem>
                                                </CustomControlledTabs>
                                                <TabSemester semester={listData.tabs.current} maksimal_sks={21} total_sks={21} loading={listData.matakuliah.loading.fetch} matakuliah={listData.matakuliah.data} krs_disabled={aksi.krs.pengajuan.is_disabled()} status_krs={listData.krs.data?.krs?.sts_krs} selected_matakuliah={formData.pengajuan_krs.mata_kuliah} onSelect_matakuliah={(value) => aksi.formData.pengajuan_krs.matakuliah.set(listData.tabs.current, value)} />
                                            </CustomTabItem>
                                        </CustomTabs>
                                    </CustomTabItem>
                                    <CustomTabItem label="Riwayat">
                                        <Mahasiswa_KRSPage_Riwayat token={token} base_url={base_url} role={role} />
                                    </CustomTabItem>
                                </CustomTabs>
                            </CustomTabItem>
                            <CustomTabItem label="KHS">
                                <KHSPage token={token} base_url={base_url} role={role} />
                            </CustomTabItem>
                        </CustomTabs>
                    </CustomLoading>

                </div>
            </div>
        </MainLayout>
    )
}

function Mahasiswa_KRSPage_Riwayat({ token, base_url, role }) {

    const [listData, setListData] = useState({
        
        riwayat: {
            data: [],
            loading: {
                fetch: false,
                download: false
            },
            matkul: []
        }
    })

    const aksi = {
        riwayat: {
            get: async () => {
                try {
                    aksi.riwayat.loading('fetch')

                    const response = await api_handler.get({
                        base_url,
                        token,
                        url: 'krs/riwayat'
                    })

                    // console.log(response)

                    aksi.riwayat.loading('fetch')

                    if(response?.success) {
                        aksi.riwayat.set('data', response?.data)
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
                    riwayat: {
                        ...state.riwayat,
                        [column]: value
                    }
                }))
            },
            loading: (column) => {
                setListData(state => ({
                    ...state,
                    riwayat: {
                        ...state.riwayat,
                        loading: {
                            ...state.riwayat.loading,
                            [column]: !state.riwayat.loading[column]
                        }
                    }
                }))
            },
            matkul: (matkul) => {
                modal.show('matkul')

                aksi.riwayat.set('matkul', matkul?.map(v => v['mata_kuliah']))
            }
        }
    }

    useEffect(() => {
        aksi.riwayat.get()
    }, [])

    return (
        <div className="p-2">
            <Modal title="Detail Mata Kuliah" modalId="matkul">
                <CustomDataTable 
                    getRowId={(row) => row?.mk_id}
                    pagination={false}
                    toolbar={{
                        column: false,
                        density: false,
                        search: true
                    }}
                    rows={listData.riwayat.matkul}
                    columns={[
                        {
                            field: 'kd_mk',
                            headerName: 'Kode',
                            minWidth: 150
                        },
                        {
                            field: 'nm_mk',
                            headerName: 'Nama',
                            minWidth: 200
                        },
                        {
                            field: 'sks',
                            headerName: 'SKS',
                            headerAlign: 'center',
                            align: 'center',
                            minWidth: 100
                        },
                        {
                            field: 'sts_mk',
                            headerName: 'Status',
                            align: 'center',
                            headerAlign: 'center',
                            minWidth: 200,
                            renderCell: ({ row }) => (
                                <div className="flex items-center justify-center w-full h-full">
                                    <div className="flex items-center gap-2 rounded-full px-2 py-0.5 text-white font-medium tracking-tighter text-xs">
                                        <CheckCircle sx={{ fontSize: 4 }} />
                                        <p>
                                            Aktif
                                        </p>
                                    </div>
                                </div>
                            )
                        }
                    ]}
                />
            </Modal>
            <CustomDataTable
                rows={listData.riwayat.data}
                loading={listData.riwayat.loading.fetch}
                getRowId={(row) => row?.krs_id} 
                columns={[
                    {
                        field: 'semester',
                        headerName: 'Semester',
                        headerAlign: 'center',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        field: 'sts_krs',
                        headerName: 'Status',
                        minWidth: 150,
                        renderCell: ({ row }) => (
                            <div className="flex items-center w-full h-full">
                                {row?.sts_krs === 'S'
                                    ? (
                                        <div className="px-3 py-0.5 rounded-full text-xs font-bold bg-green-700 text-white shadow">
                                            Disetujui
                                        </div>
                                    ) : row?.sts_krs === 'P'
                                        ? (
                                            <div className="px-3 py-0.5 rounded-full text-xs font-bold bg-blue-700 text-white shadow">
                                                Pengajuan
                                            </div>
                                        ) : (
                                            <div className="px-3 py-0.5 rounded-full text-xs font-bold bg-red-700 text-white shadow">
                                                Draft / Ditolak
                                            </div>
                                        )}
                            </div>
                        )   
                    },
                    {
                        field: 'sts_tolak',
                        headerName: 'Pernah ditolak',
                        minWidth: 300,
                        renderCell: ({ row }) => (
                            <div className="flex items-center h-full w-full">
                                {row?.ditolak_tanggal
                                    ? (
                                        <div className="flex gap-2">
                                            <Check fontSize="small" color="success" />
                                            <div className="space-y-1">
                                                <p className="italic text-xs opacity-50 tracking-tighter">
                                                    {dayjs(row?.ditolak_tanggal).locale('id').format('dddd, DD MMMM YYYY, HH:mm:ss')}
                                                </p>
                                                <p className="italic text-xs font-medium tracking-tighter">
                                                    {row?.ditolak_alasan}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="italic text-xs opacity-50 tracking-tighter">
                                            Belum Pernah
                                        </p>
                                    )
                                }
                            </div>
                        )
                    },
                    {
                        field: 'pengajuan_catatan',
                        headerName: 'Catatan',
                        minWidth: 200,
                        renderCell: ({ row }) => (
                            <div className="flex items-center h-full w-full">
                                {row?.pengajuan_catatan ?? (
                                    <p className="italic text-xs opacity-50 tracking-tighter">
                                        Tidak ada catatan
                                    </p>
                                )}
                            </div>
                        )
                    },
                    {
                        field: 'tanggal',
                        headerName: 'Tanggal',
                        minWidth: 200,
                        valueGetter: (value, row) => dayjs(value).locale('id').format('dddd, DD MMMM YYYY')
                    },
                    {
                        field: 'aksi',
                        headerName: '',
                        align: 'center',
                        renderCell: ({ row }) => (
                            <div className="flex items-center justify-center w-full h-full gap-2">
                                <Tooltip arrow title="Lihat Mata Kuliah">
                                    <IconButton size="small" color="primary" onClick={() => aksi.riwayat.matkul(row?.krs_matkul)}>
                                        <Visibility fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                {row?.sts_krs === 'S' && (
                                    <Tooltip arrow title="Unduh KSM">
                                        <IconButton size="small" color="primary" onClick={() => window.open(`/ksm/download/krs_id/${row?.krs_id}`, '_blank', 'noopener,noreferrer')}>
                                            <Download fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </div>
                        )
                    }
                ]}
            />
        </div>
    )
}

function TabSemester({
    semester,
    loading,
    matakuliah,
    krs_disabled,
    selected_matakuliah = [],
    onSelect_matakuliah = () => {},
    key
}) {

    const aksi = {
        matakuliah: {
            get: {
                semester: (semester) => {
                    const data = matakuliah.find(item => item.semester === semester)

                    return data ? data['mata_kuliah'] : []
                }
            },
            is_draft: (mk_id) => {
                return selected_matakuliah.find(item => item.mk_id.includes(mk_id))
            },
            selectable: (krs, mk_id) => {
                if(selected_matakuliah.find(item => item?.mk_id?.includes(mk_id))) {
                    return true
                }

                if(krs?.is_aktif) {
                    return true
                }

                return false
            }
        }
    }
    return (
        <div key={key} className="p-4">
            <CustomDataTable 
                checkbox={!krs_disabled}
                isRowSelectable={(params) => aksi.matakuliah.selectable(params.row.krs, params.row.mk_id)}
                pageSize={25}
                loading={loading}
                rows={aksi.matakuliah.get.semester(semester)}
                getRowId={(row) => row.mk_id}
                rowSelect={{
                    value: selected_matakuliah.find(v => v.semester === semester)?.mk_id || [],
                    onChange: onSelect_matakuliah
                }}
                columns={[
                    // {
                    //     field: 'mk_id',
                    //     headerName: 'Kode Mata Kuliah',
                    //     minWidth: 150,
                    //     valueGetter: (value, row) => row.kd_mk
                    // },
                    {
                        field: 'nm_mk',
                        headerName: 'Nama',
                        minWidth: 250
                    },
                    {
                        field: 'mk_id',
                        headerName: 'Kode',
                        minWidth: 150,
                        valueGetter: (value, row) => row.kd_mk
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

function KHSPage({ token, base_url, role}) {
    const { goTo } = useRedirect()
    const { userdata, loadingUserdata } = useUser() 

    const [listData, setListData] = useState({
        khs: {
            data: null,
            loading: false
        },
        semester: {
            data: null,
            loading: false
        }
    })



    const aksi = {
        semester: {
            set: (column, value) => {
                setListData(state => ({
                    ...state,
                    semester: {
                        ...state.semester,
                        [column]: value
                    }
                }))
            },
            get: async (semester) => {
                try {
                    aksi.semester.set('loading', true)

                    const response = await api_handler.get({
                        base_url,
                        token,
                        url: `krs/ip/semester?s=${semester}`
                    })

                    aksi.semester.set('loading', false)

                    if(response.success) {
                        aksi.semester.set('data', response?.data)
                    }else{
                        aksi.semester.set('data', null)
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
            },
            detail: {
                get: (semester) => {
                    aksi.semester.get(semester)
                    modal.show('detail_semester')
                }
            }
        }
    }

    useEffect(() => {
        aksi.khs.get()
    }, [])

    return (
        <div className="divide-y divide-zinc-300">
            <div className="p-4">
                <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                    <div className="flex justify-end mb-4">
                        <Button
                            size="small"
                            variant="contained"
                            startIcon={<DownloadOutlined fontSize="small" />}
                            disabled={listData.khs.loading || !listData.khs.data?.ip_per_semester?.length}
                            onClick={() => window.open('/khs/download', '_blank', 'noopener,noreferrer')}
                        >
                            <p className="font-jakarta text-xs">Unduh KHS PDF</p>
                        </Button>
                    </div>
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

            <Modal modalId="detail_semester" title="Detail Semester" modalBoxClassname="max-w-3xl">
                <div className="divide-y divide-zinc-300">
                    {/* <div className="p-4">
                        <Button variant="contained" onClick={() => window.open(`/ksm/download/semester/${listData.semester.data?.semester}`, '_blank', 'noopener,noreferrer')} startIcon={<DownloadTwoTone />} fullWidth>
                            <p className="font-jakarta font-medium">  
                                Unduh KSM
                            </p>
                        </Button>
                    </div> */}
                    <CustomDataTable 
                        toolbar={{ search: true, export: false, import: false, column: false, density: false }}
                        pageSize={25}
                        loading={listData.semester.loading}
                        rows={listData.semester.data?.matakuliah}
                        getRowId={(row) => row.kd_mk}
                        columns={[
                            {
                                field: 'nm_mk',
                                headerName: 'Nama',
                                minWidth: 250
                            },
                            // {
                            //     field: 'kd_mk',
                            //     headerName: 'Kode',
                            //     minWidth: 150,
                            //     headerClassname: 'bg-zinc-100'
                            // },
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
                                        {row?.nilai === 'A' && (
                                            <div className="flex items-center justify-center w-6 h-6 bg-green-100 font-bold text-green-700 text-xs rounded">
                                                {row?.nilai}
                                            </div>
                                        )}
                                        {row?.nilai === 'B' && (
                                            <div className="flex items-center justify-center w-6 h-6 bg-blue-100 font-bold text-blue-700 text-xs rounded">
                                                {row?.nilai}
                                            </div>
                                        )}
                                        {row?.nilai === 'C' && (
                                            <div className="flex items-center justify-center w-6 h-6 bg-amber-100 font-bold text-amber-700 text-xs rounded">
                                                {row?.nilai}
                                            </div>
                                        )}
                                        {row?.nilai === 'D' && (
                                            <div className="flex items-center justify-center w-6 h-6 bg-orange-100 font-bold text-orange-700 text-xs rounded">
                                                {row?.nilai}
                                            </div>
                                        )}
                                        {row?.nilai === 'E' && (
                                            <div className="flex items-center justify-center w-6 h-6 bg-red-100 font-bold text-red-700 text-xs rounded">
                                                {row?.nilai}
                                            </div>
                                        )}
                                    </div>
                                )
                            },
                            {
                                field: 'nilai_mutu',
                                headerName: 'Mutu',
                                valueGetter: (value, row) => row?.mutu,
                                align: 'center',
                                headerAlign: 'center'
                            }
                        ]}
                    />
                </div>
            </Modal>

            <div className="p-4">
                <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <CustomLoading loading={listData.khs.loading} renderIf={listData.khs.data}>
                            {listData.khs.data?.ip_per_semester?.map(item => (
                                <div key={item['semester']} className="border border-zinc-300 rounded-md shadow divide-y divide-zinc-300 overflow-hidden">
                                    <div className="px-4 py-3 bg-zinc-50 text-zinc-700">
                                        <div className="flex items-center justify-between">
                                            <h1 className="text-lg font-semibold tracing-tighter opacity-80">
                                                Semester {item['semester']}
                                            </h1>
                                            <Button variant="contained" onClick={() => aksi.khs.detail.get(item['semester'])} color="primary" size="small" endIcon={<East fontSize="small" />}>
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
                                    <div className="p-4 space-y-4 bg-zinc-50 text-zinc-700">
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
    )
}

