import { useState } from 'react';
import { Outlet} from 'react-router-dom';
import AdminSideBar from '../components/admin/AdminSideBar'; // Đường dẫn tới file sidebar của bạn

const AdminLayout = () => {
    const [activeTab, setActiveTab] = useState('projects');
    return (
        <div className="flex h-screen bg-[#05050A] overflow-hidden">
            <AdminSideBar activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="flex-1  overflow-y-auto h-screen">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;