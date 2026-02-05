import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGet } from '../../hooks/useGet';
import Header from '../../components/main/Header';
import Footer from '../../components/main/Footer';
import BaseLayout from '../../layouts/BaseTopBackground';
import { Eye, Edit, Plus, Search, Loader2, SearchX } from 'lucide-react'; // Thêm icon SearchX
import type { IProject } from '../../interface';

const ProjectManagerPage = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    // Gọi API lấy danh sách dự án
    const { data: projects, loading: isLoading } = useGet<IProject[]>('/project/user-projects');

    // Filter search client-side
    const filteredProjects = projects?.filter(p =>
        p.projectName?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    // Kiểm tra xem người dùng đã từng tạo dự án nào chưa
    const hasProjects = projects && projects.length > 0;

    // Helper render trạng thái theo Interface mới
    const renderStatus = (status: string | undefined) => {
        if (!status) return <span className="text-gray-400">N/A</span>;

        const styles: Record<string, string> = {
            process: 'bg-yellow-100 text-yellow-800 border-yellow-200', // Chờ duyệt
            active: 'bg-green-100 text-green-800 border-green-200',   // Đang hoạt động
            completed: 'bg-blue-100 text-blue-800 border-blue-200',   // Hoàn thành
            failed: 'bg-red-100 text-red-800 border-red-200',        // Thất bại
        };

        const label: Record<string, string> = {
            process: 'Chờ duyệt',
            active: 'Đang gọi vốn',
            completed: 'Hoàn thành',
            failed: 'Thất bại',
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || 'bg-gray-100'}`}>
                {label[status] || status}
            </span>
        );
    };

    // Helper format tiền tệ
    const formatCurrency = (amount: number | undefined) => {
        if (!amount) return '0 VNĐ';
        return amount.toLocaleString('vi-VN') + ' VNĐ';
    };

    // Helper tính phần trăm tiến độ
    const calculateProgress = (current: number | undefined, total: number | undefined) => {
        if (!current || !total || total === 0) return 0;
        return Math.min((current / total) * 100, 100);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="animate-spin text-blue-500" size={48} />
            </div>
        );
    }

    return (
        <div className="relative min-h-screen">
            <BaseLayout />
            <Header />

            <main className="relative z-10 container mx-auto px-4 py-12 max-w-7xl pt-30">
                {/* --- HEADER SECTION --- */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-blue-600 mb-2">Quản lý dự án</h1>
                        <p className="text-gray-400">Theo dõi và cập nhật các dự án khởi nghiệp của bạn.</p>
                    </div>

                    <button
                        onClick={() => navigate('/create-project')}
                        className="flex items-center gap-2 px-6 py-3 rounded-lg shadow-lg text-white font-bold transition transform hover:scale-105"
                        style={{ backgroundImage: "linear-gradient(206.655deg, rgb(154, 255, 255) 14.425%, rgb(71, 142, 238) 80.609%)" }}
                    >
                        <Plus size={20} strokeWidth={2.5} /> Tạo dự án mới
                    </button>
                </div>

                {/* --- LOGIC HIỂN THỊ --- */}
                {!hasProjects ? (
                    // TRƯỜNG HỢP 1: Database rỗng (Chưa có dự án nào)
                    <div className="text-center py-20 bg-[#1b1928] rounded-2xl shadow-sm border border-dashed border-[#126b86]">
                        <img src="/images/empty-box.png" alt="No projects" className="w-40 text-white mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-medium text-gray-400 mb-2">Bạn chưa có dự án nào</h3>
                        <p className="text-gray-500 mb-6">Hãy bắt đầu hành trình gọi vốn ngay hôm nay.</p>
                        <button onClick={() => navigate('/create-project')} className="text-blue-500 font-semibold hover:underline flex items-center justify-center gap-1 mx-auto">
                            <Plus size={16} /> Tạo dự án đầu tiên
                        </button>
                    </div>
                ) : (
                    // TRƯỜNG HỢP 2: Đã có dự án (Hiển thị Search & Table)
                    <>
                        {/* --- SEARCH BAR --- */}
                        <div className="bg-[#1b1928] p-4 rounded-xl shadow-sm mb-8 flex items-center border border-[#126b86]">
                            <Search className="text-gray-400 mr-3" size={20} />
                            <input
                                type="text"
                                placeholder="Tìm kiếm dự án của bạn..."
                                className="w-full outline-none text-gray-400 placeholder-gray-500 bg-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* --- CONTENT TABLE HOẶC NO RESULT --- */}
                        {filteredProjects.length === 0 ? (
                            // Search không ra kết quả
                            <div className="text-center py-16 bg-[#1b1928] rounded-2xl shadow-sm border border-dashed border-[#126b86]">
                                <div className="flex justify-center mb-4">
                                    <div className="p-4 bg-[#126b86]/20 rounded-full">
                                        <SearchX className="text-[#126b86]" size={40} />
                                    </div>
                                </div>
                                <h3 className="text-xl font-medium text-gray-400 mb-2">Không tìm thấy kết quả</h3>
                                <p className="text-gray-500 mb-6">
                                    Không có dự án nào khớp với từ khóa "{searchTerm}".
                                </p>
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="text-blue-500 font-semibold hover:underline flex items-center justify-center gap-1 mx-auto"
                                >
                                    Xóa bộ lọc tìm kiếm
                                </button>
                            </div>
                        ) : (
                            // Có kết quả -> Hiển thị bảng
                            <div className="bg-[#1b1928] rounded-2xl shadow-xl overflow-hidden border border-[#126b86]">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-[#1b1928] border-b border-[#126b86] text-gray-500 text-sm uppercase tracking-wider">
                                                <th className="px-6 py-5 font-semibold">Dự án</th>
                                                <th className="px-6 py-5 font-semibold">Mục tiêu / Đã gọi</th>
                                                <th className="px-6 py-5 font-semibold text-center">Trạng thái</th>
                                                <th className="px-6 py-5 font-semibold text-center">Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#126b86]">
                                            {filteredProjects.map((project) => (
                                                <tr key={project._id} className="transition-colors group hover:bg-[#126b86]/10">
                                                    {/* Info Column */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 shrink-0 border border-gray-100">
                                                                <img
                                                                    src={project.brandImage && project.brandImage.length > 0
                                                                        ? project.brandImage[0]
                                                                        : "https://via.placeholder.com/150?text=No+Image"}
                                                                    alt={project.projectName}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-bold text-lg text-blue-600 transition-colors">
                                                                    {project.projectName || 'Dự án chưa đặt tên'}
                                                                </h3>
                                                                <p className="text-sm text-gray-500 line-clamp-1 max-w-[200px]">
                                                                    {project.briefIntro || "Chưa có mô tả ngắn"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Finance Column */}
                                                    <td className="px-6 py-4">
                                                        <div className="space-y-1">
                                                            <p className="text-sm text-gray-500">
                                                                Mục tiêu: <span className="font-semibold text-blue-500">{formatCurrency(project.totalCallValue)}</span>
                                                            </p>
                                                            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                                                                <div
                                                                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                                                    style={{ width: `${calculateProgress(project.currentAmount, project.totalCallValue)}%` }}
                                                                ></div>
                                                            </div>
                                                            <p className="text-xs text-blue-500 font-medium mt-1">
                                                                {Math.round(calculateProgress(project.currentAmount, project.totalCallValue))}% hoàn thành
                                                            </p>
                                                        </div>
                                                    </td>

                                                    {/* Status Column */}
                                                    <td className="px-6 py-4 text-center">
                                                        {renderStatus(project.status)}
                                                    </td>

                                                    {/* Actions Column */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-center gap-3">
                                                            <button
                                                                onClick={() => navigate(`/project-details/${project._id}`)}
                                                                className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition tooltip-container relative group/btn"
                                                                title="Xem trước hiển thị"
                                                            >
                                                                <Eye size={20} />
                                                                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition whitespace-nowrap pointer-events-none z-20">
                                                                    Xem chi tiết
                                                                </span>
                                                            </button>

                                                            <button
                                                                onClick={() => navigate(`/update-project/${project._id}`)}
                                                                className="p-2 rounded-lg bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 transition relative group/btn"
                                                                title="Chỉnh sửa thông tin"
                                                            >
                                                                <Edit size={20} />
                                                                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition whitespace-nowrap pointer-events-none z-20">
                                                                    Chỉnh sửa
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default ProjectManagerPage;