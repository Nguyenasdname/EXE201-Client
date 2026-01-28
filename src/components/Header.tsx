import { useEffect, useState, useRef } from 'react';
import { LogOut, User, ChevronDown } from 'lucide-react';
import svgPaths from '../svg-yt0h61sbfi'
import imgWhiteLogo1 from "/images/logo/project_logo.png";
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'


const Header = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate()
    const [isOntop, setIsOnTop] = useState(true)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsOnTop(window.scrollY === 0)
        }
        window.addEventListener("scroll", handleScroll)

        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    })

    const handleLogout = () => {
        logout();
        setShowDropdown(false);
    };


    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 px-4 py-6 ${isOntop ? '' : 'bg-black/93 rounded-b-lg duration-200 ease-in-out'}`}>
                <div className="max-w-480 mx-auto flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2 h-16.5 cursor-pointer">
                        <div className="h-12 w-12 rounded-lg flex items-center justify-center" style={{ backgroundImage: "linear-gradient(90.75deg, rgb(154, 255, 255) 7.08%, rgb(41, 159, 229) 49.625%, rgb(71, 142, 238) 87.958%)" }}>
                            <img src={imgWhiteLogo1} alt="Fundtalk Logo" className="h-8 w-8 object-contain" />
                        </div>
                        <span className="font-bold text-white">Fundtalk</span>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden w-180 text-white lg:flex justify-between items-center gap-8 bg-white/8 backdrop-blur-sm border border-white/8 rounded-full px-8 py-4 shadow-lg">
                        <a href="#" className="hover:text-cyan-300 transition-colors cursor-pointer">Giới thiệu</a>
                        <a href="#" className="hover:text-cyan-300 transition-colors cursor-pointer">Dự án</a>
                        <a href="#" className="hover:text-cyan-300 transition-colors cursor-pointer">Tin tức</a>
                        <a href="#" className="hover:text-cyan-300 transition-colors cursor-pointer">Xưởng ý tưởng</a>
                        <a href="#" className="hover:text-cyan-300 transition-colors cursor-pointer">Hỗ trợ</a>
                    </nav>

                    {/* Auth buttons */}
                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <button className="w-[65px] h-[65px] rounded-full bg-white/8 border-2 border-white/8 flex items-center justify-center hover:bg-white/12 transition-colors shadow-md cursor-pointer">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 35 35">
                                <path d={svgPaths.p3eec01f2} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                            </svg>
                        </button>



                        {isAuthenticated ? (
                            // Logged in state
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="flex items-center gap-3 px-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/10 transition-color cursor-pointer"
                                >
                                    <div className="w-9 h-9 rounded-full flex items-center justify-center border border-yellow-200">
                                        <img src={user?.userAvt} className='rounded-full' />
                                    </div>
                                    <span className="font-medium hidden lg:block text-white">{user?.userName}</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform text-white ${showDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-64 bg-[#1a1660] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                                        <div className="p-4 border-b border-white/10">
                                            <p className="font-semibold text-white">{user?.userName}</p>
                                            <p className="text-sm text-white/60">{user?.userEmail}</p>
                                        </div>
                                        <div className="p-2">
                                            <Link
                                                to="/profile"
                                                className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                                                onClick={() => setShowDropdown(false)}
                                            >
                                                <User className="w-5 h-5" />
                                                <span>Thông tin cá nhân</span>
                                            </Link>
                                            <Link
                                                to="/payment"
                                                className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                                                onClick={() => setShowDropdown(false)}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                </svg>
                                                <span>Thanh toán</span>
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
                                            >
                                                <LogOut className="w-5 h-5" />
                                                <span>Đăng xuất</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Not logged in state
                            <>

                                <button
                                    className="px-8 py-3 rounded-lg shadow-lg cursor-pointer hover:scale-110 duration-300 ease-in-out"
                                    style={{ backgroundImage: "linear-gradient(211.322deg, rgb(154, 255, 255) 14.425%, rgb(71, 142, 238) 80.609%)" }}
                                    onClick={() => navigate('/login')}
                                >
                                    Đăng nhập
                                </button>

                                <button
                                    className="px-8 py-3 bg-white rounded-lg border border-cyan-300 shadow-lg text-transparent bg-clip-text cursor-pointer hover:scale-110 duration-300 ease-in-out"
                                    style={{ backgroundImage: "linear-gradient(206.453deg, rgb(154, 255, 255) 61.139%, rgb(71, 142, 238) 81.077%)" }}
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