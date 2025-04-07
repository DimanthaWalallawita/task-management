import React, { useState } from "react";
import { UnorderedListOutlined } from '@ant-design/icons';
import '../../App.scss'

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
    const menuItems = ["Dashboard", "Create User", "Manage Users", "Manage Task"];
    const [isSubMenuVisible, setIsSubMenuVisible] = useState(false);
    const [isManageUserSubMenuVisible, setIsManageUserSubMenuVisible] = useState(false);
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    const subMenuItems = ["Create Task", "Assign Task"];
    const UserSubMenuItems = ["Admin User", "Regular User"];

    const handleManageTaskClick = () => {
        setIsSubMenuVisible(!isSubMenuVisible);
    };

    const handleManageUserClick = () => {
        setIsManageUserSubMenuVisible(!isManageUserSubMenuVisible);
    };

    return (
        <div className="sidebar">
            <div className="toggle-button" onClick={() => setIsSidebarVisible(!isSidebarVisible)}><UnorderedListOutlined /></div>
            <h2 className="sidebar-title">Dashboard</h2>
            <ul className={`sidebar-menu ${isSidebarVisible ? 'expanded' : 'collapsed'}`}>
                {menuItems.map((item) => (
                    <li
                        key={item}
                        onClick={() => {
                            if (item === "Manage Task") {
                                handleManageTaskClick();
                            } else if (item === "Manage Users") {
                                handleManageUserClick();
                            } else {
                                setActiveTab(item);
                            }
                        }}
                        className={`sidebar-item ${activeTab === item ? "active" : ""}`}
                    >
                        {item}
                        {item === "Manage Task" && isSubMenuVisible && (
                            <ul className="sub-menu">
                                {subMenuItems.map((subItem) => (
                                    <li
                                        key={subItem}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveTab(subItem);
                                        }}
                                        className={`sub-menu-item ${activeTab === subItem ? "active" : ""}`}
                                    >
                                        {subItem}
                                    </li>
                                ))}
                            </ul>
                        )}

                        {item === "Manage Users" && isManageUserSubMenuVisible && (
                            <ul className="sub-menu">
                                {UserSubMenuItems.map((subItem) => (
                                    <li
                                        key={subItem}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveTab(subItem);
                                        }}
                                        className={`sub-menu-item ${activeTab === subItem ? "active" : ""}`}
                                    >
                                        {subItem}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
