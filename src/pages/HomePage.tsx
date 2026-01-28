import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import {
    Wallet,
    Shield,
    Users,
    Target,
    ChevronLeft,
    ChevronRight,
    Clock,
    TrendingUp,
    Award
} from 'lucide-react';
import { useState } from 'react';
import Header from '../components/Header';
import BaseTopBackground from '../layouts/BaseTopBackground';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const [projectIndex, setProjectIndex] = useState(0);
    const [testimonialIndex, setTestimonialIndex] = useState(0);
    const navigate = useNavigate()

    const projects = [
        {
            id: 1,
            title: "Dự án Khởi nghiệp Công nghệ",
            category: "Công nghệ",
            image: "https://images.unsplash.com/photo-1762558978905-850515fc6b3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHN0YXJ0dXAlMjBwcm9qZWN0fGVufDF8fHx8MTc2ODMyMzA5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
            raised: "2,5 tỷ",
            goal: "5 tỷ",
            progress: 50,
            investors: 125
        },
        {
            id: 2,
            title: "Nền tảng E-learning",
            category: "Giáo dục",
            image: "https://images.unsplash.com/photo-1758874573117-66e1143be91d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBlZHVjYXRpb24lMjB2aWRlb3xlbnwxfHx8fDE3NjgyOTcyNTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
            raised: "1,2 tỷ",
            goal: "3 tỷ",
            progress: 40,
            investors: 89
        },
        {
            id: 3,
            title: "Ứng dụng Fintech",
            category: "Tài chính",
            image: "https://images.unsplash.com/photo-1623715537851-8bc15aa8c145?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwd29ya3NwYWNlfGVufDF8fHx8MTc2ODI1MTY5NHww&ixlib=rb-4.1.0&q=80&w=1080",
            raised: "3,8 tỷ",
            goal: "6 tỷ",
            progress: 63,
            investors: 210
        },
        {
            id: 4,
            title: "Xây dựng Bất động sản",
            category: "Xây dựng",
            image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBwcm9qZWN0fGVufDF8fHx8MTc2ODI4Mzg5OHww&ixlib=rb-4.1.0&q=80&w=1080",
            raised: "5,5 tỷ",
            goal: "10 tỷ",
            progress: 55,
            investors: 340
        }
    ];

    const testimonials = [
        {
            id: 1,
            name: "Nguyễn Văn A",
            role: "CEO Startup Tech",
            image: "https://images.unsplash.com/photo-1543132220-7bc04a0e790a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHBlcnNvbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2ODI5ODk5N3ww&ixlib=rb-4.1.0&q=80&w=1080",
            content: "Fundtalk đã giúp chúng tôi gọi vốn thành công 5 tỷ đồng trong vòng 3 tháng. Nền tảng rất chuyên nghiệp và minh bạch.",
            rating: 5
        },
        {
            id: 2,
            name: "Trần Thị B",
            role: "Nhà đầu tư",
            image: "https://images.unsplash.com/photo-1543132220-7bc04a0e790a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHBlcnNvbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2ODI5ODk5N3ww&ixlib=rb-4.1.0&q=80&w=1080",
            content: "Tôi đã tìm thấy nhiều dự án tiềm năng trên Fundtalk. Hệ thống báo cáo rất chi tiết và dễ theo dõi.",
            rating: 5
        },
        {
            id: 3,
            name: "Lê Văn C",
            role: "Founder E-commerce",
            image: "https://images.unsplash.com/photo-1543132220-7bc04a0e790a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHBlcnNvbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2ODI5ODk5N3ww&ixlib=rb-4.1.0&q=80&w=1080",
            content: "Cộng đồng Fundtalk rất tích cực và nhiệt tình. Tôi đã nhận được nhiều lời khuyên hữu ích từ các nhà đầu tư.",
            rating: 5
        }
    ];

    const categories = [
        "Công nghệ",
        "Giáo dục",
        "Y tế & Sức khỏe",
        "Tài chính & Fintech",
        "Bất động sản",
        "Thương mại điện tử",
        "Du lịch & Khách sạn",
        "Nông nghiệp"
    ];

    const newsItems = [
        {
            id: 1,
            title: "5 Xu hướng Startup nổi bật năm 2026",
            date: "10/01/2026",
            image: "https://images.unsplash.com/photo-1533543119973-d60296462573?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwYmxvZ3xlbnwxfHx8fDE3NjgyODgxNTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
            views: "2.5k",
            category: "Xu hướng"
        },
        {
            id: 2,
            title: "Cách gọi vốn hiệu quả cho Startup",
            date: "08/01/2026",
            image: "https://images.unsplash.com/photo-1707301280425-475534ec3cc1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lZXRpbmclMjBwcmVzZW50YXRpb258ZW58MXx8fHwxNzY4MjUwNjQ5fDA&ixlib=rb-4.1.0&q=80&w=1080",
            views: "3.2k",
            category: "Hướng dẫn"
        },
        {
            id: 3,
            title: "Top 10 dự án thành công nhất Q4",
            date: "05/01/2026",
            image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBwcm9qZWN0fGVufDF8fHx8MTc2ODI4Mzg5OHww&ixlib=rb-4.1.0&q=80&w=1080",
            views: "4.1k",
            category: "Tin tức"
        }
    ];

    const nextProject = () => {
        setProjectIndex((prev) => (prev + 1) % (projects.length - 3));
    };

    const prevProject = () => {
        setProjectIndex((prev) => (prev - 1 + (projects.length - 3)) % (projects.length - 3));
    };

    const nextTestimonial = () => {
        setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section - GIỚI THIỆU */}
            <Header />
            <BaseTopBackground />
            <section className="relative py-20 pt-28 px-4 overflow-hidden">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h1 className="text-5xl text-white lg:text-6xl font-bold mb-6">
                                GIỚI THIỆU
                            </h1>
                            <p className="text-xl lg:text-2xl text-white/80 mb-8 leading-relaxed">
                                Fundtalk là nền tảng gọi vốn cộng đồng hàng đầu Việt Nam,
                                kết nối các dự án khởi nghiệp với hàng ngàn nhà đầu tư tiềm năng.
                                Chúng tôi cam kết mang đến môi trường minh bạch, an toàn và hiệu quả
                                cho cả người gọi vốn và nhà đầu tư.
                            </p>
                            <div className="flex gap-4">
                                <button className="text-white px-8 py-4 bg-gradient-to-r from-cyan-300 via-blue-500 to-blue-600 rounded-xl font-bold text-lg shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all hover:scale-105">
                                    Xem Dự Án
                                </button>
                                <button className="text-white px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl font-bold text-lg hover:bg-white/20 transition-colors">
                                    Nộp Dự Án
                                </button>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-md border border-white/10 p-8">
                                <ImageWithFallback
                                    src="https://images.unsplash.com/photo-1571510088533-1158a73304e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzRCUyMGlzb21ldHJpYyUyMHNtYXJ0cGhvbmUlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2ODMyMzA5M3ww&ixlib=rb-4.1.0&q=80&w=1080"
                                    alt="3D Illustration"
                                    className="w-full h-full object-cover rounded-2xl"
                                />
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/30 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl"></div>
                        </div>
                    </div>
                </div>

            </section>

            {/* Giá trị của Fundtalk */}
            <section className="py-20 px-4 bg-gradient-to-b from-transparent via-purple-900/20 to-transparent text-white">
                <div className="container mx-auto max-w-7xl">
                    <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4">Giá trị của Fundtalk</h2>
                    <p className="text-center text-white/70 mb-16 text-lg">Lý do bạn nên chọn chúng tôi</p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Value 1 */}
                        <div className="bg-gradient-to-br from-cyan-400/90 to-cyan-600/90 rounded-2xl p-8 hover:scale-105 transition-transform">
                            <div className="w-14 h-14 bg-white/20 rounded-xl mb-6 flex items-center justify-center">
                                <Wallet className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Gọi vốn dễ dàng</h3>
                            <p className="text-white/90">
                                Tiếp cận hàng ngàn nhà đầu tư tiềm năng và gọi vốn hiệu quả cho dự án của bạn
                            </p>
                        </div>

                        {/* Value 2 */}
                        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:scale-105 transition-transform">
                            <div className="w-14 h-14 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl mb-6 flex items-center justify-center">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">An toàn & Minh bạch</h3>
                            <p className="text-white/70">
                                Hệ thống bảo mật cao cấp và quy trình minh bạch đảm bảo quyền lợi cho tất cả
                            </p>
                        </div>

                        {/* Value 3 */}
                        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:scale-105 transition-transform">
                            <div className="w-14 h-14 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl mb-6 flex items-center justify-center">
                                <Users className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Cộng đồng lớn</h3>
                            <p className="text-white/70">
                                Kết nối với cộng đồng startup và nhà đầu tư năng động nhất Việt Nam
                            </p>
                        </div>

                        {/* Value 4 */}
                        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:scale-105 transition-transform">
                            <div className="w-14 h-14 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl mb-6 flex items-center justify-center">
                                <Target className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Tư vấn chuyên nghiệp</h3>
                            <p className="text-white/70">
                                Đội ngũ chuyên gia hỗ trợ 24/7 giúp bạn tối ưu hóa chiến lược gọi vốn
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dự án nổi bật */}
            <section className="py-20 px-4 text-white">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h2 className="text-4xl lg:text-5xl font-bold mb-2">Dự án nổi bật</h2>
                            <p className="text-white/70">Khám phá các dự án đang được quan tâm nhất</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={prevProject}
                                className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center transition-colors"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={nextProject}
                                className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center transition-colors"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 hover:border-cyan-400/50 transition-all hover:scale-105 group"
                            >
                                <div className="relative aspect-video overflow-hidden">
                                    <ImageWithFallback
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                    <div className="absolute top-4 left-4 px-3 py-1 bg-cyan-500 rounded-full text-sm font-bold">
                                        {project.category}
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h3 className="font-bold text-lg mb-2">{project.title}</h3>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-white/70">Đã gọi</span>
                                            <span className="font-bold text-cyan-400">{project.raised}</span>
                                        </div>
                                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                                                style={{ width: `${project.progress}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-sm mt-2">
                                            <span className="text-white/70">Mục tiêu: {project.goal}</span>
                                            <span className="text-white/70">{project.progress}%</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                        <div className="flex items-center gap-2 text-sm text-white/70">
                                            <Users className="w-4 h-4" />
                                            <span>{project.investors} nhà đầu tư</span>
                                        </div>
                                        <button className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-bold">
                                            Chi tiết →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center gap-2 mt-8">
                        {[0, 1, 2, 3].map((dot) => (
                            <div
                                key={dot}
                                className={`w-2 h-2 rounded-full transition-all ${dot === projectIndex ? 'bg-cyan-400 w-8' : 'bg-white/30'
                                    }`}
                            ></div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Phân loại */}
            <section className="py-20 px-4 bg-linear-to-b from-transparent via-purple-900/20 to-transparent text-white">
                <div className="container mx-auto max-w-7xl">
                    <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4">Phân loại</h2>
                    <p className="text-center text-white/70 mb-12 text-lg">Tìm kiếm dự án theo lĩnh vực</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {categories.map((category) => (
                            <button
                                key={category}
                                className="px-6 py-4 bg-white/10 hover:bg-linear-to-r hover:from-cyan-400 hover:to-blue-500 backdrop-blur-md border border-white/20 hover:border-cyan-400 rounded-xl font-bold transition-all hover:scale-105"
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <button className="px-8 py-3 bg-linear-to-r from-cyan-300 via-blue-500 to-blue-600 rounded-xl font-bold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all">
                            Xem tất cả
                        </button>
                    </div>
                </div>
            </section>

            {/* Tin tức mới nhất */}
            <section className="py-20 px-4 text-white">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h2 className="text-4xl lg:text-5xl font-bold mb-2">Tin tức mới nhất</h2>
                            <p className="text-white/70">Cập nhật thông tin và xu hướng mới nhất</p>
                        </div>
                        <button className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-xl font-bold transition-colors">
                            Xem tất cả
                        </button>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Featured News */}
                        <div className="lg:row-span-2 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 hover:border-cyan-400/50 transition-all group">
                            <div className="relative aspect-video overflow-hidden">
                                <ImageWithFallback
                                    src={newsItems[0].image}
                                    alt={newsItems[0].title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                                <div className="absolute top-4 left-4 px-3 py-1 bg-cyan-500 rounded-full text-sm font-bold">
                                    {newsItems[0].category}
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-8">
                                    <div className="flex items-center gap-4 text-sm text-white/70 mb-4">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {newsItems[0].date}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <TrendingUp className="w-4 h-4" />
                                            {newsItems[0].views} lượt xem
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">{newsItems[0].title}</h3>
                                    <button className="text-cyan-400 hover:text-cyan-300 transition-colors font-bold">
                                        Đọc thêm →
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Side News */}
                        <div className="space-y-6">
                            {newsItems.slice(1).map((news) => (
                                <div
                                    key={news.id}
                                    className="flex gap-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:border-cyan-400/50 transition-all group"
                                >
                                    <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                                        <ImageWithFallback
                                            src={news.image}
                                            alt={news.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="inline-block px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs font-bold mb-2">
                                            {news.category}
                                        </div>
                                        <h3 className="font-bold mb-2 line-clamp-2">{news.title}</h3>
                                        <div className="flex items-center gap-3 text-xs text-white/60">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {news.date}
                                            </span>
                                            <span>{news.views} views</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Đánh giá và chứng thỉ */}
            <section className="py-20 px-4 bg-gradient-to-b from-transparent via-purple-900/20 to-transparent text-white">
                <div className="container mx-auto max-w-7xl">
                    <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4">Đánh giá và chứng thỉ</h2>
                    <p className="text-center text-white/70 mb-12 text-lg">Khách hàng nói gì về chúng tôi</p>

                    <div className="relative">
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-12 border border-white/20">
                                <div className="flex flex-col md:flex-row gap-8 items-center">
                                    <div className="w-32 h-32 flex-shrink-0 rounded-full overflow-hidden border-4 border-cyan-400">
                                        <ImageWithFallback
                                            src={testimonials[testimonialIndex].image}
                                            alt={testimonials[testimonialIndex].name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <div className="flex justify-center md:justify-start gap-1 mb-4">
                                            {[...Array(testimonials[testimonialIndex].rating)].map((_, i) => (
                                                <Award key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                            ))}
                                        </div>
                                        <p className="text-xl mb-6 text-white/90 italic">
                                            "{testimonials[testimonialIndex].content}"
                                        </p>
                                        <h4 className="font-bold text-xl">{testimonials[testimonialIndex].name}</h4>
                                        <p className="text-white/60">{testimonials[testimonialIndex].role}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation */}
                            <div className="flex justify-center gap-4 mt-8">
                                <button
                                    onClick={prevTestimonial}
                                    className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center transition-colors"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <div className="flex items-center gap-2">
                                    {testimonials.map((_, index) => (
                                        <div
                                            key={index}
                                            className={`w-2 h-2 rounded-full transition-all ${index === testimonialIndex ? 'bg-cyan-400 w-8' : 'bg-white/30'
                                                }`}
                                        ></div>
                                    ))}
                                </div>
                                <button
                                    onClick={nextTestimonial}
                                    className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center transition-colors"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Thành lập 3 bước đơn giản */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-7xl">
                    <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4 text-white">
                        Thành lập 3{' '}
                        <span className="bg-gradient-to-r from-cyan-300 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                            bước đơn giản
                        </span>
                    </h2>
                    <p className="text-center text-white/70 mb-16 text-lg">Bắt đầu gọi vốn chỉ với 3 bước dễ dàng</p>

                    <div className="grid md:grid-cols-3 gap-8 mb-16 text-white">
                        {/* Step 1 */}
                        <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-cyan-400/50 transition-all hover:scale-105">
                            <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-cyan-500/50">
                                1
                            </div>
                            <div className="mt-6">
                                <h3 className="text-2xl font-bold mb-4">Đăng ký tài khoản</h3>
                                <p className="text-white/70 mb-6">
                                    Tạo tài khoản miễn phí và hoàn thiện thông tin cá nhân của bạn
                                </p>
                                <ul className="space-y-2 text-white/60">
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                                        Đăng ký nhanh chỉ 2 phút
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                                        Xác thực thông tin an toàn
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                                        Hoàn toàn miễn phí
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="relative bg-linear-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-cyan-400/50 transition-all hover:scale-105">
                            <div className="absolute -top-6 left-8 w-12 h-12 bg-linear-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-cyan-500/50">
                                2
                            </div>
                            <div className="mt-6">
                                <h3 className="text-2xl font-bold mb-4">Tạo dự án</h3>
                                <p className="text-white/70 mb-6">
                                    Mô tả chi tiết dự án và thiết lập mục tiêu gọi vốn của bạn
                                </p>
                                <ul className="space-y-2 text-white/60">
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                                        Tải lên tài liệu dự án
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                                        Thiết lập mục tiêu vốn
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                                        Nhận tư vấn từ chuyên gia
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-cyan-400/50 transition-all hover:scale-105">
                            <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-cyan-500/50">
                                3
                            </div>
                            <div className="mt-6">
                                <h3 className="text-2xl font-bold mb-4">Gọi vốn & Phát triển</h3>
                                <p className="text-white/70 mb-6">
                                    Kết nối với nhà đầu tư và nhận vốn để phát triển dự án
                                </p>
                                <ul className="space-y-2 text-white/60">
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                                        Tiếp cận hàng ngàn nhà đầu tư
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                                        Theo dõi tiến độ real-time
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                                        Nhận vốn nhanh chóng
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Plans */}
                    <div className="grid md:grid-cols-3 gap-8 text-white">
                        {/* Basic Plan */}
                        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-cyan-400/50 transition-all">
                            <h3 className="text-2xl font-bold mb-2">Gói cơ bản</h3>
                            <p className="text-white/60 mb-6">Dành cho các dự án khởi đầu</p>
                            <div className="mb-6">
                                <span className="text-5xl font-bold">Miễn phí</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-2 text-white/70">
                                    <div className="w-5 h-5 bg-cyan-500/20 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                                    </div>
                                    Đăng tải 1 dự án
                                </li>
                                <li className="flex items-center gap-2 text-white/70">
                                    <div className="w-5 h-5 bg-cyan-500/20 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                                    </div>
                                    Hoa hồng 5%
                                </li>
                                <li className="flex items-center gap-2 text-white/70">
                                    <div className="w-5 h-5 bg-cyan-500/20 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                                    </div>
                                    Hỗ trợ cơ bản
                                </li>
                            </ul>
                            <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold transition-colors">
                                Bắt đầu ngay
                            </button>
                        </div>

                        {/* Pro Plan */}
                        <div className="relative bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-md rounded-2xl p-8 border-2 border-cyan-400 hover:scale-105 transition-all">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full text-sm font-bold shadow-lg">
                                Phổ biến nhất
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Gói chuyên nghiệp</h3>
                            <p className="text-white/80 mb-6">Dành cho dự án đang phát triển</p>
                            <div className="mb-6">
                                <span className="text-5xl font-bold">500K</span>
                                <span className="text-white/60">/tháng</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-2">
                                    <div className="w-5 h-5 bg-cyan-400 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                    Không giới hạn dự án
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-5 h-5 bg-cyan-400 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                    Hoa hồng 3%
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-5 h-5 bg-cyan-400 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                    Tư vấn chuyên nghiệp
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-5 h-5 bg-cyan-400 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                    Marketing hỗ trợ
                                </li>
                            </ul>
                            <button className="w-full py-3 bg-gradient-to-r from-cyan-400 to-blue-500 hover:shadow-lg hover:shadow-cyan-500/50 rounded-xl font-bold transition-all">
                                Chọn gói này
                            </button>
                        </div>

                        {/* Enterprise Plan */}
                        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-cyan-400/50 transition-all">
                            <h3 className="text-2xl font-bold mb-2">Gói doanh nghiệp</h3>
                            <p className="text-white/60 mb-6">Dành cho tổ chức lớn</p>
                            <div className="mb-6">
                                <span className="text-5xl font-bold">Liên hệ</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-2 text-white/70">
                                    <div className="w-5 h-5 bg-cyan-500/20 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                                    </div>
                                    Tất cả tính năng Pro
                                </li>
                                <li className="flex items-center gap-2 text-white/70">
                                    <div className="w-5 h-5 bg-cyan-500/20 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                                    </div>
                                    Hoa hồng đặc biệt
                                </li>
                                <li className="flex items-center gap-2 text-white/70">
                                    <div className="w-5 h-5 bg-cyan-500/20 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                                    </div>
                                    Quản lý tài khoản riêng
                                </li>
                                <li className="flex items-center gap-2 text-white/70">
                                    <div className="w-5 h-5 bg-cyan-500/20 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                                    </div>
                                    API tích hợp
                                </li>
                            </ul>
                            <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold transition-colors">
                                Liên hệ ngay
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bạn là ? - CTA Section */}
            <section className="py-20 px-4 bg-gradient-to-b from-transparent via-purple-900/30 to-transparent">
                <div className="container mx-auto max-w-7xl">
                    <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4 text-white">
                        Bạn là{' '}
                        <span className="bg-gradient-to-r from-cyan-300 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                            ai?
                        </span>
                    </h2>
                    <p className="text-center text-white/70 mb-12 text-lg">Chọn vai trò phù hợp với bạn</p>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-white">
                        {/* Người gọi vốn */}
                        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-cyan-400/50 transition-all hover:scale-105 text-center">
                            <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                                <Target className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Người gọi vốn</h3>
                            <p className="text-white/70 mb-6">
                                Bạn có ý tưởng kinh doanh và cần nguồn vốn để khởi nghiệp
                            </p>
                            <button 
                            className="px-8 py-3 bg-linear-to-r from-cyan-400 to-blue-500 hover:shadow-lg hover:shadow-cyan-500/50 rounded-xl font-bold transition-all"
                            onClick={() => navigate('/create-project')}
                            >
                                Gọi vốn ngay
                            </button>
                        </div>

                        {/* Nhà đầu tư */}
                        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-cyan-400/50 transition-all hover:scale-105 text-center">
                            <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                                <Wallet className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Nhà đầu tư</h3>
                            <p className="text-white/70 mb-6">
                                Bạn muốn đầu tư vào các dự án tiềm năng và sinh lời
                            </p>
                            <button className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 hover:shadow-lg hover:shadow-cyan-500/50 rounded-xl font-bold transition-all">
                                Đầu tư ngay
                            </button>
                        </div>

                        {/* Khám phá */}
                        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-cyan-400/50 transition-all hover:scale-105 text-center">
                            <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                                <Users className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Khám phá</h3>
                            <p className="text-white/70 mb-6">
                                Bạn muốn tìm hiểu về các dự án và cơ hội kinh doanh
                            </p>
                            <button className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold transition-colors">
                                Khám phá ngay
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-7xl">
                    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-12 border border-white/20">
                        <div className="grid md:grid-cols-4 gap-8 text-center">
                            <div>
                                <div className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent mb-2">
                                    1000+
                                </div>
                                <p className="text-xl text-white/70">Dự án thành công</p>
                            </div>
                            <div>
                                <div className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent mb-2">
                                    5000+
                                </div>
                                <p className="text-xl text-white/70">Nhà đầu tư</p>
                            </div>
                            <div>
                                <div className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent mb-2">
                                    50M+
                                </div>
                                <p className="text-xl text-white/70">Vốn đầu tư</p>
                            </div>
                            <div>
                                <div className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent mb-2">
                                    95%
                                </div>
                                <p className="text-xl text-white/70">Hài lòng</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default HomePage