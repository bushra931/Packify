import { db } from './firebase.js';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

let products = [];
let filteredProducts = [];
let currentProduct = null;

const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const productTableBody = document.getElementById('product-table-body');
const uploadModal = document.getElementById('upload-modal');
const productModal = document.getElementById('product-modal');

document.addEventListener('DOMContentLoaded', async () => {
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
      const co2 = data.co2Saved || 0;
      return {
        id: docSnap.id,
        productName: data.productName || "Unnamed",
        category: data.category || "Uncategorized",
        fragility: data.fragility || "—",
        padding: data.padding || "—",
        truckLoad: data.truckLoad || 0,
        fillRate: data.fillRate || 0,
        costSaved: data.costSaved || 0,
        co2Saved: co2,
        material: data.material || "—",
        status: data.status || "optimized",
        length: data.length || 0,
        width: data.width || 0,
        height: data.height || 0,
        boxLength: data.boxLength || 0,
        boxWidth: data.boxWidth || 0,
        boxHeight: data.boxHeight || 0,
        score: Math.min(Math.round(co2 * 1000), 100),
        timestamp: data.timestamp?.toDate?.().toISOString().split("T")[0] || "—"
      };
    });
    filteredProducts = [...products];
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
  const score = product.score || 0;
  const co2 = product.co2Saved || "—";

  const row = document.createElement('tr');
  row.innerHTML = `
    <td><div class="product-name">${product.productName}</div></td>
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
    } catch (e) {
      console.error(`❌ Failed to approve ${productId}`, e);
    }

    renderProducts();
    updateSummaryCards();
  }
}

function hideUploadModal() {
  uploadModal.classList.remove('show');
}

function hideProductModal() {
  productModal.classList.remove('show');
  currentProduct = null;
}

// ✅ MODAL VIEW + APPROVE LOGIC
window.viewProductDetails = async function (product) {
  const ref = doc(db, "optimizations", product.id);
  try {
    const docSnap = await getDoc(ref);
    if (!docSnap.exists()) {
      alert("Product not found.");
      return;
    }

    const data = docSnap.data();
    const original = data.dimensions?.original || {};
    const box = data.dimensions?.box || {};
    const recommended = data.dimensions?.recommended || {};
    const sustainabilityScore = Math.min(Math.round((data.co2Saved || 0) * 10), 100);

    document.getElementById("product-modal-title").textContent = data.productName;
    document.getElementById("product-info-content").innerHTML = `
      <div class="info-item"><span class="info-label">Category:</span> ${data.category}</div>
      <div class="info-item"><span class="info-label">Original Dimensions:</span> ${original.length} × ${original.width} × ${original.height} cm</div>
      <div class="info-item"><span class="info-label">Box Dimensions:</span> ${box.length} × ${box.width} × ${box.height} cm</div>
      <div class="info-item"><span class="info-label">Material:</span> ${data.material || "—"}</div>
    `;

    document.getElementById("packaging-info-content").innerHTML = `
      <div class="packaging-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div><strong>Recommended Dimensions:</strong><br>${recommended.length} × ${recommended.width} × ${recommended.height} cm</div>
        <div><strong>Truck Load:</strong><br>${data.truckLoad} boxes</div>
        <div><strong>CO₂ Saved:</strong><br>${data.co2Saved} kg</div>
        <div><strong>Cost Saved:</strong><br>$${data.costSaved}</div>
      </div>
      <div class="sustainability-score" style="margin-top: 15px;">
        <div class="score-indicator">
          <div class="score-dot"></div>
          <span>Sustainability Score: ${sustainabilityScore}/100</span>
        </div>
      </div>
      <div class="modal-actions" style="margin-top: 20px; text-align: right;">
        <button id="approve-btn" class="action-btn approve">Approve</button>
        <button id="close-btn" class="action-btn">Close</button>
      </div>
    `;

    productModal.classList.add("show");

    document.getElementById("close-btn").onclick = hideProductModal;

    document.getElementById("approve-btn").onclick = async () => {
      try {
        await updateDoc(ref, {
          status: 'approved',
          lastUpdated: new Date().toISOString().split("T")[0]
        });

        document.getElementById("approve-btn").textContent = "Approved";
        document.getElementById("approve-btn").disabled = true;
        document.getElementById("approve-btn").classList.add("disabled");

        await fetchProductsFromFirebase();
        renderProducts();
        updateSummaryCards();
      } catch (err) {
        console.error("❌ Error approving product:", err);
        alert("Failed to approve the product.");
      }
    };

  } catch (err) {
    console.error("❌ Failed to fetch product details:", err);
    alert("Something went wrong loading the report.");
  }
};
