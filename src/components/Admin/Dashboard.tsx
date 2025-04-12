import React, { useEffect, useState } from "react";
import { UsergroupDeleteOutlined, EditOutlined, FormOutlined } from '@ant-design/icons';
import { error } from "console";

interface AssignedUser {
    _id: string;
    fullName: string;
}

interface Task {
    _id: string;
    taskName: string;
    startDate: string;
    endDate: string;
    isCompleted: boolean;
    assignedUser?: AssignedUser;
}

const Dashboard: React.FC = () => {
    const [count, setCount] = useState(0);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [completedCount, setCompletedCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        const fetchUserCount = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/user/userCount');
                const data = await response.json();
                setCount(data.count);
            } catch (error) {
                console.error("Failed to fetch user count");
            }
        }

        const fetchCompletedTask = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/task/countTask');
                const data = await response.json();
                setCompletedCount(data.countTask);
            } catch (error) {
                console.error("Failed to fetch Completed Task count");
            }
        }

        const fetchPendingTask = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/task/pending');
                const data = await response.json();
                setPendingCount(data.countTask);
            } catch (error) {
                console.error('Error in fetching pendings')
            }
        }

        const fetchRecentTasks = async () => {
            try {
                fetch('http://localhost:8000/api/task/recent')
                    .then((res) => res.json())
                    .then((data: Task[]) => setTasks(data));
            } catch (error) {
                console.error("Failed to fetch data");
            }
        }

        fetchRecentTasks();
        fetchUserCount();
        fetchCompletedTask();
        fetchPendingTask();
    }, []);

    const formatDate = (dateStr: string): string => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return ''; // check for invalid date
        return date.toISOString().split('T')[0].replace(/-/g, '.');
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-top">
                <div className="admins-users">
                    <div className="admin-user-left">
                        <UsergroupDeleteOutlined style={{ fontSize: '50px', color: 'white' }} />
                    </div>

                    <div className="admin-user-right">
                        <h1>{count}</h1>
                        <h2>Users</h2>
                    </div>
                </div>

                <div className="admins-users">
                    <div className="admin-user-left">
                        <EditOutlined style={{ fontSize: '50px', color: 'white' }} />
                    </div>

                    <div className="admin-user-right">
                        <h1>{completedCount}</h1>
                        <h2>Completed</h2>
                    </div>
                </div>

                <div className="admins-users">
                    <div className="admin-user-left">
                        <FormOutlined style={{ fontSize: '42px', color: 'white' }} />
                    </div>

                    <div className="admin-user-right">
                        <h1>{pendingCount}</h1>
                        <h2>Pending</h2>
                    </div>
                </div>
            </div>

            <div className="admin-bottom">
                <h1>Recent Task Allocations</h1>
                {tasks.map((task) => (
                    <div className="recent-task" style={{ border: `2px solid ${task.isCompleted ? '#A3E635' : 'red'}` }} key={task._id}>
                        <div className="recent-task-top">
                            <h3>{task.taskName}</h3>
                            <h6>
                                Assigned -{' '}
                                {task.assignedUser
                                    ? task.assignedUser.fullName
                                    : 'Unassigned'}
                            </h6>
                        </div>
                        <div className="recent-task-bottom">
                            <h5>
                                Date: {formatDate(task.startDate)} -{' '}
                                {formatDate(task.endDate)}
                            </h5>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
