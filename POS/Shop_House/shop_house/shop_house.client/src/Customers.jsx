import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Customers = () => {
    
        const [initialCustomersData, setCustomers] = useState([]);
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(null);

        // Fetch customer data when the component mounts
        useEffect(() => {
            const fetchCustomers = async () => {
                setLoading(true); // Start loading
                setError(null);   // Reset error before new request

                try {
                    const response = await axios.get('https://localhost:7220/api/Customer/Customers');

                    if (response.status === 200) {
                        setCustomers(response.data); // Handle success
                    } else {
                        setError(`Unexpected response status: ${response.status}`);
                    }
                } catch (error) {
                    // Handle different error cases

                    if (error.response) {
                        // Response was made and the server responded with a status code that falls out of the range of 2xx
                        setError(`Server responded with status: ${error.response.status}. Message: ${error.response.data}`);
                    } else if (error.request) {
                        // The request was made but no response was received
                        setError('No response received from server.');
                    } else if (error.code === 'ECONNABORTED') {
                        // Handle request timeout
                        setError('Request timed out. Please try again.');
                    } else {
                        // Something happened in setting up the request that triggered an error
                        setError(`Request error: ${error.message}`);
                    }
                } finally {
                    setLoading(false); // Stop loading after the request is done
                }
            };

            fetchCustomers();
        }, []);

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
        <div className=" mx-auto min-h-screen px-4 py-8 bg-gradient-to-r from-indigo-200 to-blue-300">
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
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer">Phone Number</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer">Created Date</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer">Purchases</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentCustomers.map((customer) => (
                            <tr key={customer.id} className="hover:bg-blue-100 transition duration-200">
                                <td className="px-4 py-4 text-sm text-gray-700">{customer.name}</td>
                                <td className="px-4 py-4 text-sm text-gray-700">{customer.email}</td>
                                <td className="px-4 py-4 text-sm text-gray-700">{customer.phone}</td>
                                <td className="px-4 py-4 text-sm text-gray-700">{customer.createdAt}</td>
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
