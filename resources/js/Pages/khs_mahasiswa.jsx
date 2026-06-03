import React, { useState, useEffect, useMemo } from 'react';
import MainLayout from '../layouts/MainLayout';
import CustomDataTable from '../components/CustomDataTable';
import CustomLoading from '../components/CustomLoading';
import api_handler from '../libs/api_handler';
import { customSwal } from '../components/CustomSwal';
import { useSidebar } from '../context/SidebarContext';
import {
    Button,
    TextField,
    Select,
    MenuItem,
    Checkbox,
    Chip,
    IconButton,
    Tooltip,
    FormControl,
    InputLabel,
    FormControlLabel,
    Radio,
    RadioGroup,
    FormLabel,
    Alert,
    CircularProgress
} from '@mui/material';
import {
    DownloadOutlined,
    RefreshOutlined,
    PictureAsPdfOutlined,
    ArchiveOutlined,
    MenuOutlined
} from '@mui/icons-material';

export default function KHSMahasiswa({ token, base_url, role }) {
    const { setShowSidebar } = useSidebar();
    
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        angkatan: '',
        jns_mhs: '',
        khs: '',
        page: 1,
        per_page: 10
    });
    
    const [semesterMode, setSemesterMode] = useState('all');
    const [selectedSemesters, setSelectedSemesters] = useState([]);
    const [selectedMhsIds, setSelectedMhsIds] = useState([]);
    
    const [listData, setListData] = useState({
        rows: [],
        filters_options: {
            status: [],
            angkatan: [],
            jenis: []
        },
        meta: {
            current_page: 1,
            total: 0,
            per_page: 10,
            last_page: 1
        },
        loading: false,
        exporting: false
    });

    const fetchList = async () => {
        try {
            setListData(prev => ({ ...prev, loading: true }));
            
            const params = new URLSearchParams();
            if (filters.search) params.append('search', filters.search);
            if (filters.status) params.append('status', filters.status);
            if (filters.angkatan) params.append('angkatan', filters.angkatan);
            if (filters.jns_mhs) params.append('jns_mhs', filters.jns_mhs);
            if (filters.khs) params.append('khs', filters.khs);
            params.append('page', filters.page);
            params.append('per_page', filters.per_page);
            
            const response = await api_handler.get({
                base_url,
                token,
                url: `krs/mahasiswa/khs/list?${params.toString()}`
            });
            
            setListData(prev => ({ ...prev, loading: false }));
            
            if (response.success) {
                setListData(prev => ({
                    ...prev,
                    rows: response.data.mahasiswa || [],
                    filters_options: response.data.filters || prev.filters_options,
                    meta: response.data.meta || prev.meta
                }));
            } else {
                customSwal.toast.error({
                    message: response?.message || 'Gagal mengambil data'
                });
            }
        } catch (error) {
            setListData(prev => ({ ...prev, loading: false }));
            customSwal.toast.error({
                message: error?.message || 'Terjadi kesalahan'
            });
        }
    };

    useEffect(() => {
        fetchList();
    }, [filters.page, filters.per_page]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: 1
        }));
    };

    const handleRefresh = () => {
        setFilters(prev => ({ ...prev, page: 1 }));
        fetchList();
    };

    const handleSearch = () => {
        setFilters(prev => ({ ...prev, page: 1 }));
        fetchList();
    };

    const handleSemesterModeChange = (mode) => {
        setSemesterMode(mode);
        setSelectedSemesters([]);
    };

    const handleSemesterSelect = (semester) => {
        if (semesterMode === 'single') {
            setSelectedSemesters([semester]);
        } else if (semesterMode === 'multiple') {
            setSelectedSemesters(prev => 
                prev.includes(semester) 
                    ? prev.filter(s => s !== semester)
                    : [...prev, semester]
            );
        }
    };

    const handleRowSelect = (ids) => {
        const validIds = ids.filter(id => {
            const row = listData.rows.find(r => r.mhs_id === id);
            return row && row.has_khs;
        });
        
        if (validIds.length > 50) {
            customSwal.toast.error({
                message: 'Maksimal 50 mahasiswa dapat dipilih'
            });
            return;
        }
        
        setSelectedMhsIds(validIds);
    };

    const getSemesterPayload = () => {
        if (semesterMode === 'all') {
            return 'all';
        } else if (semesterMode === 'single') {
            return selectedSemesters[0] || '';
        } else if (semesterMode === 'multiple') {
            return selectedSemesters.join(',');
        }
        return '';
    };

    const handleSingleDownload = (mhs_id) => {
        const payload = getSemesterPayload();
        if (!payload) {
            customSwal.toast.error({
                message: 'Silakan pilih semester terlebih dahulu'
            });
            return;
        }
        
        window.location.href = `/khs-mahasiswa/download/${mhs_id}?semesters=${payload}`;
    };

    const handleBulkDownload = async () => {
        if (selectedMhsIds.length === 0) {
            customSwal.toast.error({
                message: 'Silakan pilih mahasiswa terlebih dahulu'
            });
            return;
        }
        
        const payload = getSemesterPayload();
        if (!payload) {
            customSwal.toast.error({
                message: 'Silakan pilih semester terlebih dahulu'
            });
            return;
        }
        
        try {
            setListData(prev => ({ ...prev, exporting: true }));
            
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
            
            const response = await fetch('/khs-mahasiswa/download/bulk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/zip'
                },
                body: JSON.stringify({
                    mhs_ids: selectedMhsIds,
                    semesters: payload
                })
            });
            
            setListData(prev => ({ ...prev, exporting: false }));
            
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `KHS_Mahasiswa_Bulk_${new Date().getTime()}.zip`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                
                customSwal.toast.success({
                    message: 'Berhasil mengunduh KHS'
                });
            } else {
                const errorData = await response.json();
                customSwal.toast.error({
                    message: errorData?.message || 'Gagal mengunduh KHS'
                });
            }
        } catch (error) {
            setListData(prev => ({ ...prev, exporting: false }));
            customSwal.toast.error({
                message: error?.message || 'Terjadi kesalahan'
            });
        }
    };

    const columns = [
        {
            field: 'nim',
            headerName: 'NIM',
            minWidth: 120
        },
        {
            field: 'nm_mhs',
            headerName: 'Nama',
            minWidth: 250,
            flex: 1
        },
        {
            field: 'masuk_tahun',
            headerName: 'Angkatan',
            minWidth: 100
        },
        {
            field: 'jns_mhs',
            headerName: 'Jenis',
            minWidth: 100,
            valueGetter: (value, row) => row.jns_mhs === 'R' ? 'Reguler' : 'Non-Reguler'
        },
        {
            field: 'sts_mhs',
            headerName: 'Status',
            minWidth: 120,
            renderCell: ({ row }) => {
                const statusMap = {
                    'A': { label: 'Aktif', color: 'success' },
                    'C': { label: 'Cuti', color: 'warning' },
                    'N': { label: 'Tidak Aktif', color: 'error' }
                };
                const status = statusMap[row.sts_mhs] || { label: row.sts_mhs, color: 'default' };
                return <Chip label={status.label} color={status.color} size="small" />;
            }
        },
        {
            field: 'has_khs',
            headerName: 'KHS',
            minWidth: 80,
            renderCell: ({ row }) => (
                <Chip 
                    label={row.has_khs ? 'Ada' : 'Tidak Ada'} 
                    color={row.has_khs ? 'success' : 'default'} 
                    size="small" 
                    variant={row.has_khs ? 'filled' : 'outlined'}
                />
            )
        },
        {
            field: 'total_sks',
            headerName: 'SKS',
            minWidth: 80
        },
        {
            field: 'ipk',
            headerName: 'IPK',
            minWidth: 80,
            valueGetter: (value, row) => row.ipk ? parseFloat(row.ipk).toFixed(2) : '-'
        },
        {
            field: 'semesters_available',
            headerName: 'Semester Tersedia',
            minWidth: 180,
            renderCell: ({ row }) => (
                <div className="flex flex-wrap gap-1">
                    {row.semesters_available?.map(sem => (
                        <Chip key={sem} label={sem} size="small" variant="outlined" />
                    )) || '-'}
                </div>
            )
        },
        {
            field: 'action',
            headerName: 'Aksi',
            minWidth: 100,
            renderCell: ({ row }) => (
                <Tooltip title="Download KHS">
                    <span>
                        <IconButton
                            size="small"
                            color="primary"
                            disabled={!row.has_khs}
                            onClick={() => handleSingleDownload(row.mhs_id)}
                        >
                            <PictureAsPdfOutlined fontSize="small" />
                        </IconButton>
                    </span>
                </Tooltip>
            )
        }
    ];

    return (
        <MainLayout token={token} base_url={base_url} role={role}>
            <div className="bg-white w-full rounded-lg border border-zinc-300 shadow-md">
                <div className="divide-y divide-zinc-300">
                    
                    {/* Header */}
                    <div className="p-2 lg:p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center lg:gap-3">
                                <div className="lg:hidden">
                                    <IconButton onClick={() => setShowSidebar(state => !state)}>
                                        <MenuOutlined fontSize="small" />
                                    </IconButton>
                                </div>
                                <h1 className="text-lg md:text-xl font-semibold tracking-wide">
                                    KHS Mahasiswa Perwalian
                                </h1>
                            </div>
                        </div>
                    </div>

                    {/* Info Alert */}
                    <div className="p-4">
                        <Alert severity="info" icon={<PictureAsPdfOutlined />}>
                            Anda dapat mengunduh KHS mahasiswa secara individual atau bulk (maksimal 50 mahasiswa). 
                            Pilih semester yang diinginkan sebelum mengunduh.
                        </Alert>
                    </div>

                    {/* Filters */}
                    <div className="p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                            <TextField
                                size="small"
                                label="Cari NIM/Nama"
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                className="col-span-1 sm:col-span-2"
                            />
                            
                            <FormControl size="small" fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={filters.status}
                                    label="Status"
                            onChange={(e) => {
                                handleFilterChange('status', e.target.value);
                            }}
                                >
                                    <MenuItem value="">Semua</MenuItem>
                                    {listData.filters_options.status?.map(opt => (
                                        <MenuItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl size="small" fullWidth>
                                <InputLabel>Angkatan</InputLabel>
                                <Select
                                    value={filters.angkatan}
                                    label="Angkatan"
                            onChange={(e) => {
                                handleFilterChange('angkatan', e.target.value);
                            }}
                                >
                                    <MenuItem value="">Semua</MenuItem>
                                    {listData.filters_options.angkatan?.map(opt => (
                                        <MenuItem key={opt} value={opt}>
                                            {opt}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl size="small" fullWidth>
                                <InputLabel>Jenis</InputLabel>
                                <Select
                                    value={filters.jns_mhs}
                                    label="Jenis"
                            onChange={(e) => {
                                handleFilterChange('jns_mhs', e.target.value);
                            }}
                                >
                                    <MenuItem value="">Semua</MenuItem>
                                    {listData.filters_options.jenis?.map(opt => (
                                        <MenuItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl size="small" fullWidth>
                                <InputLabel>KHS</InputLabel>
                                <Select
                                    value={filters.khs}
                                    label="KHS"
                            onChange={(e) => {
                                handleFilterChange('khs', e.target.value);
                            }}
                                >
                                    <MenuItem value="">Semua</MenuItem>
                                    <MenuItem value="1">Ada KHS</MenuItem>
                                    <MenuItem value="0">Tidak Ada KHS</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        <div className="flex gap-2 mt-3">
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<RefreshOutlined />}
                                onClick={handleRefresh}
                                disabled={listData.loading}
                            >
                                Refresh
                            </Button>
                            <Button
                                size="small"
                                variant="contained"
                                onClick={handleSearch}
                                disabled={listData.loading}
                            >
                                Cari
                            </Button>
                        </div>
                    </div>

                    {/* Semester Selector */}
                    <div className="p-4 bg-zinc-50">
                        <FormLabel component="legend" className="mb-2">
                            Pilih Semester untuk Download
                        </FormLabel>
                        
                        <RadioGroup
                            row
                            value={semesterMode}
                            onChange={(e) => handleSemesterModeChange(e.target.value)}
                            className="mb-3"
                        >
                            <FormControlLabel 
                                value="all" 
                                control={<Radio size="small" />} 
                                label="Semua Semester" 
                            />
                            <FormControlLabel 
                                value="single" 
                                control={<Radio size="small" />} 
                                label="Semester Tertentu" 
                            />
                            <FormControlLabel 
                                value="multiple" 
                                control={<Radio size="small" />} 
                                label="Beberapa Semester" 
                            />
                        </RadioGroup>

                        {semesterMode === 'single' && (
                            <FormControl size="small" style={{ minWidth: 200 }}>
                                <InputLabel>Pilih Semester</InputLabel>
                                <Select
                                    value={selectedSemesters[0] || ''}
                                    label="Pilih Semester"
                                    onChange={(e) => setSelectedSemesters([e.target.value])}
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                                        <MenuItem key={sem} value={sem}>
                                            Semester {sem}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}

                        {semesterMode === 'multiple' && (
                            <div className="flex flex-wrap gap-2">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                                    <FormControlLabel
                                        key={sem}
                                        control={
                                            <Checkbox
                                                size="small"
                                                checked={selectedSemesters.includes(sem)}
                                                onChange={() => handleSemesterSelect(sem)}
                                            />
                                        }
                                        label={`Semester ${sem}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Action Toolbar */}
                    <div className="p-4 bg-blue-50 border-l-4 border-blue-500">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <Button
                                    size="small"
                                    variant="contained"
                                    color="primary"
                                    startIcon={listData.exporting ? <CircularProgress size={16} color="inherit" /> : <ArchiveOutlined />}
                                    onClick={handleBulkDownload}
                                    disabled={selectedMhsIds.length === 0 || listData.exporting}
                                >
                                    {listData.exporting ? 'Mengunduh...' : 'Download Bulk (ZIP)'}
                                </Button>
                                <span className="text-sm text-zinc-600">
                                    {selectedMhsIds.length} mahasiswa dipilih
                                </span>
                            </div>
                            {selectedMhsIds.length > 40 && (
                                <Alert severity="warning" className="py-0">
                                    Mendekati limit 50 mahasiswa
                                </Alert>
                            )}
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="p-4">
                        <CustomDataTable
                            id="khs-mahasiswa-table"
                            rows={listData.rows}
                            columns={columns}
                            loading={listData.loading}
                            getRowId={(row) => row.mhs_id}
                            checkbox={true}
                            rowSelect={{
                                onChange: handleRowSelect,
                                value: selectedMhsIds
                            }}
                            isRowSelectable={(params) => {
                                const row = listData.rows.find(r => r.mhs_id === params.id);
                                return row?.has_khs || false;
                            }}
                            pagination={false}
                        />
                        
                        {/* Manual Pagination Controls */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-zinc-200">
                            <div className="text-sm text-gray-600">
                                Menampilkan {listData.rows.length > 0 ? ((filters.page - 1) * filters.per_page) + 1 : 0} sampai {Math.min(filters.page * filters.per_page, listData.meta.total)} dari {listData.meta.total} mahasiswa
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <FormControl size="small" style={{ minWidth: 100 }}>
                                    <InputLabel>Per Halaman</InputLabel>
                                    <Select
                                        value={filters.per_page}
                                        label="Per Halaman"
                                        onChange={(e) => handleFilterChange('per_page', e.target.value)}
                                    >
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                    </Select>
                                </FormControl>
                                
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        disabled={filters.page === 1}
                                        onClick={() => handleFilterChange('page', filters.page - 1)}
                                    >
                                        Sebelumnya
                                    </Button>
                                    <span className="text-sm px-3 py-1 bg-zinc-100 rounded">
                                        Halaman {filters.page} dari {listData.meta.last_page || 1}
                                    </span>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        disabled={filters.page >= listData.meta.last_page}
                                        onClick={() => handleFilterChange('page', filters.page + 1)}
                                    >
                                        Selanjutnya
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
