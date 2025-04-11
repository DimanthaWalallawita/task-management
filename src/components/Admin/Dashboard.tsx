import React, { useEffect, useState } from "react";
import { UsergroupDeleteOutlined, EditOutlined, FormOutlined } from '@ant-design/icons';

const Dashboard: React.FC = () => {
    const [count, setCount] = useState(0);
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

        fetchUserCount();
        fetchCompletedTask();
        fetchPendingTask();
    },[]);

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

            </div>
        </div>
    );
};

export default Dashboard;
