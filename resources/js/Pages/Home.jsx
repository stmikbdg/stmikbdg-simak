import {
    AccessTimeOutlined,
    AccountBalanceWalletTwoTone,
    Add,
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
    Delete,
    Download,
    East,
    EastOutlined,
    FingerprintOutlined,
    HowToRegTwoTone,
    Image,
    IndeterminateCheckBoxTwoTone,
    InfoOutlined,
    KeyboardDoubleArrowRightOutlined,
    LocationOnOutlined,
    MenuBookTwoTone,
    MenuOutlined,
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

export default function Home({ token, base_url, role, app }) {

    if (role.mahasiswa.enable) {
        return <MahasiswaPage token={token} base_url={base_url} role={role} app={app} />;
    }

    if (role.dosen.enable) {
        return <DosenPage token={token} base_url={base_url} role={role} app={app} />;
    }

    if (role.dosen_wali.enable) {
        return <DosenWaliPage token={token} base_url={base_url} role={role} app={app} />;
    }

    if (role.admin.enable) {
        return <AdminPage token={token} base_url={base_url} role={role} app={app} />;
    }

    if(role?.prodi?.enable) {
        return <ProdiPage token={token} base_url={base_url} role={role} app={app} />
    }
}

function ProdiPage_Rekap_BeritaAcara({ token, base_url, role }) {
    const [listData, setListData] = useState({
        tahun_ajaran: {
            data: [],
            loading: {
                fetch: false,
                refresh: false
            },
            select: null
        },
        dosen: {
            data: [],
            loading: {
                fetch: false,
                refresh: false
            },
            select: null
        },
        matkul: {
            data: [],
            select: null,
            loading: false,
            error: null
        },
        tanggal: {
            from: null,
            to: null
        },
        detail: {
            data: null,
            loading: false
        }
    })

    const aksi = {
        tahun_ajaran: {
            get: async () => {
                try {
                    aksi.tahun_ajaran.loading('fetch')

                    const response = await api_handler.get({
                        url: 'rekap/presensi/filter/tahun-ajaran',
                        base_url,
                        token
                    })

                    aksi.tahun_ajaran.loading('fetch')

                    if (response?.success) {
                        aksi.tahun_ajaran.set('data', response?.data?.tahun_ajaran)                        
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
                setListData({
                    ...listData,
                    tahun_ajaran: {
                        ...listData.tahun_ajaran,
                        [column]: value
                    }
                })
            },
            loading: (column) => {
                setListData({
                    ...listData,
                    tahun_ajaran: {
                        ...listData.tahun_ajaran,
                        loading: {
                            ...listData.tahun_ajaran.loading,
                            [column]: !listData.tahun_ajaran.loading[column]
                        }
                    }
                })
            },
            select: async (value) => {
                // aksi.dosen.set('data', [])
                aksi.tahun_ajaran.set('select', value)
                aksi.dosen.set('select', null)
                aksi.matkul.set('select', null)
                aksi.detail.set('data', null)
                if(value) {
                    aksi.dosen.get(value['tahun_id'])
                }else{
                    aksi.dosen.set('data', [])
                }

            }
        },
        dosen: {
            get: async (tahun_id) => {
                try {
                    // aksi.dosen.set('data', [])
                    aksi.dosen.loading('fetch')

                    const response = await api_handler.get({
                        url: `rekap/presensi/filter/dosen?tahun_id=${tahun_id}`,
                        base_url,
                        token
                    })

                    aksi.dosen.loading('fetch')
                    
                    if (response?.success) {
                        aksi.dosen.set('data', response?.data?.dosen_mengajar)                        
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
                    dosen: {
                        ...state.dosen,
                        [column]: value
                    }
                }))
            },
            loading: (column) => {
                setListData(state => ({
                    ...state,
                    dosen: {
                        ...state.dosen,
                        loading: {
                            ...state.dosen.loading,
                            [column]: !state.dosen.loading[column]
                        }
                    }
                }))
            },
            select: (dosen) => {
                aksi.matkul.set('data', null)
                aksi.matkul.select(null)
                aksi.dosen.set('select', dosen)
                aksi.detail.set('data', null)
                if(dosen) {
                    aksi.matkul.get(dosen)
                }
            }
        },
        matkul: {
            get: async (dosen) => {
                try {
                    aksi.matkul.set('loading', true)

                    const response = await api_handler.get({
                        url: `rekap/presensi/filter/matkul?tahun_id=${dosen?.tahun_id}&dosen_id=${dosen?.dosen_id}`,
                        base_url,
                        token
                    })

                    aksi.matkul.set('loading', false)

                    if (response?.success) {
                        aksi.matkul.set('data', response?.data?.matakuliah_diselenggarakan)
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
                    matkul: {
                        ...state.matkul,
                        [column]: value
                    }
                }))
            },
            select: (matkul) => {
                
                aksi.matkul.set('select', matkul)
                if(matkul) {
                    aksi.detail.get(matkul)
                }else{
                    aksi.detail.set('data', null)
                }
            }
        },
        detail: {
            get: async (matkul) => {
                try {
                    if(!listData.tanggal.from || !listData.tanggal.to) {
                        return
                    }

                    aksi.detail.set('loading', true)

                    const response = await api_handler.get({
                        url: `rekap/berita-acara?kelas_kuliah_id=${matkul?.kelas_kuliah_id}&from=${dayjs(listData.tanggal.from).format('YYYY-MM-DD')}&to=${dayjs(listData.tanggal.to).format('YYYY-MM-DD')}`,  
                        base_url,
                        token  
                    })

                    aksi.detail.set('loading', false)

                    if(!response?.success) {
                        customSwal.toast.error({
                            message: response?.message
                        })

                        return
                    }

                    aksi.detail.set('data', response?.data)
                } catch (error) {
                    customSwal.toast.error({
                        message: error?.message
                    })
                }
            },
            set: (column, value) => {
                setListData(state => ({
                    ...state,
                    detail: {
                        ...state.detail,
                        [column]: value
                    }
                }))
            },
        },
        tanggal: {
            set: (column, value) => {
                setListData(state => ({
                    ...state,
                    tanggal: {
                        ...state.tanggal,
                        [column]: value
                    }
                }))
            },
            from: (value) => {
                aksi.tanggal.set('from', value)
            },
            to: (value) => {
                aksi.tanggal.set('to', value)
            }
        }
    }

    useEffect(() => {
        (async () => {
            await aksi.tahun_ajaran.get()
        })();
    }, [])

    useEffect(() => {
        if(listData.tanggal.from && listData.tanggal.to) {
            aksi.detail.get(listData.matkul.select)
        }else{
            aksi.detail.set('data', null)
        }
    }, [listData.tanggal.from, listData.tanggal.to])

    return (
        <div className="divide-y divide-zinc-300">

            <div className="p-4 ">
                <div className="sm:max-w-1/2 space-y-4">
                    <CustomSelect 
                        label="Cari dan Pilih Tahun Ajaran"
                        placeholder="2024/2025"
                        loading={listData.tahun_ajaran.loading.fetch || listData.dosen.loading.fetch}
                        loadingText="Loading.."
                        optionLabel="uraian"
                        options={listData.tahun_ajaran.data}
                        value={listData.tahun_ajaran.select}
                        onChange={(e, value) => aksi.tahun_ajaran.select(value)}
                        disabled={listData.tahun_ajaran.loading.fetch || listData.dosen.loading.fetch}
                    />
                    <CustomSelect 
                        label={listData.tahun_ajaran.select ? "Cari dan Pilih Dosen Mengajar" : "Silahkan pilih Tahun Ajaran terlebih dahulu"}
                        placeholder="Nama Dosen disini"
                        loading={listData.dosen.loading.fetch}
                        loadingText="Loading.."
                        optionLabel="nm_dosen"
                        options={listData.dosen.data}
                        value={listData.dosen.select}
                        onChange={(e, value) => aksi.dosen.select(value)}
                        disabled={listData.tahun_ajaran.loading.fetch || listData.dosen.loading.fetch || !listData.tahun_ajaran.select}
                    />
                    <CustomSelect 
                        label={listData.dosen.select ? "Cari dan Pilih Mata Kuliah" : "Silahkan pilih Dosen Mengajar terlebih dahulu"}
                        placeholder="Nama Mata Kuliah disini"
                        loading={listData.matkul.loading || listData.dosen.loading.fetch}
                        loadingText="Loading.."
                        // optionLabel="uraian"
                        getOptionLabel={(option) => option?.matakuliah?.nm_mk}
                        options={listData.matkul.data}
                        value={listData.matkul.select}
                        onChange={(e, value) => aksi.matkul.select(value)}
                        disabled={listData.matkul.loading || listData.dosen.loading.fetch || !listData.dosen.select}
                    />
                    <div className="grid sm:grid-cols-2 gap-4">
                        <DatePicker 
                            label="Dari Tanggal"
                            value={listData.tanggal.from}
                            onChange={(value) => aksi.tanggal.from(value)}
                            disabled={!listData.matkul.select}
                            slotProps={{
                                field: {
                                    clearable: true
                                }
                            }}

                        />
                        <DatePicker 
                            label="Hingga Tanggal"
                            value={listData.tanggal.to}
                            onChange={(value) => aksi.tanggal.to(value)}
                            disabled={!listData.matkul.select}
                            slotProps={{
                                field: {
                                    clearable: true
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
            {!listData.tahun_ajaran.select || !listData.dosen.select || !listData.matkul.select
                ? (
                    <div className="flex items-center justify-center h-80">
                        Silahkan Isi Kolom diatas terlebih dahulu
                    </div>
                )
                : (
                    <CustomDataTable 
                        loading={listData.detail.loading}
                        rows={listData.detail.data?.berita_acara || []}
                        getRowId={(row) => row?.berita_acara_id}
                        columns={[
                            {
                                field: 'berita_acara',
                                headerName: 'Berita Acara',
                                minWidth: 250
                            },
                            {
                                field: 'mhs_hdr',
                                headerName: 'Mahasiswa Hadir',
                                minWidth: 150
                            },
                            {
                                field: 'mhs_tdk_hdr',
                                headerName: 'Mahasiswa Tidak Hadir',  
                                minWidth: 150
                            },
                            {
                                field: 'jml_mhs',
                                headerName: 'Jumlah Mahasiswa'
                            },
                            {
                                field: 'created_at',
                                headerName: 'Tanggal',
                                minWidth: 250,
                                valueGetter: (value, row) => dayjs(value).locale('id').format('DD MMMM YYYY, HH:mm:ss')
                            }
                        ]}
                    />
                )
            } 
        </div>
    )
}

function ProdiPage_Pengumuman({ token, base_url, role }) {
    const { userdata, loadingUserdata } = useUser();
    
    const [listData, setListData] = useState({
        pengumuman: {
            data: [],
            meta: null,
            loading: {
                fetch: false,
                refresh: false
            }
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
                        url: 'pengumuman/list'
                    })

                    aksi.pengumuman.loading('fetch')

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
                        url: 'pengumuman/list'
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
            }
        }
    }

    useEffect(() => {
        (async () => {
            aksi.pengumuman.get()
        })();
    }, []);

    return (
        <div className="p-4">
            <div className="flex justify-center">
                <div className="max-w-5xl w-full space-y-4 flex flex-col items-center">

                    {listData.pengumuman.loading.fetch || listData.pengumuman.loading.refresh
                        ? (
                            <div className="w-full h-80 flex items-center justify-center">
                                <CircularProgress size={45} color="primary" />
                            </div>
                        )
                        : listData.pengumuman.data.length < 1 
                            ? (
                                <div className="w-full h-80 flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <p className="italic opacity-50">
                                            Tampaknya belum ada pengumuman
                                        </p>
                                    </div>
                                </div>
                            )
                            : (
                                <>
                                    {listData.pengumuman.data.filter(pengumuman => pengumuman?.target === 0).map(pengumuman => (
                                        <div key={pengumuman['pengumuman_id']} className={`relative overflow-hidden rounded-md ${pengumuman['target'] === 0 ? 'border-2 border-blue-500' : 'border border-zinc-300'} w-full shadow-md`}>
                                            <div className="space-y-1">
                                                {pengumuman['target'] === 0
                                                    ? (
                                                        <div className="bg-blue-800/80 p-4 border-b border-zinc-300 text-white font-semibold">
                                                            <div className="flex items-center gap-4">
                                                                <CampaignTwoTone fontSize="small" />
                                                                <p>
                                                                    {pengumuman['keterangan_target']}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )
                                                    : (
                                                        <div className="bg-zinc-50 p-4 border-b border-zinc-300">
                                                            <div className="flex items-center gap-4">
                                                                <CampaignTwoTone fontSize="small" />
                                                                <p>
                                                                    {pengumuman['keterangan_target']}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                <div className="p-4">
                                                    <div className="flex items-center gap-4">
                                                        <Avatar 
                                                            sx={{
                                                                width: 40,
                                                                height: 40
                                                            }}
                                                            className="w-80 h-80"
                                                            src={pengumuman['avatar_pengirim']}
                                                            alt="Foto Profil"
                                                        />
                                                        <div className="space-y-1">
                                                            <p className="font-bold">
                                                                {pengumuman['nm_pengirim']}
                                                            </p>
                                                            <p className="text-xs font-light italic opacity-70">
                                                                {dayjs(pengumuman['tgl_dikirim']).locale('id').format('dddd, DD MMMM YYYY, HH:mm:ss')}
                                                            </p>
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className="p-4">
                                                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(pengumuman['message'])}}></div>
                                                </div>
                                                {pengumuman['image'] && (
                                                    <img className="w-full h-full" src={pengumuman['image']} alt="Foto Pengumuman" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )
                    }

                </div>
            </div>
        </div>
    )
}

function ProdiPage_Rekap_Pertemuan({ token, base_url, role }) {
    const [listData, setListData] = useState({
        tahun_ajaran: {
            data: [],
            loading: {
                fetch: false,
                refresh: false
            },
            select: null
        },
        dosen: {
            data: [],
            loading: {
                fetch: false,
                refresh: false
            },
            select: null
        },
        matkul: {
            data: [],
            select: null,
            loading: false,
            error: null
        },
        tanggal: {
            from: null,
            to: null
        },
        detail: {
            data: null,
            loading: false
        }
    })

    const aksi = {
        tahun_ajaran: {
            get: async () => {
                try {
                    aksi.tahun_ajaran.loading('fetch')

                    const response = await api_handler.get({
                        url: 'rekap/presensi/filter/tahun-ajaran',
                        base_url,
                        token
                    })

                    aksi.tahun_ajaran.loading('fetch')

                    if (response?.success) {
                        aksi.tahun_ajaran.set('data', response?.data?.tahun_ajaran)                        
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
                setListData({
                    ...listData,
                    tahun_ajaran: {
                        ...listData.tahun_ajaran,
                        [column]: value
                    }
                })
            },
            loading: (column) => {
                setListData({
                    ...listData,
                    tahun_ajaran: {
                        ...listData.tahun_ajaran,
                        loading: {
                            ...listData.tahun_ajaran.loading,
                            [column]: !listData.tahun_ajaran.loading[column]
                        }
                    }
                })
            },
            select: async (value) => {
                // aksi.dosen.set('data', [])
                aksi.tahun_ajaran.set('select', value)
                aksi.dosen.set('select', null)
                aksi.matkul.set('select', null)
                aksi.detail.set('data', null)
                if(value) {
                    aksi.dosen.get(value['tahun_id'])
                }else{
                    aksi.dosen.set('data', [])
                }

            }
        },
        dosen: {
            get: async (tahun_id) => {
                try {
                    // aksi.dosen.set('data', [])
                    aksi.dosen.loading('fetch')

                    const response = await api_handler.get({
                        url: `rekap/presensi/filter/dosen?tahun_id=${tahun_id}`,
                        base_url,
                        token
                    })

                    aksi.dosen.loading('fetch')
                    
                    if (response?.success) {
                        aksi.dosen.set('data', response?.data?.dosen_mengajar)                        
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
                    dosen: {
                        ...state.dosen,
                        [column]: value
                    }
                }))
            },
            loading: (column) => {
                setListData(state => ({
                    ...state,
                    dosen: {
                        ...state.dosen,
                        loading: {
                            ...state.dosen.loading,
                            [column]: !state.dosen.loading[column]
                        }
                    }
                }))
            },
            select: (dosen) => {
                aksi.matkul.set('data', null)
                aksi.matkul.select(null)
                aksi.dosen.set('select', dosen)
                aksi.detail.set('data', null)
                if(dosen) {
                    aksi.matkul.get(dosen)
                }
            }
        },
        matkul: {
            get: async (dosen) => {
                try {
                    aksi.matkul.set('loading', true)

                    const response = await api_handler.get({
                        url: `rekap/presensi/filter/matkul?tahun_id=${dosen?.tahun_id}&dosen_id=${dosen?.dosen_id}`,
                        base_url,
                        token
                    })

                    aksi.matkul.set('loading', false)

                    if (response?.success) {
                        aksi.matkul.set('data', response?.data?.matakuliah_diselenggarakan)
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
                    matkul: {
                        ...state.matkul,
                        [column]: value
                    }
                }))
            },
            select: (matkul) => {
                
                aksi.matkul.set('select', matkul)
                if(matkul) {
                    aksi.detail.get(matkul)
                }else{
                    aksi.detail.set('data', null)
                }
            }
        },
        detail: {
            get: async (matkul) => {
                try {
                    if(!listData.tanggal.from || !listData.tanggal.to) {
                        return
                    }

                    aksi.detail.set('loading', true)

                    const response = await api_handler.get({
                        url: `rekap/pertemuan?kelas_kuliah_id=${matkul?.kelas_kuliah_id}&from=${dayjs(listData.tanggal.from).format('YYYY-MM-DD')}&to=${dayjs(listData.tanggal.to).format('YYYY-MM-DD')}`,  
                        base_url,
                        token  
                    })

                    aksi.detail.set('loading', false)

                    if(!response?.success) {
                        customSwal.toast.error({
                            message: response?.message
                        })

                        return
                    }

                    aksi.detail.set('data', response?.data)
                } catch (error) {
                    customSwal.toast.error({
                        message: error?.message
                    })
                }
            },
            set: (column, value) => {
                setListData(state => ({
                    ...state,
                    detail: {
                        ...state.detail,
                        [column]: value
                    }
                }))
            },
        },
        tanggal: {
            set: (column, value) => {
                setListData(state => ({
                    ...state,
                    tanggal: {
                        ...state.tanggal,
                        [column]: value
                    }
                }))
            },
            from: (value) => {
                aksi.tanggal.set('from', value)
            },
            to: (value) => {
                aksi.tanggal.set('to', value)
            }
        }
    }

    useEffect(() => {
        (async () => {
            await aksi.tahun_ajaran.get()
        })();
    }, [])

    useEffect(() => {
        if(listData.tanggal.from && listData.tanggal.to) {
            aksi.detail.get(listData.matkul.select)
        }else{
            aksi.detail.set('data', null)
        }
    }, [listData.tanggal.from, listData.tanggal.to])

    return (
        <div className="divide-y divide-zinc-300">

            <div className="p-4 ">
                <div className="sm:max-w-1/2 space-y-4">
                    <CustomSelect 
                        label="Cari dan Pilih Tahun Ajaran"
                        placeholder="2024/2025"
                        loading={listData.tahun_ajaran.loading.fetch || listData.dosen.loading.fetch}
                        loadingText="Loading.."
                        optionLabel="uraian"
                        options={listData.tahun_ajaran.data}
                        value={listData.tahun_ajaran.select}
                        onChange={(e, value) => aksi.tahun_ajaran.select(value)}
                        disabled={listData.tahun_ajaran.loading.fetch || listData.dosen.loading.fetch}
                    />
                    <CustomSelect 
                        label={listData.tahun_ajaran.select ? "Cari dan Pilih Dosen Mengajar" : "Silahkan pilih Tahun Ajaran terlebih dahulu"}
                        placeholder="Nama Dosen disini"
                        loading={listData.dosen.loading.fetch}
                        loadingText="Loading.."
                        optionLabel="nm_dosen"
                        options={listData.dosen.data}
                        value={listData.dosen.select}
                        onChange={(e, value) => aksi.dosen.select(value)}
                        disabled={listData.tahun_ajaran.loading.fetch || listData.dosen.loading.fetch || !listData.tahun_ajaran.select}
                    />
                    <CustomSelect 
                        label={listData.dosen.select ? "Cari dan Pilih Mata Kuliah" : "Silahkan pilih Dosen Mengajar terlebih dahulu"}
                        placeholder="Nama Mata Kuliah disini"
                        loading={listData.matkul.loading || listData.dosen.loading.fetch}
                        loadingText="Loading.."
                        // optionLabel="uraian"
                        getOptionLabel={(option) => option?.matakuliah?.nm_mk}
                        options={listData.matkul.data}
                        value={listData.matkul.select}
                        onChange={(e, value) => aksi.matkul.select(value)}
                        disabled={listData.matkul.loading || listData.dosen.loading.fetch || !listData.dosen.select}
                    />
                    <div className="grid sm:grid-cols-2 gap-4">
                        <DatePicker 
                            label="Dari Tanggal"
                            value={listData.tanggal.from}
                            onChange={(value) => aksi.tanggal.from(value)}
                            disabled={!listData.matkul.select}
                            slotProps={{
                                field: {
                                    clearable: true
                                }
                            }}

                        />
                        <DatePicker 
                            label="Hingga Tanggal"
                            value={listData.tanggal.to}
                            onChange={(value) => aksi.tanggal.to(value)}
                            disabled={!listData.matkul.select}
                            slotProps={{
                                field: {
                                    clearable: true
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
            {!listData.tahun_ajaran.select || !listData.dosen.select || !listData.matkul.select
                ? (
                    <div className="flex items-center justify-center h-80">
                        Silahkan Isi Kolom diatas terlebih dahulu
                    </div>
                )
                : listData.detail.loading
                    ? (
                        <div className="flex items-center justify-center h-80">
                            <CircularProgress size={30} color="primary" />
                        </div>
                    )
                    : !listData.detail.data
                        ? (
                            <div className="flex items-center justify-center h-80">
                                Data yang anda cari tidak ditemukan
                            </div>
                        ) 
                        : (
                            <div className="p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="font-medium text-lg">
                                        Tanggal Daftar Pertemuan
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 font-medium">
                                    {listData.detail.data?.rekap_pertemuan?.map(item => (
                                        <p key={item?.tanggal} className="w-fit px-5 py-3 rounded-full bg-zinc-100">
                                            {dayjs(item?.tanggal).locale('id').format('DD MMMM YYYY')}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )
            }
            
        </div>
    )
}

function ProdiPage_Rekap_Presensi({ token, base_url, role }) {

    const [listData, setListData] = useState({
        tahun_ajaran: {
            data: [],
            loading: {
                fetch: false,
                refresh: false
            },
            select: null
        },
        dosen: {
            data: [],
            loading: {
                fetch: false,
                refresh: false
            },
            select: null
        },
        matkul: {
            data: [],
            select: null,
            loading: false,
            error: null
        },
        detail: {
            data: null,
            loading: false
        }
    })

    const aksi = {
        tahun_ajaran: {
            get: async () => {
                try {
                    aksi.tahun_ajaran.loading('fetch')

                    const response = await api_handler.get({
                        url: 'rekap/presensi/filter/tahun-ajaran',
                        base_url,
                        token
                    })

                    aksi.tahun_ajaran.loading('fetch')

                    if (response?.success) {
                        aksi.tahun_ajaran.set('data', response?.data?.tahun_ajaran)                        
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
                setListData({
                    ...listData,
                    tahun_ajaran: {
                        ...listData.tahun_ajaran,
                        [column]: value
                    }
                })
            },
            loading: (column) => {
                setListData({
                    ...listData,
                    tahun_ajaran: {
                        ...listData.tahun_ajaran,
                        loading: {
                            ...listData.tahun_ajaran.loading,
                            [column]: !listData.tahun_ajaran.loading[column]
                        }
                    }
                })
            },
            select: async (value) => {
                // aksi.dosen.set('data', [])
                aksi.tahun_ajaran.set('select', value)
                aksi.dosen.set('select', null)
                aksi.matkul.set('select', null)
                aksi.detail.set('data', null)
                if(value) {
                    aksi.dosen.get(value['tahun_id'])
                }else{
                    aksi.dosen.set('data', [])
                }

            }
        },
        dosen: {
            get: async (tahun_id) => {
                try {
                    // aksi.dosen.set('data', [])
                    aksi.dosen.loading('fetch')

                    const response = await api_handler.get({
                        url: `rekap/presensi/filter/dosen?tahun_id=${tahun_id}`,
                        base_url,
                        token
                    })

                    aksi.dosen.loading('fetch')
                    
                    if (response?.success) {
                        aksi.dosen.set('data', response?.data?.dosen_mengajar)                        
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
                    dosen: {
                        ...state.dosen,
                        [column]: value
                    }
                }))
            },
            loading: (column) => {
                setListData(state => ({
                    ...state,
                    dosen: {
                        ...state.dosen,
                        loading: {
                            ...state.dosen.loading,
                            [column]: !state.dosen.loading[column]
                        }
                    }
                }))
            },
            select: (dosen) => {
                aksi.matkul.set('data', null)
                aksi.matkul.select(null)
                aksi.dosen.set('select', dosen)
                aksi.detail.set('data', null)
                if(dosen) {
                    aksi.matkul.get(dosen)
                }
            }
        },
        matkul: {
            get: async (dosen) => {
                try {
                    aksi.matkul.set('loading', true)

                    const response = await api_handler.get({
                        url: `rekap/presensi/filter/matkul?tahun_id=${dosen?.tahun_id}&dosen_id=${dosen?.dosen_id}`,
                        base_url,
                        token
                    })

                    aksi.matkul.set('loading', false)

                    if (response?.success) {
                        aksi.matkul.set('data', response?.data?.matakuliah_diselenggarakan)
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
                    matkul: {
                        ...state.matkul,
                        [column]: value
                    }
                }))
            },
            select: (matkul) => {
                
                aksi.matkul.set('select', matkul)
                if(matkul) {
                    aksi.detail.get(matkul)
                }else{
                    aksi.detail.set('data', null)
                }
            }
        },
        detail: {
            get: async (matkul) => {
                try {
                    aksi.detail.set('loading', true)

                    const response = await api_handler.get({
                        url: `rekap/presensi?kelas_kuliah_id=${matkul?.kelas_kuliah_id}`,  
                        base_url,
                        token  
                    })

                    aksi.detail.set('loading', false)

                    if(!response?.success) {
                        customSwal.toast.error({
                            message: response?.message
                        })

                        return
                    }

                    aksi.detail.set('data', response?.data?.rekap_presensi)
                } catch (error) {
                    customSwal.toast.error({
                        message: error?.message
                    })
                }
            },
            set: (column, value) => {
                setListData(state => ({
                    ...state,
                    detail: {
                        ...state.detail,
                        [column]: value
                    }
                }))
            },
        }
    }

    useEffect(() => {
        (async () => {
            await aksi.tahun_ajaran.get()
        })();
    }, [])

    return (
        <div className="divide-y divide-zinc-300">

            <div className="p-4 ">
                <div className="sm:max-w-1/2 space-y-4">
                    <CustomSelect 
                        label="Cari dan Pilih Tahun Ajaran"
                        placeholder="2024/2025"
                        loading={listData.tahun_ajaran.loading.fetch || listData.dosen.loading.fetch}
                        loadingText="Loading.."
                        optionLabel="uraian"
                        options={listData.tahun_ajaran.data}
                        value={listData.tahun_ajaran.select}
                        onChange={(e, value) => aksi.tahun_ajaran.select(value)}
                        disabled={listData.tahun_ajaran.loading.fetch || listData.dosen.loading.fetch}
                    />
                    <CustomSelect 
                        label={listData.tahun_ajaran.select ? "Cari dan Pilih Dosen Mengajar" : "Silahkan pilih Tahun Ajaran terlebih dahulu"}
                        placeholder="Nama Dosen disini"
                        loading={listData.dosen.loading.fetch}
                        loadingText="Loading.."
                        optionLabel="nm_dosen"
                        options={listData.dosen.data}
                        value={listData.dosen.select}
                        onChange={(e, value) => aksi.dosen.select(value)}
                        disabled={listData.tahun_ajaran.loading.fetch || listData.dosen.loading.fetch || !listData.tahun_ajaran.select}
                    />
                    <CustomSelect 
                        label={listData.dosen.select ? "Cari dan Pilih Mata Kuliah" : "Silahkan pilih Dosen Mengajar terlebih dahulu"}
                        placeholder="Nama Mata Kuliah disini"
                        loading={listData.matkul.loading || listData.dosen.loading.fetch}
                        loadingText="Loading.."
                        // optionLabel="uraian"
                        getOptionLabel={(option) => option?.matakuliah?.nm_mk}
                        options={listData.matkul.data}
                        value={listData.matkul.select}
                        onChange={(e, value) => aksi.matkul.select(value)}
                        disabled={listData.matkul.loading || listData.dosen.loading.fetch || !listData.dosen.select}
                    />
                </div>
            </div>
            {!listData.tahun_ajaran.select || !listData.dosen.select || !listData.matkul.select
                ? (
                    <div className="flex items-center justify-center h-80">
                        Silahkan Isi Kolom diatas terlebih dahulu
                    </div>
                )
                : (
                    <CustomDataTable 
                        loading={listData.detail.loading}
                        rows={listData.detail.data?.kehadiran_mahasiswa || []}
                        getRowId={(row) => row?.mhs_id}
                        columns={[
                            {
                                field: 'nim',
                                headerName: 'NIM',
                                minWidth: 150
                            },
                            {
                                field: 'nm_mhs',
                                headerName: 'Nama',
                                minWidth: 350
                            },
                            {
                                field: 'total_kehadiran',
                                headerName: 'Kehadiran',  
                            },
                            {
                                field: 'total_pertemuan',
                                headerName: 'Pertemuan'
                            },
                            {
                                field: 'persentase_kehadiran',
                                headerName: 'Persentase Kehadiran',
                                minWidth: 250,
                                valueGetter: (value, row) => `${value}%`
                            }
                        ]}
                    />
                )
            }
            {/* <CustomTabs>
                <CustomTabItem label="Daftar Mahasiswa">
                    {!listData.tahun_ajaran.select || !listData.dosen.select || !listData.matkul.select
                        ? (
                            <div className="flex items-center justify-center h-80">
                                Silahkan Isi Kolom diatas terlebih dahulu
                            </div>
                        )
                        : (
                            <CustomDataTable 
                                loading={listData.detail.loading}
                                rows={listData.detail.data?.kehadiran_mahasiswa || []}
                                getRowId={(row) => row?.mhs_id}
                                columns={[
                                    {
                                        field: 'nim',
                                        headerName: 'NIM',
                                        minWidth: 150
                                    },
                                    {
                                        field: 'nm_mhs',
                                        headerName: 'Nama',
                                        minWidth: 350
                                    },
                                    {
                                        field: 'total_kehadiran',
                                        headerName: 'Kehadiran',  
                                    },
                                    {
                                        field: 'total_pertemuan',
                                        headerName: 'Pertemuan'
                                    },
                                    {
                                        field: 'persentase_kehadiran',
                                        headerName: 'Persentase Kehadiran',
                                        minWidth: 250,
                                        valueGetter: (value, row) => `${value}%`
                                    }
                                ]}
                            />
                        )
                    }
                </CustomTabItem>
                <CustomTabItem label="Detail Kelas">
                    {!listData.tahun_ajaran.select || !listData.dosen.select || !listData.matkul.select
                        ? (
                            <div className="flex items-center justify-center h-80">
                                Silahkan Isi Kolom diatas terlebih dahulu
                            </div>
                        )
                        : listData.detail.loading
                            ? (
                                <div className="flex items-center justify-center h-80">
                                    <CircularProgress size={30} color="primary" />
                                </div>
                            )
                            : !listData.detail.data
                                ? (
                                    <div className="flex items-center justify-center h-80">
                                        Data yang anda cari tidak ditemukan
                                    </div>
                                ) 
                                : (
                                    <div className="p-4">
                                        <div className="space-y-6">
                                            <div className="border-y border-zinc-300 py-2">
                                                <p className="font-bold text-sm">
                                                    Data Dosen
                                                </p>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                                                    <div className="font-medium">
                                                        Nama
                                                    </div>
                                                    <div className="lg:col-span-2 font-bold">
                                                        {listData.detail.data?.dosen?.nm_dosen}
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                                                    <div className="font-medium">
                                                        Gelar
                                                    </div>
                                                    <div className="lg:col-span-2 font-bold">
                                                        {listData.detail.data?.dosen?.gelar}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <hr className="my-4 opacity-0" />
                                        <div className="space-y-6">
                                            <div className="border-y border-zinc-300 py-2">
                                                <p className="font-bold text-sm">
                                                    Data Tahun Ajaran
                                                </p>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                                                    <div className="font-medium">
                                                        Jenis Mahasiswa
                                                    </div>
                                                    <div className="lg:col-span-2 font-bold">
                                                        {listData.detail.data?.tahun_ajaran?.jns_mhs === 'R'
                                                            ? 'Reguler'
                                                            : 'Karyawan'}
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                                                    <div className="font-medium">
                                                        Tanggal Kuliah
                                                    </div>
                                                    <div className="lg:col-span-2 font-bold">
                                                        {dayjs(listData.detail.data?.tahun_ajaran?.tgl_kuliah).locale('id').format('DD MMMM YYYY')}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                    }
                </CustomTabItem>
            </CustomTabs> */}
        </div>
    )
}

function ProdiPage({ token, base_url, role, app }) {
    return (
        <MainLayout2 token={token} base_url={base_url} role={role} app={app} page_title="Dashboard">
            <CustomTabs>
                <CustomTabItem label="Rekap">
                    <CustomTabs>
                        <CustomTabItem label="Presensi">
                            <ProdiPage_Rekap_Presensi token={token} base_url={base_url} role={role} />
                        </CustomTabItem>
                        <CustomTabItem label="pertemuan">
                            <ProdiPage_Rekap_Pertemuan token={token} base_url={base_url} role={role} />
                        </CustomTabItem>
                        <CustomTabItem label="Berita Acara">
                            <ProdiPage_Rekap_BeritaAcara token={token} base_url={base_url} role={role} />
                        </CustomTabItem>
                    </CustomTabs>
                </CustomTabItem>
                <CustomTabItem label="Pengumuman">
                    <ProdiPage_Pengumuman token={token} base_url={base_url} role={role} />
                </CustomTabItem>
            </CustomTabs>
        </MainLayout2>
    )
}

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

function MahasiswaPage({ token, base_url, role, app }) {
    const { setShowSidebar } = useSidebar();

    const { userdata, loadingUserdata } = useUser();

    const [listData, setListData] = useState({
        khs: {
            data: null,
            loading: false,
        },
        jadwal: {
            data: [],
            loading: {
                fetch: false,
                absen_pin: false,
            },
            fetched: false,
        },
    });

    const [formData, setFormData] = useState({
        absen: {
            pin: "",
            loading: false,
            kelas_kuliah_id: "",
            error: null,
        },
    });

    const aksi = {
        khs: {
            get: async () => {
                try {
                    aksi.khs.set("loading", true);

                    const response = await api_handler.get({
                        base_url,
                        token,
                        url: "krs/ip/semester",
                    });

                    aksi.khs.set("loading", false);

                    if (response.success) {
                        aksi.khs.set("data", response?.data);
                    } else {
                        aksi.khs.set("data", null);
                        customSwal.toast.error({
                            message: response?.message,
                        });
                    }
                } catch (error) {
                    customSwal.toast.error({
                        message: error?.message,
                    });
                }
            },
            set: (column, value) => {
                setListData((state) => ({
                    ...state,
                    khs: {
                        ...state.khs,
                        [column]: value,
                    },
                }));
            },
        },
        jadwal: {
            get: async () => {
                try {
                    aksi.jadwal.loading("fetch");

                    const response = await api_handler.get({
                        base_url,
                        token,
                        url: "kelas-kuliah/mahasiswa",
                    });

                    aksi.jadwal.loading("fetch");

                    if (response.success) {
                        aksi.jadwal.set("data", response?.data?.kelas_kuliah);
                        aksi.jadwal.set("fetched", true);
                    } else {
                        customSwal.toast.error({
                            message: response?.message,
                        });
                    }
                } catch (error) {
                    customSwal.toast.error({
                        message: error?.message,
                    });
                }
            },
            set: (column, value) => {
                setListData((state) => ({
                    ...state,
                    jadwal: {
                        ...state.jadwal,
                        [column]: value,
                    },
                }));
            },
            loading: (column) => {
                setListData((state) => ({
                    ...state,
                    jadwal: {
                        ...state.jadwal,
                        loading: {
                            ...state.jadwal.loading,
                            [column]: !state.jadwal.loading[column],
                        },
                    },
                }));
            },
            hari: {
                get: (hari) => {
                    return listData.jadwal.data.find((item) => item[hari])
                        ? listData.jadwal.data.find((item) => item[hari])[hari]
                        : [];
                },
            },
        },
        formData: {
            absen: {
                set: (column, value) => {
                    setFormData((state) => ({
                        ...state,
                        absen: {
                            ...state.absen,
                            [column]: value,
                        },
                    }));
                },
                init: (kelas_kuliah_id) => {
                    aksi.formData.absen.set("kelas_kuliah_id", kelas_kuliah_id);
                    aksi.formData.absen.set("pin", "");

                    aksi.formData.absen.set("error", null);

                    modal.show("absen_modal");
                },
                submit: async (e) => {
                    try {
                        e.preventDefault();

                        aksi.formData.absen.set("error", null);

                        aksi.formData.absen.set("loading", true);

                        const response = await api_handler.post({
                            base_url,
                            url: "kelas-kuliah/mahasiswa/presensi",
                            token,
                            payload: {
                                kelas_kuliah_id: String(
                                    formData.absen.kelas_kuliah_id,
                                ),
                                pin: formData.absen.pin,
                            },
                        });

                        aksi.formData.absen.set("loading", false);

                        if (response.success) {
                            modal.close("absen_modal");
                            customSwal.success({
                                message:
                                    "Berhasil melakukan Absen, Terima Kasih! :D",
                            });
                        } else {
                            aksi.formData.absen.set("error", response?.message);
                        }
                    } catch (error) {
                        aksi.formData.absen.set("error", error?.message);
                    }
                },
            },
        },
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
    };

    useEffect(() => {
        (async () => {
            await Promise.all([aksi.khs.get(), aksi.jadwal.get()]);
        })();
    }, []);

    

    return (
        <MainLayout token={token} base_url={base_url} role={role}>
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
                                    Dashboard
                                </h1>
                            </div>
                        </div>
                    </div>

                    <ModalForm
                        modalId="absen_modal"
                        showSubmitButton={false}
                        title="Absen Kelas"
                        error={formData.absen.error}
                        loading={formData.absen.loading}
                        onSubmit={(e) => aksi.formData.absen.submit(e)}
                    >
                        <div className="divide-y divide-zinc-300">
                            <div className="p-4">
                                <div className="flex gap-4">
                                    <InfoOutlined
                                        fontSize="small"
                                        color="primary"
                                    />
                                    <div className="">
                                        Jika Absen anda mengalami gangguan
                                        seperti terlalu lama memproses atau
                                        tidak bisa melakukan Absen, segera
                                        hubungi Dosen atau Administrator.
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <TextField
                                    required
                                    type="number"
                                    disabled={formData.absen.loading}
                                    variant="filled"
                                    label="Isi PIN Absen disini"
                                    fullWidth
                                    error={!!formData.absen.error}
                                    value={formData.absen.pin}
                                    onChange={(e) =>
                                        aksi.formData.absen.set(
                                            "pin",
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="p-4">
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={formData.absen.loading}
                                    startIcon={
                                        formData.absen.loading ? (
                                            <CircularProgress
                                                size={15}
                                                className="grayscale"
                                            />
                                        ) : (
                                            <SendOutlined />
                                        )
                                    }
                                >
                                    <p className="font-jakarta font-medium">
                                        {formData.absen.loading
                                            ? "Loading..."
                                            : "Absen"}
                                    </p>
                                </Button>
                            </div>
                        </div>
                    </ModalForm>

                    <div className="p-4">
                        <CustomLoading
                            loading={loadingUserdata}
                            renderIf={userdata}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <CustomLoading
                                    loading={listData.khs.loading}
                                    renderIf={listData.khs.data}
                                >
                                    <div className="rounded-md border border-zinc-300 divide-y divide-zinc-300 shadow">
                                        <div className="flex items-center gap-4 px-4 py-3">
                                            <div className="w-10 h-10 rounded-md border  flex items-center justify-center border-zinc-300">
                                                <AssignmentOutlined
                                                    fontSize="small"
                                                    color="primary"
                                                />
                                            </div>
                                            <div className="-space-y-1">
                                                <h1 className="font-light">
                                                    Sistem Kredit Semester
                                                </h1>
                                                <p className="text-lg lg:text-xl">
                                                    {
                                                        listData.khs.data
                                                            ?.total_sks
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CustomLoading>
                                <CustomLoading
                                    loading={listData.khs.loading}
                                    renderIf={listData.khs.data}
                                >
                                    <div className="rounded-md border border-zinc-300 divide-y divide-zinc-300 shadow">
                                        <div className="flex items-center gap-4 px-4 py-3">
                                            <div className="w-10 h-10 rounded-md border  flex items-center justify-center border-zinc-300">
                                                <AssignmentOutlined
                                                    fontSize="small"
                                                    color="primary"
                                                />
                                            </div>
                                            <div className="-space-y-1">
                                                <h1 className="font-light">
                                                    Indeks Prestasi Kumulatif
                                                </h1>
                                                <p className="text-lg lg:text-xl">
                                                    {parseFloat(
                                                        listData.khs.data?.total_semua_ip.toFixed(
                                                            2,
                                                        ),
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CustomLoading>
                            </div>
                        </CustomLoading>
                    </div>

                    <ApplicationSection app={app} />

                    <CustomTabs centered>
                        <CustomTabItem label="Jadwal Hari ini">
                            <CustomLoading
                                loading={loadingUserdata}
                                renderIf={userdata}
                            >
                                <div className="divide-y divide-zinc-300">
                                    <div className="p-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div className="flex sm:items-center gap-4">
                                                <InfoOutlined
                                                    fontSize="small"
                                                    color="primary"
                                                />
                                                <p>
                                                    Silahkan tekan tombol
                                                    refresh jika terdapat data
                                                    yang tidak sesuai.
                                                </p>
                                            </div>
                                            <Button
                                                disabled={
                                                    listData.jadwal.loading
                                                        .fetch
                                                }
                                                startIcon={<RefreshOutlined />}
                                                variant="contained"
                                                onClick={() =>
                                                    aksi.jadwal.get()
                                                }
                                                size="small"
                                            >
                                                <p className="font-jakarta text-xs">
                                                    Refresh
                                                </p>
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <CustomLoading
                                            loading={
                                                listData.jadwal.loading.fetch
                                            }
                                            renderIf={listData.jadwal.fetched}
                                            sketch={<div className="p-4"></div>}
                                        >
                                            {aksi.jadwal.hari.get(
                                                dayjs()
                                                    .locale("id")
                                                    .format("dddd"),
                                            ).length > 0 ? (
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                    {aksi.jadwal.hari
                                                        .get(
                                                            dayjs()
                                                                .locale("id")
                                                                .format("dddd"),
                                                        )
                                                        .map((item) => (
                                                            <div
                                                                key={
                                                                    item[
                                                                        "data_kelas"
                                                                    ][
                                                                        "kelas_kuliah_id"
                                                                    ]
                                                                }
                                                                className={`rounded-md shadow border-l-4 ${item["kelas_dibuka"] ? "border-blue-500" : "border-zinc-500"}`}
                                                            >
                                                                <div className="flex flex-col justify-between">
                                                                    <div className="flex gap-4 p-4">
                                                                        <div className="">
                                                                            <div
                                                                                className={`w-7 sm:w-8 lg:w-10 aspect-square rounded-md flex items-center justify-center ${item["kelas_dibuka"] ? "bg-blue-100 text-blue-500" : "bg-zinc-100 text-zinc-500"}`}
                                                                            >
                                                                                <CollectionsBookmarkOutlined fontSize="small" />
                                                                            </div>
                                                                        </div>
                                                                        <div className=" space-y-4 w-full">
                                                                            <div className="space-y-2">
                                                                                {item[
                                                                                    "matakuliah"
                                                                                ][
                                                                                    "kd_mk"
                                                                                ] && (
                                                                                    <p className="text-xs font-medium opacity-70">
                                                                                        {
                                                                                            item[
                                                                                                "matakuliah"
                                                                                            ][
                                                                                                "kd_mk"
                                                                                            ]
                                                                                        }
                                                                                    </p>
                                                                                )}
                                                                                <h1 className="font-bold text-lg">
                                                                                    {
                                                                                        item[
                                                                                            "matakuliah"
                                                                                        ][
                                                                                            "nm_mk"
                                                                                        ]
                                                                                    }
                                                                                </h1>
                                                                            </div>
                                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                                {item[
                                                                                    "dosen"
                                                                                ] && (
                                                                                    <div className="flex items-center gap-3 opacity-70">
                                                                                        <PersonOutline
                                                                                            sx={{
                                                                                                fontSize: 16,
                                                                                            }}
                                                                                        />
                                                                                        <p className="text-xs font-medium">
                                                                                            {
                                                                                                item[
                                                                                                    "dosen"
                                                                                                ][
                                                                                                    "nm_dosen"
                                                                                                ]
                                                                                            }
                                                                                        </p>
                                                                                    </div>
                                                                                )}
                                                                                {item[
                                                                                    "kontrak_kuliah"
                                                                                ] && (
                                                                                    <div className="flex items-center gap-3 opacity-70">
                                                                                        <Button
                                                                                            variant="text"
                                                                                            size="small"
                                                                                            href={`${item["kontrak_kuliah"]["file_link"]}`}
                                                                                            target="_blank"
                                                                                            loading={
                                                                                                false
                                                                                            }
                                                                                            loadingPosition="start"
                                                                                            startIcon={
                                                                                                <VisibilityOutlined />
                                                                                            }
                                                                                        >
                                                                                            <p className="text-xs font-bold font-jakarta">
                                                                                                Silabus
                                                                                            </p>
                                                                                        </Button>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                            <div className="flex items-center w-full flex-wrap">
                                                                                {item[
                                                                                    "riwayat_presensi"
                                                                                ].map(
                                                                                    (
                                                                                        absen,
                                                                                        index,
                                                                                    ) =>
                                                                                        absen[
                                                                                            "masuk"
                                                                                        ] ? (
                                                                                            <Tooltip
                                                                                                key={
                                                                                                    index
                                                                                                }
                                                                                                arrow
                                                                                                title={dayjs(
                                                                                                    absen[
                                                                                                        "masuk"
                                                                                                    ],
                                                                                                )
                                                                                                    .locale(
                                                                                                        "id",
                                                                                                    )
                                                                                                    .format(
                                                                                                        "HH:mm:ss, DD MMMM YYYY",
                                                                                                    )}
                                                                                            >
                                                                                                <CheckBoxTwoTone
                                                                                                    fontSize="small"
                                                                                                    color="primary"
                                                                                                />
                                                                                            </Tooltip>
                                                                                        ) : (
                                                                                            <Tooltip
                                                                                                key={
                                                                                                    index
                                                                                                }
                                                                                                arrow
                                                                                                title={
                                                                                                    "Anda tidak absen!"
                                                                                                }
                                                                                            >
                                                                                                <IndeterminateCheckBoxTwoTone
                                                                                                    fontSize="small"
                                                                                                    color="error"
                                                                                                />
                                                                                            </Tooltip>
                                                                                        ),
                                                                                )}
                                                                                {Array.from(
                                                                                    {
                                                                                        length: parseInt(
                                                                                            item[
                                                                                                "riwayat_presensi_maks"
                                                                                            ] -
                                                                                                item[
                                                                                                    "riwayat_presensi"
                                                                                                ]
                                                                                                    .length,
                                                                                        ),
                                                                                    },
                                                                                ).map(
                                                                                    (
                                                                                        _,
                                                                                        index,
                                                                                    ) => (
                                                                                        <Tooltip
                                                                                            key={
                                                                                                index
                                                                                            }
                                                                                            arrow
                                                                                            title=""
                                                                                        >
                                                                                            <CheckBoxOutlineBlankTwoTone fontSize="small" />
                                                                                        </Tooltip>
                                                                                    ),
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div
                                                                        className={`${item["kelas_dibuka"] ? "bg-blue-50" : "bg-zinc-50"} p-4`}
                                                                    >
                                                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                                                            <div className="flex items-center justify-between sm:justify-start gap-6">
                                                                                {item[
                                                                                    "jadwal"
                                                                                ] && (
                                                                                    <>
                                                                                        {item[
                                                                                            "jadwal"
                                                                                        ][
                                                                                            "jam"
                                                                                        ] && (
                                                                                            <div className="flex items-center gap-3">
                                                                                                <AccessTimeOutlined
                                                                                                    sx={{
                                                                                                        fontSize: 16,
                                                                                                    }}
                                                                                                    className={`${item["kelas_dibuka"] ? "text-blue-700" : "text-zinc-700"}`}
                                                                                                />
                                                                                                <p className="text-xs font-semibold opacity-70">
                                                                                                    {
                                                                                                        item[
                                                                                                            "jadwal"
                                                                                                        ][
                                                                                                            "jam"
                                                                                                        ]
                                                                                                    }
                                                                                                </p>
                                                                                            </div>
                                                                                        )}
                                                                                        {item[
                                                                                            "jadwal"
                                                                                        ][
                                                                                            "kd_ruang"
                                                                                        ] && (
                                                                                            <div className="flex items-center gap-3">
                                                                                                <LocationOnOutlined
                                                                                                    sx={{
                                                                                                        fontSize: 16,
                                                                                                    }}
                                                                                                    className={`${item["kelas_dibuka"] ? "text-blue-700" : "text-zinc-700"}`}
                                                                                                />
                                                                                                <p className="text-xs font-semibold opacity-70">
                                                                                                    Ruang{" "}
                                                                                                    {
                                                                                                        item[
                                                                                                            "jadwal"
                                                                                                        ][
                                                                                                            "kd_ruang"
                                                                                                        ]
                                                                                                    }
                                                                                                </p>
                                                                                            </div>
                                                                                        )}
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                            <div className="flex justify-end">
                                                                                <Button
                                                                                    disabled={
                                                                                        !item[
                                                                                            "kelas_dibuka"
                                                                                        ]
                                                                                    }
                                                                                    onClick={() =>
                                                                                        aksi.formData.absen.init(
                                                                                            item[
                                                                                                "data_kelas"
                                                                                            ][
                                                                                                "kelas_kuliah_id"
                                                                                            ],
                                                                                        )
                                                                                    }
                                                                                    variant="contained"
                                                                                    size="small"
                                                                                    className="text-xs w-full sm:w-fit"
                                                                                >
                                                                                    {item[
                                                                                        "kelas_dibuka"
                                                                                    ] ? (
                                                                                        <p className="font-jakarta text-xs">
                                                                                            Absen
                                                                                        </p>
                                                                                    ) : (
                                                                                        <p className="font-jakarta text-xs">
                                                                                            Kelas
                                                                                            belum
                                                                                            dibuka
                                                                                        </p>
                                                                                    )}
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center min-h-screen">
                                                    <div className="space-y-4">
                                                        <img
                                                            src="/images/empty.png"
                                                            alt="Logo Not Found"
                                                            className="w-80"
                                                        />
                                                        <p className="text-center text-lg sm:text-xl lg:text-2xl font-medium">
                                                            Anda tidak memiliki
                                                            jadwal di hari ini
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </CustomLoading>
                                    </div>
                                </div>
                            </CustomLoading>
                        </CustomTabItem>
                        <CustomTabItem label="Pengumuman">
                            <CustomTabs>
                                <CustomTabItem label="Umum / Semua">
                                    <MahasiswaPagePengumumanUmum base_url={base_url} token={token} role={role} />
                                </CustomTabItem>
                                <CustomTabItem label="Kelas">
                                    <MahasiswaPagePengumumanKelas base_url={base_url} token={token} role={role} />
                                </CustomTabItem>
                            </CustomTabs>
                        </CustomTabItem>
                    </CustomTabs>
                </div>
            </div>
        </MainLayout>
    );
}

function MahasiswaPagePengumumanUmum({ token, base_url, role }) {
    const { userdata, loadingUserdata } = useUser();
    
    const [listData, setListData] = useState({
        pengumuman: {
            data: [],
            meta: null,
            loading: {
                fetch: false,
                refresh: false
            }
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
                        url: 'pengumuman/mahasiswa/list'
                    })

                    aksi.pengumuman.loading('fetch')

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
            }
        }
    }

    useEffect(() => {
        (async () => {
            aksi.pengumuman.get()
        })();
    }, []);

    return (
        <div className="p-4">
            <div className="flex justify-center">
                <div className="max-w-5xl w-full space-y-4 flex flex-col items-center">

                    {listData.pengumuman.loading.fetch || listData.pengumuman.loading.refresh
                        ? (
                            <div className="w-full h-80 flex items-center justify-center">
                                <CircularProgress size={45} color="primary" />
                            </div>
                        )
                        : listData.pengumuman.data.length < 1 
                            ? (
                                <div className="w-full h-80 flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <p className="italic opacity-50">
                                            Tampaknya belum ada pengumuman
                                        </p>
                                    </div>
                                </div>
                            )
                            : (
                                <>
                                    {listData.pengumuman.data.filter(pengumuman => pengumuman?.target === 0).map(pengumuman => (
                                        <div key={pengumuman['pengumuman_id']} className={`relative overflow-hidden rounded-md ${pengumuman['target'] === 0 ? 'border-2 border-blue-500' : 'border border-zinc-300'} w-full shadow-md`}>
                                            <div className="space-y-1">
                                                {pengumuman['target'] === 0
                                                    ? (
                                                        <div className="bg-blue-800/80 p-4 border-b border-zinc-300 text-white font-semibold">
                                                            <div className="flex items-center gap-4">
                                                                <CampaignTwoTone fontSize="small" />
                                                                <p>
                                                                    {pengumuman['keterangan_target']}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )
                                                    : (
                                                        <div className="bg-zinc-50 p-4 border-b border-zinc-300">
                                                            <div className="flex items-center gap-4">
                                                                <CampaignTwoTone fontSize="small" />
                                                                <p>
                                                                    {pengumuman['keterangan_target']}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                <div className="p-4">
                                                    <div className="flex items-center gap-4">
                                                        <Avatar 
                                                            sx={{
                                                                width: 40,
                                                                height: 40
                                                            }}
                                                            className="w-80 h-80"
                                                            src={pengumuman['avatar_pengirim']}
                                                            alt="Foto Profil"
                                                        />
                                                        <div className="space-y-1">
                                                            <p className="font-bold">
                                                                {pengumuman['nm_pengirim']}
                                                            </p>
                                                            <p className="text-xs font-light italic opacity-70">
                                                                {dayjs(pengumuman['tgl_dikirim']).locale('id').format('dddd, DD MMMM YYYY, HH:mm:ss')}
                                                            </p>
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className="p-4">
                                                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(pengumuman['message'])}}></div>
                                                </div>
                                                {pengumuman['image'] && (
                                                    <img className="w-full h-full" src={pengumuman['image']} alt="Foto Pengumuman" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )
                    }

                </div>
            </div>
        </div>
    )
}

function MahasiswaPagePengumumanKelas({ token, base_url, role }) {
    const [listData, setListData] = useState({
        kelas: {
            data: [],
            loading: {
                fetch: false,
                refresh: false
            },
            selected_target: null
        },
        pengumuman: {
            data: [],
            meta: null,
            loading: {
                fetch: false,
                refresh: false
            }
        }
    })

    const [formData, setFormData] = useState({
        pengumuman: {
            message: '',
            selected_target: null,
            error: null,
            loading: false,
            image: null,
            image_source: null
        }
    })

    const aksi = {
        kelas: {
            get: async () => {
                try {
                    aksi.kelas.loading('fetch')

                    const response = await api_handler.get({
                        base_url,
                        token,
                        url: 'pengumuman/mahasiswa/kelas-kuliah'
                    })
                    
                    aksi.kelas.loading('fetch')   
                    
                    if(response?.success) {
                        aksi.kelas.set('data', response?.data?.list_kelas)
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
                    kelas: {
                        ...state.kelas,
                        [column]: value
                    }
                }))
            },
            loading: (column) => {
                setListData(state => ({
                    ...state,
                    kelas: {
                        ...state.kelas,
                        loading: {
                            ...state.kelas.loading,
                            [column]: !state.kelas.loading[column]
                        }
                    }
                }))
            },
            select: async (selected) => {
                aksi.kelas.set('selected_target', selected)
                aksi.pengumuman.set('data', [])

                if(selected) {
                    await aksi.pengumuman.get(selected)
                }
            }
        },
        pengumuman: {
            get: async (target) => {
                try {
                    aksi.pengumuman.loading('fetch')
                    
                    const response = await api_handler.get({
                        base_url,
                        url: `pengumuman/mahasiswa/list?kelas_kuliah_id=${target['value']}`,
                        token
                    })

                    aksi.pengumuman.loading('fetch')      
                    
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
            }
        }
    }

    useEffect(() => {
        (async () => {
            await aksi.kelas.get()
        })()
    }, [])

    return (
        <div className="divide-y divide-zinc-300">

            

            <div className="p-4">
                <div className="w-full">
                    <CustomLoading loading={listData.kelas.loading.fetch} renderIf={!listData.kelas.loading.fetch}>
                        <div className="flex gap-4 flex-col-reverse sm:flex-row sm:items-center sm:justify-between">
                            <div className="w-full sm:w-2/3 lg:w-1/2">
                                <CustomSelect 
                                    placeholder="Nama atau Kode Mata Kuliah"
                                    label="Cari dan Pilih Mata Kuliah"  
                                    options={listData.kelas.data.map(kelas => ({
                                        label: kelas['mata_kuliah']['nm_mk'],
                                        value: kelas['kelas_kuliah_id']
                                    }))}
                                    optionLabel={'label'}
                                    value={listData.kelas.selected_target}
                                    onChange={(e, value) => aksi.kelas.select(value)}
                                />
                            </div>
                        </div>
                    </CustomLoading>
                </div>
            </div>
            <div className="p-4">
                {!listData.kelas.selected_target
                    ? (
                        <div className="flex items-center justify-center h-80">
                            <p className="italic opacity-50">
                                Anda perlu memilih mata kuliah terlebih dahulu!
                            </p>
                        </div>
                    )
                    : listData.pengumuman.loading.fetch
                        ? (
                            <div className="flex items-center justify-center h-80">
                                <CircularProgress size={30} />
                            </div>
                        )
                        : listData.pengumuman.data.length < 1
                            ? (
                                <div className="flex items-center justify-center h-80">
                                    <p className="italic opacity-50">
                                        Tampaknya di Kelas ini belum ada pengumuman kelas!
                                    </p>
                                </div>
                            )
                            : (
                                <div className="flex justify-center">
                                    <div className="max-w-5xl w-full space-y-4 flex flex-col items-center">
                                        {listData.pengumuman.data.map(pengumuman => (
                                            <div key={pengumuman['pengumuman_id']} className="relative overflow-hidden rounded-md border border-zinc-300 w-full shadow-md">
                                                <div className="space-y-1">
                                                    <div className="p-4">
                                                        <div className="flex items-center gap-4">
                                                            <Avatar 
                                                                sx={{
                                                                    width: 40,
                                                                    height: 40
                                                                }}
                                                                className="w-80 h-80"
                                                                src={pengumuman['avatar_pengirim']}
                                                                alt="Foto Profil"
                                                            />
                                                            <div className="space-y-1">
                                                                <p className="font-bold">
                                                                    {pengumuman['nm_pengirim']}
                                                                </p>
                                                                <p className="text-xs font-light italic opacity-70">
                                                                    {dayjs(pengumuman['tgl_dikirim']).locale('id').format('dddd, DD MMMM YYYY, HH:mm:ss')}
                                                                </p>
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className="p-4">
                                                        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(pengumuman['message'])}}></div>
                                                    </div>
                                                    {pengumuman['image'] && (
                                                        <img className="w-full h-full" src={pengumuman['image']} alt="Foto Pengumuman" />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                }
            </div>
        </div>
    )
}

function DosenWaliPage({ token, base_url, role, app }) {
    const { setShowSidebar } = useSidebar();

    const { userdata, loadingUserdata } = useUser();

    const [listData, setListData] = useState({
        krs: {
            data: [],
            loading: {
                fetch: false
            },
            detail: {
                data: []
            },
            filter: {
                jns_mhs: null,
                sts_mhs: null,
                masuk_tahun: null,
                semester: null
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
            },
            filter: {
                select: {
                    jenis_mhs: () => {
                        const data = []

                        Array.from(
                            new Set(
                                listData.krs.data
                                    // .filter(item => item?.krs?.some(krs => krs?.sts_krs !== 'S'))
                                    // .filter(item => item?.krs?.some(krs => dayjs(krs?.tanggal).isSame(dayjs())))
                                    .map(item => item.jns_mhs)
                            )
                        )
                        .map(jns_mhs => {
                            if(jns_mhs === 'R') {
                                data.push({
                                    label: 'Reguler',
                                    value: 'R'
                                })
                            }

                            if(jns_mhs === 'K') {
                                data.push({
                                    label: 'Karyawan',
                                    value: 'K'
                                })
                            }

                            if(jns_mhs === 'E') {
                                data.push({
                                    label: 'Eksekutif',
                                    value: 'E'
                                })
                            }
                        })

                        return data
                    },
                    sts_mhs: () => {
                        const data = []

                        Array.from(
                            new Set(
                                listData.krs.data
                                    // .filter(item => item?.krs?.some(krs => krs?.sts_krs !== 'S'))
                                    // .filter(item => item?.krs?.some(krs => dayjs(krs?.tanggal).isSame(dayjs())))
                                    .map(item => item?.sts_mhs)
                            )
                        )
                        .map(sts_mhs => {
                            if(sts_mhs === 'A') {
                                data.push({
                                    label: 'Aktif',
                                    value: 'A'
                                })
                            }

                            if(sts_mhs === 'TA') {
                                data.push({
                                    label: 'Tidak Aktif',
                                    value: 'TA'
                                })
                            }

                            if(sts_mhs === 'C') {
                                data.push({
                                    label: 'Cuti',
                                    value: 'C'
                                })
                            }
                        })

                        return data
                    },
                    masuk_tahun: () => {
                        const data = []

                        Array.from(
                            new Set(
                                listData.krs.data
                                    // .filter(item => item?.krs?.some(krs => krs?.sts_krs !== 'S'))
                                    // .filter(item => item?.krs?.some(krs => dayjs(krs?.tanggal).isSame(dayjs())))
                                    .map(item => item?.masuk_tahun)
                            )
                        )
                        .sort((a, b) => b - a)
                        .map(masuk_tahun => data.push({ label: masuk_tahun, value: masuk_tahun }))

                        return data
                    }
                },
                set: (column, value) => {
                    setListData(state => ({
                        ...state,
                        krs: {
                            ...state.krs,
                            filter: {
                                ...state.krs.filter,
                                [column]: value
                            }
                        }
                    }))
                }
            },
            filtered: {
                hari_ini: () => {
                    return listData.krs.data
                        .filter(item => item?.krs?.some(krs => dayjs(krs?.tanggal).isSame(dayjs())))
                },
                sts_krs: (status) => {
                    const data = aksi.krs.filtered.get()
                    return data
                        .filter(item => item?.krs?.some(krs => krs?.sts_krs === status))
                },
                get: () => {
                    let data = listData.krs.data
                    if(listData.krs.filter.jns_mhs) {
                        data = data.filter(item => item?.jns_mhs === listData.krs.filter.jns_mhs?.value)
                    }

                    if(listData.krs.filter.sts_mhs) {
                        data = data.filter(item => item?.sts_mhs === listData.krs.filter.sts_mhs?.value)
                    }

                    if(listData.krs.filter.masuk_tahun) {
                        data = data.filter(item => item?.masuk_tahun === listData.krs.filter.masuk_tahun?.value)
                    }

                    if(listData.krs.filter.semester) {
                        data = data.filter(item => item?.krs?.some(krs => krs?.semester === listData.krs.filter.semester?.value))
                    }

                    return data
                }
            }
        }
    }

    useEffect(() => {
        aksi.krs.get()
    }, [])

    return (
        <MainLayout token={token} base_url={base_url} role={role}>
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
                                    Dashboard
                                </h1>
                            </div>
                        </div>
                    </div>

                    <ApplicationSection app={app} />

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

                    <CustomTabs>
                        <CustomTabItem label="pengajuan krs">
                            <div className="divide-y divide-zinc-300">
                                <div className="p-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div className="flex gap-4">
                                            <InfoOutlined fontSize="small" color="primary" />
                                            <p>
                                                Silahkan Refresh Data jika terdapat Data yang tidak sesuai, atau hubungi Administrator segera.
                                            </p>
                                        </div>
                                        <div className="shrink-0">
                                            <Button variant="contained" onClick={() => aksi.krs.get()} loading={listData.krs.loading.fetch} loadingPosition="start" startIcon={<RefreshOutlined />} size="small" className="w-full sm:w-fit">
                                                <p className="font-jakarta font-bold text-xs">
                                                    Refresh
                                                </p>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                        <CustomSelect 
                                            label="Jenis Mahasiswa"
                                            size="small"
                                            placeholder="Cari disini"
                                            optionLabel="label"
                                            options={aksi.krs.filter.select.jenis_mhs()}
                                            value={listData.krs.filter.jns_mhs}
                                            onChange={(e, value) => aksi.krs.filter.set('jns_mhs', value)}
                                            loading={listData.krs.loading.fetch}
                                        />
                                        <CustomSelect 
                                            label="Status Mahasiswa"
                                            size="small"
                                            placeholder="Cari disini"
                                            optionLabel="label"
                                            options={aksi.krs.filter.select.sts_mhs()}
                                            value={listData.krs.filter.sts_mhs}
                                            onChange={(e, value) => aksi.krs.filter.set('sts_mhs', value)}
                                            loading={listData.krs.loading.fetch}
                                        />
                                        <CustomSelect 
                                            label="Tahun Angkatan"
                                            size="small"
                                            placeholder="Cari disini"
                                            optionLabel="label"
                                            options={aksi.krs.filter.select.masuk_tahun()}
                                            value={listData.krs.filter.masuk_tahun}
                                            onChange={(e, value) => aksi.krs.filter.set('masuk_tahun', value)}
                                            loading={listData.krs.loading.fetch}
                                        />
                                        <CustomSelect 
                                            label="Semester"
                                            size="small"
                                            placeholder="Cari disini"
                                            optionLabel="label"
                                            options={Array.from({ length: 8 }).map((_, index) => ({ label: `Semester ${index + 1}`, value: index + 1 }))}
                                            value={listData.krs.filter.semester}
                                            onChange={(e, value) => aksi.krs.filter.set('semester', value)}
                                            loading={listData.krs.loading.fetch}
                                        />
                                    </div>
                                </div>
                                <DosenWaliPage_KRSTab token={token} base_url={base_url} role={role} aksi={aksi} listData={listData} />
                            </div>
                        </CustomTabItem>
                        <CustomTabItem label="pengajuan surat">
                            <DosenWaliPage_SuratTab token={token} base_url={base_url} role={role} />
                        </CustomTabItem>
                    </CustomTabs>
                </div>
            </div>
        </MainLayout>
    );
}

function DosenWaliPage_KRSTab({ token, base_url, role, aksi, listData }) {

    return (
        <CustomTabs>
            <CustomTabItem label="Pengajuan">
                <div className="divide-y divide-zinc-300">
                    <div className="p-4">
                        <CustomDataTable 
                            getRowId={(row) => row.mhs_id}
                            loading={listData.krs.loading.fetch}
                            rows={aksi.krs.filtered.sts_krs('P')}
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
                    </div>
                </div>
            </CustomTabItem>
            <CustomTabItem label="Draft / Ditolak">
                <div className="divide-y divide-zinc-300">
                    <div className="p-4">
                        <CustomDataTable 
                            getRowId={(row) => row.mhs_id}
                            loading={listData.krs.loading.fetch}
                            rows={aksi.krs.filtered.sts_krs('D')}
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
                    </div>
                </div>
            </CustomTabItem>
            <CustomTabItem label="Di setujui">
                <div className="divide-y divide-zinc-300">
                    <div className="p-4">
                        <CustomDataTable 
                            getRowId={(row) => row.mhs_id}
                            loading={listData.krs.loading.fetch}
                            rows={aksi.krs.filtered.sts_krs('S')}
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
                    </div>
                </div>
            </CustomTabItem>
            <CustomTabItem label="Statistik">
                <div className="divide-y divide-zinc-300">
                    <div className="p-4">
                        {/* <CustomDataTable /> */}
                    </div>
                </div>
            </CustomTabItem>
        </CustomTabs>
    )
}

function DosenWaliPage_SuratTab({ token, base_url, role }) {
    return (
        <div className="divide-y divide-zinc-300">
            <div className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex gap-4">
                        <InfoOutlined fontSize="small" color="primary" />
                        <p>
                            Silahkan Refresh Data jika terdapat Data yang tidak sesuai, atau hubungi Administrator segera.
                        </p>
                    </div>
                    <div className="shrink-0">
                        <Button variant="contained" startIcon={<RefreshOutlined />} size="small" className="w-full sm:w-fit">
                            <p className="font-jakarta font-bold text-xs">
                                Refresh
                            </p>
                        </Button>
                    </div>
                </div>
            </div>
            <div className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    <CustomSelect 
                        multiple
                        size="small"  
                        label="Cari Jenis Pengajuan"
                    />
                </div>
            </div>
            <div className="p-4">
                <CustomDataTable 

                />
            </div>
        </div>
    )
}

function DosenPage({ token, base_url, role, app }) {
    const { setShowSidebar } = useSidebar();

    const { userdata, loadingUserdata } = useUser();

    const [listData, setListData] = useState({
        khs: {
            data: null,
            loading: false,
        },
        jadwal: {
            data: [],
            loading: {
                fetch: false,
                absen_pin: false,
            },
            fetched: false,
        },
        kelas: {
            kelas_kuliah_id: "",
            data: null,
            loading: {
                buka: false,
            },
            absen: {
                error: null,
                unique: false,
                loading: {
                    refresh: false,
                },
                daftar: {
                    data: null,
                    loading: {
                        fetch: false,
                        refresh: false,
                        hapus: false,
                    },
                    select: [],
                    error: null,
                },
            },
        },
    });

    const [formData, setFormData] = useState({
        tutup: {
            berita_acara: "",
            error: null,
        },
    });

    const aksi = {
        khs: {
            get: async () => {
                try {
                    aksi.khs.set("loading", true);

                    const response = await api_handler.get({
                        base_url,
                        token,
                        url: "krs/ip/semester",
                    });

                    aksi.khs.set("loading", false);

                    if (response.success) {
                        aksi.khs.set("data", response?.data);
                    } else {
                        aksi.khs.set("data", null);
                        customSwal.toast.error({
                            message: response?.message,
                        });
                    }
                } catch (error) {
                    customSwal.toast.error({
                        message: error?.message,
                    });
                }
            },
            set: (column, value) => {
                setListData((state) => ({
                    ...state,
                    khs: {
                        ...state.khs,
                        [column]: value,
                    },
                }));
            },
        },
        jadwal: {
            get: async () => {
                try {
                    aksi.jadwal.loading("fetch");

                    const response = await api_handler.get({
                        base_url,
                        token,
                        url: "kelas-kuliah/dosen",
                    });

                    aksi.jadwal.loading("fetch");

                    if (response.success) {
                        aksi.jadwal.set("data", response?.data?.kelas_kuliah);
                        aksi.jadwal.set("fetched", true);
                    } else {
                        customSwal.toast.error({
                            message: response?.message,
                        });
                    }
                } catch (error) {
                    customSwal.toast.error({
                        message: error?.message,
                    });
                }
            },
            set: (column, value) => {
                setListData((state) => ({
                    ...state,
                    jadwal: {
                        ...state.jadwal,
                        [column]: value,
                    },
                }));
            },
            loading: (column) => {
                setListData((state) => ({
                    ...state,
                    jadwal: {
                        ...state.jadwal,
                        loading: {
                            ...state.jadwal.loading,
                            [column]: !state.jadwal.loading[column],
                        },
                    },
                }));
            },
            hari: {
                get: (hari) => {
                    return listData.jadwal.data.find((item) => item[hari])
                        ? listData.jadwal.data.find((item) => item[hari])[hari]
                        : [];
                },
            },
            kelas_lain_dibuka: () => {
                return listData.jadwal.data.some((hariObj) => {
                    const hari = Object.keys(hariObj)[0];
                    return hariObj[hari].some(
                        (kelas) => kelas.kelas_dibuka === true,
                    );
                });
            },
        },
        kelas: {
            buka: async (kelas_kuliah_id) => {
                try {
                    aksi.kelas.set("loading", true);
                    aksi.kelas.set("kelas_kuliah_id", kelas_kuliah_id);

                    const response = await api_handler.get({
                        base_url,
                        token,
                        url: `kelas-kuliah/dosen/open/${kelas_kuliah_id}`,
                    });

                    aksi.kelas.set("loading", false);

                    if (response?.success) {
                        aksi.jadwal.get();
                        modal.show("modal_absen");
                        aksi.kelas.set("data", response?.data?.pertemuan);
                    } else {
                        customSwal.toast.error({
                            message: response?.message,
                        });
                    }
                } catch (error) {
                    customSwal.toast.error({
                        message: error?.message,
                    });
                }
            },
            tutup: {
                init: () => {},
                submit: async (e) => {
                    try {
                        e.preventDefault();

                        aksi.kelas.tutup.set("error", null);
                        aksi.jadwal.loading("tutup");

                        const response = await api_handler.post({
                            base_url,
                            token,
                            url: `kelas-kuliah/dosen/close/${listData.kelas.kelas_kuliah_id}`,
                            payload: {
                                berita_acara: formData.tutup.berita_acara,
                            },
                        });

                        aksi.jadwal.loading("tutup");

                        if (response?.success) {
                            customSwal.toast.success({
                                message: "Berhasil menutup kelas",
                            });
                            modal.close("modal_tutup_kelas");
                            await aksi.jadwal.get();
                        }
                    } catch (error) {
                        aksi.kelas.tutup.set("error", error?.message);
                    }
                },
                set: (column, value) => {
                    setFormData((state) => ({
                        ...state,
                        tutup: {
                            ...state.tutup,
                            [column]: value,
                        },
                    }));
                },
            },

            set: (column, value) => {
                setListData((state) => ({
                    ...state,
                    kelas: {
                        ...state.kelas,
                        [column]: value,
                    },
                }));
            },
            loading: (column) => {
                setListData((state) => ({
                    ...state,
                    kelas: {
                        ...state.kelas,
                        loading: {
                            ...state.kelas.loading,
                            [column]: !state.kelas.loading[column],
                        },
                    },
                }));
            },
            absen: {
                get: async (kelas_kuliah_id) => {
                    try {
                        aksi.kelas.loading("buka");

                        const response = await api_handler.get({
                            base_url,
                            token,
                            url: `kelas-kuliah/dosen/open/${kelas_kuliah_id}${listData.kelas.absen.unique ? "?unique_pin=true" : ""}`,
                        });

                        aksi.kelas.loading("buka");

                        if (response?.success) {
                            aksi.kelas.set("data", response?.data?.pertemuan);
                        } else {
                            customSwal.toast.error({
                                message: response?.message,
                            });
                        }
                    } catch (error) {
                        customSwal.toast.error({
                            message: error?.message,
                        });
                    }
                },
                unique: (checked) => {
                    setListData((state) => ({
                        ...state,
                        kelas: {
                            ...state.kelas,
                            absen: {
                                ...state.kelas.absen,
                                unique: checked,
                            },
                        },
                    }));
                },
                loading: (column) => {
                    setListData((state) => ({
                        ...state,
                        kelas: {
                            ...state.kelas,
                            absen: {
                                ...state.kelas.absen,
                                loading: {
                                    ...state.kelas.absen.loading,
                                    [column]:
                                        !state.kelas.absen.loading[column],
                                },
                            },
                        },
                    }));
                },
                init: async (kelas_kuliah_id) => {
                    try {
                        if (
                            (!listData.kelas.kelas_kuliah_id &&
                                !listData.kelas.data) ||
                            listData.kelas.kelas_kuliah_id !== kelas_kuliah_id
                        ) {
                            aksi.kelas.set("kelas_kuliah_id", kelas_kuliah_id);
                            await Promise.all([
                                aksi.kelas.absen.get(kelas_kuliah_id),
                                aksi.kelas.absen.daftar.get(kelas_kuliah_id),
                            ]);
                        }

                        modal.show("modal_absen");
                    } catch (error) {
                        customSwal.toast.error({
                            message: error?.message,
                        });
                    }
                },
                refresh: async () => {
                    try {
                        aksi.kelas.absen.loading("refresh");

                        const response = await api_handler.get({
                            base_url,
                            token,
                            url: `kelas-kuliah/dosen/open/${listData.kelas.kelas_kuliah_id}${listData.kelas.absen.unique ? "?unique_pin=true" : ""}`,
                        });

                        aksi.kelas.absen.loading("refresh");

                        if (response?.success) {
                            aksi.kelas.set("data", response?.data?.pertemuan);
                        } else {
                            aksi.kelas.absen.error(response?.message);
                        }
                    } catch (error) {
                        aksi.kelas.absen.error(error?.message);
                    }
                },
                error: (message = null) => {
                    setListData((state) => ({
                        ...state,
                        kelas: {
                            ...state.kelas,
                            absen: {
                                ...state.kelas.absen,
                                error: message,
                            },
                        },
                    }));
                },
                daftar: {
                    get: async (kelas_kuliah_id) => {
                        try {
                            aksi.kelas.absen.daftar.loading("fetch");

                            const response = await api_handler.get({
                                base_url,
                                token,
                                url: `kelas-kuliah/dosen/open/${kelas_kuliah_id}/presensi`,
                            });

                            aksi.kelas.absen.daftar.loading("fetch");

                            if (response?.success) {
                                aksi.kelas.absen.daftar.set(
                                    "data",
                                    response?.data,
                                );
                            } else {
                                aksi.kelas.absen.daftar.error(
                                    response?.message,
                                );
                            }
                        } catch (error) {
                            aksi.kelas.absen.daftar.error(error?.message);
                        }
                    },
                    refresh: async () => {
                        try {
                            aksi.kelas.absen.daftar.loading("refresh");

                            const response = await api_handler.get({
                                base_url,
                                token,
                                url: `kelas-kuliah/dosen/open/${listData.kelas.kelas_kuliah_id}/presensi`,
                            });

                            aksi.kelas.absen.daftar.loading("refresh");

                            if (response?.success) {
                                aksi.kelas.absen.daftar.set(
                                    "data",
                                    response?.data,
                                );
                            } else {
                                aksi.kelas.absen.daftar.error(
                                    response?.message,
                                );
                            }
                        } catch (error) {
                            aksi.kelas.absen.daftar.error(error?.message);
                        }
                    },
                    set: (column, value) => {
                        setListData((state) => ({
                            ...state,
                            kelas: {
                                ...state.kelas,
                                absen: {
                                    ...state.kelas.absen,
                                    daftar: {
                                        ...state.kelas.absen.daftar,
                                        [column]: value,
                                    },
                                },
                            },
                        }));
                    },
                    loading: (column) => {
                        setListData((state) => ({
                            ...state,
                            kelas: {
                                ...state.kelas,
                                absen: {
                                    ...state.kelas.absen,
                                    daftar: {
                                        ...state.kelas.absen.daftar,
                                        loading: {
                                            ...state.kelas.absen.daftar.loading,
                                            [column]:
                                                !state.kelas.absen.daftar
                                                    .loading[column],
                                        },
                                    },
                                },
                            },
                        }));
                    },
                    error: (message = null) => {
                        setListData((state) => ({
                            ...state,
                            kelas: {
                                ...state.kelas,
                                absen: {
                                    ...state.kelas.absen,
                                    daftar: {
                                        ...state.kelas.absen.daftar,
                                        error: message,
                                    },
                                },
                            },
                        }));
                    },
                    delete: async (pertemuan_id, mhs_id) => {
                        try {
                            aksi.kelas.absen.daftar.set("error", null);
                            aksi.kelas.absen.daftar.loading("hapus");

                            const response = await api_handler.delete({
                                base_url,
                                token,
                                url: "kelas-kuliah/dosen/presensi-mahasiswa",
                                payload: {
                                    pertemuan_id,
                                    mhs_id,
                                },
                            });

                            aksi.kelas.absen.daftar.loading("hapus");

                            if (response?.success) {
                                aksi.kelas.absen.daftar.refresh();
                                aksi.kelas.absen.daftar.set("select", []);
                            } else {
                                aksi.kelas.absen.daftar.error(
                                    response?.message,
                                );
                            }
                        } catch (error) {
                            aksi.kelas.absen.daftar.error(response?.message);
                        }
                    },
                    delete_selected: async () => {
                        try {
                            aksi.kelas.absen.daftar.set("error", null);
                            aksi.kelas.absen.daftar.loading("hapus");

                            const response = await api_handler.multi.delete({
                                token,
                                base_url,
                                requests:
                                    listData.kelas.absen.daftar.data?.presensi_mahasiswa
                                        ?.filter((v) =>
                                            listData.kelas.absen.daftar.select.includes(
                                                v.mhs_is,
                                            ),
                                        )
                                        ?.map((v) => ({
                                            url: "kelas-kuliah/dosen/presensi-mahasiswa",
                                            payload: {
                                                pertemuan_id: v.pertemuan_id,
                                                mhs_id: v.mhs_id,
                                            },
                                        })),
                            });

                            console.log(response);

                            aksi.kelas.absen.daftar.loading("hapus");

                            if (response?.success) {
                                aksi.kelas.absen.daftar.refresh();
                                aksi.kelas.absen.daftar.set("select", []);
                            } else {
                                aksi.kelas.absen.daftar.error(
                                    response?.message,
                                );
                            }
                        } catch (error) {
                            aksi.kelas.absen.daftar.error(response?.message);
                        }
                    },
                },
            },
        },
    };

    useEffect(() => {
        (async () => {
            await Promise.allSettled([
                // aksi.khs.get(),
                aksi.jadwal.get(),
            ]);
        })();
    }, []);

    return (
        <MainLayout token={token} base_url={base_url} role={role}>
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
                                    Dashboard
                                </h1>
                            </div>
                        </div>
                    </div>

                    <ApplicationSection app={app} />

                    <CustomTabs centered>
                        <CustomTabItem label="Jadwal Hari ini">
                            <CustomLoading
                                loading={loadingUserdata}
                                renderIf={userdata}
                            >
                                <div className="divide-y divide-zinc-300">
                                    <div className="p-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div className="flex sm:items-center gap-4">
                                                <InfoOutlined
                                                    fontSize="small"
                                                    color="primary"
                                                />
                                                <p>
                                                    Silahkan tekan tombol
                                                    refresh jika terdapat data
                                                    yang tidak sesuai.
                                                </p>
                                            </div>
                                            <Button
                                                disabled={
                                                    listData.jadwal.loading
                                                        .fetch
                                                }
                                                startIcon={<RefreshOutlined />}
                                                variant="contained"
                                                onClick={() =>
                                                    aksi.jadwal.get()
                                                }
                                                size="small"
                                            >
                                                <p className="font-jakarta text-xs">
                                                    Refresh
                                                </p>
                                            </Button>
                                        </div>
                                    </div>

                                    <Modal
                                        modalId="modal_absen"
                                        title="Absensi Kelas"
                                        modalBoxClassname=" w-max-2xl"
                                    >
                                        {listData.kelas.absen.error && (
                                            <div className="p-4">
                                                <div className="p-4 bg-red-700/80 text-white rounded-md shadow-md">
                                                    <div className="flex items-center gap-4">
                                                        <Warning fontSize="small" />
                                                        <p className="text-justify">
                                                            {
                                                                listData.kelas
                                                                    .absen.error
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <CustomTabs>
                                            <CustomTabItem label="PIN">
                                                <div className="divide-y divide-zinc-300">
                                                    <div className="p-4 flex items-center justify-center text-5xl font-medium text-blue-500">
                                                        <CustomLoading
                                                            loading={
                                                                listData.kelas
                                                                    .loading
                                                                    .buka ||
                                                                listData.kelas
                                                                    .absen
                                                                    .loading
                                                                    .refresh
                                                            }
                                                            renderIf={
                                                                listData.kelas
                                                                    .data
                                                            }
                                                        >
                                                            <div className="flex items-center justify-center gap-4 px-3 py-2 rounded-md bg-blue-50 text-center">
                                                                {listData.kelas.data?.presensi?.pin
                                                                    ?.split("")
                                                                    .map(
                                                                        (
                                                                            word,
                                                                            index,
                                                                        ) => (
                                                                            <p
                                                                                key={
                                                                                    index
                                                                                }
                                                                                className=""
                                                                            >
                                                                                {
                                                                                    word
                                                                                }
                                                                            </p>
                                                                        ),
                                                                    )}
                                                            </div>
                                                        </CustomLoading>
                                                    </div>
                                                    <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                        <div className="flex items-center">
                                                            <Checkbox
                                                                size="small"
                                                                disabled={
                                                                    listData
                                                                        .kelas
                                                                        .loading
                                                                        .buka ||
                                                                    listData
                                                                        .kelas
                                                                        .absen
                                                                        .loading
                                                                        .refresh
                                                                }
                                                                checked={
                                                                    listData
                                                                        .kelas
                                                                        .absen
                                                                        .unique
                                                                }
                                                                onChange={(e) =>
                                                                    aksi.kelas.absen.unique(
                                                                        e.target
                                                                            .checked,
                                                                    )
                                                                }
                                                            />
                                                            PIN per Mahasiswa
                                                        </div>
                                                        <Button
                                                            variant="text"
                                                            disabled={
                                                                listData.kelas
                                                                    .loading
                                                                    .buka ||
                                                                listData.kelas
                                                                    .absen
                                                                    .loading
                                                                    .refresh
                                                            }
                                                            size="small"
                                                            onClick={() =>
                                                                aksi.kelas.absen.refresh()
                                                            }
                                                            startIcon={
                                                                <RefreshOutlined />
                                                            }
                                                        >
                                                            <p className="font-jakarta text-xs font-semibold">
                                                                Ganti Pin
                                                            </p>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CustomTabItem>
                                            <CustomTabItem label="QR CODE">
                                                <div className="divide-y divide-zinc-300">
                                                    <div className="p-4 flex items-center justify-center text-5xl font-medium text-blue-500">
                                                        <div className="border rounded-lg border-zinc-300 p-3">
                                                            <CustomLoading
                                                                loading={
                                                                    listData
                                                                        .kelas
                                                                        .loading
                                                                        .buka ||
                                                                    listData
                                                                        .kelas
                                                                        .absen
                                                                        .loading
                                                                        .refresh
                                                                }
                                                                renderIf={
                                                                    listData
                                                                        .kelas
                                                                        .data
                                                                }
                                                            >
                                                                <QRMaker
                                                                    value={`${listData.kelas.kelas_kuliah_id}-${listData.kelas.data?.presensi?.pin}-${listData.kelas.absen.unique ? "1" : "0"}`}
                                                                />
                                                            </CustomLoading>
                                                        </div>
                                                    </div>
                                                    <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                        <div className="flex items-center">
                                                            <Checkbox
                                                                size="small"
                                                                disabled={
                                                                    listData
                                                                        .kelas
                                                                        .loading
                                                                        .buka ||
                                                                    listData
                                                                        .kelas
                                                                        .absen
                                                                        .loading
                                                                        .refresh
                                                                }
                                                                checked={
                                                                    listData
                                                                        .kelas
                                                                        .absen
                                                                        .unique
                                                                }
                                                                onChange={(e) =>
                                                                    aksi.kelas.absen.unique(
                                                                        e.target
                                                                            .checked,
                                                                    )
                                                                }
                                                            />
                                                            QR Code per
                                                            Mahasiswa
                                                        </div>
                                                        <Button
                                                            variant="text"
                                                            disabled={
                                                                listData.kelas
                                                                    .loading
                                                                    .buka ||
                                                                listData.kelas
                                                                    .absen
                                                                    .loading
                                                                    .refresh
                                                            }
                                                            size="small"
                                                            onClick={() =>
                                                                aksi.kelas.absen.refresh()
                                                            }
                                                            startIcon={
                                                                <RefreshOutlined />
                                                            }
                                                        >
                                                            <p className="font-jakarta text-xs font-semibold">
                                                                Ganti QR
                                                            </p>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CustomTabItem>
                                            <CustomTabItem label="Daftar Absen">
                                                <div className="divide-y divide-zinc-300">
                                                    {listData.kelas.absen.daftar
                                                        .error && (
                                                        <div className="p-4">
                                                            <div className="p-4 bg-red-700/80 text-white rounded-md shadow-md">
                                                                <div className="flex items-center gap-4">
                                                                    <Warning fontSize="small" />
                                                                    <p className="text-justify">
                                                                        {
                                                                            listData
                                                                                .kelas
                                                                                .absen
                                                                                .daftar
                                                                                .error
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="p-4 flex items-center justify-between gap-4">
                                                        <Button
                                                            startIcon={
                                                                listData.kelas
                                                                    .absen
                                                                    .daftar
                                                                    .loading
                                                                    .refresh ? (
                                                                    <CircularProgress
                                                                        size={
                                                                            15
                                                                        }
                                                                        className="grayscale"
                                                                    />
                                                                ) : (
                                                                    <RefreshOutlined />
                                                                )
                                                            }
                                                            size="small"
                                                            variant="outlined"
                                                            disabled={
                                                                listData.kelas
                                                                    .absen
                                                                    .daftar
                                                                    .loading
                                                                    .refresh ||
                                                                listData.kelas
                                                                    .absen
                                                                    .daftar
                                                                    .loading
                                                                    .hapus
                                                            }
                                                            onClick={() =>
                                                                aksi.kelas.absen.daftar.refresh()
                                                            }
                                                        >
                                                            <p className="font-jakarta font-semibold">
                                                                Refresh
                                                            </p>
                                                        </Button>
                                                        <Fade
                                                            in={
                                                                listData.kelas
                                                                    .absen
                                                                    .daftar
                                                                    .select
                                                                    .length > 0
                                                            }
                                                        >
                                                            <Button
                                                                startIcon={
                                                                    listData
                                                                        .kelas
                                                                        .absen
                                                                        .daftar
                                                                        .loading
                                                                        .hapus ? (
                                                                        <CircularProgress
                                                                            size={
                                                                                15
                                                                            }
                                                                            className="grayscale"
                                                                        />
                                                                    ) : (
                                                                        <Delete />
                                                                    )
                                                                }
                                                                size="small"
                                                                variant="contained"
                                                                onClick={() =>
                                                                    aksi.kelas.absen.daftar.delete_selected()
                                                                }
                                                                disabled={
                                                                    listData
                                                                        .kelas
                                                                        .absen
                                                                        .daftar
                                                                        .loading
                                                                        .refresh ||
                                                                    listData
                                                                        .kelas
                                                                        .absen
                                                                        .daftar
                                                                        .loading
                                                                        .hapus
                                                                }
                                                            >
                                                                <p className="font-jakarta font-semibold">
                                                                    Hapus
                                                                </p>
                                                            </Button>
                                                        </Fade>
                                                    </div>
                                                    <CustomDataTable
                                                        toolbar={{
                                                            search: true,
                                                        }}
                                                        rows={
                                                            listData.kelas.absen
                                                                .daftar.data
                                                                ?.presensi_mahasiswa
                                                        }
                                                        loading={
                                                            listData.kelas.absen
                                                                .daftar.loading
                                                                .refresh
                                                        }
                                                        // checkbox
                                                        getRowId={(row) =>
                                                            row.mhs_id
                                                        }
                                                        rowSelect={{
                                                            value: listData
                                                                .kelas.absen
                                                                .daftar.select,
                                                            onChange: (row) =>
                                                                aksi.kelas.absen.daftar.set(
                                                                    "select",
                                                                    row,
                                                                ),
                                                        }}
                                                        columns={[
                                                            {
                                                                field: "nim",
                                                                headerName:
                                                                    "NIM",
                                                                valueGetter: (
                                                                    value,
                                                                    row,
                                                                ) => row.nim,
                                                                minWidth: 150,
                                                            },
                                                            {
                                                                field: "nm_mhs",
                                                                headerName:
                                                                    "Nama",
                                                                minWidth: 150,
                                                            },
                                                            {
                                                                field: "masuk",
                                                                headerName:
                                                                    "Tanggal",
                                                                minWidth: 150,
                                                                valueGetter: (
                                                                    value,
                                                                    row,
                                                                ) =>
                                                                    row.masuk
                                                                        ? dayjs(
                                                                              row.masuk,
                                                                          )
                                                                              .locale(
                                                                                  "id",
                                                                              )
                                                                              .format(
                                                                                  "HH:mm:ss, DD MMMM YYYY",
                                                                              )
                                                                        : "-",
                                                            },
                                                            {
                                                                field: "aksi",
                                                                headerName:
                                                                    "Hapus",
                                                                minWidth: 75,
                                                                maxWidth: 75,
                                                                renderCell: ({
                                                                    row,
                                                                }) => (
                                                                    <div className="flex items-center justify-center h-full">
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() =>
                                                                                aksi.kelas.absen.daftar.delete(
                                                                                    row.pertemuan_id,
                                                                                    row.mhs_id,
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                listData
                                                                                    .kelas
                                                                                    .absen
                                                                                    .daftar
                                                                                    .loading
                                                                                    .hapus
                                                                            }
                                                                            color="primary"
                                                                        >
                                                                            {listData
                                                                                .kelas
                                                                                .absen
                                                                                .daftar
                                                                                .loading
                                                                                .hapus ? (
                                                                                <CircularProgress
                                                                                    size={
                                                                                        15
                                                                                    }
                                                                                    className="grayscale"
                                                                                />
                                                                            ) : (
                                                                                <Delete fontSize="small" />
                                                                            )}
                                                                        </IconButton>
                                                                    </div>
                                                                ),
                                                                headerAlign:
                                                                    "center",
                                                            },
                                                        ]}
                                                    />
                                                </div>
                                            </CustomTabItem>
                                        </CustomTabs>
                                    </Modal>

                                    <ModalForm
                                        modalId="modal_tutup_kelas"
                                        title="Tutup Kelas"
                                        modalBoxClassname="w-max-2xl"
                                        error={formData.tutup.error}
                                        loading={listData.jadwal.loading.tutup}
                                        onSubmit={(e) =>
                                            aksi.kelas.tutup.submit(e)
                                        }
                                    >
                                        <div className="p-4">
                                            <TextField
                                                multiline
                                                fullWidth
                                                label="Berita Acara"
                                                required
                                                size="small"
                                                value={
                                                    formData.tutup.berita_acara
                                                }
                                                onChange={(e) =>
                                                    aksi.kelas.tutup.set(
                                                        "berita_acara",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </ModalForm>

                                    <div className="p-4">
                                        <CustomLoading
                                            loading={
                                                listData.jadwal.loading.fetch
                                            }
                                            renderIf={listData.jadwal.fetched}
                                            sketch={<div className="p-4"></div>}
                                        >
                                            {aksi.jadwal.hari.get(
                                                dayjs()
                                                    .locale("id")
                                                    .format("dddd"),
                                            ).length > 0 ? (
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                    {aksi.jadwal.hari
                                                        .get(
                                                            dayjs()
                                                                .locale("id")
                                                                .format("dddd"),
                                                        )
                                                        .map((item) => (
                                                            <div
                                                                key={
                                                                    item[
                                                                        "data_kelas"
                                                                    ][
                                                                        "kelas_kuliah_id"
                                                                    ]
                                                                }
                                                                className={`rounded-md shadow border-l-4 ${item["kelas_dibuka"] ? "border-blue-500" : "border-zinc-500"}`}
                                                            >
                                                                <div className="flex flex-col justify-between">
                                                                    <div className="flex gap-4 p-4">
                                                                        <div className="">
                                                                            <div
                                                                                className={`w-7 sm:w-8 lg:w-10 aspect-square rounded-md flex items-center justify-center ${item["kelas_dibuka"] ? "bg-blue-100 text-blue-500" : "bg-zinc-100 text-zinc-500"}`}
                                                                            >
                                                                                <CollectionsBookmarkOutlined fontSize="small" />
                                                                            </div>
                                                                        </div>
                                                                        <div className=" space-y-4 w-full">
                                                                            <div className="space-y-2">
                                                                                {item[
                                                                                    "matakuliah"
                                                                                ][
                                                                                    "kd_mk"
                                                                                ] && (
                                                                                    <p className="text-xs font-medium opacity-70">
                                                                                        {
                                                                                            item[
                                                                                                "matakuliah"
                                                                                            ][
                                                                                                "kd_mk"
                                                                                            ]
                                                                                        }
                                                                                    </p>
                                                                                )}
                                                                                <h1 className="font-bold text-lg">
                                                                                    {
                                                                                        item[
                                                                                            "matakuliah"
                                                                                        ][
                                                                                            "nm_mk"
                                                                                        ]
                                                                                    }
                                                                                </h1>
                                                                            </div>
                                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                                {item[
                                                                                    "dosen"
                                                                                ] && (
                                                                                    <div className="flex items-center gap-3 opacity-70">
                                                                                        <SubjectOutlined
                                                                                            sx={{
                                                                                                fontSize: 16,
                                                                                            }}
                                                                                        />
                                                                                        <p className="text-xs font-medium">
                                                                                            Semester{" "}
                                                                                            {
                                                                                                item[
                                                                                                    "matakuliah"
                                                                                                ][
                                                                                                    "semester"
                                                                                                ]
                                                                                            }
                                                                                        </p>
                                                                                    </div>
                                                                                )}
                                                                                <div className="flex items-center">
                                                                                    <Button
                                                                                        startIcon={
                                                                                            <Download fontSize="small" />
                                                                                        }
                                                                                        size="small"
                                                                                        disabled={
                                                                                            !item[
                                                                                                "kontrak_kuliah"
                                                                                            ]
                                                                                        }
                                                                                    >
                                                                                        <p className="text-xs font-semibold font-jakarta">
                                                                                            Kontrak/silabus
                                                                                            Kuliah
                                                                                        </p>
                                                                                    </Button>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex items-center flex-wrap">
                                                                                {item[
                                                                                    "riwayat_pertemuan"
                                                                                ].map(
                                                                                    (
                                                                                        absen,
                                                                                        index,
                                                                                    ) => (
                                                                                        <Tooltip
                                                                                            key={
                                                                                                index
                                                                                            }
                                                                                            arrow
                                                                                            title={`${absen["jns_pert"]} - ${dayjs(absen["create_time"]).locale("id").format("HH:mm:ss, DD MMMM YYYY")}`}
                                                                                        >
                                                                                            <CheckBoxTwoTone
                                                                                                fontSize="small"
                                                                                                color="primary"
                                                                                            />
                                                                                        </Tooltip>
                                                                                    ),
                                                                                )}
                                                                                {Array.from(
                                                                                    {
                                                                                        length: parseInt(
                                                                                            item[
                                                                                                "riwayat_pertemuan_maks"
                                                                                            ] -
                                                                                                item[
                                                                                                    "riwayat_pertemuan"
                                                                                                ]
                                                                                                    .length,
                                                                                        ),
                                                                                    },
                                                                                ).map(
                                                                                    (
                                                                                        _,
                                                                                        index,
                                                                                    ) => (
                                                                                        <Tooltip
                                                                                            key={
                                                                                                index
                                                                                            }
                                                                                            arrow
                                                                                            title=""
                                                                                        >
                                                                                            <CheckBoxOutlineBlankTwoTone fontSize="small" />
                                                                                        </Tooltip>
                                                                                    ),
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div
                                                                        className={`${item["kelas_dibuka"] ? "bg-blue-50/50" : "bg-zinc-50"} p-4`}
                                                                    >
                                                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                                                            <div className="flex items-center justify-between sm:justify-start gap-6">
                                                                                {item[
                                                                                    "jadwal"
                                                                                ] && (
                                                                                    <>
                                                                                        {item[
                                                                                            "jadwal"
                                                                                        ][
                                                                                            "jam"
                                                                                        ] && (
                                                                                            <div className="flex items-center gap-3">
                                                                                                <AccessTimeOutlined
                                                                                                    sx={{
                                                                                                        fontSize: 16,
                                                                                                    }}
                                                                                                    className={`${item["kelas_dibuka"] ? "text-blue-700" : "text-zinc-700"}`}
                                                                                                />
                                                                                                <p className="text-xs font-semibold opacity-70">
                                                                                                    {
                                                                                                        item[
                                                                                                            "jadwal"
                                                                                                        ][
                                                                                                            "jam"
                                                                                                        ]
                                                                                                    }
                                                                                                </p>
                                                                                            </div>
                                                                                        )}
                                                                                        {item[
                                                                                            "jadwal"
                                                                                        ][
                                                                                            "kd_ruang"
                                                                                        ] && (
                                                                                            <div className="flex items-center gap-3">
                                                                                                <LocationOnOutlined
                                                                                                    sx={{
                                                                                                        fontSize: 16,
                                                                                                    }}
                                                                                                    className={`${item["kelas_dibuka"] ? "text-blue-700" : "text-zinc-700"}`}
                                                                                                />
                                                                                                <p className="text-xs font-semibold opacity-70">
                                                                                                    Ruang{" "}
                                                                                                    {
                                                                                                        item[
                                                                                                            "jadwal"
                                                                                                        ][
                                                                                                            "kd_ruang"
                                                                                                        ]
                                                                                                    }
                                                                                                </p>
                                                                                            </div>
                                                                                        )}
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                            <div className="flex justify-end w-full sm:w-fit">
                                                                                {!item[
                                                                                    "kontrak_kuliah"
                                                                                ] ? (
                                                                                    item[
                                                                                        "kelas_dibuka"
                                                                                    ] ? (
                                                                                        <div className="flex items-center gap-4 w-full sm:w-fit">
                                                                                            <Button
                                                                                                variant="outlined"
                                                                                                size="small"
                                                                                                onClick={() =>
                                                                                                    aksi.kelas.absen.init(
                                                                                                        item[
                                                                                                            "data_kelas"
                                                                                                        ][
                                                                                                            "kelas_kuliah_id"
                                                                                                        ],
                                                                                                    )
                                                                                                }
                                                                                                disabled={
                                                                                                    listData
                                                                                                        .kelas
                                                                                                        .loading
                                                                                                        .buka ||
                                                                                                    listData
                                                                                                        .kelas
                                                                                                        .absen
                                                                                                        .loading
                                                                                                        .refresh
                                                                                                }
                                                                                                className="text-xs w-full sm:w-fit"
                                                                                            >
                                                                                                <p className="font-jakarta text-xs">
                                                                                                    {listData
                                                                                                        .kelas
                                                                                                        .loading
                                                                                                        .buka ||
                                                                                                    listData
                                                                                                        .kelas
                                                                                                        .absen
                                                                                                        .loading
                                                                                                        .refresh
                                                                                                        ? "Loading..."
                                                                                                        : "Absensi"}
                                                                                                </p>
                                                                                            </Button>
                                                                                            <Button
                                                                                                variant="contained"
                                                                                                disabled={
                                                                                                    listData
                                                                                                        .kelas
                                                                                                        .loading
                                                                                                        .buka ||
                                                                                                    listData
                                                                                                        .kelas
                                                                                                        .absen
                                                                                                        .loading
                                                                                                        .refresh
                                                                                                }
                                                                                                onClick={() =>
                                                                                                    modal.show(
                                                                                                        "modal_tutup_kelas",
                                                                                                    )
                                                                                                }
                                                                                                size="small"
                                                                                                className="text-xs w-full sm:w-fit"
                                                                                            >
                                                                                                <p className="font-jakarta text-xs">
                                                                                                    {listData
                                                                                                        .kelas
                                                                                                        .loading
                                                                                                        .buka ||
                                                                                                    listData
                                                                                                        .kelas
                                                                                                        .absen
                                                                                                        .loading
                                                                                                        .refresh
                                                                                                        ? "Loading..."
                                                                                                        : "Tutup Kelas"}
                                                                                                </p>
                                                                                            </Button>
                                                                                        </div>
                                                                                    ) : (
                                                                                        <Button
                                                                                            variant="contained"
                                                                                            disabled={
                                                                                                listData
                                                                                                    .jadwal
                                                                                                    .loading
                                                                                                    .fetch ||
                                                                                                aksi.jadwal.kelas_lain_dibuka()
                                                                                            }
                                                                                            onClick={() =>
                                                                                                aksi.kelas.buka(
                                                                                                    item[
                                                                                                        "data_kelas"
                                                                                                    ][
                                                                                                        "kelas_kuliah_id"
                                                                                                    ],
                                                                                                )
                                                                                            }
                                                                                            size="small"
                                                                                            className="text-xs w-full sm:w-fit"
                                                                                        >
                                                                                            <p className="font-jakarta text-xs">
                                                                                                {aksi.jadwal.kelas_lain_dibuka()
                                                                                                    ? "Kelas lain sedang dibuka"
                                                                                                    : "Buka kelas"}
                                                                                            </p>
                                                                                        </Button>
                                                                                    )
                                                                                ) : (
                                                                                    <CustomUpload
                                                                                        buttonProps={{
                                                                                            size: "small",
                                                                                            variant:
                                                                                                "contained",
                                                                                        }}
                                                                                        text="upload kontrak/silabus"
                                                                                        startIcon={
                                                                                            <Upload />
                                                                                        }
                                                                                    />
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center min-h-screen">
                                                    <div className="space-y-4">
                                                        <img
                                                            src="/images/empty.png"
                                                            alt="Logo Not Found"
                                                            className="w-80"
                                                        />
                                                        <p className="text-center text-lg sm:text-xl lg:text-2xl font-medium">
                                                            Anda tidak memiliki
                                                            jadwal di hari ini
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </CustomLoading>
                                    </div>
                                </div>
                            </CustomLoading>
                        </CustomTabItem>
                        <CustomTabItem label="Pengumuman">
                            <CustomTabs>
                                <CustomTabItem label="umum">
                                    <DosenPagePengumumanUmum token={token} base_url={base_url} role={role} />
                                </CustomTabItem>
                                <CustomTabItem label="Kelas">
                                    <DosenPagePengumumanKelas token={token} base_url={base_url} role={role} />
                                </CustomTabItem>
                            </CustomTabs>
                        </CustomTabItem>
                    </CustomTabs>
                </div>
            </div>
        </MainLayout>
    );
}

function DosenPagePengumumanUmum({ token, base_url, role }) {

    const { userdata, loadingUserdata } = useUser();
    
    const [listData, setListData] = useState({
        pengumuman: {
            data: [],
            meta: null,
            loading: {
                fetch: false,
                refresh: false
            }
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
                        url: 'pengumuman/dosen/list'
                    })

                    aksi.pengumuman.loading('fetch')

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
            }
        }
    }

    useEffect(() => {
        (async () => {
            aksi.pengumuman.get()
        })();
    }, []);

    return (
        <div className="p-4">
            <div className="flex justify-center">
                <div className="max-w-5xl w-full space-y-4 flex flex-col items-center">

                    {listData.pengumuman.loading.fetch || listData.pengumuman.loading.refresh
                        ? (
                            <div className="w-full h-80 flex items-center justify-center">
                                <CircularProgress size={45} color="primary" />
                            </div>
                        )
                        : listData.pengumuman.data.length < 1 
                            ? (
                                <div className="w-full h-80 flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <p className="italic opacity-50">
                                            Tampaknya belum ada pengumuman
                                        </p>
                                    </div>
                                </div>
                            )
                            : (
                                <>
                                    {listData.pengumuman.data.filter(pengumuman => pengumuman?.target === 0).map(pengumuman => (
                                        <div key={pengumuman['pengumuman_id']} className={`relative overflow-hidden rounded-md ${pengumuman['target'] === 0 ? 'border-2 border-blue-500' : 'border border-zinc-300'} w-full shadow-md`}>
                                            <div className="space-y-1">
                                                {pengumuman['target'] === 0
                                                    ? (
                                                        <div className="bg-blue-800/80 p-4 border-b border-zinc-300 text-white font-semibold">
                                                            <div className="flex items-center gap-4">
                                                                <CampaignTwoTone fontSize="small" />
                                                                <p>
                                                                    {pengumuman['keterangan_target']}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )
                                                    : (
                                                        <div className="bg-zinc-50 p-4 border-b border-zinc-300">
                                                            <div className="flex items-center gap-4">
                                                                <CampaignTwoTone fontSize="small" />
                                                                <p>
                                                                    {pengumuman['keterangan_target']}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                <div className="p-4">
                                                    <div className="flex items-center gap-4">
                                                        <Avatar 
                                                            sx={{
                                                                width: 40,
                                                                height: 40
                                                            }}
                                                            className="w-80 h-80"
                                                            src={pengumuman['avatar_pengirim']}
                                                            alt="Foto Profil"
                                                        />
                                                        <div className="space-y-1">
                                                            <p className="font-bold">
                                                                {pengumuman['nm_pengirim']}
                                                            </p>
                                                            <p className="text-xs font-light italic opacity-70">
                                                                {dayjs(pengumuman['tgl_dikirim']).locale('id').format('dddd, DD MMMM YYYY, HH:mm:ss')}
                                                            </p>
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className="p-4">
                                                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(pengumuman['message'])}}></div>
                                                </div>
                                                {pengumuman['image'] && (
                                                    <img className="w-full h-full" src={pengumuman['image']} alt="Foto Pengumuman" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )
                    }

                </div>
            </div>
        </div>
    )
}

function DosenPagePengumumanKelas({ token, base_url, role }) {
    const [listData, setListData] = useState({
        kelas: {
            data: [],
            loading: {
                fetch: false,
                refresh: false
            },
            selected_target: null
        },
        pengumuman: {
            data: [],
            meta: null,
            loading: {
                fetch: false,
                refresh: false
            }
        }
    })

    const [formData, setFormData] = useState({
        pengumuman: {
            message: '',
            selected_target: null,
            error: null,
            loading: false,
            image: null,
            image_source: null
        }
    })

    const aksi = {
        kelas: {
            get: async () => {
                try {
                    aksi.kelas.loading('fetch')

                    const response = await api_handler.get({
                        base_url,
                        token,
                        url: 'pengumuman/dosen/kelas-kuliah'
                    })
                    
                    aksi.kelas.loading('fetch')   
                    
                    if(response?.success) {
                        aksi.kelas.set('data', response?.data?.targets)
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
                    kelas: {
                        ...state.kelas,
                        [column]: value
                    }
                }))
            },
            loading: (column) => {
                setListData(state => ({
                    ...state,
                    kelas: {
                        ...state.kelas,
                        loading: {
                            ...state.kelas.loading,
                            [column]: !state.kelas.loading[column]
                        }
                    }
                }))
            },
            select: async (selected) => {
                aksi.kelas.set('selected_target', selected)
                aksi.pengumuman.set('data', [])

                if(selected) {
                    await aksi.pengumuman.get(selected)
                }
            }
        },
        pengumuman: {
            get: async (target) => {
                try {
                    aksi.pengumuman.loading('fetch')
                    
                    const response = await api_handler.get({
                        base_url,
                        url: `pengumuman/dosen/list?kelas_kuliah_id=${target['value']}`,
                        token
                    })

                    aksi.pengumuman.loading('fetch')      
                    
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
            }
        },
        formData: {
            pengumuman: {
                clear: () => {
                    setFormData({
                        pengumuman: {
                            message: '',
                            selected_target: null,
                            error: null,
                            loading: false,
                            image: null,
                            image_source: null
                        }
                    })
                },
                set: (column, value) => {
                    setFormData(state => ({
                        ...state,
                        pengumuman: {
                            ...state.pengumuman,
                            [column]: value
                        }
                    }))
                },
                set_image: (image) => {
                    if(image && image.type.startsWith('image/')) {
                        aksi.formData.pengumuman.set('image', image)
                        const reader = new FileReader()
                        reader.onload = () => {
                            aksi.formData.pengumuman.set('image_source', reader.result)
                        }
                        reader.readAsDataURL(image)
                    }else{
                        aksi.formData.pengumuman.set('image', null)
                        customSwal.toast.error({
                            message: 'Anda hanya diperbolehkan untuk mengunggah sebuah foto / gambar!'
                        })
                    }
                },
                clear_image: () => {
                    aksi.formData.pengumuman.set('image', null)
                    aksi.formData.pengumuman.set('image_source', null)
                },
                submit: async (e) => {
                    try {
                        e.preventDefault()

                        aksi.formData.pengumuman.set('error', null)

                        let response_image = {
                            success: false,
                            message: 'Gagal mengunggah foto / gambar'
                        }

                        let response = {
                            success: false,
                            message: 'Gagal untuk membuat pengumuman'
                        }

                        let payload = {
                            target: formData.pengumuman.selected_target?.value,
                            message: formData.pengumuman.message,
                            image: null
                        }
                        
                        console.log(payload)

                        if(!payload.target) {
                            aksi.formData.pengumuman.set('error', 'Kelas belum dipilih!')
                            return
                        }


                        aksi.formData.pengumuman.set('loading', true)

                        if(formData.pengumuman.image) {
                            response_image = await api_handler.postForm({
                                url: 'file/image/add?to=pengumuman',
                                base_url,
                                token,
                                payload: {
                                    image: formData.pengumuman.image
                                }
                            })

                            if(!response_image?.success) {
                                aksi.formData.pengumuman.set('loading', false)
                                aksi.formData.pengumuman.set('error', response_image?.message)
                                return
                            }
                        }

                        if(formData.pengumuman.image) {
                            payload.image = response_image?.data?.imageName
                        }

                        response = await api_handler.post({
                            base_url,
                            token,
                            url: 'pengumuman/dosen/add',
                            payload
                        })

                        aksi.formData.pengumuman.set('loading', false)

                        if(response?.success) {
                            modal.close('buat_pengumuman')
                            aksi.kelas.select(formData.pengumuman.selected_target)
                            aksi.pengumuman.get(formData.pengumuman.selected_target)
                            aksi.formData.pengumuman.clear()
                            customSwal.toast.success({
                                message: 'Berhasil membuat pengumuman baru!'
                            })
                        }else{
                            aksi.formData.pengumuman.set('error', response?.message)
                        }
                    } catch (error) {
                        aksi.formData.pengumuman.set('error', error?.message)
                    }
                },
                init: () => {
                    if(listData.kelas.selected_target) {
                        aksi.formData.pengumuman.set('selected_target', listData.kelas.selected_target)
                    }else{
                        aksi.formData.pengumuman.set('selected_target', null)
                    }

                    modal.show('buat_pengumuman')
                }
            }
        }
    }

    useEffect(() => {
        (async () => {
            await aksi.kelas.get()
        })()
    }, [])

    return (
        <div className="divide-y divide-zinc-300">

            <ModalForm modalId="buat_pengumuman" onSubmit={(e) => aksi.formData.pengumuman.submit(e)} error={formData.pengumuman.error} loading={formData.pengumuman.loading} title="Buat Pengumuman Baru" modalBoxClassname="max-w-3xl">
                <div className="divide-y divide-zinc-300">
                    <div className="p-4">
                        <CustomSelect 
                            placeholder="Nama Kelas"
                            label="Cari dan Pilih Kelas"  
                            options={listData.kelas.data.map(kelas => 
                                kelas['target'] === 0
                                    ? ({
                                        label: 'Semua Kelas',
                                        value: kelas['target']
                                    })
                                    : ({
                                        label: kelas['nm_mk'],
                                        value: kelas['target']
                                    })
                            )}
                            optionLabel={'label'}
                            value={formData.pengumuman.selected_target}
                            onChange={(e, value) => aksi.formData.pengumuman.set('selected_target', value)}
                            onModal="buat_pengumuman"
                            disabled={formData.pengumuman.loading}
                        />
                    </div>
                    <div className="p-4">
                        <TextField 
                            fullWidth
                            label="Pesan"
                            placeholder="Berikan Pesan anda disini"
                            multiline
                            rows={4}
                            value={formData.pengumuman.message}
                            onChange={(e) => aksi.formData.pengumuman.set('message', e.target.value)}
                            disabled={formData.pengumuman.loading}
                            required
                        />
                    </div>
                    <div className="p-4 space-y-2">
                        {formData.pengumuman.image 
                            ? (
                                <div className="w-full border-dotted border-4 p-4 border-zinc-300 flex flex-col gap-4 items-center justify-center">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2 sm:gap-4">
                                        <CustomUpload disabled={formData.pengumuman.loading} text="Ganti Gambar / Foto" startIcon={<Image />} accept={['image/*']} onUploaded={(files) => aksi.formData.pengumuman.set_image(files[0])} />
                                        <Button disabled={formData.pengumuman.loading} onClick={() => aksi.formData.pengumuman.clear_image()} size="small" color="error" startIcon={<Close />}>
                                            <p className='font-jakarta text-xs font-medium'>
                                                Hapus
                                            </p>
                                        </Button>
                                    </div>
                                    <img src={formData.pengumuman.image_source} alt="Uploaded Preview" className="w-full h-full rounded-md" />
                                </div>
                            )
                            : (
                                <div className="w-full h-40 border-dotted border-4 border-zinc-300 flex items-center justify-center">
                                    <CustomUpload disabled={formData.pengumuman.loading} text="Pilih Gambar / Foto" startIcon={<Image />} accept={['image/*']} onUploaded={(files) => aksi.formData.pengumuman.set_image(files[0])} />
                                </div>
                            )
                        }
                    </div>
                </div>
            </ModalForm>

            <div className="p-4">
                <div className="w-full">
                    <CustomLoading loading={listData.kelas.loading.fetch} renderIf={!listData.kelas.loading.fetch}>
                        <div className="flex gap-4 flex-col-reverse sm:flex-row sm:items-center sm:justify-between">
                            <div className="w-full sm:w-2/3 lg:w-1/2">
                                <CustomSelect 
                                    placeholder="Nama atau Kode Mata Kuliah"
                                    label="Cari dan Pilih Mata Kuliah"  
                                    options={listData.kelas.data.filter(kelas => kelas['target'] !== 0).map(kelas => ({
                                        label: kelas['nm_mk'],
                                        value: kelas['target']
                                    }))}
                                    optionLabel={'label'}
                                    value={listData.kelas.selected_target}
                                    onChange={(e, value) => aksi.kelas.select(value)}
                                />
                            </div>
                            <Button variant="contained" onClick={() => aksi.formData.pengumuman.init()} size="small" startIcon={<Add />}>
                                <p className="font-jakarta font-semibold">
                                    Buat Pengumuman
                                </p>
                            </Button>
                        </div>
                    </CustomLoading>
                </div>
            </div>
            <div className="p-4">
                {!listData.kelas.selected_target
                    ? (
                        <div className="flex items-center justify-center h-80">
                            <p className="italic opacity-50">
                                Anda perlu memilih mata kuliah terlebih dahulu!
                            </p>
                        </div>
                    )
                    : listData.pengumuman.loading.fetch
                        ? (
                            <div className="flex items-center justify-center h-80">
                                <CircularProgress size={30} />
                            </div>
                        )
                        : listData.pengumuman.data.length < 1
                            ? (
                                <div className="flex items-center justify-center h-80">
                                    <p className="italic opacity-50">
                                        Tampaknya di Kelas ini belum ada pengumuman kelas!
                                    </p>
                                </div>
                            )
                            : (
                                <div className="flex justify-center">
                                    <div className="max-w-5xl w-full space-y-4 flex flex-col items-center">
                                        {listData.pengumuman.data.map(pengumuman => (
                                            <div key={pengumuman['pengumuman_id']} className="relative overflow-hidden rounded-md border border-zinc-300 w-full shadow-md">
                                                <div className="space-y-1">
                                                    <div className="p-4">
                                                        <div className="flex items-center gap-4">
                                                            <Avatar 
                                                                sx={{
                                                                    width: 40,
                                                                    height: 40
                                                                }}
                                                                className="w-80 h-80"
                                                                src={pengumuman['avatar_pengirim']}
                                                                alt="Foto Profil"
                                                            />
                                                            <div className="space-y-1">
                                                                <p className="font-bold">
                                                                    {pengumuman['nm_pengirim']}
                                                                </p>
                                                                <p className="text-xs font-light italic opacity-70">
                                                                    {dayjs(pengumuman['tgl_dikirim']).locale('id').format('dddd, DD MMMM YYYY, HH:mm:ss')}
                                                                </p>
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className="p-4">
                                                        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(pengumuman['message'])}}></div>
                                                    </div>
                                                    {pengumuman['image'] && (
                                                        <img className="w-full h-full" src={pengumuman['image']} alt="Foto Pengumuman" />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                }
            </div>
        </div>
    )
}

function AdminPage({ token, base_url, role, app }) {
    const { setShowSidebar } = useSidebar();

    const { userdata, loadingUserdata } = useUser();

    const [listData, setListData] = useState({
        pengumuman: {
            data: [],
            meta: null,
            loading: {
                fetch: false,
                refresh: false
            }
        }
    })

    const editorRef = useRef(null)

    const [formData, setFormData] = useState({
        tambah_pengumuman: {
            target: 0,
            image: null,
            message: '',
            error: null,
            loading: false,
            enable: false,
            with_image: false,
            image_source: null
        }
    })

    const aksi = {
        formData: {
            tambah_pengumuman: {
                enable: (enable = true) => {
                    setFormData(state => ({
                        ...state,
                        tambah_pengumuman: {
                            ...state.tambah_pengumuman,
                            enable
                        }
                    }))
                },
                submit: async () => {
                    try {
                        const message = formData.tambah_pengumuman.message

                        if(message.length < 1) {
                            return customSwal.toast.error({
                                message: 'Anda perlu memberikan pernyataan pengumuman terlebih dahulu!'
                            })
                        }

                        aksi.formData.tambah_pengumuman.set('loading', true)

                        let response = {
                            success: false,
                            message: 'Terjadi kesalahan disaat membuat pengumuman baru!'
                        }

                        let response_image = {
                            success: false,
                            message: 'Terjadi kesalahan disaat membuat pengumuman baru!'
                        }

                        if(formData.tambah_pengumuman.with_image) {
                            response_image = await api_handler.postForm({
                                token,
                                base_url,
                                url: 'file/image/add?to=pengumuman',
                                payload: {
                                    image: formData.tambah_pengumuman.image
                                }
                            })

                            if(!response_image?.success) {
                                aksi.formData.tambah_pengumuman.set('loading', false)
                                return customSwal.toast.error({
                                    message: response_image?.message
                                })
                            }
                        }

                        let payload = {
                            target: 0,
                            message
                        }

                        if(response_image?.success) {
                            payload = {
                                ...payload,
                                image: response_image?.data?.imageName
                            }
                        }

                        response = await api_handler.post({
                            token,
                            base_url,
                            url: 'pengumuman/admin/add',
                            payload
                        })

                        aksi.formData.tambah_pengumuman.set('loading', false)

                        if(response?.success) {
                            aksi.formData.tambah_pengumuman.set('message', '')
                            aksi.formData.tambah_pengumuman.set('with_image', false)
                            aksi.formData.tambah_pengumuman.set('image', null)
                            aksi.formData.tambah_pengumuman.set('image_source', null)
                            customSwal.toast.success({
                                message: 'Berhasil menambahkan pengumuman baru!'
                            })
                            aksi.formData.tambah_pengumuman.enable(false)
                            aksi.pengumuman.refresh()
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
                    setFormData(state => ({
                        ...state,
                        tambah_pengumuman: {
                            ...state.tambah_pengumuman,
                            [column]: value
                        }
                    }))
                },
                set_image: (image) => {
                    if(image && image.type.startsWith('image/')) {
                        aksi.formData.tambah_pengumuman.set('image', image)
                        const reader = new FileReader()
                        reader.onload = () => {
                            aksi.formData.tambah_pengumuman.set('image_source', reader.result)
                        }
                        reader.readAsDataURL(image)
                    }else{
                        aksi.formData.tambah_pengumuman.set('image', null)
                        customSwal.toast.error({
                            message: 'Anda hanya diperbolehkan untuk mengunggah sebuah foto / gambar!'
                        })
                    }
                },
                clear_image: () => {
                    aksi.formData.tambah_pengumuman.set('image', null)
                    aksi.formData.tambah_pengumuman.set('image_source', null)
                }
            }
        },
        pengumuman: {
            get: async () => {
                try {
                    aksi.pengumuman.loading('fetch')

                    const response = await api_handler.get({
                        base_url,
                        token,
                        url: 'pengumuman/admin/list'
                    })

                    aksi.pengumuman.loading('fetch')

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
                        url: 'pengumuman/admin/list'
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
            }
        }
    }

    useEffect(() => {
        (async () => {
            aksi.pengumuman.get()
        })();
    }, []);

    return (
        <MainLayout token={token} base_url={base_url} role={role}>
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
                                    Dashboard
                                </h1>
                            </div>
                        </div>
                    </div>

                    <ApplicationSection app={app} />

                    <CustomTabs>
                        <CustomTabItem label="Pengumuman">
                            <div className="divide-y divide-zinc-300">
                                {formData.tambah_pengumuman.enable
                                    ? (
                                        <div className="p-4">
                                            <div className="rounded-md border border-zinc-300 shadow-md">
                                                <div className="p-4 space-y-4">
                                                    <CustomControlledTextEditor editorRef={editorRef} value={formData.tambah_pengumuman.message} onChange={(newValue) => aksi.formData.tambah_pengumuman.set('message', newValue)} />
                                                    <div className="space-y-2">
                                                        <div className="flex items-center">
                                                            <Checkbox size="small" checked={formData.tambah_pengumuman.with_image} onChange={(e) => setFormData(state => ({
                                                                ...state,
                                                                tambah_pengumuman: {
                                                                    ...state.tambah_pengumuman,
                                                                    with_image: e.target.checked
                                                                }
                                                            }))} />
                                                            <p className="font-jakarta font-semibold">
                                                                Tambahkan Gambar / Foto
                                                            </p>
                                                        </div>
                                                        {formData.tambah_pengumuman.with_image && (
                                                            <div className="flex items-center justify-center">
                                                                {formData.tambah_pengumuman.image 
                                                                    ? (
                                                                        <div className="w-full border-dotted border-4 p-4 border-zinc-300 flex flex-col gap-4 items-center justify-center">
                                                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2 sm:gap-4">
                                                                                <CustomUpload text="Ganti Gambar / Foto" startIcon={<Image />} accept={['image/*']} onUploaded={(files) => aksi.formData.tambah_pengumuman.set_image(files[0])} />
                                                                                <Button onClick={() => aksi.formData.tambah_pengumuman.clear_image()} size="small" color="error" startIcon={<Close />}>
                                                                                    <p className='font-jakarta text-xs font-medium'>
                                                                                        Hapus
                                                                                    </p>
                                                                                </Button>
                                                                            </div>
                                                                            <img src={formData.tambah_pengumuman.image_source} alt="Uploaded Preview" className="w-full h-full rounded-md" />
                                                                        </div>
                                                                    )
                                                                    : (
                                                                        <div className="w-full h-60 border-dotted border-4 border-zinc-300 flex items-center justify-center">
                                                                            <CustomUpload text="Pilih Gambar / Foto" startIcon={<Image />} accept={['image/*']} onUploaded={(files) => aksi.formData.tambah_pengumuman.set_image(files[0])} />
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                        <div className="flex items-center gap-4">
                                                            <Button variant="contained" loading={formData.tambah_pengumuman.loading} loadingPosition="start" size="small" onClick={() => aksi.formData.tambah_pengumuman.submit()} startIcon={<SaveOutlined />} className="w-full sm:w-fit" >
                                                                <p className="font-jakarta font-semibold text-xs">
                                                                    Simpan
                                                                </p>
                                                            </Button>
                                                            <Button variant="text" disabled={formData.tambah_pengumuman.loading} size="small" startIcon={<Close />} onClick={() => aksi.formData.tambah_pengumuman.enable(false)} className="w-full sm:w-fit" color="error" >
                                                                <p className="font-jakarta font-semibold text-xs">
                                                                    Batal
                                                                </p>
                                                            </Button>
                                                        </div>
                                                        <Button variant="text" size="small" startIcon={<Refresh />} className="w-full sm:w-fit" >
                                                            <p className="font-jakarta font-semibold text-xs">
                                                                Refresh
                                                            </p>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) 
                                    : (
                                        <div className="p-4">
                                            <div className="flex sm:justify-between items-center gap-4">
                                                <Button variant="contained" size="small" onClick={() => aksi.formData.tambah_pengumuman.enable()} startIcon={<Add />} className="w-full sm:w-fit" >
                                                    <p className="font-jakarta font-semibold text-xs">
                                                        Pengumuman
                                                    </p>
                                                </Button>
                                                <Button variant="text" size="small" loading={listData.pengumuman.loading.refresh} loadingPosition="start" startIcon={<Refresh />} onClick={() => aksi.pengumuman.refresh()} className="w-full sm:w-fit" >
                                                    <p className="font-jakarta font-semibold text-xs">
                                                        Refresh
                                                    </p>
                                                </Button>
                                            </div>
                                        </div>
                                    )
                                }
                                <div className="p-4">
                                    <div className="flex justify-center">
                                        <div className="max-w-5xl w-full space-y-4 flex flex-col items-center">

                                            {listData.pengumuman.loading.fetch || listData.pengumuman.loading.refresh
                                                ? (
                                                    <div className="w-full h-80 flex items-center justify-center">
                                                        <CircularProgress size={45} color="primary" />
                                                    </div>
                                                )
                                                : listData.pengumuman.data.length < 1 
                                                    ? (
                                                        <div className="w-full h-80 flex items-center justify-center">
                                                            <div className="flex flex-col items-center gap-4">
                                                                <p className="italic opacity-50">
                                                                    Tampaknya belum ada pengumuman
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )
                                                    : (
                                                        <>
                                                            {listData.pengumuman.data.map(pengumuman => (
                                                                <div key={pengumuman['pengumuman_id']} className="relative overflow-hidden rounded-md border border-zinc-300 w-fit shadow-md">
                                                                    <div className="space-y-1">
                                                                        <div className="p-4">
                                                                            <div className="flex items-center gap-4">
                                                                                <Avatar 
                                                                                    sx={{
                                                                                        width: 40,
                                                                                        height: 40
                                                                                    }}
                                                                                    className="w-80 h-80"
                                                                                    src={pengumuman['avatar_pengirim']}
                                                                                    alt="Foto Profil"
                                                                                />
                                                                                <div className="space-y-1">
                                                                                    <p className="font-bold">
                                                                                        {pengumuman['nm_pengirim']}
                                                                                    </p>
                                                                                    <p className="text-xs font-light italic opacity-70">
                                                                                        {dayjs(pengumuman['tgl_dikirim']).locale('id').format('dddd, DD MMMM YYYY, HH:mm:ss')}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
        
                                                                        </div>
                                                                        <div className="p-4">
                                                                            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(pengumuman['message'])}}></div>
                                                                        </div>
                                                                        {pengumuman['image'] && (
                                                                            <img className="w-full h-full" src={pengumuman['image']} alt="Foto Pengumuman" />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </>
                                                    )
                                            }

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CustomTabItem>
                    </CustomTabs>

                </div>
            </div>
        </MainLayout>
    );
}
