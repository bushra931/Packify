document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("productForm");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const productName = document.getElementById("productName").value.trim();
      const length = document.getElementById("length").value.trim();
      const width = document.getElementById("width").value.trim();
      const height = document.getElementById("height").value.trim();
      const fragility = document.getElementById("materialType").value;
      const category = document.getElementById("category").value;
      const padding = document.getElementById("paddingType").value;

      if (!productName || !length || !width || !height ||
          fragility === "Select..." || category === "Select..." || padding === "Select...") {
        alert("Please fill all fields correctly.");
        return;
      }

      const data = {
        productName,
        length: parseFloat(length),
        width: parseFloat(width),
        height: parseFloat(height),
        fragility,
        category,
        padding
      };

      localStorage.setItem("productData", JSON.stringify(data));
      window.location.href = "optimization.html";
    });
  }
});
