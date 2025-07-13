import { db } from './firebase.js';
import { collection, getDocs, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

let products = [];
let filteredProducts = [];
let currentProduct = null;

const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const productTableBody = document.getElementById('product-table-body');
const uploadModal = document.getElementById('upload-modal');
const productModal = document.getElementById('product-modal');

console.log("✅ inventory.js loaded");

document.addEventListener('DOMContentLoaded', async () => {
  console.log("📦 DOM fully loaded");
  await fetchProductsFromFirebase();
  setupEventListeners();
  renderProducts();
  updateSummaryCards();
});

async function fetchProductsFromFirebase() {
  try {
    const querySnapshot = await getDocs(collection(db, "optimizations"));
    products = querySnapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        productName: data.productName || "Unnamed",
        category: data.category || "Uncategorized",
        fragility: data.fragility || "—",
        padding: data.padding || "—",
        truckLoad: data.truckLoad || 0,
        fillRate: data.fillRate || 0,
        costSaved: data.costSaved || 0,
        co2Saved: data.co2Saved || 0,
        material: data.material || "—",
        status: data.status || "optimized",

        // Flat dimension fields
        length: data.length || 0,
        width: data.width || 0,
        height: data.height || 0,

        boxLength: data.boxLength || 0,
        boxWidth: data.boxWidth || 0,
        boxHeight: data.boxHeight || 0,

        timestamp: data.timestamp?.toDate?.().toISOString().split("T")[0] || "—"
      };
    });

    filteredProducts = [...products];
    console.log("✅ Full product list fetched:", products);
  } catch (error) {
    console.error("❌ Error fetching from Firebase:", error);
  }
}



function setupEventListeners() {
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', function () {
      switchTab(this.dataset.tab);
    });
  });

  searchInput.addEventListener('input', handleSearch);
  categoryFilter.addEventListener('change', handleCategoryFilter);

  document.addEventListener('click', function (e) {
    if (e.target === uploadModal) hideUploadModal();
    if (e.target === productModal) hideProductModal();
  });
}

function switchTab(tabId) {
  document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
  document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  document.getElementById(`${tabId}-tab`).classList.add('active');
}

function handleSearch() {
  const searchTerm = searchInput.value.toLowerCase();
  filterProducts(searchTerm, categoryFilter.value);
}

function handleCategoryFilter() {
  const searchTerm = searchInput.value.toLowerCase();
  filterProducts(searchTerm, categoryFilter.value);
}

function filterProducts(searchTerm, category) {
  filteredProducts = products.filter(product => {
    const matchesSearch = product.productName.toLowerCase().includes(searchTerm);
    const matchesCategory = category === 'all' || product.category === category;
    return matchesSearch && matchesCategory;
  });

  renderProducts();
  updateSummaryCards();
}

function renderProducts() {
  productTableBody.innerHTML = '';
  filteredProducts.forEach(product => {
    const row = createProductRow(product);
    productTableBody.appendChild(row);
  });
}

function createProductRow(product) {
  const status = product.status || "optimized";
  const score = product.suggestedPackaging?.sustainabilityScore || 30;
  const co2 = product.co2Saved || "—";

  const row = document.createElement('tr');
  row.innerHTML = `
    <td>
      <div class="product-name">${product.productName}</div>
    </td>
    <td>${product.category}</td>
    <td>${product.truckLoad} boxes</td>
    <td>
      <span class="status-badge status-${status}">
        ${getStatusIcon(status)}
        <span>${capitalizeFirst(status)}</span>
      </span>
    </td>
    <td>
      <div class="progress-bar">
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width: ${score}%"></div>
        </div>
        <span>${score}/100</span>
      </div>
    </td>
    <td class="co2-reduction">${co2} kg CO₂</td>
    <td>
      <button class="action-btn" onclick='viewProductDetails(${JSON.stringify(product)})'>View Report</button>
      <button class="action-btn approve" onclick="approveProduct('${product.id}')">Approve</button>
    </td>
  `;
  return row;
}

function getStatusIcon(status) {
  switch (status) {
    case 'optimized': return '<i class="fas fa-check-circle"></i>';
    case 'approved': return '<i class="fas fa-thumbs-up"></i>';
    case 'pending': return '<i class="fas fa-exclamation-triangle"></i>';
    default: return '<i class="fas fa-box"></i>';
  }
}

function capitalizeFirst(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

function updateSummaryCards() {
  const total = filteredProducts.length;
  const optimized = filteredProducts.filter(p => p.status === 'optimized').length;
  const pending = filteredProducts.filter(p => p.status === 'pending').length;

  document.getElementById('total-products').textContent = total;
  document.getElementById('optimized-count').textContent = optimized;
  document.getElementById('pending-count').textContent = pending;
}

async function approveProduct(productId) {
  const product = products.find(p => p.id === productId);
  if (product) {
    product.status = 'approved';
    product.lastUpdated = new Date().toISOString().split('T')[0];

    try {
      const ref = doc(db, 'optimizations', productId);
      await updateDoc(ref, {
        status: 'approved',
        lastUpdated: product.lastUpdated
      });
      console.log(`✅ Product ${productId} approved`);
    } catch (e) {
      console.error(`❌ Failed to approve ${productId}`, e);
    }

    renderProducts();
    updateSummaryCards();
  }
}

function showProductDetails(productId) {
  currentProduct = products.find(p => p.id === productId);
  if (!currentProduct) return;

  document.getElementById('product-modal-title').textContent = currentProduct.productName;

  const productInfoContent = document.getElementById('product-info-content');
  productInfoContent.innerHTML = `
    <div class="info-item"><span class="info-label">Category:</span>${currentProduct.category}</div>
    <div class="info-item"><span class="info-label">Truck Load:</span>${currentProduct.truckLoad} boxes</div>
  `;

  const packaging = currentProduct.suggestedPackaging || {};
  const packagingInfoContent = document.getElementById('packaging-info-content');
  packagingInfoContent.innerHTML = `
    <div class="packaging-grid">
      <div><strong>Box Type:</strong> ${packaging.boxType || '—'}</div>
      <div><strong>Dimensions:</strong> ${packaging.dimensions || '—'}</div>
      <div><strong>Material:</strong> ${packaging.material || '—'}</div>
      <div><strong>Cost:</strong> ${packaging.estimatedCost || '—'}</div>
    </div>
    <div class="sustainability-score">
      <div class="score-indicator">
        <div class="score-dot"></div>
        <span>Sustainability Score: ${packaging.sustainabilityScore || 0}/100</span>
      </div>
      <span class="co2-reduction-badge">CO₂ Reduction: ${currentProduct.co2Saved || '—'} kg</span>
    </div>
  `;

  productModal.classList.add('show');
}

function hideProductModal() {
  productModal.classList.remove('show');
  currentProduct = null;
}

function hideUploadModal() {
  uploadModal.classList.remove('show');
}

// ✅ Correct function used by inline onclick with full product object
window.viewProductDetails = function(product) {
  localStorage.setItem("selectedProductId", product.id);
  window.location.href = "optimization.html"; // or whatever report page you use
};
