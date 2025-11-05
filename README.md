# IntegriSense

*IntegriSense* is an AI-powered stress detection system that analyzes physiological signals to determine whether a user is *stressed* or *calm*.  
It combines sensor hardware, real-time signal visualization, and intelligent classification models to provide an end-to-end stress monitoring solution.

---

##  Overview

IntegriSense is designed to understand human stress levels through measurable biosignals.  
It collects data such as *Electrodermal Activity (EDA), **Electrocardiogram (ECG), **Skin Temperature (TEMP), and **Acceleration (ACC)* from wearable sensors, processes the data, and predicts the user's mental state using machine learning models.

---

##  Features

- *Real-time Monitoring:* Continuously tracks EDA, ECG, temperature, and motion signals.  
- *Graphical Visualization:* Displays live graphs for each sensor signal in the app.  
- *AI-Based Prediction:* Classifies the user's state as either *Stressed (1)* or *Calm (0)*.  
- *Hardware Integration:* Includes a custom-built device equipped with sensors to capture physiological data.  
- *User Dashboard:* Interactive interface built with *React* and *Flask*, showing live readings and predictions.

---

##  Model Summary

The IntegriSense model uses *binary classification* to detect stress levels based on physiological signals.

### Algorithms Explored:
- *Random Forest Classifier*  
- *XGBoost Classifier*  
- *Deep Learning (TensorFlow/Keras Sequential Model)* with ReLU activation, Batch Normalization, and Dropout layers.

### Target Labels:
- 0 → Calm  
- 1 → Stressed

---

##  Dataset

The model is trained and evaluated using the *WESAD (Wearable Stress and Affect Detection)* dataset — a widely recognized physiological dataset containing multimodal data collected from wearable devices.

Dataset link: [https://archive.ics.uci.edu/ml/datasets/WESAD](https://archive.ics.uci.edu/ml/datasets/WESAD)

---

##  Tech Stack

*Machine Learning:* TensorFlow, XGBoost, Scikit-learn  
*Backend:* Flask  
*Interface:* React Dashboard  
*Hardware:* Custom-built wearable sensor device  
*Dataset:* WESAD  

---

## ⚙ Setup and Installation

1. *Clone the Repository*
   ```bash
  
   cd IntegriSense
