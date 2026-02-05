import { useEffect, useState, useRef } from 'react';
import { LogOut, User, ChevronDown, SquareKanban, Lock, Bell, Check, Clock, Loader2 } from 'lucide-react';
import svgPaths from '../../svg-yt0h61sbfi'
import imgWhiteLogo1 from "/images/logo/project_logo.png";
import { useAuth } from '../../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { useGet } from '../../hooks/useGet'; // Vẫn dùng useGet để lấy data ban đầu
import type { INotification, getAllNotification } from '../../interface';
import { usePost } from '../../hooks/usePost';
import axios from 'axios'; // Import axios để gọi load more (hoặc dùng instance axios của bạn)

// --- HÀM XỬ LÝ THỜI GIAN ---
const formatTimeAgo = (dateInput: string | number | Date | undefined) => {
    if (!dateInput) return '';
    const created = new Date(dateInput);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - created.getTime()) / 1000);

    if (diffInSeconds < 0) return 'Vừa xong';
    if (diffInSeconds < 60) return 'Vừa xong';

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ngày trước`;
};

const Header = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const { postData } = usePost();
    const navigate = useNavigate();

    // --- STATES QUẢN LÝ NOTIFICATION ---
    const [notificationList, setNotificationList] = useState<INotification[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const limit = 5; // Số lượng item mỗi lần load

    // Gọi API lấy thông báo TRANG 1 lúc đầu
    const { data: initialData } = useGet<getAllNotification>(`/notification?page=1&limit=${limit}`);

    // Cập nhật state khi có dữ liệu ban đầu
    useEffect(() => {
        if (initialData) {
            setNotificationList(initialData.notifications);
            setHasMore(initialData.hasMore);
            setPage(1); // Reset page về 1
        }
    }, [initialData]);

    // Hàm Load More
    const handleLoadMore = async () => {
        if (!hasMore || isLoadingMore) return;

        setIsLoadingMore(true);
        const nextPage = page + 1;

        try {
            // Thay thế bằng instance axios của bạn nếu cần (có kèm token)
            // Ví dụ: const response = await api.get(...)
            // Ở đây tôi dùng axios trần, bạn nhớ thêm header Authorization nếu cần
            const token = localStorage.getItem('token'); // Hoặc lấy từ context
            const response = await axios.get<getAllNotification>(`http://localhost:8080/api/v1/notification?page=${nextPage}&limit=${limit}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const newData = response.data;

            setNotificationList(prev => [...prev, ...newData.notifications]);
            setHasMore(newData.hasMore);
            setPage(nextPage);
        } catch (error) {
            console.error("Failed to load more notifications", error);
        } finally {
            setIsLoadingMore(false);
        }
    };

    // State cho Dropdown
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);
    const [isOntop, setIsOnTop] = useState(true);

    const unreadCount = notificationList.filter(n => !n.isRead).length;

    // ... (Các useEffect xử lý click outside và scroll giữ nguyên) ...
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsOnTop(window.scrollY === 0);
        }
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    });

    const handleLogout = () => {
        logout();
        setShowDropdown(false);
    };

    const markAllAsRead = async () => {
        try {
            await postData('/notification/read-all', {}); // API mark all read
            // Cập nhật UI ngay lập tức
            setNotificationList(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 px-4 py-6 ${isOntop ? '' : 'bg-black/93 rounded-b-lg duration-200 ease-in-out'}`}>
                <div className="max-w-480 mx-auto flex items-center justify-between">
                    {/* Logo & Navigation (Giữ nguyên) */}
                    <div className="flex items-center gap-2 h-16.5 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="h-12 w-12 rounded-lg flex items-center justify-center" style={{ backgroundImage: "linear-gradient(90.75deg, rgb(154, 255, 255) 7.08%, rgb(41, 159, 229) 49.625%, rgb(71, 142, 238) 87.958%)" }}>
                            <img src={imgWhiteLogo1} alt="Fundtalk Logo" className="h-8 w-8 object-contain" />
                        </div>
                        <span className="font-bold text-white">Fundtalk</span>
                    </div>
                    <nav className="hidden w-180 text-white lg:flex justify-between items-center gap-8 bg-white/8 backdrop-blur-sm border border-white/8 rounded-full px-8 py-4 shadow-lg">
                        <a href="#" className="hover:text-cyan-300 transition-colors cursor-pointer">Giới thiệu</a>
                        <a href="#" className="hover:text-cyan-300 transition-colors cursor-pointer">Dự án</a>
                        <a href="#" className="hover:text-cyan-300 transition-colors cursor-pointer">Tin tức</a>
                        <a href="#" className="hover:text-cyan-300 transition-colors cursor-pointer">Xưởng ý tưởng</a>
                        <a href="#" className="hover:text-cyan-300 transition-colors cursor-pointer">Hỗ trợ</a>
                    </nav>

                    <div className="flex items-center gap-4">
                        <button className="w-[50px] h-[50px] rounded-full bg-white/8 border-2 border-white/8 flex items-center justify-center hover:bg-white/12 transition-colors shadow-md cursor-pointer">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 35 35">
                                <path d={svgPaths.p3eec01f2} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                            </svg>
                        </button>

                        {isAuthenticated ? (
                            <>
                                {/* --- NOTIFICATION BELL --- */}
                                <div className="relative" ref={notificationRef}>
                                    <button
                                        onClick={() => setShowNotifications(!showNotifications)}
                                        className="w-[50px] h-[50px] rounded-full bg-white/8 border-2 border-white/8 flex items-center justify-center hover:bg-white/12 transition-colors shadow-md cursor-pointer relative"
                                    >
                                        <Bell className="w-6 h-6 text-white" />
                                        {unreadCount > 0 && (
                                            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-[#0B0B15] rounded-full animate-pulse"></span>
                                        )}
                                    </button>

                                    {/* Notification Dropdown */}
                                    {showNotifications && (
                                        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#1a1660] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                            {/* Header */}
                                            <div className="flex justify-between items-center p-4 border-b border-white/10">
                                                <h3 className="font-semibold text-white">Thông báo</h3>
                                                {unreadCount > 0 && (
                                                    <button
                                                        onClick={markAllAsRead}
                                                        className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                                                    >
                                                        <Check size={14} /> Đánh dấu đã đọc
                                                    </button>
                                                )}
                                            </div>

                                            {/* List */}
                                            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                                {notificationList.length > 0 ? (
                                                    <>
                                                        {notificationList.map((item) => (
                                                            <div
                                                                key={item._id}
                                                                className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${!item.isRead ? 'bg-white/10' : ''}`}
                                                            >
                                                                <div className="flex gap-3">
                                                                    <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!item.isRead ? 'bg-cyan-400' : 'bg-transparent'}`}></div>
                                                                    <div className="flex-1">
                                                                        <h4 className={`text-sm ${!item.isRead ? 'font-bold text-white' : 'font-medium text-white/70'}`}>
                                                                            {item.title}
                                                                        </h4>
                                                                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                                                            {item.message}
                                                                        </p>
                                                                        <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-500">
                                                                            <Clock size={10} />
                                                                            <span>{formatTimeAgo(item.createdAt)}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}

                                                        {/* Nút Xem Thêm trong danh sách */}
                                                        {hasMore && (
                                                            <div
                                                                onClick={handleLoadMore}
                                                                className="p-3 text-center text-xs text-cyan-400 cursor-pointer hover:bg-white/5 transition-colors border-t border-white/5"
                                                            >
                                                                {isLoadingMore ? (
                                                                    <span className="flex items-center justify-center gap-2">
                                                                        <Loader2 size={14} className="animate-spin" /> Đang tải...
                                                                    </span>
                                                                ) : (
                                                                    "Xem các thông báo cũ hơn"
                                                                )}
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <div className="p-8 text-center text-gray-400 text-sm">
                                                        Không có thông báo nào
                                                    </div>
                                                )}
                                            </div>

                                            {/* Footer - Nếu muốn giữ nút xem tất cả chuyển trang */}
                                            {/* <div className="p-3 text-center border-t border-white/10 bg-black/20 hover:bg-black/30 transition-colors cursor-pointer">
                                                <span className="text-sm text-cyan-400 font-medium">Đến trang thông báo</span>
                                            </div> */}
                                        </div>
                                    )}
                                </div>

                                {/* --- USER DROPDOWN (Giữ nguyên) --- */}
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        className="flex items-center gap-3 px-2 py-2 lg:px-4 lg:py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/10 transition-color cursor-pointer"
                                    >
                                        <div className="w-9 h-9 rounded-full flex items-center justify-center border border-yellow-200 overflow-hidden">
                                            <img src={user?.userAvt || "https://placehold.co/100"} alt="User Avatar" className='w-full h-full object-cover' />
                                        </div>
                                        <span className="font-medium hidden lg:block text-white max-w-[100px] truncate">{user?.userName}</span>
                                        <ChevronDown className={`w-4 h-4 transition-transform text-white ${showDropdown ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {showDropdown && (
                                        <div className="absolute right-0 mt-2 w-64 bg-[#1a1660] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                            <div className="p-4 border-b border-white/10 bg-white/5">
                                                <p className="font-semibold text-white truncate">{user?.userName}</p>
                                                <p className="text-sm text-white/60 truncate">{user?.userEmail}</p>
                                            </div>
                                            <div className="p-2 space-y-1">
                                                {user?.userRole === 'admin' && (
                                                    <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors" onClick={() => setShowDropdown(false)}>
                                                        <Lock className="w-5 h-5 text-yellow-400" />
                                                        <span>Admin Dashboard</span>
                                                    </Link>
                                                )}
                                                <Link to="/project-manager" className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors" onClick={() => setShowDropdown(false)}>
                                                    <SquareKanban className="w-5 h-5 text-cyan-400" />
                                                    <span>Quản Lý Dự Án</span>
                                                </Link>
                                                <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors" onClick={() => setShowDropdown(false)}>
                                                    <User className="w-5 h-5 text-purple-400" />
                                                    <span>Thông tin cá nhân</span>
                                                </Link>
                                                <Link to="/payment" className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors" onClick={() => setShowDropdown(false)}>
                                                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                    </svg>
                                                    <span>Thanh toán</span>
                                                </Link>
                                                <div className="border-t border-white/10 my-1"></div>
                                                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors">
                                                    <LogOut className="w-5 h-5" />
                                                    <span>Đăng xuất</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <button
                                    className="px-6 py-2.5 rounded-lg shadow-lg cursor-pointer hover:scale-105 duration-300 ease-in-out font-medium text-black"
                                    style={{ backgroundImage: "linear-gradient(211.322deg, rgb(154, 255, 255) 14.425%, rgb(71, 142, 238) 80.609%)" }}
                                    onClick={() => navigate('/login')}
                                >
                                    Đăng nhập
                                </button>
                                <button
                                    className="px-6 py-2.5 bg-transparent rounded-lg border border-cyan-400 shadow-lg text-cyan-300 cursor-pointer hover:bg-cyan-400/10 hover:scale-105 duration-300 ease-in-out font-medium"
                                    onClick={() => navigate('/register')}
                                >
                                    Đăng ký
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </header>
        </>
    )
}
export default Header