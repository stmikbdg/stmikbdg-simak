import { Avatar, Button, CircularProgress, Fade, IconButton, TextField } from "@mui/material"
import { useSidebar } from "../context/SidebarContext"
import MainLayout from "../layouts/MainLayout"
import { CheckCircle, CheckOutlined, Close, Edit, FemaleOutlined, MaleOutlined, MenuOutlined, Remove, SaveOutlined } from "@mui/icons-material"

import dayjs from "dayjs"
import 'dayjs/locale/id'
import FileUploadComponent from "../components/CustomUpload"
import CustomLoading from "../components/CustomLoading"
import { useUser } from "../context/UserContext"
import { useRedirect } from "../context/RedirectContext"
import { useBackdrop } from "../context/BackdropContext"

export default function Profil({ token, role, base_url }) {

    if(role.mahasiswa.enable) {
        return (
            <ProfilMahasiswa token={token} role={role} base_url={base_url} />
        )
    }

    if(role.dosen.enable) {
        return (
            <ProfilDosen token={token} role={role} base_url={base_url} />
        )
    }

    if(role.admin.enable) {
        return (
            <ProfilAdmin token={token} role={role} base_url={base_url} />
        )
    }

    if(role.prodi.enable) {
        return (
            <ProfilProdi token={token} role={role} base_url={base_url} />
        )
    }

    if(role.dosen_wali.enable) {
        return (
            <ProfilDosWal token={token} role={role} base_url={base_url} />    
        )
    }
    
    return (
        <MainLayout token={token} base_url={base_url} role={role}>

        </MainLayout>
    )
}

function ProfilMahasiswa({ token, role, base_url }) {

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
                                Ganti Role
                            </h1>
                            <p className="opacity-70 text-xs">
                                Dengan mengganti role, anda akan diarahkan kembali ke halaman utama.
                            </p>
                        </div>
                        <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                            <div className="col-span-1 lg:col-span-2 flex gap-4 flex-wrap h-fit">
                                <ChangeRoleSection account={userdata?.account} role={role} token={token} />
                            </div>
                        </CustomLoading>
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

function ProfilDosen({ token, role, base_url }) {

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
                                            {userdata?.profile?.nama_dan_gelar}
                                        </h1>
                                        <p className="text-center opacity-70">
                                            Dosen
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
                                    {userdata?.profile?.sts_dosen === 'A' && (
                                        <div className="flex items-center gap-3 pl-2 pr-3 py-1 rounded-md bg-green-200 w-fit text-green-700 text-xs font-bold">
                                            <CheckOutlined sx={{ fontSize: 16 }} />
                                            Aktif
                                        </div>
                                    )}
                                    {userdata?.profile?.sts_dosen === 'C' && (
                                        <div className="flex items-center gap-3 pl-2 pr-3 py-1 rounded-md bg-blue-200 w-fit text-blue-700 text-xs font-bold">
                                            <Remove sx={{ fontSize: 16 }} />
                                            Cuti
                                        </div>
                                    )}
                                    {userdata?.profile?.sts_dosen === 'TA' && (
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
                                        Kode Dosen
                                    </h1>
                                    <p className="text-xs">
                                        {userdata?.profile?.kd_dosen || 'Tidak ada'}
                                    </p>
                                </div>
                            </CustomLoading>
                            <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                                <div className="col-span-1 space-y-2">
                                    <h1 className="font-semibold">
                                        Gelar
                                    </h1>
                                    <p className="text-xs">
                                        {userdata?.profile?.gelar || 'Tidak ada'}
                                    </p>
                                </div>
                            </CustomLoading>
                            <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                                <div className="col-span-1 space-y-2">
                                    <h1 className="font-semibold">
                                        NIDN
                                    </h1>
                                    <p className="text-xs">
                                        {userdata?.profile?.nidn || 'Tidak ada'}
                                    </p>
                                </div>
                            </CustomLoading>
                        </div>
                    </div>

                    <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="col-span-1">
                            <h1 className="font-bold">
                                Ganti Role
                            </h1>
                            <p className="opacity-70 text-xs">
                                Dengan mengganti role, anda akan diarahkan kembali ke halaman utama.
                            </p>
                        </div>
                        <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                            <div className="col-span-1 lg:col-span-2 flex gap-4 flex-wrap h-fit">
                                <ChangeRoleSection account={userdata?.account} role={role} token={token} />
                            </div>
                        </CustomLoading>
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

function ProfilProdi({ token, role, base_url }) {
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
                                            {userdata?.profile?.nama_dan_gelar}
                                        </h1>
                                        <p className="text-center opacity-70">
                                            Prodi
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
                                    {userdata?.profile?.sts_dosen === 'A' && (
                                        <div className="flex items-center gap-3 pl-2 pr-3 py-1 rounded-md bg-green-200 w-fit text-green-700 text-xs font-bold">
                                            <CheckOutlined sx={{ fontSize: 16 }} />
                                            Aktif
                                        </div>
                                    )}
                                    {userdata?.profile?.sts_dosen === 'C' && (
                                        <div className="flex items-center gap-3 pl-2 pr-3 py-1 rounded-md bg-blue-200 w-fit text-blue-700 text-xs font-bold">
                                            <Remove sx={{ fontSize: 16 }} />
                                            Cuti
                                        </div>
                                    )}
                                    {userdata?.profile?.sts_dosen === 'TA' && (
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
                                        Kode Dosen
                                    </h1>
                                    <p className="text-xs">
                                        {userdata?.profile?.kd_dosen || 'Tidak ada'}
                                    </p>
                                </div>
                            </CustomLoading>
                            <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                                <div className="col-span-1 space-y-2">
                                    <h1 className="font-semibold">
                                        Gelar
                                    </h1>
                                    <p className="text-xs">
                                        {userdata?.profile?.gelar || 'Tidak ada'}
                                    </p>
                                </div>
                            </CustomLoading>
                            <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                                <div className="col-span-1 space-y-2">
                                    <h1 className="font-semibold">
                                        NIDN
                                    </h1>
                                    <p className="text-xs">
                                        {userdata?.profile?.nidn || 'Tidak ada'}
                                    </p>
                                </div>
                            </CustomLoading>
                        </div>
                    </div>

                    <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="col-span-1">
                            <h1 className="font-bold">
                                Ganti Role
                            </h1>
                            <p className="opacity-70 text-xs">
                                Dengan mengganti role, anda akan diarahkan kembali ke halaman utama.
                            </p>
                        </div>
                        <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                            <div className="col-span-1 lg:col-span-2 flex gap-4 flex-wrap h-fit">
                                <ChangeRoleSection account={userdata?.account} role={role} token={token} />
                            </div>
                        </CustomLoading>
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

function ProfilDosWal({ token, role, base_url }) {
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
                                            {userdata?.profile?.nama_dan_gelar}
                                        </h1>
                                        <p className="text-center opacity-70">
                                            Dosen Wali
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
                                    {userdata?.profile?.sts_dosen === 'A' && (
                                        <div className="flex items-center gap-3 pl-2 pr-3 py-1 rounded-md bg-green-200 w-fit text-green-700 text-xs font-bold">
                                            <CheckOutlined sx={{ fontSize: 16 }} />
                                            Aktif
                                        </div>
                                    )}
                                    {userdata?.profile?.sts_dosen === 'C' && (
                                        <div className="flex items-center gap-3 pl-2 pr-3 py-1 rounded-md bg-blue-200 w-fit text-blue-700 text-xs font-bold">
                                            <Remove sx={{ fontSize: 16 }} />
                                            Cuti
                                        </div>
                                    )}
                                    {userdata?.profile?.sts_dosen === 'TA' && (
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
                                        Kode Dosen
                                    </h1>
                                    <p className="text-xs">
                                        {userdata?.profile?.kd_dosen || 'Tidak ada'}
                                    </p>
                                </div>
                            </CustomLoading>
                            <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                                <div className="col-span-1 space-y-2">
                                    <h1 className="font-semibold">
                                        Gelar
                                    </h1>
                                    <p className="text-xs">
                                        {userdata?.profile?.gelar || 'Tidak ada'}
                                    </p>
                                </div>
                            </CustomLoading>
                            <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                                <div className="col-span-1 space-y-2">
                                    <h1 className="font-semibold">
                                        NIDN
                                    </h1>
                                    <p className="text-xs">
                                        {userdata?.profile?.nidn || 'Tidak ada'}
                                    </p>
                                </div>
                            </CustomLoading>
                        </div>
                    </div>

                    <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="col-span-1">
                            <h1 className="font-bold">
                                Ganti Role
                            </h1>
                            <p className="opacity-70 text-xs">
                                Dengan mengganti role, anda akan diarahkan kembali ke halaman utama.
                            </p>
                        </div>
                        <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                            <div className="col-span-1 lg:col-span-2 flex gap-4 flex-wrap h-fit">
                                <ChangeRoleSection account={userdata?.account} role={role} token={token} />
                            </div>
                        </CustomLoading>
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

function ProfilAdmin({ token, role, base_url }) {
    const { setShowSidebar } = useSidebar()
    const { userdata, loadingUserdata } = useUser()

    console.log(userdata)

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
                                            {userdata?.profile?.nama_dan_gelar}
                                        </h1>
                                        <p className="text-center opacity-70">
                                            Administrator
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
                                    {userdata?.profile?.sts_dosen === 'A' && (
                                        <div className="flex items-center gap-3 pl-2 pr-3 py-1 rounded-md bg-green-200 w-fit text-green-700 text-xs font-bold">
                                            <CheckOutlined sx={{ fontSize: 16 }} />
                                            Aktif
                                        </div>
                                    )}
                                    {userdata?.profile?.sts_dosen === 'C' && (
                                        <div className="flex items-center gap-3 pl-2 pr-3 py-1 rounded-md bg-blue-200 w-fit text-blue-700 text-xs font-bold">
                                            <Remove sx={{ fontSize: 16 }} />
                                            Cuti
                                        </div>
                                    )}
                                    {userdata?.profile?.sts_dosen === 'TA' && (
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
                                        Kode Dosen
                                    </h1>
                                    <p className="text-xs">
                                        {userdata?.profile?.kd_dosen || 'Tidak ada'}
                                    </p>
                                </div>
                            </CustomLoading>
                            <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                                <div className="col-span-1 space-y-2">
                                    <h1 className="font-semibold">
                                        Gelar
                                    </h1>
                                    <p className="text-xs">
                                        {userdata?.profile?.gelar || 'Tidak ada'}
                                    </p>
                                </div>
                            </CustomLoading>
                            <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                                <div className="col-span-1 space-y-2">
                                    <h1 className="font-semibold">
                                        NIDN
                                    </h1>
                                    <p className="text-xs">
                                        {userdata?.profile?.nidn || 'Tidak ada'}
                                    </p>
                                </div>
                            </CustomLoading>
                        </div>
                    </div>

                    <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="col-span-1">
                            <h1 className="font-bold">
                                Ganti Role
                            </h1>
                            <p className="opacity-70 text-xs">
                                Dengan mengganti role, anda akan diarahkan kembali ke halaman utama.
                            </p>
                        </div>
                        <CustomLoading loading={loadingUserdata} renderIf={userdata}>
                            <div className="col-span-1 lg:col-span-2 flex gap-4 flex-wrap h-fit">
                                <ChangeRoleSection account={userdata?.account} role={role} token={token} />
                            </div>
                        </CustomLoading>
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

function ChangeRoleSection({ account, role, token }) {

    const { goTo } = useRedirect()
    const { setShowBackdrop } = useBackdrop()

    const aksi = {
        isDisabled: (target_role) => {
            return role[target_role]?.enable
        },
        isHave: (target_role) => {
            return account?.[target_role]
        },
        change: (target_role) => {
            setShowBackdrop(true)
            goTo(`/?token=${token}&role=${target_role}`)
        }
    }

    return (
        <>
            {aksi.isHave('is_admin') && (
                <Button disabled={aksi.isDisabled('admin')} onClick={() => aksi.change('is_admin')} variant="contained" size="small">
                    <p className="font-jakarta text-xs font-semibold">
                        Administrator
                    </p>
                </Button>
            )}
            {aksi.isHave('is_dosen') && (
                <Button disabled={aksi.isDisabled('dosen')} onClick={() => aksi.change('is_dosen')} variant="contained" size="small">
                    <p className="font-jakarta text-xs font-semibold">
                        Dosen
                    </p>
                </Button>
            )}
            {aksi.isHave('is_dev') && (
                <Button disabled={aksi.isDisabled('developer')} onClick={() => aksi.change('is_developer')} variant="contained" size="small">
                    <p className="font-jakarta text-xs font-semibold">
                        Developer
                    </p>
                </Button>
            )}
            {aksi.isHave('is_doswal') && (
                <Button disabled={aksi.isDisabled('dosen_wali')} onClick={() => aksi.change('is_doswal')} variant="contained" size="small">
                    <p className="font-jakarta text-xs font-semibold">
                        Dosen Wali
                    </p>
                </Button>
            )}
            {aksi.isHave('is_prodi') && (
                <Button disabled={aksi.isDisabled('prodi')} onClick={() => aksi.change('is_prodi')} variant="contained" size="small">
                    <p className="font-jakarta text-xs font-semibold">
                        Prodi
                    </p>
                </Button>
            )}
            {aksi.isHave('is_mhs') && (
                <Button disabled={aksi.isDisabled('mahasiswa')} onClick={() => aksi.change('is_mhs')} variant="contained" size="small">
                    <p className="font-jakarta text-xs font-semibold">
                        Mahasiswa
                    </p>
                </Button>
            )}
        </>
    )
}