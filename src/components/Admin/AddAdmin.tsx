import React, { useState } from "react";
import { Button, Input, message } from "antd";
import axios from "axios";

const AddAdmin: React.FC = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            message.error("Passwords do not match!");
            return;
        }

        const { name, email, password } = formData;

        try {
            const response = await axios.post("http://localhost:8000/api/auth/create", {
                name,
                email,
                password
            });

            if (response.status === 200) {
                message.success("Admin account created successfully!");
                setFormData({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: ""
                });
            }
        } catch (error) {
            console.error("Error creating admin:", error);
            message.error("Failed to create admin account");
        }
    };

    return (
        <div className="create-users">
            <h2>Create an Admin Account</h2>
            <form className="add-form" onSubmit={handleSubmit}>
                <Input
                    type="text"
                    name="name"
                    placeholder="Enter admin name"
                    value={formData.name}
                    onChange={handleInputChange}
                />
                <Input
                    type="email"
                    name="email"
                    placeholder="Enter admin email"
                    value={formData.email}
                    onChange={handleInputChange}
                />
                <Input
                    type="password"
                    name="password"
                    placeholder="Enter admin password"
                    value={formData.password}
                    onChange={handleInputChange}
                />
                <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                />
                <Button type="primary" className="add-admin-button" style={{ backgroundColor: '#0a1a3d' }} htmlType="submit">
                    Add Admin
                </Button>
            </form>
        </div>
    );
};

export default AddAdmin;
