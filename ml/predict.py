from tensorflow.keras.models import load_model
import numpy as np
import sys
import json

# Load model
model = load_model("model.h5")

# Input: assume passed as command-line JSON
input_data = json.loads(sys.argv[1])  # e.g., [1, 0, 0, 1, 1]
input_array = np.array([input_data])

# Predict
pred = model.predict(input_array)
print(pred.tolist())  # Return as JSON
