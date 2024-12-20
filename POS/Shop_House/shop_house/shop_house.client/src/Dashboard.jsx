import { useState } from 'react';
import {
    DollarCircleOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    PlusCircleOutlined,
    MinusCircleOutlined,
    //InfoCircleOutlined,
} from '@ant-design/icons';
import { Table, Button, InputNumber, notification, Modal } from 'antd';

const cart_id = sessionStorage.getItem("CartId");
const customer_id =sessionStorage.getItem("CustomerId");


const Dashboard = () => {
    const [checkoutItems, setCheckoutItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [totalAmount, setTotalAmount] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [itemDetails, setItemDetails] = useState({});

    // Sample products
    const products = [
        { name: 'Apple', price: 1.5, description: 'Fresh red apples.' },
        { name: 'Banana', price: 1.0, description: 'Ripe bananas.' },
        { name: 'Orange', price: 2.0, description: 'Juicy oranges.' },
        // Add more products here
    ];

    const recentSalesData = [
        { key: '1', date: '2023-11-20', customer: 'John Doe', total: '$120.50' },
        { key: '2', date: '2023-11-19', customer: 'Jane Smith', total: '$85.20' },
        { key: '3', date: '2023-11-18', customer: 'David Lee', total: '$250.00' },
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
            const existingItem = checkoutItems.find((item) => item.name === product.name);
            const newItem = {
                name: product.name,
                price: product.price,
                quantity,
                total: product.price * quantity,
            };
            if (existingItem) {
                // Update existing item quantity and total
                const updatedItems = checkoutItems.map((item) =>
                    item.name === product.name
                        ? { ...item, quantity: item.quantity + quantity, total: item.total + newItem.total }
                        : item
                );
                setCheckoutItems(updatedItems);
            } else {
                setCheckoutItems([...checkoutItems, newItem]);
            }
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

    const showDetails = (item) => {
        setItemDetails(item);
        setModalVisible(true);
    };

    const handleModalClose = () => {
        setModalVisible(false);
    };

    return (
        <div className="min-w-full  p-6 bg-gradient-to-r from-blue-200 to-green-200">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h2>

            {/* Statistics Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white shadow-lg p-6 rounded-lg flex items-center justify-between">
                    <div>
                        <p className="text-gray-500">Total Sales</p>
                        <h3 className="text-2xl font-semibold text-black">$112,893</h3>
                    </div>
                    <DollarCircleOutlined className="text-4xl text-green-500" />
                </div>

                <div className="bg-white shadow-lg p-6 rounded-lg flex items-center justify-between">
                    <div>
                        <p className="text-gray-500">Orders</p>
                        <h3 className="text-2xl font-semibold text-black">1,234</h3>
                    </div>
                    <ShoppingCartOutlined className="text-4xl text-blue-500" />
                </div>

                <div className="bg-white shadow-lg p-6 rounded-lg flex items-center justify-between">
                    <div>
                        <p className="text-gray-500">Customers</p>
                        <h3 className="text-2xl font-semibold text-black">5,678</h3>
                    </div>
                    <UserOutlined className="text-4xl text-purple-500" />
                </div>

                <div className="bg-white shadow-lg p-6 rounded-lg">
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
                    <h3 className="text-2xl font-semibold mb-4 text-black">Checkout</h3>
                    <h3 className="text-xl font-semibold mb-4 text-green-600">in Hand</h3>
                    <select
                        value={selectedItem}
                        onChange={(e) => setSelectedItem(e.target.value)}
                        className="mb-4 w-full px-4 py-2 border border-red-800 rounded-lg"
                    >
                        <option value="">Select a product</option>
                        {products.map((product) => (
                            <option key={product.name} value={product.name}>
                                {product.name} - ${product.price}
                            </option>
                        ))}
                    </select>
                    <h4 className="text-xl font-semibold mb-4 text-grey-200">Quantity</h4>
                    <InputNumber
                        min={1}
                        value={quantity}
                        onChange={(value) => setQuantity(value)}
                        className="w-full mb-4 border border-red-800 rounded-lg"
                    />
                    <h4 className="text-xl font-semibold mb-4 text-grey-200">Price</h4>
                    <InputNumber
                        className="w-full mb-4 border border-red-800 rounded-lg"
                    />
                    <h3 className="text-xl font-semibold mb-4 text-green-600">Bracode Scan</h3>
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
                    <h3 className="text-2xl font-semibold mb-4 text-black">Items in Cart</h3>
                    {customer_id !== "-" && cart_id !== "-" ? (
                        <>
                            <h1 className="text-sm text-green-600 font-bold">Customer ID: {customer_id}</h1>
                            <h1 className="text-sm text-green-600 font-bold">Cart ID: {cart_id}</h1>
                        </>
                    ) : (
                        <p>No Customer walked in</p>
                    )}

                    
                    {checkoutItems.length > 0 ? (
                        <ul className="space-y-2">
                            {checkoutItems.map((item, index) => (
                                <li key={index} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg text-black">
                                    <div className="flex-1 cursor-pointer" onClick={() => showDetails(item)}>
                                        {item.name} (x{item.quantity}) - ${item.total.toFixed(2)}
                                    </div>
                                    <div className="flex items-center">
                                        <InputNumber
                                            min={1}
                                            value={item.quantity}
                                            onChange={(value) => {
                                                const updatedItems = checkoutItems.map((i) =>
                                                    i.name === item.name
                                                        ? { ...i, quantity: value, total: item.price * value }
                                                        : i
                                                );
                                                setCheckoutItems(updatedItems);
                                                setTotalAmount(updatedItems.reduce((sum, i) => sum + i.total, 0));
                                            }}
                                            style={{ width: 60, marginRight: 8 }}
                                        />
                                        <Button
                                            onClick={() => removeItem(item)}
                                            icon={<MinusCircleOutlined />}
                                            className="text-red-600 hover:bg-red-100 transition-all"
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-black">No items in the cart.</p>
                    )}

                    <div className="mt-4">
                        <h4 className="text-2xl font-semibold text-black mb-9">Total: ${totalAmount.toFixed(2)}</h4>
                    </div>
                    <Button
                        onClick={addToCheckout}
                        type="primary"
                        icon={<PlusCircleOutlined />}
                        className="w-full bg-red-600 hover:bg-blue-700 transition-all"
                    >
                        Proceed Pay
                    </Button>
                </div>
            </div>

            {/* Recent Sales */}
            <div className="bg-white shadow-lg p-6 rounded-lg mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-black">Recent Sales</h3>
                <Table dataSource={recentSalesData} columns={recentSalesColumns} pagination={false} />
            </div>

            {/* Item Details Modal */}
            <Modal
                title={itemDetails.name}
                visible={modalVisible}
                onCancel={handleModalClose}
                footer={null}
            >
                <p>{itemDetails.description}</p>
                <p>Price: ${itemDetails.price}</p>
                <p>Quantity: {itemDetails.quantity}</p>
                <p>Total: ${itemDetails.total}</p>
            </Modal>
        </div>
    );
};

export default Dashboard;
