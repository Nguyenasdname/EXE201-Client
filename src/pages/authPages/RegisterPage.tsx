import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import imgWhiteLogo1 from "/images/logo/project_logo.png";
import { usePost } from '../../hooks/usePost';
import { type Register } from '../../interface';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        userName: '',
        userEmail: '',
        userPhone: '',
        userPass: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { postData } = usePost()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.userPass !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        if (formData.userPass.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        setLoading(true);

        try {
            const res = await postData<Register>('/auth/register', {
                userName: formData.userName,
                userEmail: formData.userEmail,
                userPass: formData.userPass
            })

            if (!res) {
                setError('Server Error!')
                return
            }
            if (res.message === 'success') {
                localStorage.setItem('token', res.token)
                localStorage.setItem('email', res.email)
                navigate('/verify-otp?action=register')
            }
            if (res.message === 'failed' && res.errors) {
                toast.error(`${res.errors.userName || res.errors.userEmail}`)
                setLoading(false);
            }

        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            }
            toast.error('Đăng ký thất bại. Vui lòng thử lại.');
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

                {/* Register Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-2">Tạo tài khoản</h1>
                        <p className="text-white/60">Bắt đầu hành trình của bạn với Fundtalk</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-2">
                                Họ và tên
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    id="name"
                                    name="userName"
                                    type="text"
                                    value={formData.userName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Nguyễn Văn A"
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    id="email"
                                    name="userEmail"
                                    type="email"
                                    value={formData.userEmail}
                                    onChange={handleChange}
                                    required
                                    placeholder="example@fundtalk.com"
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        {/* Phone Field */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium mb-2">
                                Số điện thoại
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    id="phone"
                                    name="userPhone"
                                    type="tel"
                                    value={formData.userPhone}
                                    onChange={handleChange}
                                    required
                                    placeholder="0123456789"
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium mb-2">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    id="password"
                                    name="userPass"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.userPass}
                                    onChange={handleChange}
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                                Xác nhận mật khẩu
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-linear-to-r from-cyan-300 via-blue-500 to-blue-600 rounded-xl font-bold shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? 'Đang tạo tài khoản...' : 'Đăng ký'}
                            {!loading && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-white/60">
                            Đã có tài khoản?{' '}
                            <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                                Đăng nhập
                            </Link>
                        </p>
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

export default RegisterPage