import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom'; // Make sure to import Link if you're using react-router-dom


const HomePage = () => {
    return (
        <div className="bg-gradient-to-r from-green-400 to-blue-500 min-h-screen text-white flex flex-col">
            {/* Header Section */}
            <header className="flex justify-between items-center p-6 bg-white bg-opacity-20 rounded-b-lg shadow-lg backdrop-blur-md">
                <Link to="/login" className="flex items-center">
                    <img src='../src/assets/logo.jpg' alt="Shop House Logo" className="h-20" />
                </Link>

                <nav className="space-x-4">
                    <Button type="primary" href="/login"  className="bg-white text-green-600 hover:bg-green-300 transition-colors duration-300 rounded-lg shadow-md">Login</Button>
                    <Button type="primary" href="/reg"  className="bg-white text-green-600 hover:bg-green-300 transition-colors duration-300 rounded-lg shadow-md">Sign Up</Button>
                </nav>
            </header>

            {/* Hero Section */}
            <div className="flex flex-col items-center justify-center flex-1 text-center mt-20 animate-fadeIn">
                <h2 className="text-4xl md:text-6xl font-extrabold mb-4 animate-bounce">SHOP HOUSE POS Solution</h2>
                <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">Streamline operations and boost sales effortlessly with our intuitive and powerful tools.</p>

                <Link to="/login" className="flex items-center">
                    <img src="../src/assets/logo.jpg" alt="Shop House Logo" className="h-64 w-55" /> {/* Adjust h-16 and w-16 as needed */}
                </Link>


                <Button
                    type="primary"
                    href="/dashboard"
                    size="large"
                    className="animate-pulse bg-white text-green-600 hover:bg-green-300 m-10 transition-transform duration-300 transform hover:scale-110 shadow-lg rounded-lg"
                >
                    Get Started
                </Button>
            </div>

            {/* Features Section */}
            <section className="py-20 bg-white text-blue-600">
                <div className="container mx-auto px-4">
                    <h3 className="text-3xl font-semibold text-center mb-10 animate-fadeIn">Core Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature Cards */}
                        {[
                            { title: "🛒 Inventory Management", description: "Easily manage your stock levels.", link: "/inventory" },
                            { title: "📊 Sales Analytics", description: "Track performance and make informed decisions.", link: "/sales" },
                            { title: "👥 Customer Management", description: "Enhance customer relationships and preferences.", link: "/customers" },
                            { title: "💳 Payment Processing", description: "Accept multiple payment methods seamlessly." }
                        ].map((feature, index) => (
                            <Link key={index} to={feature.link} className="block">
                                <div
                                    className="cursor-pointer bg-gray-100 rounded-lg p-6 shadow-lg transition-transform transform hover:scale-105 duration-300 animate-fadeIn"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <h4 className="text-xl font-bold mb-2 text-blue-600">{feature.title}</h4>
                                    <p className="text-gray-700">{feature.description}</p>
                                </div>
                            </Link>
                        ))}
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
