import React, { useState, useEffect } from 'react';
import { Search, Package, Truck, Leaf, AlertTriangle, CheckCircle, Upload, Camera, Settings, BarChart3, Filter, Download } from 'lucide-react';

const WalmartInventoryManagement = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all'); 
  const [products, setProducts] = useState([
    {
      id: 'WM001',
      name: 'Samsung 65" QLED TV',
      category: 'Electronics',
      currentStock: 45,
      dimensions: '57.1" x 32.7" x 2.3"',
      weight: '55.1 lbs',
      suggestedPackaging: {
        boxType: 'Double Wall Corrugated',
        dimensions: '60" x 36" x 8"',
        material: 'Recycled Kraft 200GSM',
        sustainabilityScore: 92,
        estimatedCost: '$12.50',
        co2Reduction: '23%'
      },
      status: 'optimized',
      lastUpdated: '2024-12-15'
    },
    {
      id: 'WM002',
      name: 'iPhone 15 Pro Max',
      category: 'Electronics',
      currentStock: 234,
      dimensions: '6.29" x 3.02" x 0.32"',
      weight: '7.81 oz',
      suggestedPackaging: {
        boxType: 'Single Wall Corrugated',
        dimensions: '8" x 5" x 2"',
        material: 'Bamboo Fiber 150GSM',
        sustainabilityScore: 96,
        estimatedCost: '$2.25',
        co2Reduction: '31%'
      },
      status: 'pending',
      lastUpdated: '2024-12-14'
    },
    {
      id: 'WM003',
      name: 'Dyson V15 Vacuum',
      category: 'Home Appliances',
      currentStock: 78,
      dimensions: '49.6" x 9.8" x 10.7"',
      weight: '6.8 lbs',
      suggestedPackaging: {
        boxType: 'Triple Wall Corrugated',
        dimensions: '52" x 12" x 13"',
        material: 'Recycled Kraft 275GSM',
        sustainabilityScore: 88,
        estimatedCost: '$8.75',
        co2Reduction: '18%'
      },
      status: 'review',
      lastUpdated: '2024-12-13'
    },
    {
      id: 'WM004',
      name: 'Nike Air Max Shoes',
      category: 'Clothing & Shoes',
      currentStock: 156,
      dimensions: '13" x 8" x 5"',
      weight: '1.5 lbs',
      suggestedPackaging: {
        boxType: 'Single Wall Corrugated',
        dimensions: '14" x 9" x 6"',
        material: 'Recycled Kraft 125GSM',
        sustainabilityScore: 94,
        estimatedCost: '$1.80',
        co2Reduction: '28%'
      },
      status: 'optimized',
      lastUpdated: '2024-12-15'
    }
  ]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'optimized': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'review': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'optimized': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <AlertTriangle className="w-4 h-4" />;
      case 'review': return <AlertTriangle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const UploadModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-90vw">
        <h3 className="text-xl font-bold mb-4">Add New Product for Analysis</h3>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Camera className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">Upload product image or enter dimensions</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Choose File
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <input placeholder="Length (in)" className="border rounded px-3 py-2" />
            <input placeholder="Width (in)" className="border rounded px-3 py-2" />
            <input placeholder="Height (in)" className="border rounded px-3 py-2" />
          </div>
          <input placeholder="Product Name" className="w-full border rounded px-3 py-2" />
          <input placeholder="Weight (lbs)" className="w-full border rounded px-3 py-2" />
          <select className="w-full border rounded px-3 py-2">
            <option>Select Category</option>
            <option>Electronics</option>
            <option>Home Appliances</option>
            <option>Clothing & Shoes</option>
            <option>Toys & Games</option>
          </select>
        </div>
        <div className="flex space-x-3 mt-6">
          <button 
            onClick={() => setShowUploadModal(false)}
            className="flex-1 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Analyze & Add
          </button>
        </div>
      </div>
    </div>
  );

  const ProductDetailModal = ({ product, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-3/4 max-w-4xl max-h-90vh overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Product Information</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>Product ID:</strong> {product.id}</p>
              <p><strong>Category:</strong> {product.category}</p>
              <p><strong>Current Stock:</strong> {product.currentStock} units</p>
              <p><strong>Dimensions:</strong> {product.dimensions}</p>
              <p><strong>Weight:</strong> {product.weight}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Leaf className="w-5 h-5 text-green-600 mr-2" />
              AI-Suggested Sustainable Packaging
            </h3>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <p><strong>Box Type:</strong> {product.suggestedPackaging.boxType}</p>
                <p><strong>Dimensions:</strong> {product.suggestedPackaging.dimensions}</p>
                <p><strong>Material:</strong> {product.suggestedPackaging.material}</p>
                <p><strong>Cost:</strong> {product.suggestedPackaging.estimatedCost}</p>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium">Sustainability Score: {product.suggestedPackaging.sustainabilityScore}/100</span>
                </div>
                <span className="text-green-600 font-semibold">CO₂ Reduction: {product.suggestedPackaging.co2Reduction}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex space-x-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            Approve Packaging
          </button>
          <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700">
            Request Review
          </button>
          <button className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Package className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold">ZeroWasteCarton - Walmart Integration</h1>
              <p className="text-blue-100 text-sm">AI-Powered Sustainable Packaging Management</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowUploadModal(true)}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Add Product</span>
            </button>
            <Settings className="w-6 h-6 cursor-pointer hover:text-blue-200" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <nav className="flex space-x-8">
            {[
              { id: 'inventory', label: 'Inventory Management', icon: Package },
              { id: 'analytics', label: 'Sustainability Analytics', icon: BarChart3 },
              { id: 'logistics', label: 'Logistics Optimization', icon: Truck }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-4 border-b-2 font-medium ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border rounded-lg w-64"
                    />
                  </div>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="border rounded-lg px-3 py-2"
                  >
                    <option value="all">All Categories</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Home Appliances">Home Appliances</option>
                    <option value="Clothing & Shoes">Clothing & Shoes</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <button className="text-blue-600 hover:text-blue-700">Advanced Filters</button>
                  <button className="flex items-center space-x-2 text-green-600 hover:text-green-700">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Optimized</h3>
                <p className="text-2xl font-bold text-green-600">
                  {products.filter(p => p.status === 'optimized').length}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Pending Review</h3>
                <p className="text-2xl font-bold text-yellow-600">
                  {products.filter(p => p.status === 'pending').length}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Avg CO₂ Reduction</h3>
                <p className="text-2xl font-bold text-green-600">25%</p>
              </div>
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Packaging Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sustainability Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CO₂ Reduction</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.id}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.currentStock} units
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                            {getStatusIcon(product.status)}
                            <span className="ml-1 capitalize">{product.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${product.suggestedPackaging.sustainabilityScore}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-900">{product.suggestedPackaging.sustainabilityScore}/100</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          {product.suggestedPackaging.co2Reduction}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => setSelectedProduct(product)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            View Details
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            Approve
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Sustainability Analytics Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800">Total CO₂ Saved</h3>
                <p className="text-2xl font-bold text-green-600">2,450 kg</p>
                <p className="text-sm text-green-600">This month</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800">Packaging Cost Savings</h3>
                <p className="text-2xl font-bold text-blue-600">$12,350</p>
                <p className="text-sm text-blue-600">This quarter</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="font-semibold text-yellow-800">Waste Reduction</h3>
                <p className="text-2xl font-bold text-yellow-600">1,890 lbs</p>
                <p className="text-sm text-yellow-600">This month</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'logistics' && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Logistics Optimization</h2>
            <p className="text-gray-600">Shipping efficiency and route optimization features coming soon...</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showUploadModal && <UploadModal />}
      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </div>
  );
};

export default WalmartInventoryManagement;