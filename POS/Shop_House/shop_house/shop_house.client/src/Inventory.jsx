import React, { useState, useEffect } from 'react';
import { Input, Select, Modal, Button, Table ,message} from 'antd';
import axios from 'axios';

const InventoryPage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);

    const fetchInventory = async () => {
        try {
            const response = await axios.get('https://localhost:7220/api/Inventory');
            if (response.data) {
                setProducts(response.data);
                setFilteredProducts(response.data);
            }
        } catch (error) {
            console.error('Error fetching inventory:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('https://localhost:7220/api/Product/Category');
            setCategories(response.data.map(category => ({ value: category.name, label: category.name })));
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const filterProducts = () => {
        let filtered = products;
        if (searchQuery) {
            filtered = filtered.filter(product =>
                product.productName.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (selectedCategory) {
            filtered = filtered.filter(product => product.categoryName === selectedCategory);
        }
        setFilteredProducts(filtered);
    };

    const saveProductChanges = async () => {
        if (!selectedProduct) return; // Ensure selectedProduct is not null

        try {
            // Prepare the data to send
            const formData = new FormData();
            formData.append('id', selectedProduct.inventoryId);
            formData.append('categoryName', selectedProduct.categoryName);
            formData.append('productName', selectedProduct.productName);
            formData.append('stock', selectedProduct.stock);

            console.log("Update Data:", formData); // Log the data being sent

            // Make the PUT request to update inventory
            await axios.put(`https://localhost:7220/api/Inventory/UpdateInventory`, formData);

            // Close modal and refresh inventory
            setIsModalVisible(false);
            fetchInventory(); // Refresh the inventory list after updating
            message.success("Inventory Updated.")
        } catch (error) {
            console.error('Error updating product:', error);
            message.error('Error updating product:', error);
        }
    };



    useEffect(() => {
        fetchCategories();
        fetchInventory();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [searchQuery, selectedCategory, products]);

    const columns = [
        { title: 'Inventory ID', dataIndex: 'inventoryId', key: 'id' },
        { title: 'Product', dataIndex: 'productName', key: 'name' },
        { title: 'Category', dataIndex: 'categoryName', key: 'category' },
        { title: 'Stock', dataIndex: 'stock', key: 'stock', render: stock => stock <= 5 ? <span className="text-red-600 font-semibold">Low Stock ({stock})</span> : stock },
        { title: 'Updated', dataIndex: 'updateDate', key: 'date' },
        {
            title: 'Action',
            key: 'action',
            render: (_, product) => (
                <Button className="bg-blue-600 text-white hover:bg-blue-700 transition duration-300 shadow-lg" onClick={() => handleEditProduct(product)}>
                    Edit
                </Button>
            ),
        },
    ];

    const handleEditProduct = (product) => {
        setSelectedProduct({ ...product }); // Clone product to avoid direct mutation
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setSelectedProduct(null);
        setIsModalVisible(false);
    };

    return (
        <div className="p-8 min-h-screen bg-gradient-to-r from-indigo-200 to-blue-300">
            <div className="mb-6">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Inventory Management</h1>
                <p className="text-gray-600">Manage your inventory with ease and efficiency.</p>
            </div>

            <div className="flex justify-between mb-4 bg-white shadow-lg rounded-lg p-4">
                <Input.Search
                    placeholder="Search Products"
                    className="w-1/2 rounded-lg shadow-md"
                    onSearch={value => setSearchQuery(value)}
                    allowClear
                />
                <Select
                    className="w-1/3 rounded-lg shadow-md"
                    placeholder="Filter by Category"
                    options={categories}
                    onChange={value => setSelectedCategory(value)}
                    allowClear
                />
            </div>

            <Table
                columns={columns}
                dataSource={filteredProducts}
                rowKey="inventoryId"
                className="bg-white shadow-lg rounded-lg"
                pagination={{ pageSize: 5 }} // Adjust pagination
                rowClassName={(record, index) => `transition-all duration-300 hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`} // Zebra striping and hover effect
                onRow={record => ({
                    onClick: () => handleEditProduct(record), // Click to edit
                })}
                footer={() => <div className="p-4 text-right text-gray-600">Total Inventories: {filteredProducts.length}</div>} // Total count in footer
                summary={pageData => {
                    let totalStock = 0;
                    pageData.forEach(({ stock }) => {
                        totalStock += stock;
                    });
                    return (
                        <Table.Summary fixed>
                            <Table.Summary.Row>
                                <Table.Summary.Cell index={0} colSpan={3}>Total Stock</Table.Summary.Cell>
                                <Table.Summary.Cell index={1}>{totalStock}</Table.Summary.Cell>
                                <Table.Summary.Cell index={2}></Table.Summary.Cell>
                            </Table.Summary.Row>
                        </Table.Summary>
                    );
                }}
            />

            {/* Edit Product Modal */}
            <Modal
                title="Update Inventory"
                visible={isModalVisible}
                onCancel={handleModalClose}
                footer={null}
                className="rounded-lg"
            >
                {selectedProduct && (
                    <div className="flex flex-col gap-4">
                        <Input
                            placeholder="Product Name"
                            value={selectedProduct.productName}
                            onChange={e => setSelectedProduct({ ...selectedProduct, productName: e.target.value })}
                            className="border border-gray-300 rounded-lg p-2 shadow-md"
                        />
                        <Select
                            value={selectedProduct.categoryName}
                            options={categories}
                            onChange={value => setSelectedProduct({ ...selectedProduct, categoryName: value })}
                            className="border border-gray-300 rounded-lg shadow-md"
                        />
                        <Input
                            type="number"
                            placeholder="Stock Quantity"
                            value={selectedProduct.stock}
                            onChange={e => setSelectedProduct({ ...selectedProduct, stock: parseInt(e.target.value) })}
                            className="border border-gray-300 rounded-lg p-2 shadow-md"
                        />
                        <Button className="bg-blue-600 text-white hover:bg-blue-700 w-full shadow-lg" onClick={saveProductChanges}>
                            Save Changes
                        </Button>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default InventoryPage;
