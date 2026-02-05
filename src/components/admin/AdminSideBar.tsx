import React from 'react';
import {
    LayoutDashboard,
    FolderKanban,
    Users,
    Settings,
    LogOut,
    PieChart,
    Wallet
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import imgWhiteLogo1 from "/images/logo/project_logo.png";

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const AdminSideBar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Tổng quan', icon: <LayoutDashboard size={20} /> },
        { id: 'admin-projects-manager', label: 'Duyệt dự án', icon: <FolderKanban size={20} /> },
        { id: 'users-manager', label: 'Quản lý User', icon: <Users size={20} /> },
        { id: 'transactions-manager', label: 'Giao dịch', icon: <Wallet size={20} /> },
        { id: 'reports-manager', label: 'Báo cáo', icon: <PieChart size={20} /> },
    ];

    const navigate = useNavigate();
    return (
        <div className="h-screen w-64 bg-[#0B0B15] border-r border-white/10 flex flex-col fixed left-0 top-0 z-50">
            {/* Logo Area */}
            <div className="flex items-center ml-5 mt-2 gap-2 h-16.5 cursor-pointer"
                onClick={() => navigate('/')}
            >
                <div className="h-12 w-12 rounded-lg flex items-center justify-center" style={{ backgroundImage: "linear-gradient(90.75deg, rgb(154, 255, 255) 7.08%, rgb(41, 159, 229) 49.625%, rgb(71, 142, 238) 87.958%)" }}>
                    <img src={imgWhiteLogo1} alt="Fundtalk Logo" className="h-8 w-8 object-contain" />
                </div>
                <span className="font-bold text-white">Fundtalk Admin</span>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 px-4 py-4 space-y-2">
                {menuItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                                navigate(`/${'admin'}/${item.id}`);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                ${isActive
                                    ? 'bg-linear-to-r from-violet-600/20 to-cyan-400/10 border border-violet-500/50 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <span className={`${isActive ? 'text-cyan-400' : 'group-hover:text-cyan-400 transition-colors'}`}>
                                {item.icon}
                            </span>
                            <span className="font-medium">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Bottom Area */}
            <div className="p-4 border-t border-white/10">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                    <Settings size={20} />
                    <span className="font-medium">Cài đặt</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all mt-1">
                    <LogOut size={20} />
                    <span className="font-medium">Đăng xuất</span>
                </button>
            </div>
        </div>
    );
};

export default AdminSideBar;