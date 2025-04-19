
import { AccessTimeOutlined, ArrowRight, ArrowRightAlt, AssignmentOutlined, AutoGraphOutlined, CalendarMonthOutlined, Check, Close, CollectionsBookmarkOutlined, East, EastOutlined, FingerprintOutlined, InfoOutlined, KeyboardDoubleArrowRightOutlined, LocationOnOutlined, MenuOutlined, PersonOutline, RefreshOutlined, Remove } from "@mui/icons-material"
import { Avatar, Button, IconButton, Tooltip } from "@mui/material"
import MainLayout from "../layouts/MainLayout"
import { useSidebar } from "../context/SidebarContext"
import { useEffect, useState } from "react"
import { useUser } from "../context/UserContext"
import { customSwal } from "../components/CustomSwal"
import api_handler from "../libs/api_handler"
import CustomLoading from "../components/CustomLoading"
import CustomGradientAreaChart from "../components/Charts/CustomGradientAreaChart"
import { CustomTabItem, CustomTabs } from "../components/CustomTabs"
import dayjs from "dayjs"
import 'dayjs/locale/id'


export default function Home({ token, base_url, role }) {

  if(role.mahasiswa.enable) {
    return (
      <MahasiswaPage token={token} base_url={base_url} role={role} />
    )
  }

  if(role.dosen.enable) {
    return (
      <DosenPage token={token} base_url={base_url} role={role} />
    )
  }

  if(role.dosen_wali.enable) {
    return (
      <DosenWaliPage token={token} base_url={base_url} role={role} />
    )
  }

  if(role.admin.enable) {
    return (
      <AdminPage token={token} base_url={base_url} role={role} />
    )
  }
}

function MahasiswaPage({ token, base_url, role}) {
  
  const { setShowSidebar } = useSidebar()

  const { userdata, loadingUserdata } = useUser()

  const [listData, setListData] = useState({
    khs: {
        data: null,
        loading: false
    },
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
    },
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
    (async () => {
      await Promise.allSettled([
        aksi.khs.get(),
        aksi.jadwal.get()
      ])
    })()
  }, [])

  return (
    <MainLayout token={token} base_url={base_url} role={role}>
      <div className="bg-white w-full rounded-lg border border-zinc-300 shadow-md">

        <div className="divide-y divide-zinc-300">

          <div className="p-2 lg:p-4">
            <div className="flex justify-between items-center ">
              <div className="flex items-center lg:gap-3">
                <div className="lg:hidden">
                  <IconButton onClick={() => setShowSidebar(state => !state)}>
                    <MenuOutlined fontSize="small" />
                  </IconButton>
                </div>
                <h1 className="text-lg md:text-xl font-semibold tracking-wide">
                  Dashboard
                </h1>
              </div>
            </div>
          </div>

          <div className="p-4">
            <CustomLoading loading={loadingUserdata} renderIf={userdata}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CustomLoading loading={listData.khs.loading} renderIf={listData.khs.data}>
                  <div className="rounded-md border border-zinc-300 divide-y divide-zinc-300 shadow">
                    <div className="flex items-center gap-4 px-4 py-3">
                        <div className="w-10 h-10 rounded-md border  flex items-center justify-center border-zinc-300">
                            <AssignmentOutlined fontSize="small" color="primary" />
                        </div>
                        <div className="-space-y-1">
                            <h1 className="font-light">
                                Sistem Kredit Semester
                            </h1>
                            <p className="text-lg lg:text-xl">
                                {listData.khs.data?.total_sks}
                            </p>
                        </div>
                    </div>
                    <div className="px-4 py-3 flex justify-end items-center ">
                      <Button size="small" color="primary" fullWidth variant="contained" endIcon={<East fontSize="small" />}>
                        <p className="font-jakarta text-xs">
                          Detail
                        </p>
                      </Button>
                    </div>
                  </div>
                </CustomLoading>
                <CustomLoading loading={listData.khs.loading} renderIf={listData.khs.data}>
                  <div className="rounded-md border border-zinc-300 divide-y divide-zinc-300 shadow">
                    <div className="flex items-center gap-4 px-4 py-3">
                        <div className="w-10 h-10 rounded-md border  flex items-center justify-center border-zinc-300">
                            <AssignmentOutlined fontSize="small" color="primary" />
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
                    <div className="px-4 py-3 flex justify-end items-center ">
                      <Button size="small" color="primary" fullWidth variant="contained" endIcon={<East fontSize="small" />}>
                        <p className="font-jakarta text-xs">
                          Detail
                        </p>
                      </Button>
                    </div>
                  </div>
                </CustomLoading>
              </div>
          </CustomLoading>
          </div>

          <CustomTabs centered>
            <CustomTabItem label="Jadwal Hari ini">
              <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                <div className="divide-y divide-zinc-300">
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
                  <div className="p-4">
                    <CustomLoading 
                        loading={listData.jadwal.loading.fetch} 
                        renderIf={listData.jadwal.fetched} 
                        sketch={(
                            <div className="p-4"></div>
                        )}
                    >
                      {aksi.jadwal.hari.get(dayjs().locale('id').format('dddd')).length > 0 
                          ? <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              {aksi.jadwal.hari.get(dayjs().locale('id').format('dddd')).map(item => (
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
                </div>
              </CustomLoading>
            </CustomTabItem>
            <CustomTabItem label="Pengumuman">
              <div className="p-4">

              </div>
            </CustomTabItem>
          </CustomTabs>

        </div>
      </div>
    </MainLayout>
  )
}

function DosenWaliPage({ token, base_url, role }) {
  const { setShowSidebar } = useSidebar()

  const { userdata, loadingUserdata } = useUser()

  

  return (
    <MainLayout token={token} base_url={base_url} role={role}>
      <div className="bg-white w-full rounded-lg border border-zinc-300 shadow-md">

        <div className="divide-y divide-zinc-300">

          <div className="p-2 lg:p-4">
            <div className="flex justify-between items-center ">
              <div className="flex items-center lg:gap-3">
                <div className="lg:hidden">
                  <IconButton onClick={() => setShowSidebar(state => !state)}>
                    <MenuOutlined fontSize="small" />
                  </IconButton>
                </div>
                <h1 className="text-lg md:text-xl font-semibold tracking-wide">
                  Dashboard
                </h1>
              </div>
            </div>
          </div>

          

        </div>
      </div>
    </MainLayout>
  )
}

function DosenPage({ token, base_url, role }) {
  const { setShowSidebar } = useSidebar()

  const { userdata, loadingUserdata } = useUser()

  const [listData, setListData] = useState({
    khs: {
        data: null,
        loading: false
    },
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
    },
    jadwal: {
      get: async () => {
        try {
          aksi.jadwal.loading('fetch')
          
          const response = await api_handler.get({
              base_url,
              token,
              url: 'kelas-kuliah/dosen'
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
    (async () => {
      await Promise.allSettled([
        // aksi.khs.get(),
        aksi.jadwal.get()
      ])
    })()
  }, [])

  return (
    <MainLayout token={token} base_url={base_url} role={role}>
      <div className="bg-white w-full rounded-lg border border-zinc-300 shadow-md">

        <div className="divide-y divide-zinc-300">

          <div className="p-2 lg:p-4">
            <div className="flex justify-between items-center ">
              <div className="flex items-center lg:gap-3">
                <div className="lg:hidden">
                  <IconButton onClick={() => setShowSidebar(state => !state)}>
                    <MenuOutlined fontSize="small" />
                  </IconButton>
                </div>
                <h1 className="text-lg md:text-xl font-semibold tracking-wide">
                  Dashboard
                </h1>
              </div>
            </div>
          </div>

          <CustomTabs centered>
            <CustomTabItem label="Jadwal Hari ini">
              <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                <div className="divide-y divide-zinc-300">
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
                  <div className="p-4">
                    <CustomLoading 
                        loading={listData.jadwal.loading.fetch} 
                        renderIf={listData.jadwal.fetched} 
                        sketch={(
                            <div className="p-4"></div>
                        )}
                    >
                      {aksi.jadwal.hari.get(dayjs().locale('id').format('dddd')).length > 0 
                          ? <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              {aksi.jadwal.hari.get(dayjs().locale('id').format('dddd')).map(item => (
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
                                                      <Button disabled={item['kelas_dibuka']} variant="contained" size="small" className="text-xs w-full sm:w-fit">
                                                          {!item['kelas_dibuka'] 
                                                              ? (
                                                                  <p className="font-jakarta text-xs">
                                                                      Buka Kelas
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
                </div>
              </CustomLoading>
            </CustomTabItem>
            <CustomTabItem label="Pengumuman">
              <div className="p-4">

              </div>
            </CustomTabItem>
          </CustomTabs>

        </div>
      </div>
    </MainLayout>
  )
}


function AdminPage({ token, base_url, role }) {
  const { setShowSidebar } = useSidebar()

  const { userdata, loadingUserdata } = useUser()

  const [listData, setListData] = useState({
    khs: {
        data: null,
        loading: false
    },
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
    },
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
    (async () => {
      // await Promise.allSettled([
      //   aksi.khs.get(),
      //   aksi.jadwal.get()
      // ])
    })()
  }, [])

  return (
    <MainLayout token={token} base_url={base_url} role={role}>
      <div className="bg-white w-full rounded-lg border border-zinc-300 shadow-md">

        <div className="divide-y divide-zinc-300">

          <div className="p-2 lg:p-4">
            <div className="flex justify-between items-center ">
              <div className="flex items-center lg:gap-3">
                <div className="lg:hidden">
                  <IconButton onClick={() => setShowSidebar(state => !state)}>
                    <MenuOutlined fontSize="small" />
                  </IconButton>
                </div>
                <h1 className="text-lg md:text-xl font-semibold tracking-wide">
                  Dashboard
                </h1>
              </div>
            </div>
          </div>


        </div>
      </div>
    </MainLayout>
  )
}

