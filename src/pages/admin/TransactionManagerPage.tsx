import React, { useState, useMemo, useEffect } from 'react';
import { Download, ArrowUpRight, ArrowDownRight, ChevronLeft, ChevronRight, CheckCircle, Clock, XCircle } from 'lucide-react';

const mockTrans = Array.from({ length: 30 }, (_, i) => ({
    id: `TRX-${1000 + i}`,
    user: `User ${i + 1}`,
    amount: (i + 1) * 500000,
    type: i % 3 === 0 ? 'deposit' : (i % 2 === 0 ? 'withdraw' : 'invest'),
    status: i % 5 === 0 ? 'failed' : (i % 4 === 0 ? 'pending' : 'success'),
    date: '2023-11-20 14:30',
}));

const ITEMS_PER_PAGE = 8;

const TransactionManagerPage: React.FC = () => {
    const [filterType, setFilterType] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);

    const filteredTrans = useMemo(() => {
        if (filterType === 'All') return mockTrans;
        return mockTrans.filter(t => t.type === filterType);
    }, [filterType]);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { setCurrentPage(1); }, [filterType]);

    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentTrans = filteredTrans.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredTrans.length / ITEMS_PER_PAGE);

    const formatCurrency = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

    return (
        <div className="min-h-screen bg-[#05050A] text-gray-200 font-sans flex">
            <main className="flex-1 ml-64 p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-125 h-[500px] bg-violet-900/20 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="flex justify-between items-center mb-8 relative z-10">
                    <h1 className="text-3xl font-bold text-white">Lịch Sử Giao Dịch</h1>
                    <div className="flex gap-4">
                        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="bg-[#13131F] border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-cyan-500">
                            <option value="All">Tất cả loại</option>
                            <option value="deposit">Nạp tiền</option>
                            <option value="withdraw">Rút tiền</option>
                            <option value="invest">Đầu tư</option>
                        </select>
                        <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-cyan-400 hover:bg-white/10 transition-all"><Download size={18} /> Xuất Excel</button>
                    </div>
                </div>

                <div className="bg-[#13131F]/60 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-2xl relative z-10 flex flex-col min-h-[600px]">
                    <div className="flex-1">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-gray-400 text-sm uppercase">
                                <tr>
                                    <th className="px-6 py-4">Mã GD</th>
                                    <th className="px-6 py-4">Người Dùng</th>
                                    <th className="px-6 py-4">Loại GD</th>
                                    <th className="px-6 py-4">Số Tiền</th>
                                    <th className="px-6 py-4">Trạng Thái</th>
                                    <th className="px-6 py-4 text-right">Thời Gian</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {currentTrans.map(t => (
                                    <tr key={t.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-mono text-cyan-400">{t.id}</td>
                                        <td className="px-6 py-4 text-white font-medium">{t.user}</td>
                                        <td className="px-6 py-4">
                                            {t.type === 'deposit' && <span className="text-green-400 flex items-center gap-1 text-sm"><ArrowDownRight size={14} /> Nạp tiền</span>}
                                            {t.type === 'withdraw' && <span className="text-red-400 flex items-center gap-1 text-sm"><ArrowUpRight size={14} /> Rút tiền</span>}
                                            {t.type === 'invest' && <span className="text-violet-400 flex items-center gap-1 text-sm"><ArrowUpRight size={14} /> Đầu tư</span>}
                                        </td>
                                        <td className={`px-6 py-4 font-bold ${t.type === 'deposit' ? 'text-green-400' : 'text-white'}`}>
                                            {t.type === 'deposit' ? '+' : '-'}{formatCurrency(t.amount)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {t.status === 'success' && <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded text-xs font-bold flex w-fit items-center gap-1"><CheckCircle size={12} /> Thành công</span>}
                                            {t.status === 'pending' && <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 rounded text-xs font-bold flex w-fit items-center gap-1"><Clock size={12} /> Đang xử lý</span>}
                                            {t.status === 'failed' && <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded text-xs font-bold flex w-fit items-center gap-1"><XCircle size={12} /> Thất bại</span>}
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-500 text-sm">{t.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-white/5 flex justify-between items-center text-sm text-gray-500">
                        <span>Hiển thị {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredTrans.length)} / {filteredTrans.length}</span>
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
export default TransactionManagerPage;