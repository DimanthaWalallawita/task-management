import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, message, Modal, Form, Input } from 'antd';

const Profile: React.FC = () => {
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [changePasswordModal, setChangePasswordModal] = useState<boolean>(false);  // For change password modal
    const [form] = Form.useForm();
    const [passwordForm] = Form.useForm();  // Form for password change

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                message.error('Please log in to view your profile');
                return;
            }

            try {
                const response = await axios.get('http://localhost:8000/api/user/user', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUserData(response.data);
                setLoading(false);
            } catch (error: any) {
                setLoading(false);
                message.error(error.response?.data?.message || 'Failed to load user profile');
            }
        };

        fetchUserProfile();
    }, []);

    const data = userData
        ? [
            { key: '1', attribute: 'First Name', value: userData.firstName },
            { key: '2', attribute: 'Last Name', value: userData.lastName },
            { key: '3', attribute: 'Email', value: userData.email },
            { key: '4', attribute: 'Mobile Number', value: userData.mobileNumber },
            { key: '5', attribute: 'Address', value: userData.address },
            { key: '6', attribute: 'Role', value: userData.role },
            { key: '7', attribute: 'Enabled', value: userData.isEnabled ? 'Yes' : 'No' },
            { key: '8', attribute: 'Verified', value: userData.isVerified ? 'Yes' : 'No' },
        ]
        : [];

    const columns = [
        {
            title: 'Attribute',
            dataIndex: 'attribute',
            key: 'attribute',
        },
        {
            title: 'Details',
            dataIndex: 'value',
            key: 'value',
        },
    ];

    const showModal = () => {
        form.setFieldsValue(userData);
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const token = localStorage.getItem('token');
            const values = form.getFieldsValue();

            const response = await axios.patch(
                'http://localhost:8000/api/user/user/profile',
                values,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setUserData(response.data);
            message.success('Profile updated successfully');
            setIsModalVisible(false);
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Failed to update profile');
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleChangePassword = () => {
        setChangePasswordModal(true);
    };

    const handlePasswordChange = async () => {
        const { currentPassword, newPassword, confirmPassword } = passwordForm.getFieldsValue();

        if (newPassword !== confirmPassword) {
            message.error('New password and confirm password do not match');
            return;
        }

        try {
            const token = localStorage.getItem('token');

            const response = await axios.patch(
                'http://localhost:8000/api/auth/resetPassword',
                { currentPassword, newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                message.success('Password changed successfully');
                setChangePasswordModal(false);
            }

        } catch (error: any) {
            message.error(error.response?.data?.message || 'Failed to change password');
        }
    };

    const handleCancelPasswordChange = () => {
        setChangePasswordModal(false);
    };

    return (
        <div className="user">
            <div className="left-profile">
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <Table
                        columns={columns}
                        dataSource={data}
                        pagination={false}
                        bordered
                        size="middle"
                        loading={loading}
                        className="small-text-table"
                    />
                )}
            </div>

            <div className="right-profile">
                <Button size='small' onClick={showModal}>Edit Profile</Button>
                <Button size='small' onClick={handleChangePassword}>Change Password</Button>
            </div>

            <Modal
                title="Edit Profile"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Save Changes"
                cancelText="Cancel"
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="editProfileForm"
                    initialValues={userData}
                >
                    <Form.Item
                        label="First Name"
                        name="firstName"
                        rules={[{ required: true, message: 'First name is required' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Last Name"
                        name="lastName"
                        rules={[{ required: true, message: 'Last name is required' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Email is required' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Mobile Number"
                        name="mobileNumber"
                        rules={[{ required: true, message: 'Mobile number is required' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Address"
                        name="address"
                        rules={[{ required: true, message: 'Address is required' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Change Password"
                visible={changePasswordModal}
                onOk={handlePasswordChange}
                onCancel={handleCancelPasswordChange}
                okText="Change Password"
                cancelText="Cancel"
            >
                <Form
                    form={passwordForm}
                    layout="vertical"
                    name="changePasswordForm"
                >
                    <Form.Item
                        label="Current Password"
                        name="currentPassword"
                        rules={[{ required: true, message: 'Current password is required' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        label="New Password"
                        name="newPassword"
                        rules={[{ required: true, message: 'New password is required' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        label="Confirm New Password"
                        name="confirmPassword"
                        rules={[{ required: true, message: 'Please confirm your new password' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Profile;
