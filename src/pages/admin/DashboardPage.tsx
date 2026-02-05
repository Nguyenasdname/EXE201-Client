import React from 'react';
import { Users, DollarSign, Briefcase, TrendingUp, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const DashboardPage: React.FC = () => {
    // Mock Data cho biểu đồ
    const revenueData = [40, 70, 45, 90, 65, 85, 100, 75, 50, 95, 60, 80];

    return (
        <div className="min-h-screen bg-[#05050A] text-gray-200 font-sans flex">
            <main className="flex-1 ml-64 p-8 relative overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-0 left-0 w-125 h-[500px] bg-violet-900/20 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-125 h-125 bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="mb-8 relative z-10">
                    <h1 className="text-3xl font-bold text-white mb-2">Tổng Quan Hệ Thống</h1>
                    <p className="text-gray-400">Chào mừng trở lại, Admin! Đây là tình hình hoạt động hôm nay.</p>
                </div>

                {/* --- STATS CARDS --- */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 relative z-10">
                    {[
                        { title: 'Tổng Người Dùng', value: '12,543', icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/10', change: '+12%', trend: 'up' },
                        { title: 'Doanh Thu Tháng', value: '2.5 Tỷ', icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10', change: '+8.5%', trend: 'up' },
                        { title: 'Dự Án Mới', value: '45', icon: Briefcase, color: 'text-violet-400', bg: 'bg-violet-500/10', change: '-2%', trend: 'down' },
                        { title: 'Truy Cập', value: '89.2K', icon: Activity, color: 'text-yellow-400', bg: 'bg-yellow-500/10', change: '+24%', trend: 'up' },
                    ].map((stat, index) => (
                        <div key={index} className="bg-[#13131F]/80 backdrop-blur-xl border border-white/5 p-5 rounded-2xl shadow-lg hover:border-white/10 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <stat.icon size={24} />
                                </div>
                                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                    {stat.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                    {stat.change}
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm font-medium mb-1">{stat.title}</p>
                            <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                    {/* --- REVENUE CHART (Simulated) --- */}
                    <div className="lg:col-span-2 bg-[#13131F]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2"><TrendingUp className="text-cyan-400" size={20} /> Biểu Đồ Tăng Trưởng</h3>
                            <select className="bg-[#0B0B15] border border-white/10 rounded-lg px-3 py-1 text-sm text-gray-400 outline-none"><option>7 ngày qua</option><option>Tháng này</option></select>
                        </div>
                        <div className="h-64 flex items-end justify-between gap-2 px-2">
                            {revenueData.map((h, i) => (
                                <div key={i} className="w-full bg-white/5 rounded-t-lg relative group hover:bg-white/10 transition-all cursor-pointer">
                                    <div
                                        className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-violet-600 to-cyan-500 rounded-t-lg transition-all duration-500 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                                        style={{ height: `${h}%` }}
                                    ></div>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity mb-2">
                                        {h}%
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-4 px-2">
                            <span>T1</span><span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>T8</span><span>T9</span><span>T10</span><span>T11</span><span>T12</span>
                        </div>
                    </div>

                    {/* --- RECENT ACTIVITY --- */}
                    <div className="bg-[#13131F]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl">
                        <h3 className="text-lg font-bold text-white mb-6">Hoạt Động Gần Đây</h3>
                        <div className="space-y-6">
                            {[
                                { user: 'Nguyễn Văn A', action: 'đã đầu tư vào dự án', target: 'Robot AI', time: '2 phút trước', img: 'https://placehold.co/40' },
                                { user: 'Trần Thị B', action: 'đã tạo dự án mới', target: 'Cafe Organic', time: '15 phút trước', img: 'https://placehold.co/40' },
                                { user: 'Lê Văn C', action: 'yêu cầu rút tiền', target: '5.000.000 đ', time: '1 giờ trước', img: 'https://placehold.co/40' },
                                { user: 'Hệ thống', action: 'đã phê duyệt dự án', target: 'Xe đạp điện', time: '3 giờ trước', img: 'https://placehold.co/40' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <img src={item.img} alt="" className="w-10 h-10 rounded-full border border-white/10" />
                                    <div>
                                        <p className="text-sm text-gray-300"><span className="font-bold text-white">{item.user}</span> {item.action} <span className="text-cyan-400">{item.target}</span></p>
                                        <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-2 rounded-lg border border-white/10 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Xem tất cả</button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;