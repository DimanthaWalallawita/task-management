import React, { useState } from 'react';
import { Modal } from 'antd';
import Sidebar from "../components/User/Sidebar";
import Dashboard from "../components/User/Dashboard";
import ManageTask from "../components/User/ManageTask";
import Profile from "../components/User/Profile";
import '../App.scss';

const UserDashboard: React.FC = () => {
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
            case "Manage Task":
                return <ManageTask />;
            case "Profile":
                return <Profile />;
            case "Logout":
                handleLogout();
                return null;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="main-container">
            <div className='inside-container'>
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className="content">{renderComponent()}</div>
            </div>
        </div>
    );
};

export default UserDashboard;
