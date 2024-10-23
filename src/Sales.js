import React, { useState } from 'react';
import { Modal } from 'antd';

const Sales = () => {
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedSale, setSelectedSale] = useState(null); // State to manage the selected sale for details view

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
    setSelectedSale(sale); // Set selected sale to display in modal
  };

  const handleCloseModal = () => {
    setSelectedSale(null); // Close modal
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Sales Records</h2>
      <div className="bg-white shadow-xl rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedSalesData.map((sale) => (
            <div key={sale.id} className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg p-4 shadow-lg transition-transform transform hover:scale-105">
              <h3 className="text-xl font-semibold text-white">{sale.product}</h3>
              <p className="text-gray-200">Date: {sale.date}</p>
              <p className="text-gray-100 font-bold">${sale.amount}</p>
              <button
                onClick={() => handleViewDetails(sale)}
                className="mt-2 bg-white text-blue-600 rounded-full px-4 py-2 text-sm font-medium shadow hover:bg-gray-100 transition duration-200"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={toggleSortOrder}
          className="bg-blue-600 text-white rounded-full px-4 py-2 hover:bg-blue-500 transition duration-200"
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
  );
};

export default Sales;
