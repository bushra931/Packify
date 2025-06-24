document.addEventListener("DOMContentLoaded", async () => {
  const data = JSON.parse(localStorage.getItem("productData"));

  if (!data) {
    alert("No product data found. Please fill product details first.");
    window.location.href = "index.html";
    return;
  }

  // Display static product info
  document.getElementById("productName").textContent = data.productName;
  document.getElementById("dimensions").textContent = `${data.length}cm × ${data.width}cm × ${data.height}cm`;
  document.getElementById("boxMaterial").textContent = data.fragility;

  try {
    // POST data to Flask backend
    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: data.category,
        length: data.length,
        width: data.width,
        height: data.height,
        fragility: data.fragility,
        padding: data.padding // ✅ Must match Flask expectation
      })
    });

    const result = await response.json();
    console.log("ML Prediction Result:", result);

    if (result.error) throw new Error(result.error);

    // Update page with prediction results
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
});
