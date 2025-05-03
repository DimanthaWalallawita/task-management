import React, { useState, useEffect } from "react";
import { Table, Button, Space, Tag, message, Switch, Modal, Form, Input } from "antd";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import axios from "axios";


const ManageUsers: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentUser, setCurrentUser] = useState<any | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/user/getUsers");

                if(!response.data){
                    message.error("Something Went Wrong");
                }else{
                    setUsers(response.data);
                    setLoading(false);
                }
                
            } catch (error) {
                console.error("Error fetching users:", error);
                message.error("Failed to fetch users");
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleSwitchChange = async (checked: boolean, userId: string) => {
        try {
            const response = await axios.patch(`http://localhost:8000/api/user/switch/${userId}`, {
                isEnabled: checked
            });
            if (response.status === 200) {
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user._id === userId ? { ...user, isEnabled: checked } : user
                    )
                );
                message.success("User status updated");
            }
        } catch (error) {
            console.error("Error updating user status:", error);
            message.error("Failed to update user status");
        }
    };

    const handleDelete = (userId: string) => {
        Modal.confirm({
            title: "Are you sure you want to delete this user?",
            content: "This action cannot be undone.",
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk: async () => {
                try {
                    const response = await axios.delete(`http://localhost:8000/api/user/delete/${userId}`);
                    if (response.status === 200) {
                        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
                        message.success("User deleted successfully");
                    }
                } catch (error) {
                    console.error("Error deleting user:", error);
                    message.error("Failed to delete user");
                }
            },
            onCancel() {
                console.log("User delete canceled");
            }
        })
    };

    const handleEdit = (user: any) => {
        setCurrentUser(user);
        form.setFieldsValue({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            mobileNumber: user.mobileNumber,
            address: user.address,
            role: user.role,
        });
        setIsModalVisible(true);
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            const updatedUser = {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                mobileNumber: values.mobileNumber,
                address: values.address,
                role: values.role,
                isEnabled: values.isEnabled,
            };
            const response = await axios.patch(`http://localhost:8000/api/user/update/${currentUser._id}`, updatedUser);
            if (response.status === 200) {
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user._id === currentUser._id ? { ...user, ...updatedUser } : user
                    )
                );
                setIsModalVisible(false);
                message.success("User updated successfully");
            }
        } catch (error) {
            console.error("Error updating user:", error);
            message.error("Failed to update user");
        }
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    const columns = [
        {
            title: 'First Name',
            dataIndex: 'firstName',
            key: 'firstName',
        },
        {
            title: 'Last Name',
            dataIndex: 'lastName',
            key: 'lastName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Mobile Number',
            dataIndex: 'mobileNumber',
            key: 'mobileNumber',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role: string) => <Tag color={role === 'Admin' ? 'blue' : 'green'}>{role}</Tag>,
        },
        {
            title: 'Enabled',
            key: 'isEnabled',
            render: (_: any, record: any) => (
                <Switch
                    size="small"
                    checked={record.isEnabled}
                    onChange={(checked) => handleSwitchChange(checked, record._id)}
                />
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) => (
                <Space size="middle">
                    <Button size="small" type="link" onClick={() => handleEdit(record)} style={{ fontSize: '10px', backgroundColor: '#1ABC9C', color: 'white' }}><EditOutlined /></Button>
                    <Button size="small" type="link" onClick={() => handleDelete(record._id)} style={{ fontSize: '10px', backgroundColor: 'red', color: 'white' }}><DeleteOutlined /></Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="user-management">
            <h1 style={{ marginBottom: '10px' }}>Manage Users</h1>
            <Table
                dataSource={users}
                columns={columns}
                rowKey="_id"
                pagination={{ pageSize: 5 }}
                loading={loading}
                className="small-text-table"
            />
            <Modal
                title="Edit User"
                visible={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText="Save"
                cancelText="Cancel"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="First Name"
                        name="firstName"
                        rules={[{ required: true, message: 'Please enter first name!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Last Name"
                        name="lastName"
                        rules={[{ required: true, message: 'Please enter last name!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, type: 'email', message: 'Please enter a valid email!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Mobile Number"
                        name="mobileNumber"
                        rules={[{ required: true, message: 'Please enter mobile number!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Address"
                        name="address">
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Role"
                        name="role"
                        rules={[{ required: true, message: 'Please select role!' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ManageUsers;
