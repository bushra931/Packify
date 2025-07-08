// Product data
const products = [
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
];

// Global variables
let filteredProducts = [...products];
let currentProduct = null;

// DOM Elements
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const productTableBody = document.getElementById('product-table-body');
const uploadModal = document.getElementById('upload-modal');
const productModal = document.getElementById('product-modal');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    renderProducts();
    updateSummaryCards();
});

// Event Listeners
function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });

    // Search and filter
    searchInput.addEventListener('input', handleSearch);
    categoryFilter.addEventListener('change', handleCategoryFilter);

    // Modal close events
    document.addEventListener('click', function(e) {
        if (e.target === uploadModal) {
            hideUploadModal();
        }
        if (e.target === productModal) {
            hideProductModal();
        }
    });
}

// Tab switching
function switchTab(tabId) {
    // Update active tab
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

    // Show corresponding content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabId}-tab`).classList.add('active');
}

// Search functionality
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    filterProducts(searchTerm, categoryFilter.value);
}

// Category filter
function handleCategoryFilter() {
    const searchTerm = searchInput.value.toLowerCase();
    filterProducts(searchTerm, categoryFilter.value);
}

// Filter products
function filterProducts(searchTerm, category) {
    filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                             product.id.toLowerCase().includes(searchTerm);
        const matchesCategory = category === 'all' || product.category === category;
        return matchesSearch && matchesCategory;
    });
    
    renderProducts();
    updateSummaryCards();
}

// Render products in table
function renderProducts() {
    productTableBody.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const row = createProductRow(product);
        productTableBody.appendChild(row);
    });
}

// Create product table row
function createProductRow(product) {
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td>
            <div class="product-name">${product.name}</div>
            <div class="product-id">${product.id}</div>
        </td>
        <td>${product.category}</td>
        <td>${product.currentStock} units</td>
        <td>
            <span class="status-badge status-${product.status}">
                ${getStatusIcon(product.status)}
                <span>${capitalizeFirst(product.status)}</span>
            </span>
        </td>
        <td>
            <div class="progress-bar">
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${product.suggestedPackaging.sustainabilityScore}%"></div>
                </div>
                <span>${product.suggestedPackaging.sustainabilityScore}/100</span>
            </div>
        </td>
        <td class="co2-reduction">${product.suggestedPackaging.co2Reduction}</td>
        <td>
            <button class="action-btn" onclick="showProductDetails('${product.id}')">View Details</button>
            <button class="action-btn approve" onclick="approveProduct('${product.id}')">Approve</button>
        </td>
    `;
    
    return row;
}

// Get status icon
function getStatusIcon(status) {
    switch (status) {
        case 'optimized': return '<i class="fas fa-check-circle"></i>';
        case 'pending': return '<i class="fas fa-exclamation-triangle"></i>';
        case 'review': return '<i class="fas fa-exclamation-triangle"></i>';
        default: return '<i class="fas fa-box"></i>';
    }
}

// Capitalize first letter
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Update summary cards
function updateSummaryCards() {
    const totalProducts = filteredProducts.length;
    const optimizedCount = filteredProducts.filter(p => p.status === 'optimized').length;
    const pendingCount = filteredProducts.filter(p => p.status === 'pending').length;
    
    document.getElementById('total-products').textContent = totalProducts;
    document.getElementById('optimized-count').textContent = optimizedCount;
    document.getElementById('pending-count').textContent = pendingCount;
}

// Modal functions
function showUploadModal() {
    uploadModal.classList.add('show');
}

function hideUploadModal() {
    uploadModal.classList.remove('show');
}

function showProductDetails(productId) {
    currentProduct = products.find(p => p.id === productId);
    if (!currentProduct) return;
    
    // Update modal title
    document.getElementById('product-modal-title').textContent = currentProduct.name;
    
    // Update product info
    const productInfoContent = document.getElementById('product-info-content');
    productInfoContent.innerHTML = `
        <div class="info-item">
            <span class="info-label">Product ID:</span>${currentProduct.id}
        </div>
        <div class="info-item">
            <span class="info-label">Category:</span>${currentProduct.category}
        </div>
        <div class="info-item">
            <span class="info-label">Current Stock:</span>${currentProduct.currentStock} units
        </div>
        <div class="info-item">
            <span class="info-label">Dimensions:</span>${currentProduct.dimensions}
        </div>
        <div class="info-item">
            <span class="info-label">Weight:</span>${currentProduct.weight}
        </div>
    `;
    
    // Update packaging info
    const packagingInfoContent = document.getElementById('packaging-info-content');
    packagingInfoContent.innerHTML = `
        <div class="packaging-grid">
            <div><strong>Box Type:</strong> ${currentProduct.suggestedPackaging.boxType}</div>
            <div><strong>Dimensions:</strong> ${currentProduct.suggestedPackaging.dimensions}</div>
            <div><strong>Material:</strong> ${currentProduct.suggestedPackaging.material}</div>
            <div><strong>Cost:</strong> ${currentProduct.suggestedPackaging.estimatedCost}</div>
        </div>
        <div class="sustainability-score">
            <div class="score-indicator">
                <div class="score-dot"></div>
                <span>Sustainability Score: ${currentProduct.suggestedPackaging.sustainabilityScore}/100</span>
            </div>
            <span class="co2-reduction-badge">CO₂ Reduction: ${currentProduct.suggestedPackaging.co2Reduction}</span>
        </div>
    `;
    
    productModal.classList.add('show');
}

function hideProductModal() {
    productModal.classList.remove('show');
    currentProduct = null;
}

// Product actions
function approveProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        product.status = 'optimized';
        product.lastUpdated = new Date().toISOString().split('T')[0];
        renderProducts();
        updateSummaryCards();
        
        // Show success message (you can implement a toast notification here)
        console.log(`Product ${productId} approved successfully!`);
    }
}

// Additional utility functions
function exportData() {
    const dataStr = JSON.stringify(filteredProducts, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'walmart-inventory-export.json';
    link.click();
    URL.revokeObjectURL(url);
}

// Search suggestions (optional enhancement)
function getSearchSuggestions(query) {
    if (query.length < 2) return [];
    
    const suggestions = products
        .filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        )
        .map(product => ({
            id: product.id,
            name: product.name,
            category: product.category
        }))
        .slice(0, 5);
    
    return suggestions;
}

// Analytics calculations
function calculateAnalytics() {
    const totalCO2Saved = products.reduce((sum, product) => {
        const reduction = parseFloat(product.suggestedPackaging.co2Reduction.replace('%', ''));
        return sum + reduction;
    }, 0);
    
    const totalCostSavings = products.reduce((sum, product) => {
        const cost = parseFloat(product.suggestedPackaging.estimatedCost.replace('$', ''));
        return sum + (cost * 0.2); // Assuming 20% savings
    }, 0);
    
    const averageSustainabilityScore = products.reduce((sum, product) => {
        return sum + product.suggestedPackaging.sustainabilityScore;
    }, 0) / products.length;
    
    return {
        totalCO2Saved: totalCO2Saved.toFixed(1),
        totalCostSavings: totalCostSavings.toFixed(2),
        averageSustainabilityScore: averageSustainabilityScore.toFixed(1)
    };
}

// Performance monitoring
function logPerformance() {
    const analytics = calculateAnalytics();
    console.log('Analytics Summary:', analytics);
    console.log('Total Products:', products.length);
    console.log('Filtered Products:', filteredProducts.length);
}

// Initialize performance logging (optional)
// setInterval(logPerformance, 60000); // Log every minute