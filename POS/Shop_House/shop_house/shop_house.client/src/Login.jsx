import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Typography, Spin } from 'antd';
import { LockOutlined, UserOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';

const { Title } = Typography;

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const onFinish = (values) => {
        setLoading(true);
        console.log('Received values from login form: ', values);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            // Handle login logic here
        }, 1500);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96 transform transition-transform hover:scale-105">
                <Title level={2} className="text-center text-indigo-600">Login</Title>
                <Form name="login" onFinish={onFinish}>
                    {/* Username Field */}
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input
                            prefix={<UserOutlined className="text-gray-500" />}
                            placeholder="Username"
                            className="hover:shadow-md transition-shadow duration-300"
                        />
                    </Form.Item>

                    {/* Password Field */}
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="text-gray-500" />}
                            placeholder="Password"
                            className="hover:shadow-md transition-shadow duration-300"
                            iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                    </Form.Item>

                    {/* Remember Me Checkbox and Forgot Password */}
                    <Form.Item>
                        <Checkbox className="text-gray-600">Remember me</Checkbox>
                        <a href="#" className="float-right text-indigo-600 hover:underline">
                            Forgot password?
                        </a>
                    </Form.Item>

                    {/* Login Button */}
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
                            disabled={loading}
                        >
                            {loading ? <Spin /> : 'Log In'}
                        </Button>
                    </Form.Item>
                </Form>

                {/* Social Media Login Options */}
                <div className="mt-4 text-center">
                    <p className="text-gray-500">Or login with:</p>
                    <div className="flex justify-center space-x-4 mt-2">
                        <Button
                            type="default"
                            icon={<i className="fab fa-google text-red-500" />}
                            className="border-gray-300 hover:border-gray-400"
                        >
                            Google
                        </Button>
                        <Button
                            type="default"
                            icon={<i className="fab fa-facebook text-blue-600" />}
                            className="border-gray-300 hover:border-gray-400"
                        >
                            Facebook
                        </Button>
                        <Button
                            type="default"
                            icon={<i className="fab fa-twitter text-blue-400" />}
                            className="border-gray-300 hover:border-gray-400"
                        >
                            Twitter
                        </Button>
                    </div>
                </div>

                {/* Register Link */}
                <p className="text-center mt-6">
                    Don't have an account? <a href="/reg" className="text-indigo-600 hover:underline">Register here</a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
