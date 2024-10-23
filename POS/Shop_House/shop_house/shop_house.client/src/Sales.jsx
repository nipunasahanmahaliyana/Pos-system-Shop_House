import React, { useState } from 'react';
import { Modal } from 'antd';
import { EditOutlined } from '@ant-design/icons';

const Sales = () => {
    const [sortOrder, setSortOrder] = useState('asc');
    const [selectedSale, setSelectedSale] = useState(null);

    const salesData = [
        { id: 1, product: 'Laptop', amount: 1200, date: '2023-11-20', customer: 'Alice', paymentMethod: 'Credit Card' },
        { id: 2, product: 'Smartphone', amount: 800, date: '2023-11-19', customer: 'Bob', paymentMethod: 'PayPal' },
        { id: 3, product: 'Monitor', amount: 300, date: '2023-11-18', customer: 'Charlie', paymentMethod: 'Cash' },
        { id: 4, product: 'Tablet', amount: 450, date: '2023-11-17', customer: 'David', paymentMethod: 'Credit Card' },
        { id: 5, product: 'Headphones', amount: 150, date: '2023-11-16', customer: 'Eve', paymentMethod: 'Bank Transfer' },
    ];

    const sortedSalesData = [...salesData].sort((a, b) => {
        return sortOrder === 'asc'
            ? new Date(a.date) - new Date(b.date)
            : new Date(b.date) - new Date(a.date);
    });

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const handleViewDetails = (sale) => {
        setSelectedSale(sale);
    };

    const handleCloseModal = () => {
        setSelectedSale(null);
    };

    return (
        <div className="flex h-screen bg-gradient-to-r from-indigo-200 to-blue-300 p-6">
            {/* Main Content */}
            <div className="flex-1 p-6 rounded-lg shadow-lg bg-white">
                <h2 className="text-4xl font-extrabold mb-6 text-gray-800">Sales Records</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedSalesData.map((sale) => (
                        <div key={sale.id} className="bg-white rounded-lg p-4 shadow-md transition-transform transform hover:scale-105 hover:shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
                            <h3 className="text-xl font-semibold text-gray-800 mt-2">{sale.product}</h3>
                            <p className="text-gray-600">Date: {sale.date}</p>
                            <p className="text-gray-800 font-bold text-lg">${sale.amount}</p>
                            <p className="text-gray-500">Customer: {sale.customer}</p>
                            <p className="text-gray-500">Payment: {sale.paymentMethod}</p>
                            <button
                                onClick={() => handleViewDetails(sale)}
                                className="mt-4 bg-green-600 text-white rounded-full px-4 py-2 text-sm font-medium shadow-md hover:bg-green-500 transition duration-200 flex items-center"
                            >
                                <EditOutlined className="mr-1" /> View Details
                            </button>
                        </div>
                    ))}
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={toggleSortOrder}
                        className="bg-green-600 text-white rounded-full px-6 py-3 hover:bg-green-500 transition duration-200 flex items-center"
                    >
                        Sort by Date {sortOrder === 'asc' ? '↑' : '↓'}
                    </button>
                </div>

                {/* Modal for Sale Details */}
                <Modal
                    title="Sale Details"
                    visible={!!selectedSale}
                    onCancel={handleCloseModal}
                    footer={null}
                    className="custom-modal"
                >
                    {selectedSale && (
                        <div>
                            <p><strong>Product:</strong> {selectedSale.product}</p>
                            <p><strong>Amount:</strong> ${selectedSale.amount}</p>
                            <p><strong>Date:</strong> {selectedSale.date}</p>
                            <p><strong>Customer:</strong> {selectedSale.customer}</p>
                            <p><strong>Payment Method:</strong> {selectedSale.paymentMethod}</p>
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
};

export default Sales;
