import React, { useState } from 'react';
import { Switch, Input, Button, Slider, Upload, Select, notification } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('English');
  const [volume, setVolume] = useState(50);
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('Fruits');
  const [productPrice, setProductPrice] = useState('');
  const [productImage, setProductImage] = useState(null);

  const languages = ['English', 'Spanish', 'French', 'German', 'Chinese'];
  const categories = ['Fruits', 'Vegetables', 'Meat', 'Beverages'];

  const handleDarkModeToggle = () => setDarkMode(!darkMode);
  const handleNotificationsToggle = () => setNotifications(!notifications);
  const handleLanguageChange = (e) => setLanguage(e.target.value);
  const handleVolumeChange = (value) => setVolume(value);

  const handleProductImageChange = (info) => {
    if (info.file.status === 'done') {
      setProductImage(info.file);
    }
  };

  const handleAddProduct = () => {
    if (productName && productPrice && productImage) {
      notification.success({
        message: 'Product Added',
        description: `${productName} has been successfully added.`,
      });
      // Clear form after submission
      setProductName('');
      setProductCategory('Fruits');
      setProductPrice('');
      setProductImage(null);
    } else {
      notification.error({
        message: 'Failed to Add Product',
        description: 'Please fill all fields before adding the product.',
      });
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8">Settings</h1>

        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">General Settings</h2>

          {/* Dark Mode */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-medium">Dark Mode</span>
            <Switch checked={darkMode} onChange={handleDarkModeToggle} />
          </div>

          {/* Notifications */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-medium">Notifications</span>
            <Switch checked={notifications} onChange={handleNotificationsToggle} />
          </div>

          {/* Language */}
          <div className="mb-4">
            <label htmlFor="language" className="block text-lg font-medium mb-2">
              Language
            </label>
            <select
              id="language"
              value={language}
              onChange={handleLanguageChange}
              className="block w-full border rounded-md p-2 bg-gray-200"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* Volume Control */}
          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">Volume Control</label>
            <Slider value={volume} onChange={handleVolumeChange} />
            <div className="text-right mt-2">{volume}%</div>
          </div>

          {/* Save Settings Button */}
          <div className="flex justify-end">
            <Button type="primary" className="bg-blue-500 hover:bg-blue-700 text-white">
              Save Changes
            </Button>
          </div>
        </div>

        {/* Product Add Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>

          {/* Product Name */}
          <div className="mb-4">
            <label htmlFor="productName" className="block text-lg font-medium mb-2">
              Product Name
            </label>
            <Input
              id="productName"
              placeholder="Enter product name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Product Category */}
          <div className="mb-4">
            <label htmlFor="productCategory" className="block text-lg font-medium mb-2">
              Product Category
            </label>
            <Select
              id="productCategory"
              value={productCategory}
              onChange={(value) => setProductCategory(value)}
              className="w-full"
            >
              {categories.map((category) => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </div>

          {/* Product Price */}
          <div className="mb-4">
            <label htmlFor="productPrice" className="block text-lg font-medium mb-2">
              Product Price ($)
            </label>
            <Input
              id="productPrice"
              placeholder="Enter product price"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              type="number"
              className="w-full"
            />
          </div>

          {/* Product Image Upload */}
          <div className="mb-4">
            <label htmlFor="productImage" className="block text-lg font-medium mb-2">
              Product Image
            </label>
            <Upload
              name="productImage"
              listType="picture"
              maxCount={1}
              onChange={handleProductImageChange}
              className="w-full"
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </div>

          {/* Add Product Button */}
          <div className="flex justify-end">
            <Button
              type="primary"
              className="bg-green-500 hover:bg-green-700 text-white"
              onClick={handleAddProduct}
            >
              Add Product
            </Button>
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Advanced Settings</h2>

          {/* Payment Methods */}
          <div className="mb-4">
            <label htmlFor="paymentMethods" className="block text-lg font-medium mb-2">
              Payment Methods
            </label>
            <Input placeholder="Add payment method" />
            <Button type="dashed" className="mt-2 w-full">
              Add New Payment Method
            </Button>
          </div>

          {/* User Roles */}
          <div className="mb-4">
            <label htmlFor="userRoles" className="block text-lg font-medium mb-2">
              User Roles
            </label>
            <Input placeholder="Define user roles" />
            <Button type="dashed" className="mt-2 w-full">
              Add User Role
            </Button>
          </div>

          {/* Auto Backup */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-medium">Auto Backup</span>
            <Switch />
          </div>

          {/* Logout Button */}
          <div className="flex justify-end">
            <Button type="danger" className="bg-red-500 hover:bg-red-700 text-white">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
