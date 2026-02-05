import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, Calendar, DollarSign, FolderKanban, RotateCcw, ChevronLeft, ChevronRight, Building2 } from 'lucide-react';
import type { ICategory, IProject } from '../../interface';
import { useGet } from '../../hooks/useGet';
import { useNavigate } from 'react-router-dom';
import { usePatch } from '../../hooks/usePatch';
import { toast } from 'react-toastify';

const ITEMS_PER_PAGE = 5;

const AdminProjectManagerPage: React.FC = () => {
    const { data: projects, refetch: projectRefetch } = useGet<IProject[]>('/project')
    const { data: PROJECT_TYPES } = useGet<ICategory[]>('/category')
    const [searchTerm, setSearchTerm] = useState('');
    const [activeStatusTab, setActiveStatusTab] = useState('Tất cả');
    const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
    const { patchData } = usePatch();

    const navigate = useNavigate()
    // STATE PHÂN TRANG
    const [currentPage, setCurrentPage] = useState(1);

    const [advancedFilter, setAdvancedFilter] = useState({
        projectType: '',
        minAmount: '',
        maxAmount: '',
        dateFrom: '',
        dateTo: ''
    });

    const filteredProjects: IProject[] = useMemo(() => {
        let result = projects ? [...projects] : [];

        // --- Logic Search ---
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(p =>
                (p.projectName?.toLowerCase().includes(lowerTerm)) ||
                (p.businessName?.toLowerCase().includes(lowerTerm))
            );
        }

        if (activeStatusTab !== 'Tất cả') {
            if (activeStatusTab === 'Chờ duyệt') result = result.filter(p => p.status === 'process');
            else if (activeStatusTab === 'Đang chạy') result = result.filter(p => p.status === 'active');
            else if (activeStatusTab === 'Đã đóng') result = result.filter(p => p.status === 'completed' || p.status === 'failed');
        }

        // --- Logic Advanced Filter ---
        // 2. SỬA LOGIC MATCH CATEGORY TẠI ĐÂY
        if (advancedFilter.projectType !== '') {
            result = result.filter(p => p.projectType?._id === advancedFilter.projectType);
        }

        if (advancedFilter.minAmount) {
            result = result.filter(p => (p.totalCallValue || 0) >= Number(advancedFilter.minAmount));
        }
        if (advancedFilter.maxAmount) {
            result = result.filter(p => (p.totalCallValue || 0) <= Number(advancedFilter.maxAmount));
        }
        if (advancedFilter.dateFrom) {
            result = result.filter(p => p.createAt && new Date(p.createAt) >= new Date(advancedFilter.dateFrom));
        }
        if (advancedFilter.dateTo) {
            result = result.filter(p => p.createAt && new Date(p.createAt) <= new Date(advancedFilter.dateTo));
        }

        return result;
    }, [projects, searchTerm, activeStatusTab, advancedFilter]);


    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentPage(1);
    }, [searchTerm, activeStatusTab, advancedFilter]);

    // --- LOGIC PHÂN TRANG ---
    const indexOfLastProject = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstProject = indexOfLastProject - ITEMS_PER_PAGE;
    const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
    const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);

    // --- HELPER FUNCTIONS ---
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const resetAdvancedFilter = () => {
        // Reset về ''
        setAdvancedFilter({ projectType: '', minAmount: '', maxAmount: '', dateFrom: '', dateTo: '' });
    };

    const formatCurrency = (amount: number | undefined) => {
        if (!amount) return '0 đ';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const renderStatus = (status: string | undefined) => {
        switch (status) {
            case 'process': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 flex items-center gap-1 w-fit"><span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span> Chờ duyệt</span>;
            case 'active': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1 w-fit"><span className="w-2 h-2 rounded-full bg-cyan-400"></span> Đang gọi vốn</span>;
            case 'completed': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-1 w-fit"><CheckCircle size={12} /> Hoàn thành</span>;
            case 'failed': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1 w-fit"><XCircle size={12} /> Thất bại</span>;
            default: return <span className="text-gray-500">N/A</span>;
        }
    };

    const stats = useMemo(() => {
        return {
            total: projects?.length || 0,
            process: projects?.filter(p => p.status === 'process').length || 0,
            active: projects?.filter(p => p.status === 'active').length || 0,
            completed: projects?.filter(p => p.status === 'completed' || p.status === 'failed').length || 0
        }
    }, [projects]);

    const approveProject = async (projectId: string | undefined) => {
        try {
            const res = await patchData<IProject>(`/project/${projectId}/approve`)
            if (res) {
                toast.success('Success!')
                projectRefetch();
            }
        } catch (err) {
            if (err instanceof Error) {
                toast.error(err.message)
            }
        }
    }

    const deniedProject = async (projectId: string | undefined) => {
        try {
            const res = await patchData<IProject>(`/project/${projectId}/denied`)
            if (res) {
                toast.success('Success!')
                projectRefetch();
            }
        } catch (err) {
            if (err instanceof Error) {
                toast.error(err.message)
            }
        }
    }

    if (!projects) {
        return <div className="min-h-screen bg-[#05050A] flex items-center justify-center text-white">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-[#05050A] text-gray-200 font-sans flex">
            <main className="flex-1 ml-64 p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-125 h-[500px] bg-violet-900/20 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-125 h-125 bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="flex justify-between items-center mb-8 relative z-10">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Quản Lý Dự Án</h1>
                        <p className="text-gray-400">Xem xét và phê duyệt các dự án gọi vốn cộng đồng.</p>
                    </div>
                    {/* ... Search bar section ... */}
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-[#13131F] border border-white/10 text-gray-300 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all w-64"
                                placeholder="Tìm kiếm dự án..."
                            />
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 p-[2px]">
                            <div className="w-full h-full rounded-full bg-[#0B0B15] flex items-center justify-center"><span className="font-bold text-sm">AD</span></div>
                        </div>
                    </div>
                </div>

                {/* ... Stats Cards ... */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 relative z-10">
                    <div className="bg-[#13131F]/80 backdrop-blur-xl border border-white/5 p-5 rounded-2xl shadow-lg">
                        <div className="flex justify-between items-start"><div><p className="text-gray-400 text-sm font-medium mb-1">Tổng Dự Án</p><h3 className="text-3xl font-bold text-white">{stats.total}</h3></div><div className="p-3 rounded-lg bg-white/5 text-white"><FolderKanban /></div></div>
                    </div>
                    <div className="bg-[#13131F]/80 backdrop-blur-xl border border-white/5 p-5 rounded-2xl shadow-lg">
                        <div className="flex justify-between items-start"><div><p className="text-gray-400 text-sm font-medium mb-1">Chờ Duyệt</p><h3 className="text-3xl font-bold text-yellow-400">{stats.process}</h3></div><div className="p-3 rounded-lg bg-white/5 text-yellow-400"><RotateCcw /></div></div>
                    </div>
                    <div className="bg-[#13131F]/80 backdrop-blur-xl border border-white/5 p-5 rounded-2xl shadow-lg">
                        <div className="flex justify-between items-start"><div><p className="text-gray-400 text-sm font-medium mb-1">Đang Gọi Vốn</p><h3 className="text-3xl font-bold text-cyan-400">{stats.active}</h3></div><div className="p-3 rounded-lg bg-white/5 text-cyan-400"><DollarSign /></div></div>
                    </div>
                    <div className="bg-[#13131F]/80 backdrop-blur-xl border border-white/5 p-5 rounded-2xl shadow-lg">
                        <div className="flex justify-between items-start"><div><p className="text-gray-400 text-sm font-medium mb-1">Đã Đóng</p><h3 className="text-3xl font-bold text-green-400">{stats.completed}</h3></div><div className="p-3 rounded-lg bg-white/5 text-green-400"><CheckCircle /></div></div>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-6 relative z-10">
                    <div className="flex gap-3">
                        {['Tất cả', 'Chờ duyệt', 'Đang chạy', 'Đã đóng'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveStatusTab(filter)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all 
                                    ${activeStatusTab === filter ? 'bg-white/10 text-cyan-400 border-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.2)]' : 'bg-[#13131F] border-white/5 text-gray-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <button onClick={() => setIsAdvancedFilterOpen(!isAdvancedFilterOpen)} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium shadow-lg transition-all ${isAdvancedFilterOpen ? 'bg-cyan-600 text-white shadow-cyan-500/40 ring-2 ring-cyan-500/50' : 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-cyan-500/20 hover:shadow-cyan-500/40'}`}>
                            <Filter size={18} /> {isAdvancedFilterOpen ? 'Đóng bộ lọc' : 'Bộ lọc nâng cao'}
                        </button>
                        {isAdvancedFilterOpen && (
                            <div className="absolute right-0 top-12 w-80 bg-[#13131F] border border-white/10 rounded-2xl p-4 shadow-2xl z-50 backdrop-blur-xl">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center pb-2 border-b border-white/10"><h3 className="font-semibold text-white">Lọc chi tiết</h3><button onClick={resetAdvancedFilter} className="text-xs text-cyan-400 hover:underline">Đặt lại</button></div>
                                    <div>
                                        <label className="text-xs text-gray-400 block mb-1">Lĩnh vực</label>

                                        {/* 3. SỬA GIAO DIỆN SELECT ĐỂ DÙNG ID */}
                                        <select
                                            value={advancedFilter.projectType}
                                            onChange={(e) => setAdvancedFilter({ ...advancedFilter, projectType: e.target.value })}
                                            className="w-full bg-[#0B0B15] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500 outline-none"
                                        >
                                            {/* Value rỗng cho 'Tất cả' */}
                                            <option value="">Tất cả</option>
                                            {PROJECT_TYPES?.map(type => (
                                                <option key={type._id} value={type._id}>
                                                    {type.categoryName}
                                                </option>
                                            ))}
                                        </select>

                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 block mb-1">Mức gọi vốn (VND)</label>
                                        <div className="flex gap-2">
                                            <input type="number" placeholder="Từ" value={advancedFilter.minAmount} onChange={(e) => setAdvancedFilter({ ...advancedFilter, minAmount: e.target.value })} className="w-1/2 bg-[#0B0B15] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500 outline-none" />
                                            <input type="number" placeholder="Đến" value={advancedFilter.maxAmount} onChange={(e) => setAdvancedFilter({ ...advancedFilter, maxAmount: e.target.value })} className="w-1/2 bg-[#0B0B15] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500 outline-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 block mb-1">Ngày tạo</label>
                                        <div className="flex gap-2">
                                            <input type="date" value={advancedFilter.dateFrom} onChange={(e) => setAdvancedFilter({ ...advancedFilter, dateFrom: e.target.value })} className="w-1/2 bg-[#0B0B15] border border-white/10 rounded-lg px-2 py-2 text-xs text-white focus:border-cyan-500 outline-none" />
                                            <input type="date" value={advancedFilter.dateTo} onChange={(e) => setAdvancedFilter({ ...advancedFilter, dateTo: e.target.value })} className="w-1/2 bg-[#0B0B15] border border-white/10 rounded-lg px-2 py-2 text-xs text-white focus:border-cyan-500 outline-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Table & Pagination (Giữ nguyên) */}
                <div className="bg-[#13131F]/60 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden relative z-1 shadow-2xl flex flex-col min-h-[500px]">
                    <div className="flex-1">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white/5 text-gray-400 text-sm uppercase tracking-wider border-b border-white/5">
                                    <th className="px-6 py-4 font-semibold">Tên Dự Án</th>
                                    <th className="px-6 py-4 font-semibold">Doanh Nghiệp</th>
                                    <th className="px-6 py-4 font-semibold">Mục Tiêu Gọi Vốn</th>
                                    <th className="px-6 py-4 font-semibold">Ngày Tạo</th>
                                    <th className="px-6 py-4 font-semibold">Trạng Thái</th>
                                    <th className="px-6 py-4 font-semibold text-right">Hành Động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {currentProjects.length > 0 ? (
                                    currentProjects.map((project) => (
                                        <tr key={project._id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-lg bg-gray-700 flex-shrink-0 overflow-hidden border border-white/10">
                                                        {project.brandImage && project.brandImage[0] ? (
                                                            <img src={project.brandImage[0]} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">IMG</div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium group-hover:text-cyan-400 transition-colors">{project.projectName}</p>
                                                        {/* Hiển thị tên category, nhưng lọc bằng ID */}
                                                        <p className="text-xs text-gray-500">{project.projectType?.categoryName}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-gray-300 text-sm">{project.businessName}</p>
                                                <p className="text-xs text-gray-500">{project.representative}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-white font-medium">{formatCurrency(project.totalCallValue)}</p>
                                                <div className="w-full h-1.5 bg-gray-700 rounded-full mt-2 overflow-hidden">
                                                    <div className="h-full bg-gradient-to-r from-violet-500 to-cyan-500" style={{ width: `${project.currentAmount && project.totalCallValue ? (project.currentAmount / project.totalCallValue) * 100 : 0}%` }}></div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4"><div className="flex items-center gap-2 text-gray-400 text-sm"><Calendar size={14} />{project.createAt}</div></td>
                                            <td className="px-6 py-4">{renderStatus(project.status)}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {project.status === 'process' && (
                                                        <>
                                                            <button className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors cursor-pointer"
                                                                onClick={() => approveProject(project._id)}
                                                            >
                                                                <CheckCircle size={18} />
                                                            </button>
                                                            <button className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
                                                                onClick={() => deniedProject(project._id)}
                                                            >
                                                                <XCircle size={18} />
                                                            </button>
                                                        </>
                                                    )}
                                                    <button className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                                                        onClick={() => navigate(`/project-details/${project._id}`)}
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button className="p-2 rounded-lg hover:bg-white/10 text-gray-500 transition-colors cursor-pointer"
                                                        onClick={() => window.open(`https://masothue.com/${project.taxId || "0101248141-051"}`)}
                                                    >
                                                        <Building2 size={18} />
                                                    </button>
                                                    <div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                            Không tìm thấy dự án nào phù hợp với bộ lọc.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {filteredProjects && filteredProjects.length > 0 && (
                        <div className="px-6 py-4 border-t border-white/5 flex justify-between items-center text-sm text-gray-500 bg-[#13131F]/40">
                            <span>
                                Hiển thị {filteredProjects.length === 0 ? 0 : indexOfFirstProject + 1} - {Math.min(indexOfLastProject, filteredProjects.length)} trong tổng số {filteredProjects.length} dự án
                            </span>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`p-2 rounded-lg border border-white/10 transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed text-gray-600' : 'hover:bg-white/5 hover:text-white text-gray-400'}`}
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-all
                                            ${currentPage === page
                                                ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/20'
                                                : 'border border-white/10 text-gray-400 hover:bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`p-2 rounded-lg border border-white/10 transition-colors ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed text-gray-600' : 'hover:bg-white/5 hover:text-white text-gray-400'}`}
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminProjectManagerPage;