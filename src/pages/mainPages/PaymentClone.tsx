import Header from '../../components/main/Header';
import Footer from "../../components/main/Footer";
import BaseTopBackground from "../../layouts/BaseTopBackground";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { toast } from 'react-toastify';
import { GeneratedRandomCode } from '../../constants/GeneratedRandomCode';
import { usePost } from '../../hooks/usePost';
import { Check, ShieldCheck, CreditCard, ArrowRight, Loader2 } from 'lucide-react';
import { useGet } from "../../hooks/useGet";
import { type projectPackage } from '../../interface';

const PaymentClone = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { postData } = usePost();

    // Lấy dữ liệu project từ các bước trước
    const projectDataFromState = location.state || {};
    const packageId = projectDataFromState.selectedPackage;

    // Gọi API lấy thông tin gói
    const { data: packageData } = useGet<projectPackage>(`/projectPackage/${packageId}`);

    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false); // Trạng thái đang lưu data

    // Tạo mã giao dịch ngẫu nhiên
    const transactionCode = useMemo(() => `PAY ${GeneratedRandomCode()}`, []);

    // Số tiền cần thanh toán
    const amount = packageData?.price || 0;

    // --- LOGIC 1: GIẢ LẬP CHECK THANH TOÁN (Tự động thành công sau 15s) ---
    useEffect(() => {
        if (!isConfirmed || isSuccess) return;

        // Giả lập thời gian chờ người dùng quét mã và hệ thống check (15 giây)
        const timer = setTimeout(() => {
            setIsSuccess(true);
            toast.success('Thanh toán thành công!');
        }, 15000); // 15s

        return () => clearTimeout(timer);
    }, [isConfirmed, isSuccess]);


    // --- LOGIC 2: LƯU DỰ ÁN SAU KHI THANH TOÁN THÀNH CÔNG ---
    const handleCreateNewProject = async () => {
        setIsProcessing(true);
        try {
            const data = new FormData();

            // Append các trường text
            Object.entries(projectDataFromState).forEach(([key, value]) => {
                if (Array.isArray(value)) return; // Bỏ qua mảng (xử lý riêng bên dưới)
                if (key === 'selectedPackage') return; // Bỏ qua ID gói nếu không cần gửi lên
                if (value !== null && value !== undefined) {
                    data.append(key, String(value));
                }
            });

            // Append Package ID (nếu backend cần)
            if (packageId) data.append('projectPackageId', packageId);
            // Append Transaction Code
            data.append('transactionCode', transactionCode);

            // Append File (Brand Images)
            if (Array.isArray(projectDataFromState.brandImage)) {
                projectDataFromState.brandImage.forEach((file: File) => {
                    data.append('brandImage', file);
                });
            }

            // Append File (Activity Images)
            if (Array.isArray(projectDataFromState.activityImage)) {
                projectDataFromState.activityImage.forEach((file: File) => {
                    data.append('activityImage', file);
                });
            }

            // Gọi API tạo dự án
            await postData('/project', data);

            toast.success("Khởi tạo dự án thành công!");

            // Chuyển hướng sau 2s
            setTimeout(() => {
                navigate('/'); // Hoặc chuyển về trang quản lý dự án
            }, 2000);

        } catch (err: unknown) {
            setIsProcessing(false); // Cho phép thử lại nếu lỗi
            if (err instanceof Error) {
                console.log(err)
                toast.error(err.message);
            } else {
                toast.error('Có lỗi xảy ra khi tạo dự án');
            }
            console.error(err);
        }
    };

    // Tự động gọi hàm tạo dự án khi isSuccess = true
    useEffect(() => {
        if (isSuccess) {
            handleCreateNewProject();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess]);


    const paymentQR = `https://img.vietqr.io/image/OCB-CASS049204001504-qr-only.png?amount=${amount}&addInfo=${transactionCode}&accountName=NGUYEN%20VIET%20NGUYEN`;

    if (!packageData) return <div className="min-h-screen bg-black flex items-center justify-center text-white"><Loader2 className="animate-spin mr-2" /> Đang tải thông tin...</div>;

    return (
        <div className="min-h-screen bg-linear-to-b from-[black] via-[#1a1a2e] to-[#0f0c29] text-white font-sans">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-150 h-150 bg-blue-600/10 blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-150 h-150 bg-purple-600/10 blur-[100px]" />
            </div>

            <Header />
            <BaseTopBackground />

            <main className="relative z-10 container mx-auto px-4 py-16 pt-32">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-4xl font-bold text-center mb-4 text-white">Thanh toán dịch vụ</h1>
                    <p className="text-center text-gray-400 mb-12">Hoàn tất thanh toán để kích hoạt dự án của bạn</p>

                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* LEFT: Package Info */}
                        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-cyan-500/20 rounded-xl">
                                    <ShieldCheck className="text-cyan-400 w-8 h-8" />
                                </div>
                                <h2 className="text-2xl font-bold">Thông tin gói</h2>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                                    <h3 className="text-xl font-bold text-cyan-300 mb-2">{packageData.packageName}</h3>
                                    <p className="text-gray-400 text-sm mb-4">{packageData.packageTitle}</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold text-white">{packageData.price.toLocaleString('vi-VN')}</span>
                                        <span className="text-gray-400">VNĐ</span>
                                    </div>
                                </div>

                                <div className="space-y-3 text-gray-300 text-sm">
                                    <div className="flex justify-between">
                                        <span>Giá gói:</span>
                                        <span>{packageData.price.toLocaleString('vi-VN')} đ</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>VAT (0%):</span>
                                        <span>0 đ</span>
                                    </div>
                                    <div className="border-t border-white/10 pt-3 flex justify-between text-lg font-bold text-white">
                                        <span>Tổng thanh toán:</span>
                                        <span className="text-cyan-400">{amount.toLocaleString('vi-VN')} đ</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Payment Action */}
                        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-purple-500/20 rounded-xl">
                                    <CreditCard className="text-purple-400 w-8 h-8" />
                                </div>
                                <h2 className="text-2xl font-bold">Thanh toán</h2>
                            </div>

                            {/* Step 1: Confirmation */}
                            {!isConfirmed ? (
                                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                    <p className="text-gray-300 mb-6">
                                        Vui lòng xác nhận thông tin trước khi lấy mã QR.
                                    </p>
                                    <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl mb-8 flex gap-3 items-start">
                                        <div className="mt-1 w-2 h-2 rounded-full bg-yellow-500 shrink-0" />
                                        <p className="text-xs text-yellow-200 leading-relaxed">
                                            Sau khi nhấn xác nhận, mã QR sẽ hiển thị. Hệ thống sẽ tự động kích hoạt dự án sau khi bạn thanh toán.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setIsConfirmed(true)}
                                        className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-lg shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                                    >
                                        Xác nhận & Hiển thị QR <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            ) : (
                                /* Step 2: QR Code & Check */
                                <div className="flex flex-col items-center animate-in zoom-in duration-300">
                                    <div className="bg-white p-3 rounded-2xl shadow-lg relative mb-6">
                                        {isSuccess && (
                                            <div className="absolute inset-0 bg-white/95 z-10 flex flex-col items-center justify-center rounded-2xl animate-in fade-in">
                                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                                                    <Check size={40} className="text-green-600" />
                                                </div>
                                                <span className="text-green-700 font-bold text-xl">Thành công!</span>
                                            </div>
                                        )}
                                        <img src={paymentQR} alt="VietQR" className="w-56 h-56 object-contain" />
                                    </div>

                                    {!isSuccess ? (
                                        <div className="text-center w-full">
                                            <p className="font-bold text-lg text-white mb-1">Quét mã VietQR</p>
                                            <p className="text-sm text-gray-400 mb-4">Sử dụng App ngân hàng để thanh toán</p>

                                            <div className="bg-black/30 rounded-xl p-4 border border-white/5 mb-4">
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span className="text-gray-400">Nội dung:</span>
                                                    <span className="font-mono text-yellow-400 font-bold select-all">{transactionCode}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-400">Số tiền:</span>
                                                    <span className="font-bold text-white">{amount.toLocaleString('vi-VN')} đ</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-center gap-2 text-cyan-300 text-sm animate-pulse mb-6">
                                                <Loader2 size={16} className="animate-spin" />
                                                Hệ thống đang kiểm tra giao dịch...
                                            </div>

                                            <button
                                                onClick={() => setIsConfirmed(false)}
                                                className="text-xs text-red-400 hover:text-red-300 underline cursor-pointer"
                                            >
                                                Quay lại bước trước
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-center animate-in fade-in slide-in-from-bottom-2">
                                            <p className="text-green-400 font-medium mb-2">Giao dịch hoàn tất!</p>
                                            {isProcessing && (
                                                <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
                                                    <Loader2 size={14} className="animate-spin" />
                                                    Đang khởi tạo dự án...
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default PaymentClone;