import React, { useState, useEffect } from 'react';
import { Button, Input, notification, Modal, Select, message, Drawer, Table } from 'antd';
import { ShoppingCartOutlined, DeleteOutlined, UserAddOutlined, CloseCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Pagination } from 'antd';
import { v4 as uuidv4 } from 'uuid';

const { Option } = Select;

const ProductsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [cart, setCart] = useState([]);  // Cart state
    const [drawerVisible, setDrawerVisible] = useState(false); // Drawer state for cart
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [categoryMap, setCategoryMap] = useState({});
    const [cartId, setCartId] = useState('');
    // State to hold the array of cart items
    const [cartArray, setCartArray] = useState([]);
    const [errorMessage, setMessage] = useState('No customer'); // State to hold the message
    const [isCustomerAdded, setIsCustomerAdded] = useState(false);
    const [disableCustomerButton, setdisableCustomerButton] = useState(true);
    //const [disableRemoveButton, setdisableCustomerRemoveButton] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; // Number of products per page

    // Fetch products from the API
    const fetchProducts = async () => {
        setLoading(true); // Set loading state to true before the API call
        try {
            const response = await axios.get('https://localhost:7220/api/Product');
            if (response.status === 200) {
                setProducts(response.data); // Update the products state
            } else {
                message.error(`Error: ${response.status} - ${response.statusText}`);
            }
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data || 'Error occurred while fetching products.';
                message.error(`Server Error: ${errorMessage}`);
            } else if (error.request) {
                message.error('Network error: No response from the server.');
            } else {
                message.error(`Error: ${error.message}`);
            }
        } finally {
            setLoading(false); // Set loading state to false after the API call
        }
    };

    const sendItemsToCart = async (productIdsArray) => {
        // Loop through each product ID and send a separate Axios request
        for (let i = 0; i < productIdsArray.length; i++) {
            const productId = productIdsArray[i];
            const formData = new FormData();
            formData.append('id', productId);

            try {
                const response = await axios.put(`https://localhost:7220/api/Product/Checkout`, formData);
                console.log(response.data);
                message.success(`Product ID ${productId} checked out successfully.`);
                message.success('All products processed for checkout.');
                setCart([]);
            } catch (error) {
                if (error.response) {
                    message.error(`Error for Product ID ${productId}: ${error.response.data.message}`);
                } else if (error.request) {
                    message.error(`No response from server for Product ID ${productId}.`);
                } else {
                    message.error(`Error: ${error.message}`);
                }
            }
        }
    };
    const generatCartId =  () => {
        
            // Generate a unique cart ID
            const uniqueCartId = uuidv4();

            // Get the current date in 'YYYYMMDD' format
            const currentDate = new Date();
            const datePart = currentDate.toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD format

            // Combine the date with the unique ID
            const finalCartId = `${datePart}-${uniqueCartId}`;

            setCartId(finalCartId); // Set the combined cart ID

            // Store CartId and CustomerId in session storage
            sessionStorage.setItem("CartId", finalCartId);
 
    }

    // Call the fetchProducts function when the component mounts
    useEffect(() => {
        fetchProducts();
        const fetchCategories = async () => {

            try {
                const response = await axios.get('https://localhost:7220/api/Product/Category');
                setCategories(response.data);
                const map = {};
                response.data.forEach(category => {
                    map[category.categoryId] = category.name;
                });
                setCategoryMap(map);
            } catch (error) {
                console.error("Error fetching categories: ", error);
            }
        };

        fetchCategories();
        //generatCartId();

        //const disable = sessionStorage.getItem("disable");

        // If CustomerId exists, enable the button
        //if (disable) {
            //setdisableCustomerButton(false);
        //} else {
            //setdisableCustomerButton(true);
        //}
  
    }, []);


    const AddToCart = async () => {
       
        console.log(cartArray);
        console.log(cartId);
    
        try {
            // Iterate through the array of cart items
            for (const cartItem of cartArray) {
                // Create a plain object for each cart item
                const cartData = {
                    userId: cartItem.UserId,
                    productName: cartItem.ProductName,
                    quantity: cartItem.Quantity,
                    price: cartItem.Price,
                    dateAdded: new Date().toISOString(), // Current date
                    categoryName: cartItem.CategoryName,
                    customer_RefNo: customerId
                };

                // Make a POST request with the ID in the URL and cartData in the body
                const response = await axios.post(`https://localhost:7220/api/Cart/AddToCart?id=${cartId}`, cartData, {
                    headers: {
                        'Content-Type': 'application/json', // Set the appropriate content type for JSON
                    },
                });


                // Check response and show appropriate message
                if (response.status === 200) {
                    message.success(`Cart updated successfully for item: ${cartItem.ProductName}`);
                    setCart([]);
                } else {
                    message.error(`Failed to update cart for item: ${cartItem.ProductName}, Status: ${response.status}`);
                }
            }
        } catch (error) {
            // Catch block for errors
            if (error.response) {
                message.error(`Error: ${error.response.data}`);
            } else {
                message.error(`Error: ${error.message}`);
            }
        }
    };

    // Function to store row details into an array
    const extractRowDetailsToArray = () => {
        // Check if aggregatedCartItems is an array
        if (!Array.isArray(aggregatedCartItems)) {
            console.error('aggregatedCartItems is not an array:', aggregatedCartItems);
            return; // Exit the function if it's not an array
        }

        const cartItemsArray = aggregatedCartItems.map((item) => {
            // Ensure the item has all required properties
            const { productId, name, categoryId, quantity, price, totalPrice } = item;

            // Log a warning and skip this item if any required properties are missing
            if (!productId || !name || !categoryId || quantity === undefined || price === undefined || totalPrice === undefined) {
                console.warn('Item is missing required properties:', item);
                return null; // Skip this item
            }

            // Create the cart item object
            return {
                CartId: productId, // Assuming productId is used as CartId
                UserId: 23, // Hardcoded UserId; change as needed
                ProductName: name,
                CategoryName: getCategoryName(categoryId), // Ensure this function works as expected
                Quantity: quantity,
                Price: price,
                TotalPrice: totalPrice,
            };
        }).filter(item => item !== null); // Filter out any null values

        // Store the cart items into the state
        setCartArray(cartItemsArray);
        console.log(cartItemsArray); // Inspect the array in the console
    };

    const handleAddToCart = (product) => {

        //console.log(`Generated Cart ID: ${cartId}`);
        // Check if product already exists in cart with the same name and category
        const existingProductIndex = cart.findIndex(item => item.productId === product.productId);

        if (existingProductIndex >= 0) {
            // Product exists, increase quantity and update total price
            const updatedCart = [...cart];
            updatedCart[existingProductIndex].quantity += 1;
            updatedCart[existingProductIndex].totalPrice = updatedCart[existingProductIndex].price * updatedCart[existingProductIndex].quantity;
            setCart(updatedCart);
        } else {
            // Product does not exist, add it with quantity 1 and set total price
            const newProduct = { ...product, quantity: 1, totalPrice: product.price };
            setCart([...cart, newProduct]);
        }

        notification.success({
            message: 'Product Added',
            description: `${product.name} has been added to your cart.`,
            placement: 'bottomRight',
            duration: 2, // Notification will close after 3 seconds
            
        });
    };

    const handleRemoveFromCart = (productId) => {
        const updatedCart = cart.filter((item) => item.productId !== productId);
        setCart(updatedCart);
        notification.info({
            message: 'Product Removed',
            description: `The product has been removed from your cart.`,
            placement: 'bottomRight',
            duration: 2, // Notification will close after 3 seconds
        });
    };

    const showModal = (product) => {
        setSelectedProduct(product);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedProduct(null);
    };

    const showDrawer = () => {
        setDrawerVisible(true);
    };

    const closeDrawer = () => {
        setDrawerVisible(false);
    };

    const getCategoryName = (categoryId) => {
        return categoryMap[categoryId] || 'Unknown Category';
    };

    // Filter products based on search term, selected category, and cart items
    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.categoryId === selectedCategory;
        const isNotInCart = !cart.some(cartItem => cartItem.productId === product.productId);
        return matchesSearch && matchesCategory && isNotInCart;
    });

    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const getProductIds = () => {
        return cart.map(product => product.productId);
    };

    const handleCheckout = () => {
  
        const productIdsArray = getProductIds();
        message.success('Proceeding to Checkout');
        sendItemsToCart(productIdsArray);
        extractRowDetailsToArray();
        AddToCart();
    };

    // Aggregate cart items by name and category
    const aggregateCartItems = () => {
        const aggregated = {};

        cart.forEach((item) => {
            const key = `${item.name} (${getCategoryName(item.categoryId)})`; // Unique key for aggregation
            if (aggregated[key]) {
                aggregated[key].quantity += item.quantity; // Sum quantities
                aggregated[key].totalPrice += item.totalPrice; // Sum total prices
            } else {
                aggregated[key] = {
                    ...item,
                    categoryId: item.categoryId, // Retain category ID for display
                };
            }
        });

        return Object.values(aggregated);
    };

    // Checkout Table Columns
    const aggregatedCartItems = aggregateCartItems(); // Get aggregated items for the table

    const columns = [
        {
            title: 'Product',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => `${text} (${getCategoryName(record.categoryId)})`, // Show product name with category
        },
        {
            title: 'Price (Rs)',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `Rs ${price.toFixed(2)}`,
        },
        {
            title: 'Quantity',
            key: 'quantity',
            render: (_, record) => record.quantity, // Use aggregated quantity
        },
        {
            title: 'Total (Rs)',
            key: 'total',
            render: (_, record) => `Rs ${(record.totalPrice).toFixed(2)}`, // Use the aggregated total price
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="danger"
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveFromCart(record.productId)} // Calls the remove function
                >
                    Remove
                </Button>
            ),
        }
    ];
 
    // Calculate Grand Total
    const grandTotal = aggregatedCartItems.reduce((acc, product) => acc + product.totalPrice, 0);

    const handleClick = () => {
        setIsCustomerAdded(true);
        generateCustomerId();
        generatCartId();
        setdisableCustomerButton(false);
        setMessage('New Customer Arrived!'); // Update the message
        sessionStorage.setItem("disable", true);
    };

    const [customerId, setCustomerId] = useState('');

    const generateCustomerId = () => {
        const timestamp = Date.now();
        const randomNum = Math.floor(Math.random() * 1000);
        const customerId = `CUST-${timestamp}-${randomNum}`;
        setCustomerId(customerId);
        // Store CartId and CustomerId in session storage
        sessionStorage.setItem("CustomerId", customerId);
    };

    return (
        <div className="mx-auto min-h-screen px-4 py-8 bg-gradient-to-r from-indigo-200 to-blue-300">
            <h2 className="text-4xl font-extrabold mb-6 text-gray-800">Products</h2>
            <div>
                
                <Button
                    type="primary"
                    icon={<UserAddOutlined />} // Use the User Add icon
                    disabled={!disableCustomerButton}
                    onClick={() => {
                        handleClick();
                        //sessionStorage.setItem("disable", false);
                        setdisableCustomerButton(false);
                    }} // Handle click
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-5 rounded-lg shadow-md transition-transform transform hover:scale-105"
                    size="large"
                >
                    Walk in Customer
                </Button>

                <Button
                    type="primary"
                    icon={<UserAddOutlined />} // Use the User Add icon
                    disabled={disableCustomerButton}
                    onClick={() => {
                        setCustomerId('-');
                        setCartId('-');
                        //setdisableCustomerRemoveButton(false);
                        setCart([]);
                        setMessage('Customer has been removed');
                        setIsCustomerAdded(true);
                        // Store CartId and CustomerId in session storage
                        sessionStorage.setItem("CartId", '-');
                        sessionStorage.setItem("CustomerId", '-');
                        
                        //sessionStorage.setItem("disable", true);
                        
                    }
                    } // Handle click
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-5 rounded-lg shadow-md transition-transform transform hover:scale-105 ml-2"
                    size="large"
                >
                    Remove Customer
                </Button>
                <Button
                    type="default"
                    icon={<CloseCircleOutlined />}
                    onClick={() => {
                        setCartId('-');
                        setCustomerId('-');
                        sessionStorage.setItem("CartId", '-');
                        sessionStorage.setItem("CustomerId", '-');
                        setdisableCustomerButton(true);
                        setCart([]);
                    }} // Function to clear the session storage or state
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg ml-2"
                >
                    <span className="ml-2">Clear IDs</span>
                </Button>
              
                <h2 className="text-lg font-extrabold text-gray-800 mt-2">Customer id: {sessionStorage.getItem("CartId")}</h2>
                <h2 className="text-lg font-extrabold mb-6 text-gray-800">Cart id: {sessionStorage.getItem("CustomerId")}</h2>
                {errorMessage && ( // Conditionally render the message
                    <p className="mt-2 text-green-700 font-semibold">{errorMessage}</p>
                )}
            </div>

            {/* Search Bar */}
            <div className="mb-6 flex justify-between">
                <Input.Search
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-1/2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Category Dropdown */}
                <Select
                    defaultValue="All"
                    className="w-1/4 border border-gray-300 rounded-lg"
                    onChange={(value) => setSelectedCategory(value)}
                >
                    <Option value="All">All Categories</Option>
                    {categories.map((category) => (
                        <Option key={category.categoryId} value={category.categoryId}>
                            {category.name}
                        </Option>
                    ))}
                </Select>

                {/* Cart Button */}
                <Button
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    onClick={() => {
                        showDrawer();
                        extractRowDetailsToArray();
                    }}
                >
                    Cart ({cart.length})
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                    <p>Loading products...</p>
                ) : (
                    currentProducts.map((product) => (
                        <div
                            key={product.productId}
                            className="relative border border-gray-300 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => showModal(product)}
                        >
                            <img
                                src={product.imageBase64 ? `data:image/png;base64,${product.imageBase64}` : 'https://via.placeholder.com/150'}
                                alt={product.name}
                                className="w-full h-32 object-cover rounded-t-lg mb-2"
                            />

                            <span className="absolute top-2 right-2 bg-green-200 text-green-800 font-bold px-2 py-1 rounded">
                                {getCategoryName(product.categoryId)}
                            </span>
                            <h3 className="text-xl font-semibold">{product.name}</h3>
                            <p className="text-gray-600">Price: Rs {product.price.toFixed(2)}</p>

                            <Button
                                type="primary"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // Check if the customer has been added
                                    {var id = sessionStorage.getItem("CartId")}
                                    { var cusid = sessionStorage.getItem("CustomerId") }
                                    if (!isCustomerAdded && (id === '-' && cusid === '-')) {
                                        const errorMsg = 'Please click "New Customer" first before adding items to the cart.';
                                        setMessage(errorMsg);
                                        message.error(errorMsg); // Use errorMsg instead of errorMessage
                                        return;
                                    }


                                    // Proceed to add the product to the cart
                                    handleAddToCart(product);
                                    
                                }}
                            >
                                Add to Cart
                            </Button>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            <Pagination
                current={currentPage}
                total={filteredProducts.length}
                pageSize={itemsPerPage}
                onChange={handlePageChange}
                className="mt-8"
            />

            {/* Modal for product details */}
            <Modal
                title={selectedProduct ? selectedProduct.name : ''}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                {selectedProduct && (
                    <div>
                        <img
                            src={selectedProduct.imageBase64 ? `data:image/png;base64,${selectedProduct.imageBase64}` : 'https://via.placeholder.com/150'}
                            alt={selectedProduct.name}
                            className="w-full h-32 object-cover rounded-t-lg mb-2"
                        />
                        <p>Price: Rs {selectedProduct.price.toFixed(2)}</p>
                        <p>Category: {getCategoryName(selectedProduct.categoryId)}</p>
                    </div>
                )}
            </Modal>

            {/* Drawer for cart */}
            <Drawer
                title="Cart"
                placement="right"
                onClose={closeDrawer}
                visible={drawerVisible}
                width={550}
            >
                <div>
                    <h2 className="text-lg font-extrabold mb-1 text-gray-800">Cart id: {sessionStorage.getItem("CartId")}</h2>
                    <h2 className="text-lg font-extrabold text-gray-800">Customer id: {sessionStorage.getItem("CustomerId")}</h2>
                </div>
                <Table
                    dataSource={aggregatedCartItems} // Use aggregated items for the table
                    columns={columns}
                    pagination={false}
                    rowKey={(record) => `${record.productId}-${record.quantity}`} // Unique key for each row
                />
                <h2 className="text-xl font-bold mt-4">Grand Total: Rs {grandTotal.toFixed(2)}</h2>
                <Button
                    type="primary"
                    className="mt-4"
                    onClick={handleCheckout}
                >
                    Checkout
                </Button>
            </Drawer>
        </div>
    );
};

export default ProductsPage;
