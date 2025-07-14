import { db } from './firebase.js';
import { collection, getDocs, doc, updateDoc, getDoc, addDoc } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

document.addEventListener("DOMContentLoaded", async () => {
  const data = JSON.parse(localStorage.getItem("productData"));

  if (!data) {
    alert("No product data found.");
    window.location.href = "dashboard1.html";
    return;
  }

  const alreadyOptimized = data.truckLoad && data.co2Saved; // flat fields

  // Static UI
  document.getElementById("productName").textContent = data.productName || "--";
  document.getElementById("dimensions").textContent = `${data.length}cm × ${data.width}cm × ${data.height}cm`;
  document.getElementById("boxMaterial").textContent = data.fragility || data.material || "--";
  document.getElementById("originalBoxDimensions").value = `${data.boxLength}cm × ${data.boxWidth}cm × ${data.boxHeight}cm`;

  if (alreadyOptimized) {
    // 🟢 Use saved optimization values
    document.getElementById("recommendedDimensions").value =
      `${data.boxLength}cm × ${data.boxWidth}cm × ${data.boxHeight}cm`; // fallback to box dims

    document.getElementById("truckLoad").textContent = `${data.truckLoad} boxes`;
    document.getElementById("fillRate").textContent = `${data.fillRate}%`;
    document.getElementById("costSaved").textContent = `$${data.costSaved}`;
    document.getElementById("co2Saved").textContent = `${data.co2Saved} kg CO₂`;

  } else {
    // 🟡 Call ML API and store optimized result
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

      // Save to Firebase
      try {
        await addDoc(collection(db, "optimizations"), {
          productName: data.productName || "Unnamed Product",
          category: data.category,
          length: data.length,
          width: data.width,
          height: data.height,
          boxLength: data.boxLength,
          boxWidth: data.boxWidth,
          boxHeight: data.boxHeight,
          fragility: data.fragility,
          padding: data.padding,
          material: data.material || "—",
          truckLoad: result.truck_load,
          fillRate: result.fill_rate,
          costSaved: result.cost_saved,
          co2Saved: result.co2_saved,
          timestamp: new Date()
        });
        console.log("✅ Optimization result saved to Firebase");
      } catch (e) {
        console.error("❌ Firebase save failed:", e);
      }

      // Update UI
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
  }

  // Button events
  document.getElementById("simulateBtn")?.addEventListener("click", () => window.location.href = "simulation.html");
  document.getElementById("truckBtn")?.addEventListener("click", () => window.location.href = "truckStm.html");
  document.getElementById("sendReportBtn")?.addEventListener("click", () => alert("📤 Report sent to the Walmart team!"));
});
