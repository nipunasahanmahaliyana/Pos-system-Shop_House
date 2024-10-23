import React, { useState, useEffect } from 'react';
import { Select, Input, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const ProductAddition = () => {
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [productName, setProductName] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [productDescription, setProductDescription] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [image, setImage] = useState(null); // Store the image file
    const [previewUrl, setPreviewUrl] = useState(null); // Store the image preview URL


        // Handle image change and preview
        const handleImageChange = (e) => {
            const file = e.target.files[0];
            setImage(file);

            // For image preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        };

    // Fetch categories from the API when the component mounts
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('https://localhost:7220/api/Product/Category');
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories: ", error);
            }
        };

        fetchCategories();
    }, []);

    const handleCategorySubmit = async () => {
        if (!categoryName || !categoryDescription) {
            message.error('Please fill in all fields');
            return;
        }

        try {
            const categoryData = {
                name: categoryName,
                description: categoryDescription
            };

            // Send the POST request with FormData
            const response = await axios.post('https://localhost:7220/api/Product/AddCategory', categoryData, {
                headers: {
                    'Content-Type': 'multipart/form-data' // Set the content type for FormData
                }
            });

           
            console.log('Category added successfully:', response.data);
            message.success('Category added successfully!');
    
            setCategoryName('');
            setCategoryDescription('');
        } catch (error) {
         
            console.error('Error adding category:', error);
        }

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if all fields are filled
        if (!productName || !category || !productPrice || !image) {
            message.error('Please fill in all fields');
            return;
        }

        // Prepare form data to submit
        const formData = new FormData();
        formData.append('name', productName);
        formData.append('description', productDescription);
        formData.append('price', productPrice);
        formData.append('categoryId', category);

        if (image) {
            formData.append('image', image); 
        }

        try {
            const response = await axios.post('https://localhost:7220/api/Inventory/AddProduct', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                // Success handling
                console.log(response.data);
                message.success('Product added successfully!');

                setProductName('');
                setProductDescription('');
                setCategory('');
                setProductPrice('');
                setImage(null); 
                setPreviewUrl('');

            } else {
                // Catch unexpected status codes
                console.warn('Unexpected response status:', response.status);
                message.error('Unexpected response from the server.');
            }
        } catch (error) {
            // Network or server error handling
            if (error.response) {
                // Server responded with a status outside the 2xx range
                const { status, data } = error.response;
                console.error(`Error response from server (Status: ${status}):`, data);

                // Specific error handling based on status codes
                if (status === 400) {
                    message.error('Invalid input. Please check the data you provided.');
                } else if (status === 500) {
                    message.error('Internal server error. Please try again later.');
                } else {
                    message.error(`Unexpected error: ${data}`);
                }
            } else if (error.request) {
                // No response was received
                console.error('No response received:', error.request);
                message.error('No response from the server. Please check your connection.');
            } else {
                // Other errors (likely client-side)
                console.error('Error setting up the request:', error.message);
                message.error('An unexpected error occurred. Please try again.');
            }
        }
    };


    return (
        <div className="p-8 min-h-screen bg-gradient-to-r from-blue-200 to-green-200">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Add New Category</h2>
            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="mb-4">

                    <label className="block text-gray-700 font-semibold mb-2">Category Name</label>
                    <Input
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        placeholder="Enter product name"
                        className="border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div className="mb-4">

                    <label className="block text-gray-700 font-semibold mb-2">Category Descryption</label>
                    <Input
                        value={categoryDescription}
                        onChange={(e) => setCategoryDescription(e.target.value)}
                        placeholder="Category description"
                        className="border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div className="flex justify-end">
                    <Button
                        type="primary"
                        onClick={handleCategorySubmit}
                        className="bg-blue-600 hover:bg-blue-500 transition duration-200"
                    >
                        Add Category
                    </Button>
                </div>
            </div>

            <h2 className="mt-20 text-3xl font-bold text-gray-800 mb-6">Add New Product</h2>
            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Product Name</label>
                    <Input
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="Enter product name"
                        className="border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Category</label>
                    <Select
                        value={category} // this should be the state holding the selected category ID
                        onChange={(value) => setCategory(value)} // Update the categoryId state on change
                        className="w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Select category"
                    >
                        {categories.map((cat) => (
                            <Option key={cat.categoryId} value={cat.categoryId}>
                                {cat.name}
                            </Option>
                        ))}
                    </Select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Price</label>
                    <Input
                        type="number"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                        placeholder="Enter price"
                        className="border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Description</label>
                    <Input.TextArea
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        placeholder="Enter product description"
                        className="border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        rows={4}
                    />
                </div>
                <div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="productImage">
                            Product Image
                        </label>
                        <input
                            id="productImage"
                            type="file"
                            onChange={handleImageChange}
                            className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            accept="image/*"
                        />
                    </div>

                    {/* Image preview */}
                    {previewUrl && (
                        <div className="mb-4">
                            <img src={previewUrl} alt="Product Preview" className="w-32 h-32 object-cover rounded-md shadow-md" />
                        </div>
                    )}
                </div>
                <div className="flex justify-end">
                    <Button
                        type="primary"
                        onClick={handleSubmit}
                        className="bg-blue-600 hover:bg-blue-500 transition duration-200"
                    >
                        Add Product
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProductAddition;
