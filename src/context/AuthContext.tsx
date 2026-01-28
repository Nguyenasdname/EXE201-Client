import { createContext, useContext, useState, useEffect, type ReactNode, startTransition } from 'react';
import type { Login, User, Register } from '../interface';
import { usePost } from '../hooks/usePost';
import { toast } from 'react-toastify';


interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    otpVerify: (user: User) => void
    register: (name: string, email: string, password: string, phone: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const { postData } = usePost()

    useEffect(() => {
        const storedUser = localStorage.getItem('fundtalk_user');
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                startTransition(() => {
                    setUser(parsed);
                });
            } catch (err) {
                if (err instanceof Error) {
                    toast.error(err.message)
                }
                localStorage.removeItem('fundtalk_user');
            }
        }
    }, []);

    const otpVerify = (user: User) => {
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
        setUser(null);
        localStorage.removeItem('fundtalk_user');
        localStorage.removeItem('token')
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                otpVerify,
                register,
                logout,
                isAuthenticated: !!user
            }
            }
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
