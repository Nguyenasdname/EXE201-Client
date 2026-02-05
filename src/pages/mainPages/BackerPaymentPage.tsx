/* eslint-disable react-hooks/set-state-in-effect */
import Header from '../../components/main/Header';
import Footer from "../../components/main/Footer";
import BaseTopBackground from "../../layouts/BaseTopBackground";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { toast } from 'react-toastify';
import { GeneratedRandomCode } from '../../constants/GeneratedRandomCode';
import { Check, Gift, Heart, MapPin, MessageSquareHeart, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePost } from '../../hooks/usePost';
import type { IDonation } from '../../interface';

// Mock data
const MOCK_REWARD_PACKAGES = [
    {
        id: 'pkg_1',
        name: 'Gói Tiên Phong - Ebook cảm ơn',
        price: 200000,
        description: 'Nhận 01 Ebook hướng dẫn và thư cảm ơn từ Founder.'
    },
    {
        id: 'pkg_2',
        name: 'Gói Trải Nghiệm - Sản phẩm mẫu',
        price: 1500000,
        description: 'Nhận 01 sản phẩm mẫu dùng thử sớm nhất + Ebook.'
    },
    {
        id: 'pkg_3',
        name: 'Gói VIP - Phiên bản giới hạn',
        price: 5000000,
        description: 'Sản phẩm khắc tên riêng, vé mời tham dự sự kiện ra mắt.'
    }
];

const BackerPaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { id } = useParams()

    const project = location.state?.project || { projectName: "Dự án mẫu (Dev Mode)" };
    const { postData } = usePost()

    // STATES
    const [paymentType, setPaymentType] = useState<'donation' | 'reward'>('donation');
    const [selectedRewardId, setSelectedRewardId] = useState<string | null>(null);
    const [customAmount, setCustomAmount] = useState<string>('');
    const [finalAmount, setFinalAmount] = useState<number>(0);

    // Form data
    const [note, setNote] = useState('');
    const [address, setAddress] = useState('');

    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Tạo mã giao dịch: BK + Random
    const transactionCode = useMemo(() => {
        return `BK${GeneratedRandomCode()}`;
    }, []);

    // Cập nhật số tiền
    useEffect(() => {
        if (isConfirmed) return;

        if (paymentType === 'donation') {
            const val = parseInt(customAmount.replace(/\D/g, '')) || 0;
            setFinalAmount(val);
        } else {
            const pkg = MOCK_REWARD_PACKAGES.find(p => p.id === selectedRewardId);
            setFinalAmount(pkg ? pkg.price : 0);
        }
    }, [paymentType, customAmount, selectedRewardId, isConfirmed]);

    // Xử lý xác nhận (Hiện QR)
    const handleConfirmPayment = () => {
        if (paymentType === 'donation') {
            if (finalAmount < 10000) {
                toast.error("Số tiền ủng hộ tối thiểu là 10.000 VNĐ");
                return;
            }
        } else {
            if (!selectedRewardId) {
                toast.warning("Vui lòng chọn một gói quà");
                return;
            }
            if (!address.trim()) {
                toast.warning("Vui lòng nhập địa chỉ nhận quà");
                return;
            }
        }
        setIsConfirmed(true);
    };

    // --- LOGIC 1: GIẢ LẬP CHECK THANH TOÁN (15s) ---
    useEffect(() => {
        if (!isConfirmed || isSuccess) return;

        // Giả lập thời gian chờ 15s để người dùng quét mã
        const timer = setTimeout(() => {
            setIsSuccess(true);
            toast.success('Thanh toán thành công! Cảm ơn bạn đã ủng hộ.');
        }, 15000);

        return () => clearTimeout(timer);
    }, [isConfirmed, isSuccess]);

    // --- LOGIC 2: LƯU DATA SAU KHI THÀNH CÔNG ---
    useEffect(() => {
        const saveTransaction = async () => {
            try {
                // TODO: Gọi API backend lưu transaction tại đây
                // const payload = { 
                //    userId: user?._id, 
                //    projectId: project._id, 
                //    amount: finalAmount, 
                //    note, 
                //    address,
                //    transactionCode 
                // };
                // await postData('/transactions', payload);
                const res = await postData<IDonation>(`/donation`, {
                    amount: finalAmount,
                    projectId: id,
                    message: note
                })

                console.log("Đang lưu giao dịch cho user:", user?.userName);

                if (res) {
                    setTimeout(() => navigate(`/project-details/${id}`), 3000);
                }

            } catch (err) {
                toast.error("Lỗi lưu dữ liệu");
                console.error(err);
            }
        };

        if (isSuccess) {
            saveTransaction();
        }
    }, [isSuccess, navigate, user, finalAmount, note, address, transactionCode]);

    const paymentQR = `https://img.vietqr.io/image/OCB-CASS049204001504-qr-only.png?amount=${finalAmount}&addInfo=${transactionCode}&accountName=NGUYEN%20VIET%20NGUYEN`;

    return (
        <div className="min-h-screen bg-linear-to-b from-[black] via-[black] to-[#6c42b4] text-white font-sans">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-125 bg-gradient-radial from-purple-600/20 via-transparent to-transparent blur-3xl" />
            </div>

            <Header />
            <BaseTopBackground />

            <main className="relative z-10 container mx-auto px-4 py-16 pt-32">
                <h1 className="text-5xl font-bold text-center mb-2 bg-linear-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                    Ủng hộ dự án
                </h1>
                <p className="text-center text-xl mb-12 text-white/80 max-w-2xl mx-auto">
                    "{project.projectName}"
                </p>

                <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {/* LEFT COLUMN: SELECTION */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                            {/* Chọn loại ủng hộ */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <button
                                    onClick={() => { setPaymentType('donation'); setIsConfirmed(false); }}
                                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2
                                        ${paymentType === 'donation' ? 'border-cyan-400 bg-cyan-400/10 text-white' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}
                                >
                                    <Heart size={32} className={paymentType === 'donation' ? 'fill-red-500 text-red-500' : ''} />
                                    <span className="font-bold text-lg">Ủng hộ tuỳ tâm</span>
                                </button>
                                <button
                                    onClick={() => { setPaymentType('reward'); setIsConfirmed(false); }}
                                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2
                                        ${paymentType === 'reward' ? 'border-cyan-400 bg-cyan-400/10 text-white' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}
                                >
                                    <Gift size={32} className={paymentType === 'reward' ? 'fill-yellow-400 text-yellow-400' : ''} />
                                    <span className="font-bold text-lg">Chọn gói quà</span>
                                </button>
                            </div>

                            {/* Nội dung input */}
                            {paymentType === 'donation' ? (
                                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                                    <label className="block text-lg font-bold mb-2 text-cyan-200">Nhập số tiền muốn ủng hộ</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={customAmount ? Number(customAmount).toLocaleString('vi-VN') : ''}
                                            onChange={(e) => {
                                                setCustomAmount(e.target.value.replace(/\D/g, ''));
                                                setIsConfirmed(false);
                                            }}
                                            placeholder="Ví dụ: 50.000"
                                            className="w-full px-6 py-4 pl-6 pr-12 rounded-xl bg-white/5 border-2 border-white/20 text-white text-3xl font-bold focus:outline-none focus:border-cyan-400 transition-colors placeholder:text-gray-600"
                                        />
                                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">VNĐ</span>
                                    </div>
                                    <p className="text-sm text-gray-400 mt-2 italic">* Tối thiểu 10.000 VNĐ</p>
                                </div>
                            ) : (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                    {MOCK_REWARD_PACKAGES.map(pkg => (
                                        <div
                                            key={pkg.id}
                                            onClick={() => { setSelectedRewardId(pkg.id); setIsConfirmed(false); }}
                                            className={`p-4 rounded-xl border cursor-pointer flex justify-between items-center transition-all hover:bg-white/5
                                                ${selectedRewardId === pkg.id ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'bg-white/5 border-white/10'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
                                                    ${selectedRewardId === pkg.id ? 'border-cyan-400' : 'border-gray-500'}`}>
                                                    {selectedRewardId === pkg.id && <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full" />}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-lg text-white">{pkg.name}</h4>
                                                    <p className="text-sm text-gray-300">{pkg.description}</p>
                                                </div>
                                            </div>
                                            <span className="text-xl font-bold text-cyan-300 whitespace-nowrap ml-4">
                                                {pkg.price.toLocaleString('vi-VN')} đ
                                            </span>
                                        </div>
                                    ))}

                                    {/* Chỉ hiện ô nhập địa chỉ khi chọn gói quà */}
                                    {selectedRewardId && (
                                        <div className="mt-4 pt-4 border-t border-white/10 animate-in fade-in">
                                            <label className="block text-lg font-bold mb-2 flex items-center gap-2">
                                                <MapPin size={20} className="text-yellow-400" /> Địa chỉ nhận quà
                                            </label>
                                            <input
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                                placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành..."
                                                className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/20 text-white focus:outline-none focus:border-cyan-400"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Ô nhập lời chúc - Luôn hiển thị */}
                            <div className="mt-8 pt-6 border-t border-white/10">
                                <label className="block text-lg font-bold mb-2 flex items-center gap-2">
                                    <MessageSquareHeart size={20} className="text-pink-400" /> Lời nhắn gửi đến dự án
                                </label>
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Chúc dự án thành công rực rỡ..."
                                    rows={3}
                                    className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/20 text-white focus:outline-none focus:border-pink-400 resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: SUMMARY & QR */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 sticky top-32 shadow-2xl">
                            <h3 className="text-xl font-bold mb-4 border-b border-white/20 pb-4">Xác nhận đóng góp</h3>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-300">
                                    <span>Người ủng hộ:</span>
                                    <span className="font-semibold text-white text-right truncate max-w-[150px]">
                                        {user?.userName || "Ẩn danh"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-lg pt-2 border-t border-white/10">
                                    <span>Tổng cộng:</span>
                                    <span className="font-bold text-2xl text-cyan-400">{finalAmount.toLocaleString('vi-VN')} đ</span>
                                </div>
                            </div>

                            {isConfirmed ? (
                                <div className="mt-4 flex flex-col items-center animate-in zoom-in duration-300">
                                    <div className="bg-white p-3 rounded-xl shadow-lg relative">
                                        {isSuccess && (
                                            <div className="absolute inset-0 bg-white/95 z-10 flex flex-col items-center justify-center rounded-xl animate-in fade-in">
                                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                                                    <Check size={40} className="text-green-600" />
                                                </div>
                                                <span className="text-green-700 font-bold text-lg">Thành công!</span>
                                            </div>
                                        )}
                                        <img src={paymentQR} alt="VietQR" className="w-48 h-48 object-contain" />
                                    </div>

                                    {!isSuccess ? (
                                        <div className="mt-4 text-center w-full">
                                            <p className="text-sm text-gray-300 mb-2">Quét mã để thanh toán</p>

                                            <div className="bg-black/30 rounded-xl p-3 border border-white/5 mb-4 text-left">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-gray-400">Nội dung:</span>
                                                    <span className="font-mono text-yellow-400 font-bold">{transactionCode}</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-gray-400">Số tiền:</span>
                                                    <span className="font-bold text-white">{finalAmount.toLocaleString('vi-VN')} đ</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-center gap-2 text-cyan-300 text-sm animate-pulse">
                                                <Loader2 size={16} className="animate-spin" />
                                                Đang chờ xác nhận...
                                            </div>

                                            <button onClick={() => setIsConfirmed(false)} className="mt-4 text-xs text-red-400 hover:underline">
                                                Quay lại chỉnh sửa
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="text-green-400 font-medium animate-pulse mt-4">Đang chuyển hướng...</p>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={handleConfirmPayment}
                                    className="w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all hover:scale-105 bg-gradient-to-r from-cyan-600 to-blue-600 hover:shadow-cyan-500/50"
                                >
                                    Tiếp tục
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default BackerPaymentPage;