from flask import Flask, render_template, request, jsonify
import pandas as pd
from flask_cors import CORS
import cloudpickle
from sklearn.preprocessing import StandardScaler

app = Flask(__name__)
CORS(app)

# Load ML models
with open("packify_box_model.pkl", "rb") as f:
    box_model = cloudpickle.load(f)

with open("packify_cluster_classifier.pkl", "rb") as f:
    cluster_model = cloudpickle.load(f)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/optimization.html")
def optimization():
    return render_template("optimization.html")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        category = data.get("category")
        length = float(data.get("length"))
        width = float(data.get("width"))
        height = float(data.get("height"))
        fragility = data.get("fragility")
        padding = data.get("padding")  # Fixed to match frontend JS key

        input_df = pd.DataFrame([{
            'Product Category': category,
            'Product Length (cm)': length,
            'Product Width (cm)': width,
            'Product Height (cm)': height,
            'Fragility': fragility,
            'Padding Type': padding
        }])

        box_pred = box_model.predict(input_df)[0]

        cluster_input = pd.DataFrame([{
            'Product Length (cm)': length,
            'Product Width (cm)': width,
            'Product Height (cm)': height,
            'Recommended Box Length (cm)': box_pred[0],
            'Recommended Box Width (cm)': box_pred[1],
            'Recommended Box Height (cm)': box_pred[2],
            'Air Space Saved (%)': 20.0,
            'CO2 Saved (g)': 50.0,
            'Cost Saved ($)': 0.7
        }])

        scaled_input = StandardScaler().fit_transform(cluster_input)
        cluster = int(cluster_model.predict(scaled_input)[0])

        simulations = [
            {"truck_load": 88, "fill_rate": 95, "cost_saved": 0.55, "co2_saved": 0.04},
            {"truck_load": 82, "fill_rate": 89, "cost_saved": 0.47, "co2_saved": 0.036},
            {"truck_load": 74, "fill_rate": 81, "cost_saved": 0.39, "co2_saved": 0.031},
            {"truck_load": 67, "fill_rate": 75, "cost_saved": 0.32, "co2_saved": 0.028}
        ]

        sim = simulations[cluster]

        return jsonify({
            "recommended_length": round(box_pred[0], 2),
            "recommended_width": round(box_pred[1], 2),
            "recommended_height": round(box_pred[2], 2),
            "truck_load": sim["truck_load"],
            "fill_rate": sim["fill_rate"],
            "cost_saved": sim["cost_saved"],
            "co2_saved": sim["co2_saved"]
        })

    except Exception as e:
        print("❌ Error:", e)
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)
