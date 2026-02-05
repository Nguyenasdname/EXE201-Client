import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import CreateProjectPage from "../pages/mainPages/CreateProjectPage"
// import PaymentPage from "../pages/mainPages/PaymentPage"
import HomePage from "../pages/mainPages/HomePage"
import LoginPage from "../pages/authPages/LoginPage"
import { AuthProvider } from '../context/AuthContext';
import RegisterPage from "../pages/authPages/RegisterPage"
import OTPVerifyPage from "../pages/authPages/VerifyOTP"
import ForgotPasswordPage from "../pages/authPages/ForgotPasswordPage"
import ChangePasswordPage from "../pages/authPages/ChangePasswordPage"
import ScrollToTop from "../components/main/ScrollToTop"
import ProjectDetailPage from "../pages/mainPages/ProjectDetailsPage"
import AdminLayout from "../layouts/AdminLayout"
import ProtectedRoute from "../layouts/ProtectedRouter"
import DashboardPage from "../pages/admin/DashboardPage"
import UserManagerPage from "../pages/admin/UserManagerPage"
import TransactionManagerPage from "../pages/admin/TransactionManagerPage"
import ReportPage from "../pages/admin/ReportPage"
import AdminProjectManagerPage from "../pages/admin/AdminProjectManagerPage"
import ProjectManagerPage from "../pages/mainPages/ProjectManagerPage"
import BackerPaymentPage from "../pages/mainPages/BackerPaymentPage"
import PaymentClone from "../pages/mainPages/PaymentClone"

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
                    <Route path="/create-project" element={<ProtectedRoute><CreateProjectPage /></ProtectedRoute>} />
                    {/* <Route path='/payment' element={<ProtectedRoute><PaymentPage /></ProtectedRoute>}/> */}
                    <Route path='/payment' element={<ProtectedRoute><PaymentClone /></ProtectedRoute>} />
                    <Route path='/project-manager' element={<ProtectedRoute><ProjectManagerPage /></ProtectedRoute>} />
                    <Route path="/project-details/:id" element={<ProjectDetailPage />} />
                    <Route path="/payment-backer/:id" element={<BackerPaymentPage />} />
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <AdminLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<DashboardPage />} />
                        <Route path="admin-projects-manager" element={<AdminProjectManagerPage />} />
                        <Route path="users-manager" element={<UserManagerPage />} />
                        <Route path="transactions-manager" element={<TransactionManagerPage />} />
                        <Route path="reports-manager" element={<ReportPage />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default AppRouter