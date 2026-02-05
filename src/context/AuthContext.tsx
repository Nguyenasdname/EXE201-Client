import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Login, IUser, Register } from '../interface';
import { usePost } from '../hooks/usePost';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
    user: IUser | null;
    login: (email: string, password: string) => Promise<boolean>;
    otpVerify: (user: IUser) => void
    register: (name: string, email: string, password: string, phone: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);
    const { postData } = usePost()
    const navigate = useNavigate()
    useEffect(() => {
        // Kiểm tra localStorage
        const storedUser = localStorage.getItem('fundtalk_user');

        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                // Cập nhật User NGAY LẬP TỨC, không dùng startTransition
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setUser(parsed);
            } catch (err) {
                console.error("Auth Init Error:", err);
                localStorage.removeItem('fundtalk_user');
            }
        }

        // Tắt loading. 
        // Trong React 18, setUser ở trên và setLoading ở dưới sẽ được "Batch" (gộp) lại 
        // thành 1 lần render duy nhất -> Đảm bảo khi loading=false thì user đã có dữ liệu.
        setLoading(false);
    }, []);

    const otpVerify = (user: IUser) => {
        setUser(user)
        localStorage.setItem('fundtalk_user', JSON.stringify(user))
    }

    const login = async (email: string, password: string): Promise<boolean> => {
        localStorage.clear()
        try {
            const res = await postData<Login>("/auth/login", {
                loginId: email.toLowerCase(),
                userPass: password
            })

            if (res.token) {
                localStorage.setItem('token', res.token)
            }
            if (res.user) {
                setUser(res.user)
                localStorage.setItem('fundtalk_user', JSON.stringify(res.user))
                return true
            }
        } catch (err) {
            if (err instanceof Error) {
                toast.error(err.message)
            }
        }
        return false;
    };

    const register = async (name: string, email: string, password: string, phone: string): Promise<boolean> => {
        try {
            const res = await postData<Register>('/auth/register', {
                userName: name,
                userEmail: email,
                userPass: password,
                userPhone: phone
            })

            if (!res) {
                toast.error('Server Error!')
                return false
            }
            localStorage.setItem('token', res.token)
            localStorage.setItem('email', res.email)
        } catch (err) {
            if (err instanceof Error) {
                toast.error(err.message)
            }
        }
        return true;
    };

    const logout = () => {
        navigate('/')
        setUser(null);
        localStorage.removeItem('fundtalk_user');
        localStorage.removeItem('token')
    };

    // QUAN TRỌNG: Return null để chặn render AppRouter khi chưa load xong user
    if (loading) {
        // Bạn có thể thay bằng 1 cái Spinner đẹp đẹp ở giữa màn hình
        return <div className="min-h-screen flex items-center justify-center bg-[#05050A] text-white">Loading...</div>;
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                otpVerify,
                register,
                logout,
                isAuthenticated: !!user,
                isLoading: loading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}