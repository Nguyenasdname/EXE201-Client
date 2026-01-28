import { BrowserRouter, Route, Routes } from "react-router-dom"
import CreateProjectPage from "../pages/CreateProjectPage"
import PaymentPage from "../pages/PaymentPage"
import HomePage from "../pages/HomePage"
import LoginPage from "../pages/LoginPage"
import { AuthProvider } from '../context/AuthContext';
import RegisterPage from "../pages/RegisterPage"
import OTPVerifyPage from "../pages/VerifyOTP"
import ForgotPasswordPage from "../pages/ForgotPasswordPage"
import ChangePasswordPage from "../pages/ChangePasswordPage"
import ScrollToTop from "../components/ScrollToTop"
import ProjectDetailPage from "../pages/ProjectDetailsPage"

const AppRouter = () => {
    return (
        <BrowserRouter>
        <ScrollToTop />
            <AuthProvider>
                <Routes>
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/verify-otp" element={<OTPVerifyPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/change-password" element={<ChangePasswordPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/" element={<HomePage />} />
                    <Route path="/create-project" element={<CreateProjectPage />} />
                    <Route path='/payment' element={<PaymentPage />} />
                    <Route path="/project-details" element={<ProjectDetailPage />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default AppRouter