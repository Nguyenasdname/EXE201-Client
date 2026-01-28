/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, Share2, Users, Clock, TrendingUp, ShieldCheck, MapPin, Phone, Mail } from "lucide-react";
import Slider from "react-slick";
import type { IProject } from "../interface";

// --- HELPERS ---
const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const calculateDaysLeft = (openTime: string | number | Date | undefined) => {
    if (!openTime) return 0;
    const startDate = new Date(openTime);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 100); // Default 100 days campaign

    const diffTime = endDate.getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
};

const calculateTimeLeft = (openTime: string | number | Date | undefined) => {
    if (!openTime) return { days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true };

    const startDate = new Date(openTime);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 100); // Logic 100 ngày của bạn

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
// --- MOCK DATA FOR PARTS NOT IN PROJECT SCHEMA ---
// (Backend cần có API riêng cho Packages, Comments, Transactions)
const mockRewardPackages = [
    { id: 1, name: "Gói tiên phong trải nghiệm", price: 2000000, quantity: 99, rating: 5, image: "/api/placeholder/350/260" },
    { id: 2, name: "Gói Giá Trị Bản Địa", price: 4000000, quantity: 50, rating: 5, image: "/api/placeholder/350/260" },
];

const mockTestimonials = [
    { name: "Trần Thảo My", rating: 5, comment: "Dự án rất ý nghĩa!", title: "Tuyệt vời" },
    { name: "Võ Đức Long", rating: 5, comment: "Mong dự án thành công.", title: "Ủng hộ" },
];

const mockRelatedProjects = [
    { id: 2, title: "Dự án Startup 2", image: "/api/placeholder/300/200", progress: 75, amount: "1.5 tỷ" },
];

const ProjectDetailPage = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState("story");
    const [project, setProject] = useState<IProject | null>(null);
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: false });


    useEffect(() => {
        if (!project?.openTime) return;

        // Cập nhật ngay lập tức
        setTimeLeft(calculateTimeLeft(project.openTime));

        // Cài đặt interval cập nhật mỗi giây
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(project.openTime));
        }, 1000);

        return () => clearInterval(timer);
    }, [project]);
    // --- API CALL SIMULATION ---
    useEffect(() => {
        setTimeout(() => {
            setProject({
                _id: "1",
                projectName: "Faifo Tailor - Tinh Hoa May Đo",
                projectType: "Gọi vốn cộng đồng",
                briefIntro: "Khởi nguồn từ khát khao lan tỏa giá trị may đo thủ công tại Hội An, Faifo Tailor đồng hành cùng các Nghệ nhân gìn giữ và nâng tầm nghề truyền thống.",
                brandImage: ["/api/placeholder/800/600", "/api/placeholder/800/601"], // Ảnh bìa + slide
                activityImage: ["/api/placeholder/400/300", "/api/placeholder/400/301", "/api/placeholder/400/302"], // Ảnh hoạt động
                summary: "Tại Faifo Tailor, với chất lượng sản phẩm cao cấp và đội ngũ tận tâm...",
                brandStory: "Câu chuyện chi tiết về thương hiệu... (Nội dung dài lấy từ database)",
                totalCallValue: 2180000000,
                openTime: "2023-10-01T00:00:00.000Z",
                status: "process",

                // Các trường doanh nghiệp
                businessName: "CÔNG TY CỔ PHẦN FAIFO TAILOR",
                taxId: "0123456789",
                representative: "Nguyễn Văn A",
                address: "10 Trần Hưng Đạo, Hội An",
                transparencyCommitment: "Cam kết minh bạch tài chính 100% qua sao kê ngân hàng.",

                // Computed fields giả lập
                currentAmount: 1635000000,
                backerCount: 245
            } as IProject);
            setLoading(false);
        }, 1000);
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#111160] text-white">Loading...</div>;
    if (!project || project === undefined) return <div className="min-h-screen flex items-center justify-center bg-[#111160] text-white">Project not found</div>;

    // Calculations
    const progressPercentage = Math.min(
        ((project.currentAmount ?? 0) / (project.totalCallValue ?? 1)) * 100,
        100
    );
    // const daysLeft = calculateDaysLeft(project.openTime);

    // Settings for Sliders
    const commonSliderSettings = {
        dots: false, infinite: true, speed: 500, slidesToShow: 3, slidesToScroll: 1,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 2 } },
            { breakpoint: 640, settings: { slidesToShow: 1 } },
        ],
    };

    const tabsData = [
        { id: "story", label: "Thông tin dự án", description: "Mô tả, pháp lý & câu chuyện" }, // Đảo Story lên đầu cho hợp lý
        { id: "package", label: "Gói tham gia", description: "Chọn gói quyền lợi" },
        { id: "transactions", label: "Giao dịch", description: "Lịch sử đóng góp" },
        { id: "comments", label: "Thảo luận", description: "Cộng đồng đánh giá" },
    ];

    return (
        <div className="min-h-screen bg-linear-to-b from-[#111160] via-[#2a1a5e] to-black text-white">
            {/* Hero Section */}
            <section className="relative px-6 py-20 lg:px-24">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Left: Project Info */}
                        <div className="space-y-6">
                            <h1 className="font-bold text-4xl lg:text-5xl drop-shadow-[0_4px_16px_rgba(154,255,255,0.5)] leading-tight">
                                {project.projectName}
                            </h1>

                            <p className="text-lg text-gray-200 leading-relaxed text-justify">
                                {project.briefIntro}
                            </p>

                            {/* Small Info Grid - Map fields from Schema */}
                            <div className="grid grid-cols-2 gap-6 pt-6 bg-white/5 p-4 rounded-xl border border-white/10">
                                <div>
                                    <p className="text-sm text-cyan-400 mb-1 uppercase tracking-wider">Loại hình</p>
                                    <p className="font-bold text-lg">{project.projectType}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-cyan-400 mb-1 uppercase tracking-wider">Đại diện</p>
                                    <p className="font-bold text-lg truncate" title={project.representative}>
                                        {project.representative || "Đang cập nhật"}
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-cyan-400 mb-1 uppercase tracking-wider">Mục tiêu vốn</p>
                                    <p className="font-bold text-2xl text-yellow-400">
                                        {formatCurrency(project.totalCallValue ?? 0)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Image Gallery & Stats */}
                        <div className="relative">
                            <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative group">
                                {/* Display 1st image from brandImage array */}
                                <img
                                    src={project.brandImage?.[0] || "/api/placeholder/600/400"}
                                    alt={project.projectName}
                                    className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                {/* Status Badge */}
                                <div className="absolute top-4 right-4 bg-green-500/90 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm">
                                    {project.status === 'process' ? 'Đang gây quỹ' : project.status}
                                </div>
                            </div>

                            {/* Campaign Stats Card */}
                            <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
                                <div className="space-y-4">
                                    {/* Progress Bar */}
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-cyan-300">Tiến độ</span>
                                            <span className="font-bold">{progressPercentage.toFixed(1)}%</span>
                                        </div>
                                        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${progressPercentage}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-3 gap-4 pt-4 divide-x divide-white/20">
                                        <div className="text-center px-2">
                                            <TrendingUp className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
                                            <p className="text-lg lg:text-xl font-bold">
                                                {(project.currentAmount ?? 0 / 1000000000).toFixed(2)} VND
                                            </p>
                                            <p className="text-xs text-gray-300">Đã đạt</p>
                                        </div>

                                        <div className="text-center px-2">
                                            <Users className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
                                            <p className="text-lg lg:text-xl font-bold">{project.backerCount}</p>
                                            <p className="text-xs text-gray-300">Người ủng hộ</p>
                                        </div>

                                        <div className="text-center px-2">
                                            {/* <Clock className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
                                            <p className="text-lg lg:text-xl font-bold">{daysLeft}</p>
                                            <p className="text-xs text-gray-300">Ngày còn lại</p> */}
                                            <Clock className="w-5 h-5 text-cyan-400 mx-auto mb-2" />

                                            {/* PHẦN CHỈNH SỬA HIỂN THỊ THỜI GIAN */}
                                            <div className="text-lg lg:text-xl font-bold flex flex-col justify-center items-center leading-tight min-h-[56px]">
                                                {timeLeft.isEnded ? (
                                                    <span className="text-red-500">Đã kết thúc</span>
                                                ) : (
                                                    <>
                                                        <span className="text-2xl text-yellow-400">
                                                            {timeLeft.days}<span className="text-sm text-gray-400 ml-1">ngày</span>
                                                        </span>
                                                        <span className="text-sm font-mono text-cyan-200">
                                                            {String(timeLeft.hours).padStart(2, '0')}:
                                                            {String(timeLeft.minutes).padStart(2, '0')}:
                                                            {String(timeLeft.seconds).padStart(2, '0')}
                                                        </span>
                                                    </>
                                                )}
                                            </div>

                                            <p className="text-xs text-gray-300 mt-1">Thời gian còn lại</p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-4">
                                        <button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 px-6 rounded-xl font-bold hover:shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-1 transition-all">
                                            Ủng hộ ngay
                                        </button>
                                        <button className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all border border-white/10">
                                            <Share2 className="w-5 h-5" />
                                        </button>
                                        <button className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all border border-white/10">
                                            <Heart className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tabs Navigation */}
            <section className="sticky top-0 z-40 bg-[#1a1a40]/90 backdrop-blur-md border-b border-white/10 shadow-lg">
                <div className="max-w-7xl mx-auto px-6 lg:px-24">
                    <div className="flex overflow-x-auto no-scrollbar">
                        {tabsData.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-shrink-0 px-6 py-5 text-center border-b-2 transition-all min-w-[150px] ${activeTab === tab.id
                                    ? "border-cyan-400 bg-white/5"
                                    : "border-transparent hover:bg-white/5 text-gray-400 hover:text-white"
                                    }`}
                            >
                                <p className={`font-bold text-lg ${activeTab === tab.id ? "text-cyan-400" : ""}`}>
                                    {tab.label}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tab Content */}
            <section className="px-6 py-12 lg:px-24 min-h-[500px]">
                <div className="max-w-7xl mx-auto">

                    {/* --- STORY TAB (Updated with Schema Fields) --- */}
                    {activeTab === "story" && (
                        <div className="grid lg:grid-cols-3 gap-10">
                            <div className="lg:col-span-2 space-y-8">
                                {/* Brand Story */}
                                <div>
                                    <h2 className="text-3xl font-bold mb-6 border-l-4 border-cyan-400 pl-4">Câu chuyện dự án</h2>
                                    <div className="prose prose-invert prose-lg max-w-none text-gray-200">
                                        <p className="whitespace-pre-line">{project.summary}</p>
                                        <p className="whitespace-pre-line mt-4">{project.brandStory}</p>
                                    </div>
                                </div>

                                {/* Activity Images Grid (Hiển thị mảng activityImage) */}
                                {project.activityImage && project.activityImage.length > 0 && (
                                    <div>
                                        <h3 className="text-2xl font-bold mb-4">Hình ảnh hoạt động</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {project.activityImage.map((img, index) => (
                                                <div key={index} className="rounded-xl overflow-hidden hover:opacity-90 transition-opacity">
                                                    <img src={img} alt={`Activity ${index}`} className="w-full h-64 object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Transparency Section (New based on Schema) */}
                                <div className="bg-blue-900/20 p-6 rounded-2xl border border-blue-500/30">
                                    <div className="flex items-center gap-2 mb-4">
                                        <ShieldCheck className="w-8 h-8 text-cyan-400" />
                                        <h3 className="text-2xl font-bold">Cam kết minh bạch</h3>
                                    </div>
                                    <p className="text-gray-300 italic">"{project.transparencyCommitment}"</p>
                                </div>
                            </div>

                            {/* Sidebar: Business Info (Schema Fields) */}
                            <div className="lg:col-span-1 space-y-6">
                                <div className="bg-white/5 rounded-2xl p-6 border border-white/10 sticky top-24">
                                    <h3 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">Thông tin chủ dự án</h3>

                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-gray-400 text-sm">Doanh nghiệp</p>
                                            <p className="font-semibold">{project.businessName}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Mã số thuế</p>
                                            <p className="font-mono bg-black/20 px-2 py-1 rounded inline-block text-cyan-300">{project.taxId}</p>
                                        </div>

                                        <div className="flex items-start gap-3 pt-2">
                                            <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                                            <p className="text-sm">{project.officeAddress || "Chưa cập nhật địa chỉ"}</p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Phone className="w-5 h-5 text-gray-400" />
                                            <p className="text-sm">{project.phoneNumber || "Liên hệ trực tiếp"}</p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Mail className="w-5 h-5 text-gray-400" />
                                            <p className="text-sm truncate">{project.contactEmail || "Chưa cập nhật email"}</p>
                                        </div>
                                    </div>

                                    {project.videoLink && (
                                        <div className="mt-6 pt-4 border-t border-white/10">
                                            <a
                                                href={project.videoLink}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center justify-center gap-2 w-full bg-red-600/80 hover:bg-red-600 text-white py-2 rounded-lg transition-colors"
                                            >
                                                Xem Video giới thiệu
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- PACKAGES TAB --- */}
                    {activeTab === "package" && (
                        <div>
                            <h2 className="text-3xl font-bold mb-8 text-center">Các gói tài trợ</h2>
                            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                                {mockRewardPackages.map((pkg) => (
                                    <div key={pkg.id} className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 hover:border-cyan-400/50 hover:bg-white/10 transition-all group">
                                        <div className="rounded-2xl overflow-hidden mb-4 relative">
                                            <img src={pkg.image} alt={pkg.name} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
                                            <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded-lg text-xs backdrop-blur-sm">
                                                Còn {pkg.quantity} suất
                                            </div>
                                        </div>
                                        <h3 className="font-bold text-lg mb-2 line-clamp-2 min-h-[3.5rem]">{pkg.name}</h3>
                                        <p className="text-2xl font-bold text-cyan-400 mb-4">{formatCurrency(pkg.price)}</p>
                                        <button className="w-full bg-white/10 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 text-white py-3 rounded-xl font-bold transition-all">
                                            Chọn gói này
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- TRANSACTIONS TAB --- */}
                    {activeTab === "transactions" && (
                        <div className="max-w-4xl mx-auto bg-white/5 rounded-2xl p-8 border border-white/10 text-center">
                            <p className="text-gray-400">Tính năng đang được phát triển. Dữ liệu giao dịch sẽ hiển thị tại đây.</p>
                        </div>
                    )}

                    {/* --- COMMENTS TAB --- */}
                    {activeTab === "comments" && (
                        <div>
                            <h2 className="text-3xl font-bold mb-8 text-center">Cộng đồng nói gì?</h2>
                            <Slider {...commonSliderSettings}>
                                {mockTestimonials.map((testimonial, index) => (
                                    <div key={index} className="px-3">
                                        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10 h-full">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center font-bold text-lg">
                                                    {testimonial.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold">{testimonial.name}</h3>
                                                    <div className="flex text-yellow-400 text-sm">{"★".repeat(testimonial.rating)}</div>
                                                </div>
                                            </div>
                                            <p className="text-gray-300 italic">"{testimonial.comment}"</p>
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    )}
                </div>
            </section>

            {/* Related Projects */}
            <section className="px-6 py-16 lg:px-24 bg-black/20">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8">Dự án cùng lĩnh vực</h2>
                    <Slider {...commonSliderSettings}>
                        {mockRelatedProjects.map((project) => (
                            <div key={project.id} className="px-3">
                                <Link to={`/project/${project.id}`}>
                                    <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-400/50 transition-all">
                                        <img src={project.image} alt={project.title} className="w-full h-40 object-cover" />
                                        <div className="p-4">
                                            <h3 className="font-bold text-lg mb-2">{project.title}</h3>
                                            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                                <div className="h-full bg-cyan-400 w-[75%]" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </Slider>
                </div>
            </section>
        </div>
    );
}

export default ProjectDetailPage;