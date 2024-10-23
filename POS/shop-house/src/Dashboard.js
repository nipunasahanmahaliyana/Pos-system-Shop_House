import React, { useState } from 'react';
import {
  DollarCircleOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';
import { Table, Button, InputNumber, notification } from 'antd';

const Dashboard = () => {
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);

  // Sample products (you can replace these with dynamic data from your backend)
  const products = [
    { name: 'Apple', price: 1.5 },
    { name: 'Banana', price: 1.0 },
    { name: 'Orange', price: 2.0 },
    // Add more products here
  ];

  // Sample recent sales data
  const recentSalesData = [
    { key: '1', date: '2023-11-20', customer: 'John Doe', total: '$120.50' },
    { key: '2', date: '2023-11-19', customer: 'Jane Smith', total: '$85.20' },
    { key: '3', date: '2023-11-18', customer: 'David Lee', total: '$250.00' },
    // More data
  ];

  const recentSalesColumns = [
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Customer', dataIndex: 'customer', key: 'customer' },
    { title: 'Total', dataIndex: 'total', key: 'total' },
  ];

  // Function to add an item to the checkout
  const addToCheckout = () => {
    const product = products.find((item) => item.name === selectedItem);
    if (product) {
      const newItem = {
        name: product.name,
        price: product.price,
        quantity,
        total: product.price * quantity,
      };
      setCheckoutItems([...checkoutItems, newItem]);
      setTotalAmount(totalAmount + newItem.total);
      setSelectedItem('');
      setQuantity(1);
      notification.success({
        message: 'Item Added',
        description: `${newItem.name} has been added to the cart.`,
      });
    }
  };

  const removeItem = (item) => {
    const updatedItems = checkoutItems.filter((i) => i.name !== item.name);
    setCheckoutItems(updatedItems);
    setTotalAmount(totalAmount - item.total);
    notification.info({
      message: 'Item Removed',
      description: `${item.name} has been removed from the cart.`,
    });
  };

  return (
    <div className="p-6 bg-gray-100">
      {/* Dashboard Header */}
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h2>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow-lg p-6 rounded-lg transition-transform transform hover:scale-105 hover:shadow-xl flex items-center justify-between">
          <div>
            <p className="text-gray-500">Total Sales</p>
            <h3 className="text-2xl font-semibold">$112,893</h3>
          </div>
          <DollarCircleOutlined className="text-4xl text-green-500" />
        </div>

        <div className="bg-white shadow-lg p-6 rounded-lg transition-transform transform hover:scale-105 hover:shadow-xl flex items-center justify-between">
          <div>
            <p className="text-gray-500">Orders</p>
            <h3 className="text-2xl font-semibold">1,234</h3>
          </div>
          <ShoppingCartOutlined className="text-4xl text-blue-500" />
        </div>

        <div className="bg-white shadow-lg p-6 rounded-lg transition-transform transform hover:scale-105 hover:shadow-xl flex items-center justify-between">
          <div>
            <p className="text-gray-500">Customers</p>
            <h3 className="text-2xl font-semibold">5,678</h3>
          </div>
          <UserOutlined className="text-4xl text-purple-500" />
        </div>

        <div className="bg-white shadow-lg p-6 rounded-lg transition-transform transform hover:scale-105 hover:shadow-xl">
          <p className="text-gray-500">Sales Target</p>
          <div className="relative pt-1">
            <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
              <div
                style={{ width: '70%' }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
              ></div>
            </div>
          </div>
          <p className="text-right mt-2 text-sm text-gray-600">70% Complete</p>
        </div>
      </div>

      {/* Checkout Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Add Item to Checkout */}
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <h3 className="text-2xl font-semibold mb-4">Checkout</h3>

          <select
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
            className="mb-4 w-full px-4 py-2 border border-gray-300 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product.name} value={product.name}>
                {product.name} - ${product.price}
              </option>
            ))}
          </select>

          <InputNumber
            min={1}
            value={quantity}
            onChange={(value) => setQuantity(value)}
            className="w-full mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <Button
            onClick={addToCheckout}
            type="primary"
            icon={<PlusCircleOutlined />}
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all"
          >
            Add to Checkout
          </Button>
        </div>

        {/* Checkout Items */}
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <h3 className="text-2xl font-semibold mb-4">Items in Cart</h3>

          {checkoutItems.length > 0 ? (
            <ul className="space-y-2">
              {checkoutItems.map((item, index) => (
                <li key={index} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg transition-all hover:bg-gray-200">
                  <span>{item.name} (x{item.quantity})</span>
                  <span>${item.total.toFixed(2)}</span>
                  <Button
                    onClick={() => removeItem(item)}
                    icon={<MinusCircleOutlined />}
                    className="text-red-600 hover:bg-red-100 transition-all"
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p>No items in the cart.</p>
          )}

          <div className="mt-4">
            <h4 className="text-2xl font-semibold">Total: ${totalAmount.toFixed(2)}</h4>
            <Button type="primary" className="w-full mt-4 bg-green-600 hover:bg-green-700 transition-all">
              Complete Purchase
            </Button>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Dashboard;
