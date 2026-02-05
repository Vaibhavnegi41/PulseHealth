import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

print("\nTraining AI Health Prediction Models...\n")


data = pd.read_csv("health_dataset.csv")
print("Dataset Loaded:", data.shape)


features = [
    "HighBP", "HighChol", "CholCheck", "BMI", "Smoker",
    "Stroke", "PhysicalActivity", "HvyAlcoholConsump",
    "AnyHealthcare", "NoDocbcCost", "GenHlth", "MentHlth",
    "Sex", "Age", "Income"
]

X = data[features]


y_diabetes = data["Diabetes_binary"]
y_heart = data["HeartDiseaseorAttack"]


scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

joblib.dump(scaler, "scaler.pkl")
print("Scaler saved")


X_train, X_test, y_train, y_test = train_test_split(X_scaled, y_diabetes, test_size=0.2, random_state=42)

diabetes_model = RandomForestClassifier(n_estimators=200, max_depth=12)
diabetes_model.fit(X_train, y_train)

pred = diabetes_model.predict(X_test)
print("Diabetes Model Accuracy:", accuracy_score(y_test, pred))

joblib.dump(diabetes_model, "diabetes_model.pkl")
print("Diabetes Model Saved")

X_train, X_test, y_train, y_test = train_test_split(X_scaled, y_heart, test_size=0.2, random_state=42)

heart_model = RandomForestClassifier(n_estimators=200, max_depth=12)
heart_model.fit(X_train, y_train)

pred = heart_model.predict(X_test)
print("Heart Disease Model Accuracy:", accuracy_score(y_test, pred))

joblib.dump(heart_model, "heart_model.pkl")
print("Heart Disease Model Saved")

print("\n AI Health System Ready!")
print("Generated Files:")
print("- diabetes_model.pkl")
print("- heart_model.pkl")
print("- scaler.pkl")
