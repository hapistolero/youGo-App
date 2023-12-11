import sys
import numpy as np
import cv2
import os
from tensorflow.keras.models import load_model

# Load the trained model
script_directory = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_directory, "yoga model.h5")

imported_model = load_model(model_path)

# Preprocess the input image
def preprocess_image(image_path):
    img = cv2.imread(image_path)
    img = cv2.resize(img, (256, 256))
    img = img / 255.0  # Normalize pixel values
    img = np.expand_dims(img, axis=0)  # Add batch dimension
    return img

# Check if the image path is provided as a command-line argument
if len(sys.argv) != 2:
    print("Usage: python script.py <image_path>")
    sys.exit(1)

# Get the image path from the command-line arguments
image_path = sys.argv[1]

# Make predictions
input_image = preprocess_image(image_path)

# Use the model with the best performance
best_model = imported_model  # Update this line with the best model if you have multiple models

predictions = best_model.predict(input_image)
labels = ['adho mukha svanasana', 'adho mukha vriksasana', 'agnistambhasana', 'ananda balasana', 'anantasana',
          'anjaneyasana', 'ardha bhekasana', 'ardha chandrasana', 'ardha matsyendrasana', 'ardha pincha mayurasana',
          'ardha uttanasana', 'ashtanga namaskara', 'astavakrasana']

# Assuming predictions is a one-hot encoded array
predicted_class = np.argmax(predictions)
confidence = predictions[0, predicted_class]
predicted_class_label = labels[predicted_class]

# Print the predicted class label and confidence
print(predicted_class_label)
print(confidence)
