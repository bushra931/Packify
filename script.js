import { db } from './firebase.js';
import {
  doc,
  getDoc,
  updateDoc
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("productForm");

  // Get Product ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (!productId) {
    alert("❌ No product ID provided.");
    return;
  }

  // Fetch product from Firestore
  try {
    const docRef = doc(db, "supplierProducts", productId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      // Populate form with fetched data
      document.getElementById("productName").value = data.productName || '';
      document.getElementById("length").value = data.length || '';
      document.getElementById("width").value = data.width || '';
      document.getElementById("height").value = data.height || '';
      document.getElementById("materialType").value = data.fragility || '';
      document.getElementById("category").value = data.category || '';
      document.getElementById("paddingType").value = data.padding || '';

      // Populate box dimensions if available
      if (data.boxLength) document.getElementById("boxLength").value = data.boxLength;
      if (data.boxWidth)  document.getElementById("boxWidth").value  = data.boxWidth;
      if (data.boxHeight) document.getElementById("boxHeight").value = data.boxHeight;

    } else {
      alert("❌ Product not found.");
    }
  } catch (error) {
    console.error("🔥 Error fetching product:", error);
  }

  // Handle form submission
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const productName = document.getElementById("productName").value.trim();
      const length = document.getElementById("length").value.trim();
      const width = document.getElementById("width").value.trim();
      const height = document.getElementById("height").value.trim();
      const fragility = document.getElementById("materialType").value;
      const category = document.getElementById("category").value;
      const padding = document.getElementById("paddingType").value;

      // Box dimensions
      const boxLength = document.getElementById("boxLength").value.trim();
      const boxWidth = document.getElementById("boxWidth").value.trim();
      const boxHeight = document.getElementById("boxHeight").value.trim();

      if (!productName || !length || !width || !height ||
        fragility === "Select..." || category === "Select..." || padding === "Select..." ||
        !boxLength || !boxWidth || !boxHeight) {
        alert("Please fill all fields correctly.");
        return;
      }

      const updatedData = {
        productName,
        length: parseFloat(length),
        width: parseFloat(width),
        height: parseFloat(height),
        fragility,
        category,
        padding,
        boxLength: parseFloat(boxLength),
        boxWidth: parseFloat(boxWidth),
        boxHeight: parseFloat(boxHeight),
        status: "optimized",
        optimizedAt: new Date()
      };

      try {
        await updateDoc(doc(db, "supplierProducts", productId), updatedData);
        alert("✅ Product optimization saved!");
        localStorage.setItem("productData", JSON.stringify(updatedData));
        window.location.href = "optimization.html";
      } catch (err) {
        console.error("🔥 Error updating document:", err);
        alert("❌ Failed to save optimization.");
      }
    });
  }
});
