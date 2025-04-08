import React, { useState } from 'react';
import { Modal } from 'antd';
import Sidebar from "../components/Admin/Sidebar";
import Dashboard from "../components/Admin/Dashboard";
import CreateUser from "../components/Admin/CreateUser";
import ManageTask from "../components/Admin/ManageTask";
import CreateTask from '../components/Admin/TaskManagement/CreateTask';
import AssignedTask from '../components/Admin/TaskManagement/AssignedTask';
import DeletedTask from '../components/Admin/TaskManagement/DeletedTask';
import AdminUser from '../components/Admin/UserManagement/AdminUserManage';
import RegularUser from '../components/Admin/UserManagement/RegularUserManage';
import '../App.scss'

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState("Dashboard");

    const handleLogout = () => {
        Modal.confirm({
            title: 'Are you sure you want to logout?',
            content: 'You will be logged out and your session will be terminated.',
            okText: 'Yes',
            cancelText: 'No',
            onOk: () => {
                localStorage.clear();
                window.location.reload();
            },
            onCancel: () => {
                window.location.reload();
            }
        });
    };

    const renderComponent = () => {
        switch (activeTab) {
            case "Create User":
                return <CreateUser />;
            case "Manage Task":
                return <ManageTask />;
            case "Create Task":
                return <CreateTask />;
            case "Assign Task":
                return <AssignedTask />;
            case "Delete Task":
                return <DeletedTask />;
            case "Admin User":
                return <AdminUser />;
            case "Regular User":
                return <RegularUser />;
            case "Logout":
                handleLogout();
                return null;
            default:
                return <Dashboard />;
        }
    };
    return (
        <>
            <div className="main-container">
                <div className='inside-container'>
                    <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                    <div className="content">{renderComponent()}</div>
                </div>
            </div>
        </>
    );
}

export default AdminDashboard;