import React, { useState, useMemo, useEffect } from 'react';
import {
    Search,
    Lock,
    Unlock,
    Edit,
    Mail,
    Phone,
    ChevronLeft,
    ChevronRight,
    User
} from 'lucide-react';
import { useGet } from '../../hooks/useGet';
import type { IUser } from '../../interface';

const ITEMS_PER_PAGE = 7;

const UserManagerPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);

    const { data: userData } = useGet<IUser[]>('/user');

    const filteredUsers = useMemo(() => {
        let result = userData || [];

        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(u =>
                (u.userName?.toLowerCase() || '').includes(lowerTerm) ||
                (u.userEmail?.toLowerCase() || '').includes(lowerTerm)
            );
        }

        if (roleFilter !== 'All') {

            result = result.filter(u => u.userRole?.toLowerCase() === roleFilter.toLowerCase());
        }

        return result;
    }, [userData, searchTerm, roleFilter]);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { setCurrentPage(1); }, [searchTerm, roleFilter]);

    // --- LOGIC PHÂN TRANG ---
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

    // Helper: Hàm hiển thị Role đẹp hơn (Admin thay vì admin)
    const displayRole = (role?: string) => {
        if (!role) return 'Unknown';
        return role.charAt(0).toUpperCase() + role.slice(1);
    };

    return (
        <div className="min-h-screen bg-[#05050A] text-gray-200 font-sans flex">
            <main className="flex-1 ml-64 p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-125 h-125 bg-violet-900/20 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="flex justify-between items-center mb-8 relative z-10">
                    <h1 className="text-3xl font-bold text-white">Quản Lý Người Dùng</h1>
                    <div className="flex gap-4">
                        {/* Search Box */}
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 text-gray-500 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm user..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="bg-[#13131F] border border-white/10 rounded-xl pl-10 pr-4 py-2 focus:border-cyan-500 outline-none text-white w-64"
                            />
                        </div>

                        {/* Filter Role - Chỉ còn Admin và Creator */}
                        <select
                            value={roleFilter}
                            onChange={e => setRoleFilter(e.target.value)}
                            className=" bg-[#13131F] border border-white/10 rounded-xl px-4 py-2 text-white outline-none cursor-pointer focus:border-cyan-500"
                        >
                            <option value="All">Tất cả vai trò</option>
                            <option value="admin">Admin</option>
                            <option value="creator">Creator</option>
                        </select>
                    </div>
                </div>

                <div className="bg-[#13131F]/60 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-2xl relative z-10 flex flex-col min-h-125">
                    <div className="flex-1">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-gray-400 text-sm uppercase">
                                <tr>
                                    <th className="px-6 py-4">Người Dùng</th>
                                    <th className="px-6 py-4">Liên Hệ</th>
                                    <th className="px-6 py-4">Vai Trò</th>
                                    <th className="px-6 py-4">Trạng Thái</th>
                                    <th className="px-6 py-4 text-right">Hành Động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {/* Loading state logic (Optional) */}
                                {!userData && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                            Đang tải dữ liệu...
                                        </td>
                                    </tr>
                                )}

                                {/* Empty state */}
                                {userData && currentUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                            Không tìm thấy người dùng nào.
                                        </td>
                                    </tr>
                                )}

                                {currentUsers.map(user => (
                                    <tr key={user._id || user._id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 flex items-center gap-3">
                                            {/* Avatar: Dùng ảnh thật hoặc placeholder nếu null */}
                                            {user.userAvt ? (
                                                <img src={user.userAvt} alt="" className="w-10 h-10 rounded-full border border-white/10 object-cover" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-400">
                                                    <User size={20} />
                                                </div>
                                            )}
                                            <span className="font-medium text-white">{user.userName}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col text-sm text-gray-400">
                                                <span className="flex items-center gap-2"><Mail size={12} /> {user.userEmail}</span>
                                                <span className="flex items-center gap-2 mt-1"><Phone size={12} /> {user.userPhone || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold 
                                                ${user.userRole === 'admin' ? 'bg-red-500/10 text-red-400' : 'bg-violet-500/10 text-violet-400'}`}>
                                                {displayRole(user.userRole)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.userStatus !== 'banned'
                                                ? <span className="text-green-400 text-xs font-bold bg-green-500/10 px-2 py-1 rounded-md">Active</span>
                                                : <span className="text-gray-400 text-xs font-bold bg-gray-500/10 px-2 py-1 rounded-md">Banned</span>
                                            }
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all">
                                                    <Edit size={16} />
                                                </button>
                                                {user.userStatus !== 'banned'
                                                    ? <button className="p-2 bg-red-500/10 rounded-lg text-red-400 hover:bg-red-500/20 transition-all"><Lock size={16} /></button>
                                                    : <button className="p-2 bg-green-500/10 rounded-lg text-green-400 hover:bg-green-500/20 transition-all"><Unlock size={16} /></button>
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-white/5 flex justify-between items-center text-sm text-gray-500">
                        <span>Hiển thị {filteredUsers.length > 0 ? indexOfFirstItem + 1 : 0}-{Math.min(indexOfLastItem, filteredUsers.length)} / {filteredUsers.length}</span>
                        <div className="flex gap-2">
                            <button onClick={() => setCurrentPage(c => Math.max(c - 1, 1))} disabled={currentPage === 1} className="p-2 border border-white/10 rounded-lg hover:bg-white/5 disabled:opacity-50"><ChevronLeft size={16} /></button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button key={page} onClick={() => setCurrentPage(page)} className={`w-8 h-8 rounded-lg ${currentPage === page ? 'bg-cyan-600 text-white' : 'border border-white/10 text-gray-400 hover:bg-white/5'}`}>{page}</button>
                            ))}
                            <button onClick={() => setCurrentPage(c => Math.min(c + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 border border-white/10 rounded-lg hover:bg-white/5 disabled:opacity-50"><ChevronRight size={16} /></button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
export default UserManagerPage;