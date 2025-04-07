import React, { useState } from 'react';
import Sidebar from "../components/User/Sidebar";
import Dashboard from "../components/User/Dashboard";
import ManageTask from "../components/User/ManageTask";
import Profile from "../components/User/Profile";
import '../App.scss'

const UserDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState("Dashboard");

    const renderComponent = () => {
        switch (activeTab) {
            case "Manage Task":
                return <ManageTask />;
            case "Profile":
                return <Profile />
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

export default UserDashboard;