import { Button, CircularProgress, IconButton, TextField } from "@mui/material";
import { useSidebar } from "../context/SidebarContext";
import { useUser } from "../context/UserContext";
import MainLayout from "../layouts/MainLayout";
import NotAllowedPage from "./NotAllowed";
import { AdjustOutlined, CheckOutlined, Close, EastOutlined, HelpOutline, MenuOutlined, QuestionMarkOutlined, SaveAsOutlined, WestOutlined } from "@mui/icons-material";
import CustomDataTable from "../components/CustomDataTable";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CustomLoading from "../components/CustomLoading";
import { customSwal } from "../components/CustomSwal";
import api_handler from "../libs/api_handler";
import { CustomTabItem, CustomTabs } from "../components/CustomTabs";
import dayjs from "dayjs";
import 'dayjs/locale/id'
import Modal, { modal, ModalForm } from "../components/Modal";

export default function KRSApproveByDosenWaliPage({ role, base_url, token, krs_id, mhs_id }) {
    if(role.dosen_wali.enable) {
        return <Page token={token} base_url={base_url} role={role} krs_id={krs_id} mhs_id={mhs_id} />
    }

    return <NotAllowedPage token={token} base_url={base_url} role={role} />
}

function Page({ token, base_url, role, krs_id, mhs_id }) {

    const { setShowSidebar } = useSidebar()
    const { userdata, loadingUserdata } = useUser()
    const navigate = useNavigate()

    const [listData, setListData] = useState({
        mahasiswa: {
            data: null,
            loading: {
                fetch: false,
                approve: false
            }
        }
    })

    const [formData, setFormData] = useState({
        tolak: {
            catatan: '',
            error: null,
            loading: false,
            krs_matkul: []
        }
    })

    const aksi = {
        mahasiswa: {
            get: async () => {
                try {
                    aksi.mahasiswa.loading('fetch')

                    const response = await api_handler.get({
                        url: `krs/mahasiswa?mhs_id=${mhs_id}&krs_id=${krs_id}`,
                        base_url,
                        token
                    })

                    aksi.mahasiswa.loading('fetch')

                    if(response?.success) {
                        aksi.mahasiswa.set('data', response?.data?.mahasiswa)
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
                    mahasiswa: {
                        ...state.mahasiswa,
                        [column]: value
                    }
                }))
            },
            loading: (column) => {
                setListData(state => ({
                    ...state,
                    mahasiswa: {
                        ...state.mahasiswa,
                        loading: {
                            ...state.mahasiswa.loading,
                            [column]: !state.mahasiswa.loading[column]
                        }
                    }
                }))
            },
            krs: {
                total: {
                    sks: () => {
                        let data = 0

                        listData.mahasiswa.data?.krs?.krs_matkul?.map(krs_mk => {
                            data += krs_mk['sks']
                        })

                        return data
                    },
                    matakuliah: () => {
                        return listData.mahasiswa.data?.krs?.krs_matkul?.length
                    }
                },
                approve: async () => {
                    try {

                        aksi.mahasiswa.loading('approve')
                        const payload = {
                            mhs_id,
                            krs_id,
                            sts_krs: 'S',
                            ditolak_alasan: '',
                            krs_matkul: listData.mahasiswa.data?.krs?.krs_matkul?.map(v => ({
                                k_disetujui: true,
                                krs_mk_id: v.krs_mk_id
                            }))
                        }

                        const response = await api_handler.put({
                            base_url,
                            token,
                            url: 'krs/mahasiswa',
                            payload
                        })

                        aksi.mahasiswa.loading('approve')

                        if(response?.success) {
                            customSwal.toast.success({
                                message: 'Berhasil menyetujui pengajuan KRS tersebut.'
                            })
                            aksi.mahasiswa.get()
                        }else{
                            aksi.formData.tolak.set('error', response?.message)
                        }
                    } catch (error) {
                        aksi.formData.tolak.set('error', error?.message)
                    }
                },
                tolak: async (e) => {
                    try {
                        e.preventDefault()

                        aksi.formData.tolak.set('error', null)

                        if(formData.tolak.krs_matkul.length < 1) {
                            aksi.formData.tolak.set('error', 'Anda harus memilih mata kuliah terlebih dahulu')
                            return
                        }

                        aksi.formData.tolak.set('loading', true)
                        const payload = {
                            mhs_id,
                            krs_id,
                            sts_krs: 'D',
                            ditolak_alasan: formData.tolak.catatan,
                            krs_matkul: formData.tolak.krs_matkul.map(krs_mk_id => ({
                                krs_mk_id,
                                k_disetujui: false
                            }))
                        }

                        // console.log(payload)

                        const response = await api_handler.put({
                            base_url,
                            token,
                            url: 'krs/mahasiswa',
                            payload
                        })

                        aksi.formData.tolak.set('loading', false)

                        if(response?.success) {
                            modal.close('tolak_krs')
                            aksi.formData.tolak.set('catatan', '')
                            aksi.formData.tolak.set('krs_matkul', [])
                            customSwal.toast.success({
                                message: 'Berhasil menolak pengajuan KRS tersebut.'
                            })
                            aksi.mahasiswa.get()
                        }else{
                            aksi.formData.tolak.set('error', response?.message)
                        }
                    } catch (error) {
                        aksi.formData.tolak.set('error', error?.message)
                    }
                },
                draft: async () => {

                }
            }
        },
        formData: {
            tolak: {
                set: (column, value) => {
                    setFormData(state => ({
                        ...state,
                        tolak: {
                            ...state.tolak,
                            [column]: value
                        }
                    }))
                }
            }
        }
    }

    useEffect(() => {
        aksi.mahasiswa.get()
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
                                    Approve KRS
                                </h1>
                            </div>
                        </div>
                    </div>

                    {/* Content */}

                    <ModalForm modalId="tolak_krs" title="Tolak Pengajuan KRS" loading={formData.tolak.loading} error={formData.tolak.error} onSubmit={aksi.mahasiswa.krs.tolak}>
                        <div className="p-4">
                            <TextField size="small" value={formData.tolak.catatan} onChange={e => aksi.formData.tolak.set('catatan', e.target.value)} fullWidth multiline label="Berikan Alasan untuk Penolakan" required />
                        </div>
                    </ModalForm>

                    <div className="p-4">
                        <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                            <div className="flex items-center gap-4">
                                <IconButton onClick={() => navigate(-1)} size="small" color="primary">
                                    <WestOutlined fontSize="small" />
                                </IconButton>
                                <CustomLoading loading={listData.mahasiswa.loading.fetch} renderIf={listData.mahasiswa.data}>
                                    <h1 className="text-lg sm:text-2xl">
                                        {listData.mahasiswa.data?.nama || 'Loading'} 
                                    </h1>
                                </CustomLoading>
                            </div>
                        </CustomLoading>
                    </div>

                    <div className="p-4">
                        <CustomLoading loading={listData.mahasiswa.loading.fetch} renderIf={listData.mahasiswa.data}>
                            <div className="flex gap-4">
                                <div className="shrink-0">
                                    <HelpOutline color="primary" fontSize="small" />
                                </div>
                                {listData.mahasiswa.data?.krs?.sts_krs !== 'S'
                                    ?  (
                                        <div className="space-y-4">
                                            <p>
                                                Mahasiswa ini telah mengajukan KRS. Anda bisa memberikan Approve ataupun Menolak pengajuan ini.
                                            </p>
                                            <div className="flex items-center gap-4 flex-col sm:flex-row *:w-full *:sm:w-fit">
                                                <Button variant="contained" onClick={() => aksi.mahasiswa.krs.approve()} disabled={listData.mahasiswa.loading.approve} color="primary" size="small" startIcon={listData.mahasiswa.loading.approve ? <CircularProgress size={15} className="grayscale" /> : <CheckOutlined fontSize="small" />}>
                                                    <p className="font-jakarta font-medium text-xs">
                                                        {listData.mahasiswa.loading.approve ? 'Loading...' : 'Approve'}
                                                    </p>
                                                </Button>
                                                <Button variant="text" disabled={listData.mahasiswa.loading.approve} onClick={() => modal.show('tolak_krs')} color="error" size="small" startIcon={<Close fontSize="small" />}>
                                                    <p className="font-jakarta font-medium text-xs">
                                                        Tolak
                                                    </p>
                                                </Button>
                                            </div>
                                        </div>
                                    )
                                    : (
                                        <div className="space-y-4">
                                            <p>
                                                Pengajuan KRS Mahasiswa ini telah disetujui. Anda bisa menolak atau mengubah status pengajuan KRS ini.
                                            </p>
                                            <div className="flex items-center gap-4 flex-col sm:flex-row *:w-full *:sm:w-fit">
                                                
                                                <Button variant="text" disabled={listData.mahasiswa.loading.approve} onClick={() => modal.show('tolak_krs')} color="error" size="small" startIcon={<Close fontSize="small" />}>
                                                    <p className="font-jakarta font-medium text-xs">
                                                        Tolak / Ubah menjadi Draft
                                                    </p>
                                                </Button>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </CustomLoading>
                    </div>

                    <CustomTabs>
                        <CustomTabItem label="Detail">
                            <div className="p-4">
                                <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                                        <div className="col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <p className="opacity-80">
                                                No Induk Mahasiswa  
                                            </p>
                                            <CustomLoading loading={listData.mahasiswa.loading.fetch} renderIf={listData.mahasiswa.data}>
                                                <p className="font-semibold opacity-80">
                                                    {listData.mahasiswa.data?.nim || '-'}
                                                </p>
                                            </CustomLoading>
                                        </div>
                                        <div className="col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <p className="opacity-80">
                                                Jurusan  
                                            </p>
                                            <CustomLoading loading={listData.mahasiswa.loading.fetch} renderIf={listData.mahasiswa.data}>
                                                <p className="font-semibold opacity-80">
                                                    {listData.mahasiswa.data?.jurusan?.nama_jurusan || '-'}
                                                </p>
                                            </CustomLoading>
                                        </div>
                                        <div className="col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <p className="opacity-80">
                                                No KRS  
                                            </p>
                                            <CustomLoading loading={listData.mahasiswa.loading.fetch} renderIf={listData.mahasiswa.data}>
                                                <p className="font-semibold opacity-80">
                                                    {listData.mahasiswa.data?.krs?.nmr_krs || '-'}
                                                </p>
                                            </CustomLoading>
                                        </div>
                                        <div className="col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <p className="opacity-80">
                                                Diajukan pada Tanggal
                                            </p>
                                            <CustomLoading loading={listData.mahasiswa.loading.fetch} renderIf={listData.mahasiswa.data}>
                                                <p className="font-semibold opacity-80">
                                                    {dayjs(listData.mahasiswa.data?.krs?.tanggal).locale('id').format('DD MMMM YYYY') || '-'}
                                                </p>
                                            </CustomLoading>
                                        </div>
                                        <div className="col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <p className="opacity-80">
                                                Semester
                                            </p>
                                            <CustomLoading loading={listData.mahasiswa.loading.fetch} renderIf={listData.mahasiswa.data}>
                                                <p className="font-semibold opacity-80"> 
                                                    {listData.mahasiswa.data?.krs?.semester || '-'}
                                                </p>
                                            </CustomLoading>
                                        </div>
                                        <div className="col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <p className="opacity-80">
                                                Status KRS
                                            </p>
                                            <CustomLoading loading={listData.mahasiswa.loading.fetch} renderIf={listData.mahasiswa.data}>
                                                <p className="font-semibold opacity-80">
                                                    {listData.mahasiswa.data?.krs?.sts_krs || '-'}
                                                </p>
                                            </CustomLoading>
                                        </div>
                                        <div className="col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <p className="opacity-80">
                                                Catatan Pengajuan
                                            </p>
                                            <CustomLoading loading={listData.mahasiswa.loading.fetch} renderIf={listData.mahasiswa.data}>
                                                <p className="font-semibold opacity-80">
                                                    {listData.mahasiswa.data?.krs?.pengajuan_catatan || '-'}
                                                </p>
                                            </CustomLoading>
                                        </div>
                                        <div className="col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <p className="opacity-80">
                                                Ditolak Tanggal
                                            </p>
                                            <CustomLoading loading={listData.mahasiswa.loading.fetch} renderIf={listData.mahasiswa.data}>
                                                <p className="font-semibold opacity-80">
                                                    {dayjs(listData.mahasiswa.data?.krs?.ditolak_tanggal).locale('id').format('HH:mm:ss, DD MMMM YYYY') || '-'}
                                                </p>
                                            </CustomLoading>
                                        </div>
                                        <div className="col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <p className="opacity-80">
                                                Ditolak dengan Alasan
                                            </p>
                                            <CustomLoading loading={listData.mahasiswa.loading.fetch} renderIf={listData.mahasiswa.data}>
                                                <p className="font-semibold opacity-80">
                                                    {listData.mahasiswa.data?.krs?.ditolak_alasan || '-'}
                                                </p>
                                            </CustomLoading>
                                        </div>
                                        <div className="col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <p className="opacity-80">
                                                Ditolak setelah Sah
                                            </p>
                                            <CustomLoading loading={listData.mahasiswa.loading.fetch} renderIf={listData.mahasiswa.data}>
                                                <p className="font-semibold opacity-80">
                                                    {listData.mahasiswa.data?.krs?.ditolak_stlh_sah || '-'}
                                                </p>
                                            </CustomLoading>
                                        </div>
                                    </div>
                                </CustomLoading>
                            </div>
                        </CustomTabItem>
                        <CustomTabItem label="Mata Kuliah">
                            <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div className="flex gap-4">
                                    <div className="shrink-0">
                                        <AdjustOutlined fontSize="small" color="primary" />
                                    </div>
                                    <div className="space-y-1">
                                        <p>
                                            Total SKS yang diambil
                                        </p>
                                        <CustomLoading loading={listData.mahasiswa.loading.fetch} renderIf={listData.mahasiswa.data}>
                                            <p className="text-xl font-medium">
                                                {aksi.mahasiswa.krs.total.sks()}
                                            </p>
                                        </CustomLoading>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="shrink-0">
                                        <AdjustOutlined fontSize="small" color="primary" />
                                    </div>
                                    <div className="space-y-1">
                                        <p>
                                            Total Mata Kuliah yang diambil
                                        </p>
                                        <CustomLoading loading={listData.mahasiswa.loading.fetch} renderIf={listData.mahasiswa.data}>
                                            <p className="text-xl font-medium">
                                                {aksi.mahasiswa.krs.total.matakuliah()}
                                            </p>
                                        </CustomLoading>
                                    </div>
                                </div>
                            </div>
                            <CustomDataTable 
                                getRowId={(row) => row.krs_mk_id}
                                loading={listData.mahasiswa.loading.fetch}
                                rows={listData.mahasiswa.data?.krs?.krs_matkul}
                                checkbox
                                rowSelect={{
                                    value: formData.tolak.krs_matkul,
                                    onChange: (value) => aksi.formData.tolak.set('krs_matkul', value)
                                }}
                                columns={[
                                    {
                                        field: 'krs_mk_id',
                                        headerName: 'Kode Mata Kuliah',
                                        valueGetter: (value, row) => row.kd_mk,
                                        minWidth: 120
                                    },
                                    {
                                        field: 'nm_mk',
                                        headerName: 'Nama Mata Kuliah',
                                        minWidth: 350
                                    },
                                    {
                                        field: 'sks',
                                        headerName: 'SKS',
                                        minWidth: 100
                                    },
                                    
                                ]}
                            />
                        </CustomTabItem>
                    </CustomTabs>                   

                    
                    
                    

                </div>
            </div>
        </MainLayout>
    )
}