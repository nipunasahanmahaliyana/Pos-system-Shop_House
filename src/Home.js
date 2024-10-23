import React from 'react';
import { Button } from 'antd';

const HomePage = () => {
  return (
    <div className="bg-gradient-to-r from-green-400 to-blue-500 min-h-screen text-white flex flex-col">
      {/* Header Section */}
      <header className="flex justify-between items-center p-6 bg-white bg-opacity-20 rounded-b-lg">
        <h1 className="text-4xl font-extrabold">Shop House</h1>
        <nav className="space-x-4">
          <Button type="primary" className="bg-white text-green-600 hover:bg-green-300">Login</Button>
          <Button type="primary" className="bg-white text-green-600 hover:bg-green-300">Sign Up</Button>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center flex-1 text-center mt-20">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-4 animate-bounce">Your All-in-One POS Solution</h2>
        <p className="text-lg md:text-xl mb-6">Streamline operations and boost sales effortlessly.</p>
        <Button type="primary" size="large" className="bg-white text-green-600 hover:bg-green-300 m-10">
          Get Started
        </Button>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-white text-blue-600">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-semibold text-center mb-10">Core Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-100 rounded-lg p-6 shadow-lg transition-transform transform hover:scale-105">
              <h4 className="text-xl font-bold mb-2">🛒 Inventory Management</h4>
              <p className="text-gray-700">Easily manage your stock levels.</p>
            </div>
            <div className="bg-gray-100 rounded-lg p-6 shadow-lg transition-transform transform hover:scale-105">
              <h4 className="text-xl font-bold mb-2">📊 Sales Analytics</h4>
              <p className="text-gray-700">Track performance and make informed decisions.</p>
            </div>
            <div className="bg-gray-100 rounded-lg p-6 shadow-lg transition-transform transform hover:scale-105">
              <h4 className="text-xl font-bold mb-2">👥 Customer Management</h4>
              <p className="text-gray-700">Enhance customer relationships and preferences.</p>
            </div>
            <div className="bg-gray-100 rounded-lg p-6 shadow-lg transition-transform transform hover:scale-105">
              <h4 className="text-xl font-bold mb-2">💳 Payment Processing</h4>
              <p className="text-gray-700">Accept multiple payment methods seamlessly.</p>
            </div>
          </div>
        </div>
      </section>


      {/* Footer Section */}
      <footer className="py-6 bg-gray-800 text-center">
        <p className="text-sm text-gray-400">© 2024 Shop House. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
