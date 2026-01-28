import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import imgWhiteLogo1 from "/images/logo/project_logo.png";
import { toast } from 'react-toastify';
import type { ForgotPassword } from '../interface';
import { usePost } from '../hooks/usePost';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const { postData } = usePost();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!email) {
            setError('Missing Field');
            return
        }
        try {
            setLoading(true);
            const res = await postData<ForgotPassword>(`/auth/send-otp?action=forgotPassword`, {
                email: email
            })
            if (!res) {
                toast.error('Không tìm thấy email!');
                return
            }
            setSuccess(true);
            setLoading(false);
            const token = res.token;
            localStorage.setItem('token', token);
            localStorage.setItem('email', res.email)
            navigate(`/verify-otp?action=forgotPassword`);

        } catch (err) {
            console.error(err)
            setError('Email không tồn tại trong hệ thống');
            setLoading(false);
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

                {/* Forgot Password Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-linear-to-r from-cyan-300 via-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Quên mật khẩu?</h1>
                        <p className="text-white/60">
                            Nhập email của bạn và chúng tôi sẽ gửi mã xác nhận để đặt lại mật khẩu
                        </p>
                    </div>

                    {!success ? (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="example@fundtalk.com"
                                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-linear-to-r from-cyan-300 via-blue-500 to-blue-600 rounded-xl font-bold shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? 'Đang gửi...' : 'Gửi mã xác nhận'}
                                {!loading && <ArrowRight className="w-5 h-5" />}
                            </button>

                            {/* Back to Login */}
                            <Link
                                to="/login"
                                className="w-full py-3 bg-white/5 border border-white/10 rounded-xl font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Quay lại đăng nhập
                            </Link>
                        </form>
                    ) : (
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold">Đã gửi!</h2>
                            <p className="text-white/60">
                                Mã xác nhận đã được gửi đến email <span className="text-cyan-400 font-semibold">{email}</span>
                            </p>
                            <p className="text-sm text-white/40">
                                Đang chuyển hướng đến trang xác nhận...
                            </p>
                        </div>
                    )}
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
export default ForgotPasswordPage;