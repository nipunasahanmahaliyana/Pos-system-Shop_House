import React, { useState } from 'react';

const Customers = () => {
  const initialCustomersData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', purchases: 3 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', purchases: 5 },
    { id: 3, name: 'David Lee', email: 'david@example.com', purchases: 2 },
    { id: 4, name: 'Alice Johnson', email: 'alice@example.com', purchases: 4 },
    { id: 5, name: 'Bob Brown', email: 'bob@example.com', purchases: 1 },
    { id: 6, name: 'Charlie Wilson', email: 'charlie@example.com', purchases: 6 },
    { id: 7, name: 'Eve Adams', email: 'eve@example.com', purchases: 3 },
    { id: 8, name: 'Frank Wright', email: 'frank@example.com', purchases: 7 },
    { id: 9, name: 'Grace Hopper', email: 'grace@example.com', purchases: 4 },
    { id: 10, name: 'Henry Ford', email: 'henry@example.com', purchases: 2 },
    // Add more customer data as needed
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items to display per page

  const filteredCustomers = initialCustomersData.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastCustomer = currentPage * itemsPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Customer List</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 border border-gray-300 rounded-md w-full md:w-1/3"
        />
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer">Purchases</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-blue-100 transition duration-200">
                <td className="px-4 py-4 text-sm text-gray-700">{customer.name}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{customer.email}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{customer.purchases}</td>
              </tr>
            ))}
            {currentCustomers.length === 0 && (
              <tr>
                <td colSpan="3" className="px-4 py-4 text-sm text-gray-700 text-center">No customers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Customers;
