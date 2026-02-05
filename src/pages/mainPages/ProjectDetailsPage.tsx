/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Heart, Share2, Users, Clock, TrendingUp, ShieldCheck, MapPin, Phone, Mail, CheckCircle2, ArrowDown, LockKeyhole, Home, User, PlayCircle } from "lucide-react";
import Slider from "react-slick";
import type { IProject, IDonation } from "../../interface";
import { useGet } from "../../hooks/useGet";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/main/Header";
import BaseTopBackground from "../../layouts/BaseTopBackground";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Hàm format ngày tháng cho lịch sử donate
const formatDate = (dateString: Date | string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const calculateTimeLeft = (openTime: string | undefined) => {
    if (!openTime) return { days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true };

    const startDate = new Date(openTime);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 100);

    const now = new Date();
    const diff = endDate.getTime() - now.getTime();

    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true };

    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        isEnded: false
    };
};

const ProjectDetailPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("story");
    const [project, setProject] = useState<IProject | null>(null);
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: false });
    const navigate = useNavigate()

    // 1. Lấy thông tin Project
    const { data: projectData } = useGet<IProject>(`/project/${id}`);

    // 2. Lấy danh sách Donation
    const { data: donations } = useGet<IDonation[]>(`/donation/${id}`);

    useEffect(() => {
        setLoading(true);
        if (projectData) {
            setProject(projectData);
            setLoading(false);
        }
    }, [id, projectData]);

    useEffect(() => {
        if (!project?.openTime) return;

        setTimeLeft(calculateTimeLeft(project.openTime));
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(project.openTime));
        }, 1000);

        return () => clearInterval(timer);
    }, [project]);

    const scrollToContent = () => {
        const element = document.getElementById("project-content-tabs");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            setActiveTab("story");
        }
    };


    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#05050A] text-white">Loading...</div>;

    if (!project) return <div className="min-h-screen flex items-center justify-center bg-[#05050A] text-white">Project not found</div>;

    const isPending = project.status === 'process';

    if (isPending) {
        const ownerId = typeof project.userId === 'object' && project.userId !== null
            ? project.userId._id
            : project.userId;

        const isAdmin = user?.userRole === 'admin';
        const isOwner = user?._id === ownerId || user?._id === ownerId; // Sửa lỗi so sánh id

        if (!isAdmin && !isOwner) {
            return (
                <div className="min-h-screen bg-[#05050A] flex flex-col items-center justify-center text-white px-4">
                    <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-center max-w-lg shadow-2xl backdrop-blur-xl">
                        <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <LockKeyhole size={40} className="text-gray-400" />
                        </div>
                        <h1 className="text-3xl font-bold mb-4">Quyền truy cập bị hạn chế</h1>
                        <p className="text-gray-400 mb-8 text-lg">
                            Dự án này đang trong quá trình <strong>chờ xét duyệt</strong>.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link to="/" className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
                                <Home size={20} /> Về trang chủ
                            </Link>
                        </div>
                    </div>
                </div>
            );
        }
    }

    const progressPercentage = Math.min(
        ((project.currentAmount ?? 0) / (project.totalCallValue ?? 1)) * 100,
        100
    );

    const mainSliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        arrows: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        appendDots: (dots: any) => (
            <div style={{ bottom: "20px" }}>
                <ul style={{ margin: "0px" }}> {dots} </ul>
            </div>
        ),
    };

    // 3. Cập nhật Tab Data
    const tabsData = [
        { id: "story", label: "Câu chuyện & Pháp lý" },
        { id: "donors", label: "Người ủng hộ" },
        { id: "package", label: "Gói tài trợ" },
        { id: "comments", label: "Thảo luận" },
    ];

    return (
        <div className="min-h-screen bg-[#05050A] text-white font-sans">
            <Header />
            <BaseTopBackground />

            <main className="relative z-10 pt-28 pb-20">
                {isPending && (
                    <div className="fixed bottom-0 left-0 right-0 bg-yellow-600/90 text-white text-center py-3 z-50 backdrop-blur-md font-bold shadow-[0_-4px_20px_rgba(0,0,0,0.5)] animate-slide-up">
                        ⚠️ Bạn đang xem dự án ở chế độ xem trước (Chờ duyệt).
                    </div>
                )}

                {/* ================= HERO SECTION ================= */}
                <div className="max-w-7xl mx-auto px-4 lg:px-8 mb-16">
                    <div className="flex items-center gap-2 mb-6 text-sm">
                        <span className="bg-white/10 px-3 py-1 rounded-full text-cyan-400 border border-cyan-500/30 uppercase font-bold tracking-wider">
                            {project.projectType?.categoryName || "Dự án"}
                        </span>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-300 truncate max-w-[200px]">{project.projectName}</span>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
                        {/* LEFT: MAIN GALLERY */}
                        <div className="lg:col-span-7">
                            <div className="rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10 bg-[#13131F] relative aspect-video">
                                {project.activityImage && project.activityImage.length > 0 ? (
                                    <Slider {...mainSliderSettings} className="h-full project-slider">
                                        {project.activityImage.map((img, index) => (
                                            <div key={index} className="outline-none h-full">
                                                <img src={img} alt={`Activity ${index}`} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </Slider>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">Chưa có hình ảnh hoạt động</div>
                                )}

                                <div className="absolute top-4 left-4">
                                    <span className={`px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-md border border-white/20 shadow-lg 
                                        ${project.status === 'process' ? 'bg-yellow-500/80 text-white' :
                                            project.status === 'active' ? 'bg-green-500/80 text-white' : 'bg-gray-500/80'}`}>
                                        {project.status === 'process' ? 'Chờ duyệt' :
                                            project.status === 'active' ? 'Đang gây quỹ' : project.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: INFO & FUNDING */}
                        <div className="lg:col-span-5 flex flex-col justify-between h-full">
                            <div>
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)] shrink-0 bg-white">
                                        <img src={project.brandImage?.[0] || "https://via.placeholder.com/100"} alt="Brand Logo" className="w-full h-full object-contain" />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl lg:text-4xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                            {project.projectName}
                                        </h1>
                                        <p className="text-cyan-400 text-sm mt-1 font-medium">bởi {project.businessName || "Doanh nghiệp ẩn danh"}</p>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <p className="text-gray-300 text-lg leading-relaxed line-clamp-4">{project.briefIntro}</p>
                                    <button onClick={scrollToContent} className="text-cyan-400 text-sm font-medium hover:text-cyan-300 flex items-center gap-1 mt-2">
                                        Xem chi tiết mô tả <ArrowDown size={14} />
                                    </button>
                                </div>

                                <div className="bg-[#13131F]/80 p-6 rounded-2xl border border-white/10 mb-8 backdrop-blur-md shadow-xl">
                                    <div className="flex justify-between items-end mb-2">
                                        <div>
                                            <p className="text-3xl font-bold text-white">{formatCurrency(project.currentAmount ?? 0)}</p>
                                            <p className="text-sm text-gray-400">trên mục tiêu <span className="text-gray-300">{formatCurrency(project.totalCallValue ?? 0)}</span></p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-2xl font-bold text-cyan-400">{progressPercentage.toFixed(0)}%</span>
                                        </div>
                                    </div>
                                    <div className="h-3 bg-gray-700 rounded-full overflow-hidden mb-6">
                                        <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                                        <div className="flex flex-col justify-center border-r border-white/10 pr-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Users size={20} className="text-cyan-400" />
                                                <span className="text-sm text-gray-400">Người ủng hộ</span>
                                            </div>
                                            <span className="text-2xl font-bold text-white">{project.backerCount || 0}</span>
                                        </div>
                                        <div className="flex flex-col items-end pl-2">
                                            {timeLeft.isEnded ? (
                                                <div className="flex items-center gap-2 text-red-400"><Clock size={20} /><span className="font-bold">Đã kết thúc</span></div>
                                            ) : (
                                                <div className="text-right">
                                                    <div className="flex items-baseline justify-end gap-1">
                                                        <span className="text-3xl font-bold text-yellow-400 leading-none">{timeLeft.days}</span>
                                                        <span className="text-sm text-gray-400 font-medium">ngày còn lại</span>
                                                    </div>
                                                    <div className="mt-1 flex items-center justify-end gap-2 text-cyan-200 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                                                        <Clock size={14} className="animate-pulse" />
                                                        <span className="font-mono text-sm tracking-widest font-semibold">
                                                            {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button disabled={isPending} className={`flex-1 py-4 text-white font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-1 text-lg ${isPending ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 hover:shadow-cyan-500/25'}`}
                                    onClick={() => navigate(`/payment-backer/${id}`, { state: { project } })}
                                >
                                    {isPending ? 'Chưa mở ủng hộ' : 'Ủng hộ ngay'}
                                </button>
                                <button className="p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors border border-white/10 text-gray-300 hover:text-white"><Share2 size={24} /></button>
                                <button className="p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors border border-white/10 text-gray-300 hover:text-red-500"><Heart size={24} /></button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= TABS NAVIGATION ================= */}
                <div id="project-content-tabs" className="sticky top-0 z-40 bg-[#05050A]/95 backdrop-blur-xl border-y border-white/10 mb-12 shadow-2xl">
                    <div className="max-w-7xl mx-auto px-4 lg:px-8">
                        <div className="flex gap-8 overflow-x-auto no-scrollbar">
                            {tabsData.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-5 px-2 border-b-2 font-bold text-sm uppercase tracking-wide transition-colors whitespace-nowrap
                                        ${activeTab === tab.id
                                            ? "border-cyan-500 text-cyan-400"
                                            : "border-transparent text-gray-400 hover:text-white"
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ================= MAIN CONTENT ================= */}
                <div className="max-w-7xl mx-auto px-4 lg:px-8 grid lg:grid-cols-12 gap-12">
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* --- TAB: STORY --- */}
                        {activeTab === "story" && (
                            <div className="animate-fade-in">
                                <section>
                                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                        <TrendingUp className="text-cyan-400" /> Tổng quan dự án
                                    </h3>
                                    <div className="text-gray-300 leading-loose text-lg whitespace-pre-line bg-white/5 p-8 rounded-2xl border border-white/5">
                                        <p className="mb-6 font-medium text-white">{project.briefIntro}</p>
                                        <hr className="border-white/10 my-6" />
                                        {project.summary || "Chưa có nội dung tổng quan chi tiết."}
                                    </div>
                                </section>
                                {project.videoLink && (
                                    <section className="mt-12">
                                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                            <PlayCircle className="text-red-500" /> Video giới thiệu
                                        </h3>
                                        <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black relative group cursor-pointer">
                                            <a href={project.videoLink} target="_blank" rel="noreferrer" className="absolute inset-0 flex items-center justify-center bg-black/50 group-hover:bg-black/30 transition-all">
                                                <PlayCircle size={64} className="text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform" />
                                            </a>
                                            <img src={project.activityImage?.[0] || ""} alt="Video Thumbnail" className="w-full h-full object-cover opacity-60" />
                                        </div>
                                    </section>
                                )}
                                <section className="mt-12">
                                    <h3 className="text-2xl font-bold text-white mb-6">Câu chuyện thương hiệu</h3>
                                    <div className="prose prose-invert prose-lg max-w-none text-gray-300">
                                        <p className="whitespace-pre-line">{project.brandStory}</p>
                                    </div>
                                </section>
                                <section className="mt-12 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 p-8 rounded-3xl border border-cyan-500/20">
                                    <div className="flex items-start gap-4">
                                        <ShieldCheck className="w-12 h-12 text-cyan-400 shrink-0" />
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-2">Cam kết minh bạch</h3>
                                            <p className="text-gray-300 italic">"{project.transparencyCommitment}"</p>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}

                        {/* --- TAB: DONORS (NGƯỜI ỦNG HỘ) - UPDATE --- */}
                        {activeTab === "donors" && (
                            <div className="animate-fade-in">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                        <Users className="text-cyan-400" /> Danh sách ủng hộ
                                    </h3>
                                    <span className="text-gray-400 bg-white/5 px-3 py-1 rounded-full text-sm">
                                        {donations?.length || 0} lượt đóng góp
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    {donations && donations.length > 0 ? (
                                        donations.map((donation) => (
                                            <div
                                                key={donation._id}
                                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all hover:scale-[1.01]"
                                            >
                                                <div className="flex items-start gap-4">
                                                    {/* Avatar người dùng */}
                                                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                                                        {donation.donor?.userAvt ? (
                                                            <img src={donation.donor.userAvt} alt={donation.donor.userName} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <User className="text-cyan-200" size={24} />
                                                        )}
                                                    </div>

                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            {/* Tên người dùng */}
                                                            <h4 className="font-bold text-white text-lg">
                                                                {donation.donor?.userName || "Nhà hảo tâm ẩn danh"}
                                                            </h4>
                                                            <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                                                                {formatDate(donation.createdAt)}
                                                            </span>
                                                        </div>

                                                        {donation.message ? (
                                                            <p className="text-gray-300 italic text-sm">"{donation.message}"</p>
                                                        ) : (
                                                            <p className="text-gray-500 text-sm italic">Không có lời nhắn</p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="text-right sm:pl-4 sm:border-l border-white/10">
                                                    <span className="block text-xs text-gray-400 mb-1">Số tiền</span>
                                                    <span className="text-xl font-bold text-cyan-400 block">
                                                        +{formatCurrency(donation.amount)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-16 bg-white/5 rounded-2xl border border-dashed border-white/10">
                                            <Users size={48} className="mx-auto text-gray-600 mb-4" />
                                            <p className="text-gray-400">Chưa có lượt ủng hộ nào. Hãy là người đầu tiên!</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* --- TAB: PACKAGE --- */}
                        {activeTab === "package" && (
                            <div className="text-center py-20 text-gray-400 bg-white/5 rounded-2xl">
                                Danh sách các gói tài trợ sẽ hiển thị ở đây (Mock Data)
                            </div>
                        )}

                        {/* --- TAB: COMMENTS --- */}
                        {activeTab === "comments" && (
                            <div className="text-center py-20 text-gray-400 bg-white/5 rounded-2xl">
                                Khu vực thảo luận cộng đồng
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN (Giữ nguyên Sidebar) */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-[#13131F] rounded-3xl p-6 border border-white/10 sticky top-24">
                            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                                <img src={project.brandImage?.[0] || "https://via.placeholder.com/64"} alt="Owner Avatar" className="w-16 h-16 rounded-full object-cover border-2 border-white/20" />
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Chủ dự án</p>
                                    <h4 className="font-bold text-lg text-white">{project.businessName}</h4>
                                    <div className="flex items-center gap-1 text-xs text-green-400 mt-1"><CheckCircle2 size={12} /> <span>Đã xác minh</span></div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex gap-3"><MapPin size={18} className="text-gray-500 shrink-0 mt-1" /><div><p className="text-xs text-gray-500 mb-1">Địa chỉ văn phòng</p><p className="text-sm text-gray-300">{project.officeAddress || "Chưa cập nhật"}</p></div></div>
                                <div className="flex gap-3"><Users size={18} className="text-gray-500 shrink-0 mt-1" /><div><p className="text-xs text-gray-500 mb-1">Người đại diện</p><p className="text-sm text-gray-300">{project.representative || "Chưa cập nhật"}</p></div></div>
                                <div className="flex gap-3"><Mail size={18} className="text-gray-500 shrink-0 mt-1" /><div><p className="text-xs text-gray-500 mb-1">Email liên hệ</p><p className="text-sm text-gray-300">{project.contactEmail || "Ẩn thông tin"}</p></div></div>
                                <div className="flex gap-3"><Phone size={18} className="text-gray-500 shrink-0 mt-1" /><div><p className="text-xs text-gray-500 mb-1">Điện thoại</p><p className="text-sm text-gray-300">{project.phoneNumber || "Ẩn thông tin"}</p></div></div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-white/10">
                                <button className="w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium text-gray-300">Liên hệ chủ dự án</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ProjectDetailPage;