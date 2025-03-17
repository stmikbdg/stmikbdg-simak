import { Avatar, Button, CircularProgress, Fade, IconButton, TextField } from "@mui/material"
import { useSidebar } from "../../context/SidebarContext"
import MainLayout from "../../layouts/MainLayout"
import { CheckCircle, CheckOutlined, Close, Edit, FemaleOutlined, MaleOutlined, MenuOutlined, Remove, SaveOutlined } from "@mui/icons-material"
import { useEffect, useState } from "react"
import { customSwal } from "../../components/CustomSwal"
import api_handler from "../../libs/api_handler"
import dayjs from "dayjs"
import 'dayjs/locale/id'
import FileUploadComponent from "../../components/CustomUpload"
import CustomLoading from "../../components/CustomLoading"
import { useUser } from "../../context/UserContext"

export default function Profil({ token, role, base_url }) {

    const { setShowSidebar } = useSidebar()
    const { userdata, loadingUserdata } = useUser()

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
                                    Profil Saya
                                </h1>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    
                    <div className="p-4">
                        <div className="flex items-center justify-center">
                            <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                                <div className="space-y-6 w-fit">
                                    <div className="flex justify-center">
                                        <Avatar src={userdata?.avatar} sx={{ width: 120, height: 120 }} />
                                    </div>
                                    <div className="flex justify-center items-center gap-2">
                                        <FileUploadComponent 
                                            variant="contained"
                                            size="small"
                                            text="Ganti Profil"
                                            buttonProps={{
                                                size: 'small'
                                            }}
                                        />
                                        {/* <button type="button" className="px-3 py-1 rounded bg-zinc-100 hover:bg-zinc-200 active:bg-zinc-300 cursor-pointer">
                                            Hapus
                                        </button> */}
                                    </div>
                                    <div className="space-y-1">
                                        <h1 className="text-center text-lg sm:text-xl lg:text-2xl font-medium">
                                            {userdata?.profile?.nama}
                                        </h1>
                                        <p className="text-center opacity-70">
                                            {userdata?.profile?.nama_jurusan}
                                        </p>
                                    </div>
                                </div>
                            </CustomLoading>
                        </div>
                    </div>

                    <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="col-span-1">
                            <h1 className="font-bold">
                                Informasi Pribadi
                            </h1>
                            <p className="opacity-70 text-xs">
                                Informasi yang tersimpan mengenai profil anda.
                            </p>
                        </div>
                        <div className="col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                                <div className="col-span-1 space-y-2">
                                    <h1 className="font-semibold">
                                        Status
                                    </h1>
                                    {userdata?.profile?.sts_mhs === 'A' && (
                                        <div className="flex items-center gap-3 pl-2 pr-3 py-1 rounded-md bg-green-200 w-fit text-green-700 text-xs font-bold">
                                            <CheckOutlined sx={{ fontSize: 16 }} />
                                            Aktif
                                        </div>
                                    )}
                                    {userdata?.profile?.sts_mhs === 'C' && (
                                        <div className="flex items-center gap-3 pl-2 pr-3 py-1 rounded-md bg-blue-200 w-fit text-blue-700 text-xs font-bold">
                                            <Remove sx={{ fontSize: 16 }} />
                                            Cuti
                                        </div>
                                    )}
                                    {userdata?.profile?.sts_mhs === 'TA' && (
                                        <div className="flex items-center gap-3 pl-2 pr-3 py-1 rounded-md bg-red-200 w-fit text-red-700 text-xs font-bold">
                                            <Close sx={{ fontSize: 16 }} />
                                            Tidak Aktif
                                        </div>
                                    )}
                                </div>
                            </CustomLoading>
                            <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                                <div className="col-span-1 space-y-2">
                                    <h1 className="font-semibold">
                                        Nomor Induk Mahasiswa / NIM
                                    </h1>
                                    <p className="text-xs">
                                        {userdata?.profile?.nim}
                                    </p>
                                </div>
                            </CustomLoading>
                            <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                                <div className="col-span-1 space-y-2">
                                    <h1 className="font-semibold">
                                        Angkatan
                                    </h1>
                                    <p className="text-xs">
                                        {userdata?.profile?.angkatan}
                                    </p>
                                </div>
                            </CustomLoading>
                            <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                                <div className="col-span-1 space-y-2">
                                    <h1 className="font-semibold">
                                        Dosen Wali
                                    </h1>
                                    <p className="text-xs">
                                        {userdata?.profile?.dosen_wali}
                                    </p>
                                </div>
                            </CustomLoading>
                            <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                                <div className="col-span-1 space-y-2">
                                    <h1 className="font-semibold">
                                        Jenis Mahasiswa
                                    </h1>
                                    <p className="text-xs">
                                        {userdata?.profile?.jns_mhs === 'R' && 'Reguler'}
                                        {userdata?.profile?.jns_mhs === 'K' && 'Karyawan'}
                                        {userdata?.profile?.jns_mhs === 'E' && 'Eksekutif'}
                                    </p>
                                </div>
                            </CustomLoading>
                            <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                                <div className="col-span-1 space-y-2">
                                    <h1 className="font-semibold">
                                        Tempat, Tanggal Lahir
                                    </h1>
                                    <p className="text-xs">
                                        {userdata?.profile?.tmp_lahir}, {dayjs(userdata?.profile?.tgl_lahir).locale('id').format('DD MMMM YYYY')}
                                    </p>
                                </div>
                            </CustomLoading>
                            <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                                <div className="col-span-1 space-y-2">
                                    <h1 className="font-semibold">
                                        Jenis Kelamin
                                    </h1>
                                    <div className="flex items-center gap-3">
                                        {userdata?.profile?.jk === 'L'
                                            ? <MaleOutlined sx={{ fontSize: 16 }} />
                                            : <FemaleOutlined sx={{ fontSize: 16 }} />
                                        }
                                        <p className="text-xs">
                                            {userdata?.profile?.jk === 'L' && 'Laki - laki'}
                                            {userdata?.profile?.jk === 'P' && 'Perempuan'}
                                        </p>
                                    </div>
                                </div>
                            </CustomLoading>
                            <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                                <div className="col-span-1 space-y-2">
                                    <h1 className="font-semibold">
                                        Alamat
                                    </h1>
                                    <p className="text-xs">
                                        {userdata?.profile?.alamat}
                                    </p>
                                </div>
                            </CustomLoading>
                            <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                                <div className="col-span-1 space-y-2">
                                    <h1 className="font-semibold">
                                        Email
                                    </h1>
                                    <p className="text-xs">
                                        {userdata?.account?.email}
                                    </p>
                                </div>
                            </CustomLoading>
                        </div>
                    </div>
                    
                    <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="col-span-1">
                            <h1 className="font-bold">
                                Ganti Password
                            </h1>
                            <p className="opacity-70 text-xs">
                                Dengan mengganti password, anda akan diarahkan ke halaman login.
                            </p>
                        </div>
                        <div className="col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                                <div className="col-span-1">
                                    <TextField 
                                        fullWidth
                                        size={'small'}
                                        label={'Password Lama'}
                                    />
                                </div>
                            </CustomLoading>
                            <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                                <div className="col-span-1">
                                    <TextField 
                                        fullWidth
                                        size={'small'}
                                        label={'Password Baru'}
                                    />
                                </div>
                            </CustomLoading>
                            <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                                <div className="col-span-1">
                                    <Button variant="contained" size="small" startIcon={<SaveOutlined />}>
                                        <p className="font-jakarta font-medium">
                                            Simpan
                                        </p>
                                    </Button>
                                </div>
                            </CustomLoading>
                            
                            
                            
                        </div>
                    </div>
                    
                </div>
            </div>
        </MainLayout>
    )
}