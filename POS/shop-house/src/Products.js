import React, { useState } from 'react';
import { Button, Input, notification, Modal, Select } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

const { Option } = Select;

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Sample products
  const products = [
    { id: 1, name: 'Apple', price: 1.5, category: 'Fruits', image: 'https://via.placeholder.com/150', description: 'Fresh and juicy apples.' },
    { id: 2, name: 'Banana', price: 1.0, category: 'Fruits', image: 'https://via.placeholder.com/150', description: 'Ripe bananas, perfect for snacking.' },
    { id: 3, name: 'Orange', price: 2.0, category: 'Fruits', image: 'https://via.placeholder.com/150', description: 'Sweet and tangy oranges.' },
    { id: 4, name: 'Broccoli', price: 2.5, category: 'Vegetables', image: 'https://via.placeholder.com/150', description: 'Green and healthy broccoli.' },
    { id: 5, name: 'Carrot', price: 1.8, category: 'Vegetables', image: 'https://via.placeholder.com/150', description: 'Crunchy carrots, great for salads.' },
    { id: 6, name: 'Chicken', price: 5.0, category: 'Meat', image: 'https://via.placeholder.com/150', description: 'Fresh chicken, perfect for grilling.' },
  ];

  const handleAddToCart = (product) => {
    setCart([...cart, product]);
    notification.success({
      message: 'Product Added',
      description: `${product.name} has been added to your cart.`,
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

  // Filter products by category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Search Bar */}
      <div className="mb-6 flex justify-between">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Category Dropdown */}
        <Select
          defaultValue="All"
          onChange={(value) => setSelectedCategory(value)}
          className="w-1/3 ml-4"
        >
          <Option value="All">All Categories</Option>
          <Option value="Fruits">Fruits</Option>
          <Option value="Vegetables">Vegetables</Option>
          <Option value="Meat">Meat</Option>
        </Select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105 p-4 relative overflow-hidden cursor-pointer"
            onClick={() => showModal(product)}
          >
            {/* Category Badge */}
            <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold rounded-full px-2 py-1">
              {product.category}
            </span>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover rounded-md mb-4 shadow-md"
            />
            <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
            <p className="text-lg text-gray-600 mb-4">${product.price.toFixed(2)}</p>
            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              onClick={(e) => {
                e.stopPropagation(); // Prevent modal from opening when clicking the button
                handleAddToCart(product);
              }}
              className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-blue-500 hover:to-green-400 transition-all duration-300"
            >
              Add to Cart
            </Button>
          </div>
        ))}
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <Modal
          title={selectedProduct.name}
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <img
            src={selectedProduct.image}
            alt={selectedProduct.name}
            className="w-full h-40 object-cover mb-4 rounded-md"
          />
          <p className="text-lg text-gray-600 mb-4">{selectedProduct.description}</p>
          <p className="text-xl font-bold">${selectedProduct.price.toFixed(2)}</p>
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            onClick={() => {
              handleAddToCart(selectedProduct);
              handleCancel();
            }}
            className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-blue-500 hover:to-green-400 transition-all duration-300 mt-4"
          >
            Add to Cart
          </Button>
        </Modal>
      )}
    </div>
  );
};

export default ProductsPage;
