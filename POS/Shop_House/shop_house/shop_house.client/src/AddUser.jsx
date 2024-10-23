import React, { useState } from 'react';
import { Input, Button, Form, Upload, message } from 'antd';
import { UploadOutlined, UserAddOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';

const UserAddPage = () => {
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [form] = Form.useForm();

    // Handle file change and manually set the file
    const handleImageChange = (info) => {
        // Set the image file directly when selected
        setImageFile(info.file);
        message.success(`${info.file.name} file selected successfully.`);
    };

    const onFinish = async (values) => {
        setLoading(true);

        const formData = new FormData();
        formData.append('username', values.username);
        formData.append('role', values.role);
        formData.append('password', values.password);

        if (imageFile) {
            formData.append('imageFile', imageFile); // Append the image file to the formData
        } else {
            message.error('Image file is required!');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('https://localhost:7220/api/User/AddUsers', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const successMessage = response.data.Message || 'User added successfully!';
            message.success(successMessage);
            form.resetFields();

        } catch (error) {
            console.log(imageFile);
            const errorMessage = error.response?.data?.Message || 'An error occurred. Please try again.';
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const validatePassword = ({ getFieldValue }) => ({
        validator(_, value) {
            if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
            }
            return Promise.reject(new Error('Passwords do not match!'));
        },
    });

    return (
        <div className="p-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold text-center mb-6 text-indigo-600">Add New User</h2>
                <Form form={form}  onFinish={onFinish} layout="vertical">
                    <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Please input the username!' }]}>
                        <Input prefix={<UserAddOutlined />} placeholder="Enter username" />
                    </Form.Item>
                    <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please input the password!' }]}>
                        <Input.Password prefix={<LockOutlined />} placeholder="Enter password" />
                    </Form.Item>
                    <Form.Item name="confirmPassword" label="Confirm Password" dependencies={['password']} hasFeedback rules={[{ required: true, message: 'Please confirm your password!' }, validatePassword]}>
                        <Input.Password prefix={<LockOutlined />} placeholder="Confirm password" />
                    </Form.Item>
                    <Form.Item name="role" label="Role" rules={[{ required: true, message: 'Role is required!' }]}>
                        <Input prefix={<UserAddOutlined />} placeholder="Enter role" />
                    </Form.Item>
                    <Form.Item label="Profile Image" rules={[{ required: true, message: 'Please upload an image!' }]}>
                        <Upload name="profileImage" listType="picture" beforeUpload={file => {
                            handleImageChange({ file });
                            return false;  // Prevent automatic upload
                        }}>
                            <Button icon={<UploadOutlined />}>Click to upload</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} className="w-full">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default UserAddPage;
