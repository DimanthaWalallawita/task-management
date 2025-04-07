import React, { useState, useEffect } from "react";
import { Table, Button, Space, Tag, message, Switch, Modal, Form, Input, DatePicker, Select } from "antd";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import axios from "axios";
import moment, { Moment } from 'moment';

const { Option } = Select;

const AssignedTask: React.FC = () => {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentTask, setCurrentTask] = useState<any | null>(null);
    const [users, setUsers] = useState<{ id: string; fullName: string }[]>([]);
    const [form] = Form.useForm();

    const [statusFilter, setStatusFilter] = useState('all');
    const [startDateFilter, setStartDateFilter] = useState<Moment | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/task/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/task/getTasks");
                setTasks(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching tasks:", error);
                message.error("Failed to fetch tasks");
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    const handleSwitchChange = async (checked: boolean, taskId: string) => {
        try {
            const response = await axios.patch(`http://localhost:8000/api/task/task/${taskId}`, {
                isEnabled: checked
            });
            if (response.status === 200) {
                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task._id === taskId ? { ...task, isEnabled: checked } : task
                    )
                );
                message.success("Task status updated");
            }
        } catch (error) {
            console.error("Error updating task status:", error);
            message.error("Failed to update task status");
        }
    };

    const handleDelete = (taskId: string) => {
        Modal.confirm({
            title: "Are you sure you want to delete this task?",
            content: "This action cannot be undone.",
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk: async () => {
                try {
                    const response = await axios.delete(`http://localhost:8000/api/task/delete/${taskId}`);
                    if (response.status === 200) {
                        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
                        message.success("Task deleted successfully");
                    }
                } catch (error) {
                    console.error("Error deleting task:", error);
                    message.error("Failed to delete task");
                }
            }
        })
    };

    const handleEdit = (task: any) => {
        setCurrentTask(task);
        form.setFieldsValue({
            taskName: task.taskName,
            description: task.description,
            startDate: moment(task.startDate),
            endDate: moment(task.endDate),
            assignedUser: task.assignedUser?._id,
        });
        setIsModalVisible(true);
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            const updatedTask = {
                ...values,
                startDate: values.startDate.toISOString(),
                endDate: values.endDate.toISOString(),
            };
            const response = await axios.patch(`http://localhost:8000/api/task/update/${currentTask._id}`, updatedTask);
            if (response.status === 200) {
                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task._id === currentTask._id ? { ...task, ...updatedTask } : task
                    )
                );
                setIsModalVisible(false);
                message.success("Task updated successfully");
            }
        } catch (error) {
            console.error("Error updating task:", error);
            message.error("Failed to update task");
        }
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    const filteredTasks = tasks.filter((task) => {
        const matchesStatus = statusFilter === 'all'
            || (statusFilter === 'completed' && task.isCompleted)
            || (statusFilter === 'pending' && !task.isCompleted);
    
        const matchesDate = !startDateFilter
            || moment(task.startDate).format('YYYY-MM-DD') === startDateFilter.format('YYYY-MM-DD');
    
        return matchesStatus && matchesDate;
    });

    const columns = [
        {
            title: 'Task Name',
            dataIndex: 'taskName',
            key: 'taskName',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (text: string) => new Date(text).toLocaleDateString(),
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (text: string) => new Date(text).toLocaleDateString(),
        },
        {
            title: 'Assigned User',
            dataIndex: 'assignedUser',
            key: 'assignedUser',
            render: (user: any) => user ? `${user.firstName} ${user.lastName}` : 'N/A',
        },
        {
            title: 'Status',
            key: 'status',
            render: (_: any, record: any) => (
                <Tag color={record.isCompleted ? 'green' : 'red'}>
                    {record.isCompleted ? 'Completed' : 'Pending'}
                </Tag>
            ),
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
            <h1 style={{ marginBottom: '10px' }}>Assigned Task</h1>

            <div style={{ display: 'flex', gap: '10px', marginBottom: 16 }}>
                <DatePicker
                    placeholder="Start Date"
                    value={startDateFilter}
                    onChange={(date) => setStartDateFilter(date)}
                    style={{ width: 150 }}
                />
                <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 180 }}>
                    <Option value="all">All Statuses</Option>
                    <Option value="completed">Completed</Option>
                    <Option value="pending">Pending</Option>
                </Select>
            </div>

            <Table
                dataSource={filteredTasks}
                columns={columns}
                rowKey="_id"
                pagination={{ pageSize: 4 }}
                loading={loading}
                className="small-text-table"
            />

            <Modal
                title="Edit Task"
                visible={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText="Save"
                cancelText="Cancel"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Task Name"
                        name="taskName"
                        rules={[{ required: true, message: 'Please enter task name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                    >
                        <Input.TextArea maxLength={1250} />
                    </Form.Item>
                    <Form.Item
                        label="Start Date"
                        name="startDate"
                        rules={[{ required: true, message: 'Please select start date!' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        label="End Date"
                        name="endDate"
                        rules={[{ required: true, message: 'Please select end date!' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        label="Assign User"
                        name="assignedUser"
                        rules={[{ required: true, message: 'Please select a user!' }]}
                    >
                        <Select placeholder="Select a user">
                            {users.map(user => (
                                <Option key={user.id} value={user.id}>
                                    {user.fullName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AssignedTask;
