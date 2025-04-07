import React, { useState, useEffect } from "react";
import { Table, Button, Space, Tag, message } from "antd";
import axios from "axios";

const DeletedTask: React.FC = () => {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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

    const columns = [
        {
            title: 'Task Name',
            dataIndex: 'taskName',
            key: 'taskName',
            render: (text: string) => <a>{text}</a>,
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
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) => (
                <Space size="middle">
                    <Button type="link" style={{fontSize: '10px'}}>View</Button>
                    <Button type="link" style={{fontSize: '10px'}}>Edit</Button>
                </Space>
            ),
        },
    ];

    const handleTableChange = (pagination: any, filters: any, sorter: any) => {
        console.log('Table changed:', pagination, filters, sorter);
    };

    return (
        <div>
            <h1 style={{marginBottom:'10px'}}>Deleted Task</h1>
            <Table 
                dataSource={tasks}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 4 }}
                loading={loading}
                onChange={handleTableChange}
                className="small-text-table"
            />
        </div>
    );
}

export default DeletedTask;
