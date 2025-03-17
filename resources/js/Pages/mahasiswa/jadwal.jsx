import { Avatar, Button, IconButton, Tab, Tabs, Tooltip } from "@mui/material"
import { useSidebar } from "../../context/SidebarContext"
import MainLayout from "../../layouts/MainLayout"
import { AccessTimeOutlined, Check, Close, CollectionsBookmarkOutlined, InfoOutlined, LocationOnOutlined, MenuOutlined, PersonOutline, Pin, QrCode, RefreshOutlined, Remove, Star } from "@mui/icons-material"
import { CustomTabItem, CustomTabs } from "../../components/CustomTabs"
import CustomDropdown, { CustomDropdown2 } from "../../components/CustomDropdown"
import { useUser } from "../../context/UserContext"
import CustomLoading from "../../components/CustomLoading"
import { useEffect, useState } from "react"
import { customSwal } from "../../components/CustomSwal"
import api_handler from "../../libs/api_handler"

export default function MJadwal({ token, base_url, role }) {

    const { setShowSidebar } = useSidebar()
    const { userdata, loadingUserdata } = useUser() 

    const [listData, setListData] = useState({
        jadwal: {
            data: [],
            loading: {
                fetch: false,
                absen_pin: false
            },
            fetched: false
        }
    })

    const aksi = {
        jadwal: {
            get: async () => {
                try {
                    aksi.jadwal.loading('fetch')
                    
                    const response = await api_handler.get({
                        base_url,
                        token,
                        url: 'kelas-kuliah/mahasiswa'
                    })

                    aksi.jadwal.loading('fetch')

                    if(response.success) {
                        aksi.jadwal.set('data', response?.data?.kelas_kuliah)
                        aksi.jadwal.set('fetched', true)
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
                    jadwal: {
                        ...state.jadwal,
                        [column]: value
                    }
                }))
            },
            loading: (column) => {
                setListData(state => ({
                    ...state,
                    jadwal: {
                        ...state.jadwal,
                        loading: {
                            ...state.jadwal.loading,
                            [column]: !state.jadwal.loading[column]
                        }
                    }
                }))
            },
            hari: {
                get: (hari) => {
                    return listData.jadwal.data.find(item => item[hari]) ? listData.jadwal.data.find(item => item[hari])[hari] : []
                    
                }
            }
        }
    }

    useEffect(() => {
        aksi.jadwal.get()
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
                                    Jadwal Kuliah Saya
                                </h1>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex sm:items-center gap-4">
                                <InfoOutlined fontSize="small" color="primary" />
                                <p>
                                   Silahkan tekan tombol refresh jika terdapat data yang tidak sesuai. 
                                </p>
                            </div>
                            <Button disabled={listData.jadwal.loading.fetch} startIcon={<RefreshOutlined />} variant="contained" onClick={() => aksi.jadwal.get()} size="small">
                                <p className="font-jakarta text-xs">
                                    Refresh
                                </p>
                            </Button>
                        </div>
                    </div>
                    <CustomTabs>
                        {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'].map(hari => (
                            <CustomTabItem key={hari} label={hari}>
                                <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                                    <div className="p-4">
                                        <CustomLoading 
                                            loading={listData.jadwal.loading.fetch} 
                                            renderIf={listData.jadwal.fetched} 
                                            sketch={(
                                                <div className="p-4"></div>
                                            )}
                                        >
                                            
                                                {aksi.jadwal.hari.get(hari).length > 0 
                                                    ? <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                        {aksi.jadwal.hari.get(hari).map(item => (
                                                            <div key={item['data_kelas']['kelas_kuliah_id']} className={`rounded-md shadow border-l-4 ${item['kelas_dibuka'] ? 'border-blue-500' : 'border-zinc-500'}`}>
                                                                <div className="flex flex-col justify-between">
                                                                    <div className="flex gap-4 p-4">
                                                                        <div className="">
                                                                            <div className={`w-7 sm:w-8 lg:w-10 aspect-square rounded-md flex items-center justify-center ${item['kelas_dibuka'] ? 'bg-blue-100 text-blue-500' : 'bg-zinc-100 text-zinc-500'}`}>
                                                                                <CollectionsBookmarkOutlined fontSize="small" />
                                                                            </div>
                                                                        </div>
                                                                        <div className=" space-y-4 w-full">
                                                                            <div className="space-y-2">
                                                                                {item['matakuliah']['kd_mk'] && (
                                                                                    <p className="text-xs font-medium opacity-70">
                                                                                        {item['matakuliah']['kd_mk']}
                                                                                    </p>
                                                                                )}
                                                                                <h1 className="font-bold text-lg">
                                                                                    {item['matakuliah']['nm_mk']}
                                                                                </h1>
                                                                            </div>
                                                                            {item['dosen'] && (
                                                                                <div className="flex items-center gap-3 opacity-70">
                                                                                    <PersonOutline sx={{ fontSize: 16 }} />
                                                                                    <p className="text-xs font-medium">
                                                                                        {item['dosen']['nm_dosen']}
                                                                                    </p>
                                                                                </div>
                                                                            )}
                                                                            <div className="flex items-center justify-between w-full">
                                                                                <Tooltip arrow title="Hadir">
                                                                                    <div className="flex items-center gap-2">
                                                                                        <Check sx={{ fontSize: 16 }} className="text-green-500" />
                                                                                        <p className="text-xs font-bold text-green-700">
                                                                                            12
                                                                                        </p>
                                                                                    </div>
                                                                                </Tooltip>
                                                                                <Tooltip arrow title="Tidak Hadir">
                                                                                    <div className="flex items-center gap-2">
                                                                                        <Close sx={{ fontSize: 16 }} className="text-red-500" />
                                                                                        <p className="text-xs font-bold text-red-700">
                                                                                            12
                                                                                        </p>
                                                                                    </div>
                                                                                </Tooltip>
                                                                                <Tooltip arrow title="Sisa Kehadiran">
                                                                                    <div className="flex items-center gap-2">
                                                                                        <Remove sx={{ fontSize: 16 }} className="text-zinc-500" />
                                                                                        <p className="text-xs font-bold text-zinc-700">
                                                                                            12
                                                                                        </p>
                                                                                    </div>
                                                                                </Tooltip>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className={`${item['kelas_dibuka'] ? 'bg-blue-50' : 'bg-zinc-50'} p-4`}>
                                                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                                                            <div className="flex items-center justify-between sm:justify-start gap-6">
                                                                                {item['jadwal'] && (
                                                                                    <>
                                                                                        {item['jadwal']['jam'] && (
                                                                                            <div className="flex items-center gap-3">
                                                                                                <AccessTimeOutlined sx={{ fontSize: 16 }} className={`${item['kelas_dibuka'] ? 'text-blue-700' : 'text-zinc-700'}`} />
                                                                                                <p className="text-xs font-semibold opacity-70">
                                                                                                    {item['jadwal']['jam']}
                                                                                                </p>
                                                                                            </div>
                                                                                        )}
                                                                                        {item['jadwal']['kd_ruang'] && (
                                                                                            <div className="flex items-center gap-3">
                                                                                                <LocationOnOutlined sx={{ fontSize: 16 }} className={`${item['kelas_dibuka'] ? 'text-blue-700' : 'text-zinc-700'}`} />
                                                                                                <p className="text-xs font-semibold opacity-70">
                                                                                                    Ruang {item['jadwal']['kd_ruang']}
                                                                                                </p>
                                                                                            </div>
                                                                                        )}
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                            <div className="flex justify-end">
                                                                                <Button disabled={!item['kelas_dibuka']} variant="contained" size="small" className="text-xs w-full sm:w-fit">
                                                                                    {item['kelas_dibuka'] 
                                                                                        ? (
                                                                                            <p className="font-jakarta text-xs">
                                                                                                Absen
                                                                                            </p>
                                                                                        )
                                                                                        : (
                                                                                            <p className="font-jakarta text-xs">
                                                                                                Kelas belum dibuka
                                                                                            </p>
                                                                                        )
                                                                                    }
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    : (
                                                        <div className="flex items-center justify-center min-h-screen">
                                                            <div className="space-y-4">
                                                                <img src="/images/empty.png" alt="Logo Not Found" className="w-80" />
                                                                <p className="text-center text-lg sm:text-xl lg:text-2xl font-medium">
                                                                    Anda tidak memiliki jadwal di hari ini
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                
                                            
                                        </CustomLoading>
                                    </div>
                                </CustomLoading>
                            </CustomTabItem>
                        ))}
                        <CustomTabItem label={'Belum ada'}>
                            <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                                <div className="p-4">
                                    <CustomLoading 
                                        loading={listData.jadwal.loading.fetch} 
                                        renderIf={listData.jadwal.fetched} 
                                        sketch={(
                                            <div className="p-4"></div>
                                        )}
                                    >
                                        
                                            {aksi.jadwal.hari.get('Unknown').length > 0 
                                                ? <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                    {aksi.jadwal.hari.get('Unknown').map(item => (
                                                        <div key={item['data_kelas']['kelas_kuliah_id']} className={`rounded-md shadow border-l-4 ${item['kelas_dibuka'] ? 'border-blue-500' : 'border-zinc-500'}`}>
                                                            <div className="flex flex-col justify-between">
                                                                <div className="flex gap-4 p-4">
                                                                    <div className="">
                                                                        <div className={`w-7 sm:w-8 lg:w-10 aspect-square rounded-md flex items-center justify-center ${item['kelas_dibuka'] ? 'bg-blue-100 text-blue-500' : 'bg-zinc-100 text-zinc-500'}`}>
                                                                            <CollectionsBookmarkOutlined fontSize="small" />
                                                                        </div>
                                                                    </div>
                                                                    <div className=" space-y-4 w-full">
                                                                        <div className="space-y-2">
                                                                            {item['matakuliah']['kd_mk'] && (
                                                                                <p className="text-xs font-medium opacity-70">
                                                                                    {item['matakuliah']['kd_mk']}
                                                                                </p>
                                                                            )}
                                                                            <h1 className="font-bold text-lg">
                                                                                {item['matakuliah']['nm_mk']}
                                                                            </h1>
                                                                        </div>
                                                                        {item['dosen'] && (
                                                                            <div className="flex items-center gap-3 opacity-70">
                                                                                <PersonOutline sx={{ fontSize: 16 }} />
                                                                                <p className="text-xs font-medium">
                                                                                    {item['dosen']['nm_dosen']}
                                                                                </p>
                                                                            </div>
                                                                        )}
                                                                        <div className="flex items-center justify-between w-full">
                                                                            <Tooltip arrow title="Hadir">
                                                                                <div className="flex items-center gap-2">
                                                                                    <Check sx={{ fontSize: 16 }} className="text-green-500" />
                                                                                    <p className="text-xs font-bold text-green-700">
                                                                                        12
                                                                                    </p>
                                                                                </div>
                                                                            </Tooltip>
                                                                            <Tooltip arrow title="Tidak Hadir">
                                                                                <div className="flex items-center gap-2">
                                                                                    <Close sx={{ fontSize: 16 }} className="text-red-500" />
                                                                                    <p className="text-xs font-bold text-red-700">
                                                                                        12
                                                                                    </p>
                                                                                </div>
                                                                            </Tooltip>
                                                                            <Tooltip arrow title="Sisa Kehadiran">
                                                                                <div className="flex items-center gap-2">
                                                                                    <Remove sx={{ fontSize: 16 }} className="text-zinc-500" />
                                                                                    <p className="text-xs font-bold text-zinc-700">
                                                                                        12
                                                                                    </p>
                                                                                </div>
                                                                            </Tooltip>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className={`${item['kelas_dibuka'] ? 'bg-blue-50' : 'bg-zinc-50'} p-4`}>
                                                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                                                        <div className="flex items-center justify-between sm:justify-start gap-6">
                                                                            {item['jadwal'] && (
                                                                                <>
                                                                                    {item['jadwal']['jam'] && (
                                                                                        <div className="flex items-center gap-3">
                                                                                            <AccessTimeOutlined sx={{ fontSize: 16 }} className={`${item['kelas_dibuka'] ? 'text-blue-700' : 'text-zinc-700'}`} />
                                                                                            <p className="text-xs font-semibold opacity-70">
                                                                                                {item['jadwal']['jam']}
                                                                                            </p>
                                                                                        </div>
                                                                                    )}
                                                                                    {item['jadwal']['kd_ruang'] && (
                                                                                        <div className="flex items-center gap-3">
                                                                                            <LocationOnOutlined sx={{ fontSize: 16 }} className={`${item['kelas_dibuka'] ? 'text-blue-700' : 'text-zinc-700'}`} />
                                                                                            <p className="text-xs font-semibold opacity-70">
                                                                                                Ruang {item['jadwal']['kd_ruang']}
                                                                                            </p>
                                                                                        </div>
                                                                                    )}
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex justify-end">
                                                                            <Button disabled={!item['kelas_dibuka']} variant="contained" size="small" className="text-xs w-full sm:w-fit">
                                                                                {item['kelas_dibuka'] 
                                                                                    ? (
                                                                                        <p className="font-jakarta text-xs">
                                                                                            Absen
                                                                                        </p>
                                                                                    )
                                                                                    : (
                                                                                        <p className="font-jakarta text-xs">
                                                                                            Kelas belum dibuka
                                                                                        </p>
                                                                                    )
                                                                                }
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                : (
                                                    <div className="flex items-center justify-center min-h-screen">
                                                        <div className="space-y-4">
                                                            <img src="/images/empty.png" alt="Logo Not Found" className="w-80" />
                                                            <p className="text-center text-lg sm:text-xl lg:text-2xl font-medium">
                                                                Anda tidak memiliki jadwal di hari ini
                                                            </p>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            
                                        
                                    </CustomLoading>
                                </div>
                            </CustomLoading>
                        </CustomTabItem>
                    </CustomTabs>

                </div>
            </div>
        </MainLayout>
    )
}