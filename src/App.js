import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {
  DollarCircleOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  BarChartOutlined,
  SettingOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import Dashboard from './Dashboard';
import Sales from './Sales';
import Products from './Products';
import Customers from './Customers';
import Settings from './Settings';

const App = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex">
        {/* Sidebar */}
        <aside className={`bg-gray-900 ${collapsed ? 'w-20' : 'w-64'} p-5 transition-width duration-300`}>
          <div className="flex justify-between items-center">
            <h1 className={`text-white text-xl ${collapsed ? 'hidden' : 'block'}`}>POS System</h1>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-white focus:outline-none"
            >
              {collapsed ? '>' : '<'}
            </button>
          </div>
          <nav className="mt-10">
            <ul className="space-y-4">
              <li className="text-gray-300">
                <Link to="/" className="flex items-center space-x-2 hover:text-white">
                  <BarChartOutlined className="text-lg" />
                  {!collapsed && <span>Dashboard</span>}
                </Link>
              </li>
              <li className="text-gray-300">
                <Link to="/sales" className="flex items-center space-x-2 hover:text-white">
                  <ShoppingCartOutlined className="text-lg" />
                  {!collapsed && <span>Sales</span>}
                </Link>
              </li>
              <li className="text-gray-300">
                <Link to="/products" className="flex items-center space-x-2 hover:text-white">
                  <DatabaseOutlined className="text-lg" />
                  {!collapsed && <span>Products</span>}
                </Link>
              </li>
              <li className="text-gray-300">
                <Link to="/customers" className="flex items-center space-x-2 hover:text-white">
                  <UserOutlined className="text-lg" />
                  {!collapsed && <span>Customers</span>}
                </Link>
              </li>
              <li className="text-gray-300">
                <Link to="/settings" className="flex items-center space-x-2 hover:text-white">
                  <SettingOutlined className="text-lg" />
                  {!collapsed && <span>Settings</span>}
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/products" element={<Products />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
