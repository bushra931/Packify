import pandas as pd
import cloudpickle
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.multioutput import MultiOutputRegressor
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.cluster import KMeans
from sklearn.model_selection import train_test_split

# Load dataset
df = pd.read_csv("box_dataset.csv")

# Feature and target columns
features = [
    'Product Category', 'Product Length (cm)', 'Product Width (cm)',
    'Product Height (cm)', 'Fragility', 'Padding Type'
]
targets = [
    'Recommended Box Length (cm)',
    'Recommended Box Width (cm)',
    'Recommended Box Height (cm)'
]

# Split data
X = df[features]
y = df[targets]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Preprocessing
categorical = ['Product Category', 'Fragility', 'Padding Type']
numerical = ['Product Length (cm)', 'Product Width (cm)', 'Product Height (cm)']

preprocessor = ColumnTransformer([
    ('cat', OneHotEncoder(handle_unknown='ignore'), categorical),
    ('num', StandardScaler(), numerical)
])

# Model pipeline
model_pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('regressor', MultiOutputRegressor(
        GradientBoostingRegressor(n_estimators=100, random_state=42)
    ))
])

# Fit model
model_pipeline.fit(X_train, y_train)

# ✅ Save model safely using cloudpickle
with open("packify_box_model.pkl", "wb") as f:
    cloudpickle.dump(model_pipeline, f)

# --------------- Clustering ----------------
cluster_features = [
    'Product Length (cm)', 'Product Width (cm)', 'Product Height (cm)',
    'Recommended Box Length (cm)', 'Recommended Box Width (cm)', 'Recommended Box Height (cm)',
    'Air Space Saved (%)', 'CO2 Saved (g)', 'Cost Saved ($)'
]

X_cluster = df[cluster_features]
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_cluster)

kmeans = KMeans(n_clusters=4, random_state=42)
kmeans.fit(X_scaled)

# ✅ Save clustering model too
with open("packify_cluster_classifier.pkl", "wb") as f:
    cloudpickle.dump(kmeans, f)

print("✅ Models retrained and saved without version errors!")
