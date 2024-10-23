import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
    DollarCircleOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    BarChartOutlined,
    SettingOutlined,
    DatabaseOutlined,
    FolderOpenOutlined,
    PlusCircleOutlined,
    UserAddOutlined
} from '@ant-design/icons';

import Dashboard from './Dashboard';
import Sales from './Sales';
import Products from './Products';
import Customers from './Customers';
import Settings from './Settings';
import AddProducts from './AddProducts';
import Inventory from './Inventory';
import Home from './Home';
import Login from './Login';
import Registration from './Registration'
import AddUser from './AddUser';

const App = () => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation(); // Get the current location

    // Determine if the sidebar should be visible
    const showSidebar = location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/reg';


    return (
        <div className="flex">
            {/* Sidebar */}
            {showSidebar && (
               <aside className={`bg-gradient-to-b from-blue-600 to-blue-800 ${collapsed ? 'w-20' : 'w-64'} p-5 transition-width duration-100 shadow-lg sidebar`}>
                    <div className="flex justify-between items-center">
                        <h1 className={`text-white text-xl font-bold transition-opacity duration-100 ${collapsed ? 'opacity-0' : 'opacity-100'}`}>SHOP HOUSE</h1>
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="text-white bg-black focus:outline-none transition-transform duration-300 transform hover:scale-125"
                            style={{ marginLeft: collapsed ? '-11vh' : '' }}
                        >
                            {collapsed ? '>' : '<'}
                        </button>
                    </div>
                    <nav className="mt-10">
                        <ul className="space-y-4">
                            <li>
                                <Link to="/dashboard" className={`flex items-center space-x-2 text-gray-200 hover:text-white transition-colors duration-300 rounded-lg p-2 ${collapsed ? 'justify-center' : ''}`}>
                                    <BarChartOutlined className="text-xl" />
                                    {!collapsed && <span className="transition-opacity duration-300">Dashboard</span>}
                                </Link>
                            </li>
                            <li>
                                <Link to="/sales" className={`flex items-center space-x-2 text-gray-200 hover:text-white transition-colors duration-300 rounded-lg p-2 ${collapsed ? 'justify-center' : ''}`}>
                                    <ShoppingCartOutlined className="text-xl" />
                                    {!collapsed && <span className="transition-opacity duration-300">Sales</span>}
                                </Link>
                            </li>
                            <li>
                                <Link to="/products" className={`flex items-center space-x-2 text-gray-200 hover:text-white transition-colors duration-300 rounded-lg p-2 ${collapsed ? 'justify-center' : ''}`}>
                                    <DatabaseOutlined className="text-xl" />
                                    {!collapsed && <span className="transition-opacity duration-300">Products</span>}
                                </Link>
                            </li>
                            <li>
                                <Link to="/customers" className={`flex items-center space-x-2 text-gray-200 hover:text-white transition-colors duration-300 rounded-lg p-2 ${collapsed ? 'justify-center' : ''}`}>
                                    <UserOutlined className="text-xl" />
                                    {!collapsed && <span className="transition-opacity duration-300">Customers</span>}
                                </Link>
                            </li>
                            <li>
                                <Link to="/settings" className={`flex items-center space-x-2 text-gray-200 hover:text-white transition-colors duration-300 rounded-lg p-2 ${collapsed ? 'justify-center' : ''}`}>
                                    <SettingOutlined className="text-xl" />
                                    {!collapsed && <span className="transition-opacity duration-300">Settings</span>}
                                </Link>
                            </li>
                            <li>
                                <Link to="/addProducts" className={`flex items-center space-x-2 text-gray-200 hover:text-white transition-colors duration-300 rounded-lg p-2 ${collapsed ? 'justify-center' : ''}`}>
                                    <PlusCircleOutlined className="text-xl" />
                                    {!collapsed && <span className="transition-opacity duration-300">Add Products</span>}
                                </Link>
                            </li>
                            <li>
                                <Link to="/inventory" className={`flex items-center space-x-2 text-gray-200 hover:text-white transition-colors duration-300 rounded-lg p-2 ${collapsed ? 'justify-center' : ''}`}>
                                    <FolderOpenOutlined className="text-xl" />
                                    {!collapsed && <span className="transition-opacity duration-300">Inventory</span>}
                                </Link>
                            </li>
                            <li>
                                <Link to="/adduser" className={`flex items-center space-x-2 text-gray-200 hover:text-white transition-colors duration-300 rounded-lg p-2 ${collapsed ? 'justify-center' : ''}`}>
                                    <UserAddOutlined className="text-xl" />
                                    {!collapsed && <span className="transition-opacity duration-300">Add User</span>}
                                </Link>
                            </li>

                        </ul>
                    </nav>
                    {/* Footer Section */}
                    <footer className=" py-6 mt-20 text-center mr-5">
                        <p className={`text-sm text-white ${collapsed ? 'opacity-0' : 'opacity-100'}`}>2024 Shop House. All rights reserved.</p>
                    </footer>
                </aside>
            )}

            {/* Main Content */}
            <div className="flex-1">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/reg" element={<Registration />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/sales" element={<Sales />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/addProducts" element={<AddProducts />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/adduser" element={<AddUser/> }/>
                    <Route path="*" element={<div>404 Not Found</div>} />
                </Routes>
            </div>
        </div>
    );
};

// Make sure to wrap your App component with Router
const WrappedApp = () => (
    <Router>
        <App />
    </Router>
);

export default WrappedApp;
