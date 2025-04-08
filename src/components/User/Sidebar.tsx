import React, { useState } from "react";
import { UnorderedListOutlined } from '@ant-design/icons';
import '../../App.scss'

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
    const menuItems = ["Dashboard", "Manage Task", "Profile", "Logout"];
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    return (
        <div className="sidebar">
            <div className="toggle-button" onClick={() => setIsSidebarVisible(!isSidebarVisible)}><UnorderedListOutlined /></div>
            <h2 className="sidebar-title">Dashboard</h2>
            <ul className={`sidebar-menu ${isSidebarVisible ? 'expanded' : 'collapsed'}`}>
                {menuItems.map((item) => (
                    <li
                        key={item}
                        onClick={() => setActiveTab(item)}
                        className={`sidebar-item ${activeTab === item ? "active" : ""}`}
                    >
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
