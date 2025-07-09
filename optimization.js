import { db } from './firebase.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
  const data = JSON.parse(localStorage.getItem("productData"));

  if (!data) {
    alert("No product data found. Please fill product details first.");
    window.location.href = "index.html";
    return;
  }

  // Display static product info
  document.getElementById("productName").textContent = data.productName || "--";
  document.getElementById("dimensions").textContent = `${data.length}cm × ${data.width}cm × ${data.height}cm`;
  document.getElementById("boxMaterial").textContent = data.fragility || "--";

  try {
    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: data.category,
        length: data.length,
        width: data.width,
        height: data.height,
        fragility: data.fragility,
        padding: data.padding
      })
    });

    const result = await response.json();
    console.log("ML Prediction Result:", result);

    if (result.error) throw new Error(result.error);

    // Store optimized result in Firebase
    try {
      await addDoc(collection(db, "optimizations"), {
        productName: data.productName || "Unnamed Product",
        category: data.category,
        dimensions: {
          original: {
            length: data.length,
            width: data.width,
            height: data.height
          },
          recommended: {
            length: result.recommended_length,
            width: result.recommended_width,
            height: result.recommended_height
          }
        },
        fragility: data.fragility,
        padding: data.padding,
        truckLoad: result.truck_load,
        fillRate: result.fill_rate,
        costSaved: result.cost_saved,
        co2Saved: result.co2_saved,
        timestamp: new Date()
      });
      console.log("✅ Optimization result saved to Firebase");
    } catch (e) {
      console.error("❌ Failed to save optimization result to Firebase:", e);
    }

    // Populate UI
    document.getElementById("recommendedDimensions").value =
      `${result.recommended_length}cm × ${result.recommended_width}cm × ${result.recommended_height}cm`;
    document.getElementById("truckLoad").textContent = `${result.truck_load} boxes`;
    document.getElementById("fillRate").textContent = `${result.fill_rate}%`;
    document.getElementById("costSaved").textContent = `$${result.cost_saved}`;
    document.getElementById("co2Saved").textContent = `${result.co2_saved} kg CO₂`;

  } catch (error) {
    console.error("Prediction failed:", error);
    alert("Something went wrong while fetching optimization data.");
  }

  // Handle "View 3D Simulation" button
  const simulateBtn = document.getElementById("simulateBtn");
  if (simulateBtn) {
    simulateBtn.addEventListener("click", () => {
      window.location.href = "simulation.html";
    });
  }

  // Handle "Send Report" button
  const sendReportBtn = document.getElementById("sendReportBtn");
  if (sendReportBtn) {
    sendReportBtn.addEventListener("click", () => {
      alert("📤 Report sent to the Walmart team!");
    });
  }
});
