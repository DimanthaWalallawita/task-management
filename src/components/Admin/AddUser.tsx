import React, { useState } from "react";
import { Button, Input, message } from "antd";
import axios from "axios";

const AddUser: React.FC = () => {
    const [email, setEmail] = useState("");

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const verifyUser = async () => {
        if (!email) {
            message.error("Please enter a valid email");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8000/api/auth/send-otp", { email });

            if(!response){
                message.error("An error occurred");
            }

            message.success(response.data.message);
        } catch (error) {
            message.error("An error occurred");
        }
    }

    return (
        <div className="create-users">
            <h2>Create a Regular User</h2>
            <form className="add-form">
                <Input type="email" value={email} onChange={handleEmailChange} placeholder="Enter email" />
                <Button onClick={verifyUser} className="add-admin-button" type="primary" style={{backgroundColor: '#0a1a3d'}}>
                    Verify User
                </Button>
            </form>
        </div>
    );
};

export default AddUser;
