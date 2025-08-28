# Prompt: Replace Scikit-Learn Model with TensorFlow `.h5` in Flask + React Real-Time Dashboard

You are tasked with replacing the current Scikit-Learn `.pkl` model in our Flask backend with a TensorFlow `.h5` model for stress level prediction, while keeping the entire data flow in sync with our real-time React dashboard.

The goal is to ensure:
- The TensorFlow model loads successfully when the Flask backend starts.
- Predictions are made with the TensorFlow model whenever new sensor data is received.
- The prediction results are streamed to the dashboard in **real time** via Flask-SocketIO.
- The real-time dashboard reflects the new TensorFlow prediction output without requiring frontend code changes (other than adjusting displayed values if the format changes).

## Backend Tasks (Flask)
1. **Remove Scikit-Learn dependency** for model loading and replace with TensorFlow’s Keras API:
   - Import `tensorflow as tf`
   - Use `tf.keras.models.load_model("path_to_model.h5")` to load the model at startup.
2. **Adapt Prediction Logic**:
   - Convert incoming sensor data into the correct TensorFlow input format (e.g., NumPy array with correct shape).
   - Call `model.predict()` and extract the result.
   - Map the prediction to a human-readable label (e.g., `"Calm"` or `"Stressed"`).
3. **Update `process_and_broadcast_data()`**:
   - Pass the TensorFlow prediction to the payload sent to Socket.IO.
   - Ensure the payload structure is **identical** to what the React dashboard currently expects.
4. **Update `/api/test-data`**:
   - Simulate test data and generate predictions using the new TensorFlow model.
5. **Ensure Compatibility**:
   - Keep the `source` and `timestamp` fields in the payload for the frontend.
   - Maintain the same event name (`stream`) so the dashboard continues to receive updates without changes.

## Frontend (React Dashboard)
- No major code changes required unless:
  - Prediction labels change (e.g., from numeric to string).
  - Additional metrics from TensorFlow output are added.
- Verify that when new predictions come in from the backend, the dashboard updates instantly.

## Example Backend Code Change
```python
import tensorflow as tf
import numpy as np

model = None

def load_ml_model():
    global model
    model_path = "stress_model.h5"
    try:
        model = tf.keras.models.load_model(model_path)
        logger.info("TensorFlow model loaded successfully")
    except Exception as e:
        logger.error(f"Error loading TensorFlow model: {e}")

def predict_stress_level(features):
    try:
        input_data = np.array([features], dtype=np.float32)
        prediction = model.predict(input_data)
        # Example threshold mapping
        if prediction[0][0] > 0.5:
            return "Stressed"
        else:
            return "Calm"
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        return "Prediction Error"
