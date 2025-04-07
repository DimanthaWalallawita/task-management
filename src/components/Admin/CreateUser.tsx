import React, { useState } from "react";
import { Button } from "antd";
import { UserOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import AddUser from "./AddUser";
import AddAdmin from "./AddAdmin";

const CreateUser: React.FC = () => {
    const [selectedUserType, setSelectedUserType] = useState<String>("");

    const handleButtonClick = (type: string) => {
        setSelectedUserType(type);
    };

    return (
        <div className="user">
            <div className="left-user">
                <div
                    className="user-button"
                    onClick={() => handleButtonClick("admin")}
                    style={{
                        backgroundColor: selectedUserType === "admin" ? '#1abc9c' : '#0a1a3d',
                        color: selectedUserType === "admin" ? '#fff' : '#fff',
                    }}
                >
                    <Button type="default" style={{ borderRadius: '50%' }}>
                        <UserOutlined />
                    </Button>
                    <label>Create Admin</label>
                </div>

                <div
                    className="user-button"
                    onClick={() => handleButtonClick("user")}
                    style={{
                        backgroundColor: selectedUserType === "user" ? '#1abc9c' : '#0a1a3d',
                        color: selectedUserType === "user" ? '#fff' : '#fff',
                    }}
                >
                    <Button type="default" style={{ borderRadius: '50%' }}>
                        <UsergroupAddOutlined />
                    </Button>
                    <label>Create a User</label>
                </div>
            </div>

            <div className="right-user">
                <div className="both-users">
                    {selectedUserType === "admin" && <AddAdmin />}
                    {selectedUserType === "user" && <AddUser />}
                </div>
            </div>
        </div>
    );
};

export default CreateUser;
