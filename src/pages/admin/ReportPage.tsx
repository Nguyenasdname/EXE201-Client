import React, { useState, useMemo, useEffect } from 'react';
import { Eye, CheckCircle, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';

const mockReports = Array.from({ length: 15 }, (_, i) => ({
    id: `RPT-${i + 1}`,
    reporter: `User ${i + 5}`,
    target: `Project ABC ${i}`,
    reason: i % 2 === 0 ? 'Lừa đảo / Scam' : 'Nội dung không phù hợp',
    status: i % 3 === 0 ? 'resolved' : 'pending',
    date: '2023-11-21',
    severity: i % 4 === 0 ? 'high' : 'medium'
}));

const ITEMS_PER_PAGE = 6;

const ReportPage: React.FC = () => {
    const [statusFilter, setStatusFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);

    const filteredReports = useMemo(() => {
        if (statusFilter === 'All') return mockReports;
        return mockReports.filter(r => r.status === statusFilter);
    }, [statusFilter]);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { setCurrentPage(1); }, [statusFilter]);

    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const currentReports = filteredReports.slice(indexOfLastItem - ITEMS_PER_PAGE, indexOfLastItem);
    const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE);

    return (
        <div className="min-h-screen bg-[#05050A] text-gray-200 font-sans flex">
            <main className="flex-1 ml-64 p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-125 h-[500px] bg-violet-900/20 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="flex justify-between items-center mb-8 relative z-10">
                    <h1 className="text-3xl font-bold text-white">Báo Cáo Vi Phạm</h1>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-[#13131F] border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-cyan-500">
                        <option value="All">Tất cả trạng thái</option>
                        <option value="pending">Chờ xử lý</option>
                        <option value="resolved">Đã giải quyết</option>
                    </select>
                </div>

                <div className="bg-[#13131F]/60 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-2xl relative z-10 flex flex-col min-h-[500px]">
                    <div className="flex-1">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-gray-400 text-sm uppercase">
                                <tr>
                                    <th className="px-6 py-4">Mã BC</th>
                                    <th className="px-6 py-4">Người Báo Cáo</th>
                                    <th className="px-6 py-4">Đối Tượng</th>
                                    <th className="px-6 py-4">Lý Do</th>
                                    <th className="px-6 py-4">Mức Độ</th>
                                    <th className="px-6 py-4">Trạng Thái</th>
                                    <th className="px-6 py-4 text-right">Hành Động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {currentReports.map(r => (
                                    <tr key={r.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-mono text-gray-400">{r.id}</td>
                                        <td className="px-6 py-4 text-white">{r.reporter}</td>
                                        <td className="px-6 py-4 text-cyan-400 font-medium">{r.target}</td>
                                        <td className="px-6 py-4 text-gray-300">{r.reason}</td>
                                        <td className="px-6 py-4">
                                            {r.severity === 'high'
                                                ? <span className="text-red-400 flex items-center gap-1 text-xs font-bold"><AlertTriangle size={12} /> Cao</span>
                                                : <span className="text-yellow-400 flex items-center gap-1 text-xs font-bold"><AlertTriangle size={12} /> Trung bình</span>
                                            }
                                        </td>
                                        <td className="px-6 py-4">
                                            {r.status === 'pending'
                                                ? <span className="bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded text-xs font-bold">Chờ xử lý</span>
                                                : <span className="bg-green-500/10 text-green-400 px-2 py-1 rounded text-xs font-bold">Đã xong</span>
                                            }
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all"><Eye size={16} /></button>
                                                {r.status === 'pending' && (
                                                    <button className="p-2 bg-green-500/10 rounded-lg text-green-400 hover:bg-green-500/20 transition-all"><CheckCircle size={16} /></button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-white/5 flex justify-between items-center text-sm text-gray-500">
                        <span>Trang {currentPage} / {totalPages}</span>
                        <div className="flex gap-2">
                            <button onClick={() => setCurrentPage(c => Math.max(c - 1, 1))} disabled={currentPage === 1} className="p-2 border border-white/10 rounded-lg hover:bg-white/5 disabled:opacity-50"><ChevronLeft size={16} /></button>
                            <button onClick={() => setCurrentPage(c => Math.min(c + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 border border-white/10 rounded-lg hover:bg-white/5 disabled:opacity-50"><ChevronRight size={16} /></button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
export default ReportPage;