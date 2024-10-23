import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, CheckCircleOutlined } from '@ant-design/icons';

const RegistrationPage = () => {
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg transform transition-transform hover:scale-105">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create Your Account</h2>

                <Form
                    name="register"
                    className="registration-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    {/* Username */}
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                    >
                        <Input
                            prefix={<UserOutlined className="site-form-item-icon" />}
                            placeholder="Username"
                            size="large"
                            className="rounded-md"
                        />
                    </Form.Item>

                    {/* Email */}
                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: 'Please input your Email!', type: 'email' }]}
                    >
                        <Input
                            prefix={<MailOutlined className="site-form-item-icon" />}
                            placeholder="Email"
                            size="large"
                            className="rounded-md"
                        />
                    </Form.Item>

                    {/* Password */}
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            placeholder="Password"
                            size="large"
                            className="rounded-md"
                        />
                    </Form.Item>

                    {/* Confirm Password */}
                    <Form.Item
                        name="confirm"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            { required: true, message: 'Please confirm your Password!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<CheckCircleOutlined className="site-form-item-icon" />}
                            placeholder="Confirm Password"
                            size="large"
                            className="rounded-md"
                        />
                    </Form.Item>

                    {/* Agree to terms */}
                    <Form.Item name="agreement" valuePropName="checked">
                        <Checkbox className="text-gray-700">
                            I agree to the <a href="#">terms and conditions</a>
                        </Checkbox>
                    </Form.Item>

                    {/* Register Button */}
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="registration-form-button w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md transition-all"
                        >
                            Register
                        </Button>
                    </Form.Item>
                </Form>

                {/* Already have an account */}
                <div className="text-center">
                    <p className="text-gray-600">Already have an account? <a href="/login" className="text-indigo-600 hover:text-indigo-800">Sign In</a></p>
                </div>
            </div>
        </div>
    );
};

export default RegistrationPage;
