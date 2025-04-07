import React, { useState, useEffect } from "react";
import { Table, Button, Space, message, Modal, Form, Input } from "antd";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from "axios";

const AdminUserManage: React.FC = () => {
    const [admins, setAdmins] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentAdmin, setCurrentAdmin] = useState<any | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/user/admins");
                setAdmins(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching admins:", error);
                message.error("Failed to fetch admins");
                setLoading(false);
            }
        };
        fetchAdmins();
    }, []);

    const handleDelete = (adminId: string) => {
        Modal.confirm({
            title: "Are you sure you want to delete this admin?",
            content: "This action cannot be undone.",
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk: async () => {
                try {
                    const response = await axios.delete(`http://localhost:8000/api/user/admin/delete/${adminId}`);
                    if (response.status === 200) {
                        setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin._id !== adminId));
                        message.success("Admin deleted successfully");
                    }
                } catch (error) {
                    console.error("Error deleting admin:", error);
                    message.error("Failed to delete admin");
                }
            },
            onCancel() {
                console.log("Admin delete canceled");
            }
        });
    };

    const handleEdit = (admin: any) => {
        setCurrentAdmin(admin);
        form.setFieldsValue({
            name: admin.name,
            email: admin.email,
        });
        setIsModalVisible(true);
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            const updatedAdmin = {
                name: values.name,
                email: values.email,
            };
            const response = await axios.patch(`http://localhost:8000/api/user/admin/update/${currentAdmin._id}`, updatedAdmin);
            if (response.status === 200) {
                setAdmins((prevAdmins) =>
                    prevAdmins.map((admin) =>
                        admin._id === currentAdmin._id ? { ...admin, ...updatedAdmin } : admin
                    )
                );
                setIsModalVisible(false);
                message.success("Admin updated successfully");
            }
        } catch (error) {
            console.error("Error updating admin:", error);
            message.error("Failed to update admin");
        }
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Actions',
            key: 'actions',
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
            <h1 style={{ marginBottom: '10px' }}>Manage Admins</h1>
            <Table
                dataSource={admins}
                columns={columns}
                rowKey="_id"
                pagination={{ pageSize: 5 }}
                loading={loading}
                className="small-text-table"
            />

            <Modal
                title="Edit Admin"
                visible={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText="Save"
                cancelText="Cancel"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter the admin name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, type: 'email', message: 'Please enter a valid email!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminUserManage;
