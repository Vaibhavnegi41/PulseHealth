import joblib
import numpy as np

diabetes_model = joblib.load("diabetes_model.pkl")
heart_model = joblib.load("heart_model.pkl")
scaler = joblib.load("scaler.pkl")

# Format:
# HighBP, HighChol, CholCheck, BMI, Smoker, Stroke,
# PhysicalActivity, Alcohol, AnyHealthcare, NoDocCost,
# GenHlth, MentHlth, Sex, Age, Income

# Healthy athlete
person1 = [[0,0,1,22,0  ,0,1,0,1,0,2,0,1,4,8]]

# Unhealthy inactive smoker
person2 = [[1,1,0,35,1,0,0,1,0,1,4,15,1,9,3]]

# Obese, no gym, high BP
person3 = [[1,1,1,40,0,0,0,0,1,0,4,10,0,8,4]]

p1 = scaler.transform(person1)
p2 = scaler.transform(person2)
p3 = scaler.transform(person3)

print("\nPerson 1 (Athlete)")
print("Diabetes:", diabetes_model.predict(p1)[0])
print("Heart Disease:", heart_model.predict(p1)[0])

print("\nPerson 2 (Smoker)")
print("Diabetes:", diabetes_model.predict(p2)[0])
print("Heart Disease:", heart_model.predict(p2)[0])

print("\nPerson 3 (Obese)")
print("Diabetes:", diabetes_model.predict(p3)[0])
print("Heart Disease:", heart_model.predict(p3)[0])
