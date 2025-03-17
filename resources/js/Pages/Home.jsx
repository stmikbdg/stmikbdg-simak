
import { AccessTimeOutlined, ArrowRight, ArrowRightAlt, AssignmentOutlined, AutoGraphOutlined, CalendarMonthOutlined, East, EastOutlined, FingerprintOutlined, InfoOutlined, KeyboardDoubleArrowRightOutlined, MenuOutlined } from "@mui/icons-material"
import { Avatar, Button, IconButton, Tooltip } from "@mui/material"
import MainLayout from "../layouts/MainLayout"
import { useSidebar } from "../context/SidebarContext"
import { useEffect, useState } from "react"
import { useUser } from "../context/UserContext"
import { customSwal } from "../components/CustomSwal"
import api_handler from "../libs/api_handler"
import CustomLoading from "../components/CustomLoading"


export default function Home({ token, base_url, role }) {

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
    }
  }

  useEffect(() => {
    aksi.khs.get()
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

        </div>
      </div>
    </MainLayout>
  )
}