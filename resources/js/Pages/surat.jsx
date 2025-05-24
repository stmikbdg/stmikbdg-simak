import { InfoOutlined, RefreshOutlined } from "@mui/icons-material";
import { CustomTabItem, CustomTabs } from "../components/CustomTabs";
import MainLayout, { MainLayout2 } from "../layouts/MainLayout";
import NotAllowedPage from "./NotAllowed";
import { Button } from "@mui/material";
import CustomSelect from "../components/CustomSelect";
import CustomDataTable from "../components/CustomDataTable";

export default function SuratPage({ token, base_url, role, app }) {
    
    if(role?.dosen_wali?.enable) {
        return <DosenWali_SuratPage token={token} base_url={base_url} role={role} app={app} />
    }

    return (
        <NotAllowedPage token={token} base_url={base_url} role={role} />
    )
}

function DosenWali_SuratPage({ token, base_url, role, app }) {
    return (
        <MainLayout2 token={token} base_url={base_url} role={role} app={app} page_title="Surat" noApplications>
            <div className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex gap-4">
                        <InfoOutlined fontSize="small" color="primary" />
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis molestiae dolorum animi itaque! Pariatur placeat vero adipisci voluptas, rem dolore quam. Consequatur alias quasi adipisci aliquam exercitationem distinctio consequuntur repellendus.
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
        </MainLayout2>
    )
}