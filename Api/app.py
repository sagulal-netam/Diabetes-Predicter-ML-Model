from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load model and pipeline
try:
    model = joblib.load('Api/models/model.pkl')
    pipeline = joblib.load('Api/models/pipeline.pkl')
except Exception as e:
    print(f"Error loading model/pipeline: {e}")
    model = None
    pipeline = None

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()   # expect a single object, not a list

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # ✅ FIX: wrap dict in a list so DataFrame has 1 row
        df = pd.DataFrame([data])

        # ✅ FIX: pass df directly to pipeline, no extra list
        processed_data = pipeline.transform(df)

        prediction = model.predict(processed_data)
        pred_int = int(prediction[0])

        return jsonify({
            'prediction': pred_int,
            'is_diabetic': bool(pred_int == 1),
            'status': 'success'
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)


# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import joblib
# import pandas as pd

# app = Flask(__name__)
# CORS(app)

# # Load model and pipeline
# try:
#     model = joblib.load('Api/models/model.pkl')
#     pipeline = joblib.load('Api/models/pipeline.pkl')
#     print("✅ Model and pipeline loaded successfully")

# except Exception as e:
#     print(f"❌ Error loading model/pipeline: {e}")
#     model = None
#     pipeline = None

# @app.route("/api/predict", methods=["POST"])
# def predict():
#     if model is None or pipeline is None:
#         return jsonify({"error": "Model or pipeline not loaded"}), 500

#     try:
#         data = request.get_json()

#         if not data:
#             return jsonify({"error": "No data provided"}), 400

#         # 👇 IMPORTANT: wrap data in a list
#         # If React sends a single object (one patient), this creates 1-row DataFrame
#         df = pd.DataFrame([data])

#         # 👇 IMPORTANT: DO NOT wrap df again in a list
#         X = pipeline.transform(df)

#         y_pred = model.predict(X)
#         pred_int = int(y_pred[0])
#         is_diabetic = bool(pred_int == 1)

#         return jsonify({
#             "prediction": pred_int,
#             "is_diabetic": is_diabetic,
#             "status": "success"
#         })
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


# if __name__ == '__main__':
#     app.run(debug=True, port=5000)


