import pandas as pd
import cloudpickle

# ✅ Load prediction model
with open("packify_box_model.pkl", "rb") as f:
    box_model = cloudpickle.load(f)

# ✅ Load clustering model
with open("packify_cluster_classifier.pkl", "rb") as f:
    cluster_model = cloudpickle.load(f)

# 🔍 Sample input for prediction
sample_input = pd.DataFrame([{
    'Product Category': 'Electronics',
    'Product Length (cm)': 20,
    'Product Width (cm)': 15,
    'Product Height (cm)': 8,
    'Fragility': 'High',
    'Padding Type': 'Bubble Wrap'
}])

# 🎯 Predict box size
box_prediction = box_model.predict(sample_input)
print("\n📦 Recommended Box Dimensions:")
print(f"Length: {box_prediction[0][0]:.2f} cm")
print(f"Width : {box_prediction[0][1]:.2f} cm")
print(f"Height: {box_prediction[0][2]:.2f} cm")

# 🔁 Example input for clustering
cluster_input = pd.DataFrame([{
    'Product Length (cm)': 20,
    'Product Width (cm)': 15,
    'Product Height (cm)': 8,
    'Recommended Box Length (cm)': box_prediction[0][0],
    'Recommended Box Width (cm)': box_prediction[0][1],
    'Recommended Box Height (cm)': box_prediction[0][2],
    'Air Space Saved (%)': 20.0,
    'CO2 Saved (g)': 50.0,
    'Cost Saved ($)': 0.7
}])

# 📊 Cluster classification (apply same scaler logic used earlier)
from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
X_scaled = scaler.fit_transform(cluster_input)

cluster_label = cluster_model.predict(X_scaled)
print(f"\n🧠 Cluster Assigned: Group {cluster_label[0]}")
