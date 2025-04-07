import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    message,
    Table,
    Dropdown,
    Menu,
    Button,
    DatePicker,
    Select,
    Row,
    Col,
} from "antd";
import dayjs from "dayjs";

const { Option } = Select;

interface Task {
    _id: string;
    taskName: string;
    description: string;
    startDate: string;
    endDate: string;
    isCompleted: boolean;
}

const UserTasks: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedDate, setSelectedDate] = useState<any>(null);
    const [statusFilter, setStatusFilter] = useState<string>("All");

    useEffect(() => {
        const fetchTasks = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                message.error("Please log in first.");
                return;
            }

            try {
                const response = await axios.get<Task[]>(
                    "http://localhost:8000/api/task/user/tasks",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setTasks(response.data);
                setFilteredTasks(response.data);
                setLoading(false);
            } catch (error: any) {
                setLoading(false);
                message.error(error.response?.data?.message || "Failed to load tasks.");
            }
        };

        fetchTasks();
    }, []);

    const handleStatusChange = async (_id: string, status: string) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `http://localhost:8000/api/task/task/${_id}/status`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const updatedTasks = tasks.map((task) =>
                task._id === _id ? { ...task, isCompleted: status === "Completed" } : task
            );
            setTasks(updatedTasks);
            applyFilters(updatedTasks, selectedDate, statusFilter);
            message.success("Status updated successfully.");
        } catch (error: any) {
            message.error("Failed to update status.");
        }
    };

    const getStatusButton = (isCompleted: boolean) => {
        return (
            <Button
                size="small"
                style={{
                    backgroundColor: isCompleted ? "green" : "red",
                    color: "white",
                    borderColor: isCompleted ? "green" : "red",
                }}
            >
                {isCompleted ? "Completed" : "Pending"}
            </Button>
        );
    };

    const applyFilters = (
        allTasks: Task[],
        selectedDate: any,
        selectedStatus: string
    ) => {
        let filtered = allTasks;

        if (selectedDate) {
            const formatted = dayjs(selectedDate).format("YYYY-MM-DD");
            filtered = filtered.filter((task) =>
                dayjs(task.startDate).format("YYYY-MM-DD") === formatted
            );
        }

        if (selectedStatus === "Completed") {
            filtered = filtered.filter((task) => task.isCompleted);
        } else if (selectedStatus === "Pending") {
            filtered = filtered.filter((task) => !task.isCompleted);
        }

        setFilteredTasks(filtered);
    };

    const handleDateChange = (date: any) => {
        setSelectedDate(date);
        applyFilters(tasks, date, statusFilter);
    };

    const handleStatusFilterChange = (value: string) => {
        setStatusFilter(value);
        applyFilters(tasks, selectedDate, value);
    };

    const columns = [
        {
            title: "Task",
            dataIndex: "taskName",
            key: "taskName",
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Start Date",
            dataIndex: "startDate",
            key: "startDate",
            render: (startDate: string) => new Date(startDate).toLocaleDateString(),
        },
        {
            title: "End Date",
            dataIndex: "endDate",
            key: "endDate",
            render: (endDate: string) => new Date(endDate).toLocaleDateString(),
        },
        {
            title: "Status",
            key: "status",
            render: (_: any, record: Task) => {
                const menu = (
                    <Menu>
                        <Menu.Item onClick={() => handleStatusChange(record._id, "Pending")}>
                            Pending
                        </Menu.Item>
                        <Menu.Item onClick={() => handleStatusChange(record._id, "Completed")}>
                            Completed
                        </Menu.Item>
                    </Menu>
                );

                return <Dropdown overlay={menu}>{getStatusButton(record.isCompleted)}</Dropdown>;
            },
        },
    ];

    return (
        <div className="user-management">
            <h1 style={{ marginBottom: "10px" }}>Assigned Tasks</h1>

            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col>
                    <DatePicker onChange={handleDateChange} />
                </Col>
                <Col>
                    <Select
                        defaultValue="All"
                        style={{ width: 150 }}
                        onChange={handleStatusFilterChange}
                    >
                        <Option value="All">All Statuses</Option>
                        <Option value="Pending">Pending</Option>
                        <Option value="Completed">Completed</Option>
                    </Select>
                </Col>
            </Row>

            <Table
                dataSource={filteredTasks}
                columns={columns}
                rowKey="_id"
                pagination={{ pageSize: 4 }}
                loading={loading}
                className="small-text-table"
            />
        </div>
    );
};

export default UserTasks;
