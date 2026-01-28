import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../components/ui/input-otp';
import { toast } from 'sonner';
import imgWhiteLogo1 from "/images/logo/project_logo.png";
import { usePost } from '../hooks/usePost';
import type { ResendOTP, VerifyOTP } from '../interface';
import { useAuth } from '../context/AuthContext';

const OTPVerifyPage = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const { otpVerify } = useAuth();

    const { postData } = usePost();
    const [searchParams] = useSearchParams();

    const email = localStorage.getItem('email') || '';
    const action = searchParams.get('action')

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCanResend(true);
        }
    }, [resendTimer]);

    const handleVerify = async () => {
        if (otp.length !== 6) {
            toast.error('Vui lòng nhập đầy đủ mã OTP');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const res = await postData<VerifyOTP>(`/auth/verify-otp?action=${action}`, { otp });
            if (!res) {
                setError('Invalid OTP. Please enter a valid OTP.!')
                return
            }
            if (res.action === 'forgotPassword') {
                const id = res.user._id
                localStorage.setItem('id', id)
                console.log("navigate to change password")
                navigate('/change-password');
                setLoading(false)
            }
            if (res.action === 'register') {
                localStorage.clear()
                localStorage.setItem('token', res.token)
                otpVerify(res.user)
                setLoading(false)
                navigate('/')
            }
            console.log("OTP verification successful:");
        } catch (err) {
            if (err instanceof Error) {
                toast.error("Mã OTP không hợp lệ! Vui lòng thử lại.");
                setLoading(false);
            }
        }

    }
    const handleResend = async () => {
        if (!canResend) return;
        setCanResend(false);
        setResendTimer(60);
        try {
            const res = await postData<ResendOTP>('/auth/send-otp', { email })
            if (!res) {
                setError('Resend Failed');
                return
            }
            const token = res.token;
            localStorage.setItem('token', token);
            localStorage.setItem('email', res.email)
            toast.success('Mã OTP mới đã được gửi đến email của bạn!');
            navigate('/verify-otp');
        } catch (err) {
            console.error(err)
        }

    };

    return (
        <div className="min-h-screen bg-linear-to-b from-[#111160] via-[#2a1a5e] to-black text-white flex items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-125 bg-gradient-radial from-purple-600/20 via-transparent to-transparent blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-150 h-150 bg-gradient-radial from-blue-500/10 via-transparent to-transparent blur-3xl" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <Link to="/" className="flex items-center justify-center gap-3 mb-8 hover:opacity-80 transition-opacity">
                    <div className="w-12 h-12 bg-linear-to-r from-cyan-300 via-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                        <img src={imgWhiteLogo1} alt="Fundtalk" className="w-8 h-8 object-contain" />
                    </div>
                    <span className="text-3xl font-bold">Fundtalk</span>
                </Link>

                {/* OTP Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-linear-to-r from-cyan-300 via-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Xác thực OTP</h1>
                        <p className="text-white/60">
                            Mã xác nhận đã được gửi đến
                        </p>
                        <p className="text-cyan-400 font-semibold">{email}</p>
                    </div>

                    <div className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm text-center">
                                {error}
                            </div>
                        )}

                        {/* OTP Input */}
                        <div className="flex justify-center">
                            <InputOTP
                                maxLength={6}
                                value={otp}
                                onChange={(value) => {
                                    setOtp(value);
                                    setError('');
                                }}
                            >
                                <InputOTPGroup className="gap-2">
                                    {[0, 1, 2, 3, 4, 5].map((index) => (
                                        <InputOTPSlot
                                            key={index}
                                            index={index}
                                            className="w-12 h-14 text-2xl font-bold bg-white/5 border-white/10 focus:border-cyan-400 focus:ring-cyan-400 rounded-xl"
                                        />
                                    ))}
                                </InputOTPGroup>
                            </InputOTP>
                        </div>

                        {/* Resend Timer */}
                        <div className="text-center">
                            {canResend ? (
                                <button
                                    onClick={handleResend}
                                    className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
                                >
                                    Gửi lại mã OTP
                                </button>
                            ) : (
                                <p className="text-white/60 text-sm">
                                    Gửi lại mã sau <span className="text-cyan-400 font-semibold">{resendTimer}s</span>
                                </p>
                            )}
                        </div>

                        {/* Verify Button */}
                        <button
                            onClick={handleVerify}
                            disabled={loading || otp.length !== 6}
                            className="w-full py-3 bg-linear-to-r from-cyan-300 via-blue-500 to-blue-600 rounded-xl font-bold shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? 'Đang xác thực...' : 'Xác nhận'}
                            {!loading && <ArrowRight className="w-5 h-5" />}
                        </button>

                        {/* Back Button */}
                        <Link
                            to={action === 'forgotPassword' ? '/forgot-password' : '/register'}
                            className="w-full py-3 bg-white/5 border border-white/10 rounded-xl font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Quay lại
                        </Link>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="mt-6 text-center">
                    <Link to="/" className="text-white/60 hover:text-white transition-colors text-sm">
                        ← Quay lại trang chủ
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default OTPVerifyPage;