import Header from '../../components/main/Header';
import Footer from "../../components/main/Footer";
import BaseTopBackground from "../../layouts/BaseTopBackground";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGet } from "../../hooks/useGet";
import axios from 'axios';
import { toast } from 'react-toastify';
import { type projectPackage } from '../../interface';
import { GeneratedRandomCode } from '../../constants/GeneratedRandomCode';
import { usePost } from '../../hooks/usePost';

const PaymentPage = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const project = location.state
    const { data: packageData } = useGet<projectPackage>(`/projectPackage/${project.selectedPackage}`)
    const { postData } = usePost();
    const amount = packageData?.price as number
    const infor = useMemo(() => {
        return `${GeneratedRandomCode()}`
    }, [])
    const [isSuccess, setIsSuccess] = useState(false)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const checkPaid = async (amount: number, infor: string) => {
        if (isSuccess) return
        try {
            const response = await axios.get(
                'https://script.google.com/macros/s/AKfycbxHT2rsbazaMghhZJHZdtb1aXDnTmIBEFMN2ndH4cgKRg0JHS_dgVR8sLwJbvqaqWc9/exec'
            )
            console.log(`1: ${isSuccess}`)
            console.log(`Tien dau vao: ${amount} + ${infor}`)
            const lastPaid = await response.data.data[response.data.data.length - 1]
            const paidInfor: string = lastPaid["Mô tả"]
            const paidAmount: number = lastPaid["Giá trị"]
            console.log(`${paidInfor} + ${paidAmount}`)
            if (paidAmount >= amount && paidInfor.includes(infor)) {
                setIsSuccess(true)
                toast.success('Thanh toan thanh cong')
                if (intervalRef.current) {
                    clearInterval(intervalRef.current)
                    intervalRef.current = null;
                }
            }
        } catch (err) {
            if(err instanceof Error){
                toast.error(err.message)
            }
            console.error(err)
        }
    }

    const handleCreateNewProject = async () => {
        const data = new FormData()

        Object.entries(project).forEach(([key, value]) => {
            if (Array.isArray(value)) return
            if (value !== null && value !== undefined) {
                data.append(key, String(value))
            }
        })

        project.brandImage.forEach((file: File) => {
            data.append('brandImage', file)
        })
        project.activityImage.forEach((file: File) => {
            data.append('activityImage', file)
        })

        const res = await postData('/project', data)
        return res
    }


    useEffect(() => {
        if (!packageData || isSuccess) return
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(() => {
            checkPaid(amount, infor);
        }, 3000);
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [packageData, amount, infor])

    useEffect(() => {
        const createProject = async () => {
            try {
                await handleCreateNewProject()
                navigate('/')
            } catch (err: unknown) {
                if (err instanceof Error) {
                    toast.error(err.message)
                } else {
                    toast.error('Unexpected error')
                }
            }
        }

        if (isSuccess) {
            createProject()
        }
    }, [isSuccess])

    const paymentQR = `https://img.vietqr.io/image/OCB-CASS049204001504-qr-only.png?amount=${amount}&addInfo=${infor}&accountName=NGUYEN%20VIET%20NGUYEN`

    return (
        <>
            <div className="min-h-screen bg-linear-to-b from-[black] via-[black] to-[#6c42b4] text-white">
                {/* Background decorative elements */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-125 bg-gradient-radial from-purple-600/20 via-transparent to-transparent blur-3xl" />
                    <div className="absolute top-0 right-1/4 w-150 h-150 bg-gradient-radial from-blue-500/10 via-transparent to-transparent blur-3xl" />
                </div>

                {/* Header */}
                <Header />
                <BaseTopBackground />
                {/* Main Content */}
                <main className="relative z-10 container mx-auto px-4 py-16">

                    {/* Page Title */}
                    <h1 className="text-6xl font-bold text-center mt-10 mb-4 bg-linear-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                        Giao dịch
                    </h1>
                    <p className="text-center text-2xl mb-12 text-white/80">
                        Minh bạch từng giao dịch – Vững bước cùng khởi nghiệp
                    </p>

                    {/* Form and Summary Grid */}
                    <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {/* Form Section - 2 columns */}
                        <div className="lg:col-span-2 bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Name Field */}
                                <div>
                                    <label className="block text-2xl font-bold italic mb-3">Họ và tên</label>
                                    <input
                                        type="text"
                                        placeholder="Nguyễn Minh Trí"
                                        className="w-full px-6 py-4 rounded-xl bg-white border-2 border-purple-200 text-gray-600 text-xl placeholder:text-gray-400 focus:outline-none focus:border-cyan-400 transition-colors"
                                    />
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label className="block text-2xl font-bold italic mb-3">Email</label>
                                    <input
                                        type="email"
                                        placeholder="minhitran@example.com"
                                        className="w-full px-6 py-4 rounded-xl bg-white border-2 border-purple-200 text-gray-600 text-xl placeholder:text-gray-400 focus:outline-none focus:border-cyan-400 transition-colors"
                                    />
                                </div>

                                {/* Phone Field */}
                                <div>
                                    <label className="block text-2xl font-bold italic mb-3">Số điện thoại</label>
                                    <input
                                        type="tel"
                                        placeholder="0909 123 456"
                                        className="w-full px-6 py-4 rounded-xl bg-white border-2 border-purple-200 text-gray-600 text-xl placeholder:text-gray-400 focus:outline-none focus:border-cyan-400 transition-colors"
                                    />
                                </div>

                                {/* Address Field */}
                                <div>
                                    <label className="block text-2xl font-bold italic mb-3">Địa chỉ</label>
                                    <input
                                        type="text"
                                        placeholder="24 Nguyễn Thái Học, Hội An, Việt Nam"
                                        className="w-full px-6 py-4 rounded-xl bg-white border-2 border-purple-200 text-gray-600 text-xl placeholder:text-gray-400 focus:outline-none focus:border-cyan-400 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Payment Method Section */}
                            <div className="mt-8">
                                <h3 className="text-2xl font-bold italic mb-4">Phương thức thanh toán</h3>

                                {/* <div className="grid md:grid-cols-2 gap-6">
                              
                                    <div>
                                        <label className="block text-2xl font-bold italic mb-3">Số thẻ</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Số"
                                                className="w-full px-6 py-4 rounded-xl bg-white border-2 border-purple-200 text-gray-600 text-xl placeholder:text-gray-400 focus:outline-none focus:border-cyan-400 transition-colors"
                                            />
                                     
                                            <div className="flex gap-2 mt-2">
                                                <div className="w-12 h-8 bg-white rounded border border-gray-200 flex items-center justify-center overflow-hidden">
                                                    <svg className="w-10 h-6" fill="none" viewBox="0 0 51.9062 34.4062">
                                                        <path d={svgPaths.p3b134a00} fill="white" stroke="black" strokeOpacity="0.2" strokeWidth="0.5" />
                                                        <path d={svgPaths.p2cf76d00} fill="#171E6C" />
                                                    </svg>
                                                </div>
                                                <div className="w-12 h-8 bg-white rounded border border-gray-200 flex items-center justify-center overflow-hidden">
                                                    <svg className="w-10 h-6" fill="none" viewBox="0 0 53.2609 35">
                                                        <path d={svgPaths.p35788000} fill="#252525" />
                                                        <path d={svgPaths.p32f85000} fill="#EB001B" />
                                                        <path d={svgPaths.p1762f6c0} fill="#F79E1B" />
                                                        <path d={svgPaths.p21f31a00} fill="#FF5F00" fillRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div className="w-12 h-8 bg-white rounded border border-gray-200 flex items-center justify-center overflow-hidden">
                                                    <svg className="w-10 h-6" fill="none" viewBox="0 0 53.2609 35">
                                                        <path d={svgPaths.p35788000} fill="#016FD0" />
                                                    </svg>
                                                </div>
                                                <div className="w-12 h-8 bg-white rounded border border-gray-200 flex items-center justify-center overflow-hidden">
                                                    <svg className="w-10 h-6" fill="none" viewBox="0 0 52.2032 35.4998">
                                                        <path d={svgPaths.p2b3b9a00} fill="white" stroke="black" strokeOpacity="0.2" strokeWidth="0.5" />
                                                        <path d={svgPaths.pbd5400} fill="#F27712" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                              
                                    <div>
                                        <label className="block text-2xl font-bold italic mb-3">Lấy mã chuyển khoản</label>
                                        <button className="w-full px-6 py-4 rounded-xl bg-white border-4 border-cyan-400 text-xl font-medium bg-gradient-to-r from-cyan-300 to-blue-600 bg-clip-text text-transparent hover:border-cyan-500 transition-colors">
                                            Nhấp vào để nhận mã
                                        </button>
                                    </div>
                                </div> */}
                                <div className="flex flex-col items-center ">
                                    <div className="w-80 h-80 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-cyan-400">
                                        {/* QR Code Placeholder */}
                                        <img src={paymentQR} />
                                    </div>
                                    <p className="text-white text-center mt-4">Quét mã để thanh toán</p>
                                </div>
                            </div>
                        </div>

                        {/* Summary Section - 1 column */}
                        <div className="space-y-6">
                            {/* Voucher Card */}
                            {/* <div className="relative bg-white/20 backdrop-blur-md rounded-3xl overflow-hidden border border-white/30 shadow-xl">
                                <div className="absolute inset-0 opacity-30">
                                    <img src={imgQCb7440AaPng} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="relative p-6">
                           
                                    <div className="relative h-64 mb-4 rounded-2xl overflow-hidden">
                                        <div
                                            className="absolute inset-0 bg-black rounded-2xl"
                                            style={{
                                                maskImage: `url('${imgImage12}')`,
                                                maskSize: 'cover',
                                                WebkitMaskImage: `url('${imgImage12}')`,
                                                WebkitMaskSize: 'cover'
                                            }}
                                        >
                                            <img src={imgImage13} alt="Voucher" className="w-full h-full object-cover" />
                                        </div>
                                    </div>

                            
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold">Gói tiên phong trải nghiệm</h3>
                                        </div>
                                        <p className="font-bold text-sm">Chỉ từ: 2.000.000 VND</p>
                                    </div>
                                </div>
                            </div> */}

                            {/* Price Summary */}
                            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                                <h3 className="text-xl font-bold mb-4">Tóm tắt hóa đơn</h3>

                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span>{packageData?.packageName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Vat</span>
                                        <span>Ưu đãi</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tạm tính</span>
                                        <span>{packageData?.price.toLocaleString("vi-VN")} VND</span>
                                    </div>

                                    <div className="border-t border-white/30 pt-3 mt-3">
                                        <div className="flex justify-between font-bold text-xl">
                                            <span>Tổng</span>
                                            <span>{packageData?.price.toLocaleString("vi-VN")} VND</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <Footer />
            </div>
        </>
    )
}

export default PaymentPage