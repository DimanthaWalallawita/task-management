import React, { useState, useEffect } from "react";
import { DatePicker, Button, Input, Switch, Dropdown, Menu, message } from "antd";
import { DownOutlined } from '@ant-design/icons';
import axios from 'axios';

const CreateTask: React.FC = () => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [users, setUsers] = useState<{ id: string; fullName: string }[]>([]);
    const [formData, setFormData] = useState({
        taskName: '',
        description: '',
        startDate: null,
        endDate: null,
        isEnabled: true,
        assignedUser: null
    });

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

    const menu = (
        <Menu onClick={(e) => setSelectedOption(e.key)}>
            {users.map((user) => (
                <Menu.Item key={user.id}>{user.fullName}</Menu.Item>
            ))}
        </Menu>
    );

    const handleCreateTask = async () => {
        const { taskName, description, startDate, endDate, isEnabled } = formData;

        if (!taskName || !startDate || !endDate || !selectedOption || !description) {
            message.error("Some data are missing!");
            return;
        }

        console.log(taskName, startDate);

        try {
            const response = await axios.post('http://localhost:8000/api/task/create', {
                taskName,
                description,
                startDate,
                endDate,
                assignedUser: selectedOption,
                isEnabled
            });

            message.success('Task created successfully');
            console.log(response.data);

            setFormData({
                taskName: '',
                description: '',
                startDate: null,
                endDate: null,
                isEnabled: true,
                assignedUser: null
            });
            setSelectedOption(null);
        } catch (error) {
            console.error('Error creating task:', error);
            message.error("Failed to create task");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleDateChange = (date: any, dateString: string, field: string) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: date
        }));
    };

    const handleSwitchChange = (checked: boolean) => {
        setFormData((prevData) => ({
            ...prevData,
            isEnabled: checked
        }));
    };

    return (
        <div className="create-task">
            <div className="left-user">
                <h1>Create & Assigned</h1>
            </div>

            <div className="right-user task-user">
                <div className="both-users">
                    <form className="add-form">
                        <Input
                            type="text"
                            name="taskName"
                            value={formData.taskName}
                            onChange={handleChange}
                            placeholder="Enter task name"
                        />
                        <Input.TextArea
                            name="description"
                            onChange={handleChange}
                            value={formData.description}
                            style={{ borderRadius: "15px" }}
                            rows={4}
                            placeholder="Enter task description"
                        />
                        <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "row", gap: "5px" }}>
                            <DatePicker
                                style={{ width: "50%" }}
                                format="YYYY-MM-DD"
                                placeholder="Start Date"
                                value={formData.startDate}
                                onChange={(date) => handleDateChange(date, "", "startDate")}
                            />

                            <DatePicker
                                style={{ width: "50%" }}
                                format="YYYY-MM-DD"
                                placeholder="End Date"
                                value={formData.endDate}
                                onChange={(date) => handleDateChange(date, "", "endDate")}
                            />
                        </div>

                        <Dropdown overlay={menu}>
                            <Button>
                                {selectedOption ? `Assigned User: ${selectedOption}` : 'Assign user for the task'} <DownOutlined />
                            </Button>
                        </Dropdown>

                        <div style={{ display: "flex", justifyContent: "start", alignItems: "center", flexDirection: "row", gap: "10px" }}>
                            <Switch
                                style={{ width: "5px", height: "2px" }}
                                checkedChildren="1" unCheckedChildren="0"
                                checked={formData.isEnabled}
                                onChange={handleSwitchChange}
                            />
                            <label>Enable / Disable task</label>
                        </div>
                        <Button type="primary" onClick={handleCreateTask} style={{ backgroundColor: '#0a1a3d' }}>
                            Create Task
                        </Button>
                    </form>
                </div>

            </div>
        </div>
    );
}

export default CreateTask;
