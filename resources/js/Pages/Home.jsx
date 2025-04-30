import {
    AccessTimeOutlined,
    AccountBalanceWalletTwoTone,
    ArrowRight,
    ArrowRightAlt,
    AssignmentOutlined,
    AssignmentTwoTone,
    AutoGraphOutlined,
    BookmarksTwoTone,
    BookTwoTone,
    CalendarMonthOutlined,
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
    IndeterminateCheckBoxTwoTone,
    InfoOutlined,
    KeyboardDoubleArrowRightOutlined,
    LocationOnOutlined,
    MenuBookTwoTone,
    MenuOutlined,
    PeopleAltTwoTone,
    PersonOutline,
    RefreshOutlined,
    Remove,
    SchoolTwoTone,
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
import MainLayout from "../layouts/MainLayout";
import { useSidebar } from "../context/SidebarContext";
import { useEffect, useState } from "react";
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
                            <div className="p-4"></div>
                        </CustomTabItem>
                    </CustomTabs>
                </div>
            </div>
        </MainLayout>
    );
}

function DosenWaliPage({ token, base_url, role }) {
    const { setShowSidebar } = useSidebar();

    const { userdata, loadingUserdata } = useUser();

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
                </div>
            </div>
        </MainLayout>
    );
}

function DosenPage({ token, base_url, role }) {
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
                                                                                {item[
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
                            <div className="p-4"></div>
                        </CustomTabItem>
                    </CustomTabs>
                </div>
            </div>
        </MainLayout>
    );
}

function AdminPage({ token, base_url, role }) {
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
    };

    useEffect(() => {
        (async () => {
            // await Promise.allSettled([
            //   aksi.khs.get(),
            //   aksi.jadwal.get()
            // ])
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
                </div>
            </div>
        </MainLayout>
    );
}
