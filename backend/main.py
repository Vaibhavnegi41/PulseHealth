from fastapi import FastAPI,HTTPException,Depends
from pydantic import BaseModel,EmailStr
from typing import List,Optional
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector as sql
from passlib.context import CryptContext
from jose import jwt 
from datetime import datetime,timedelta
from fastapi.security import OAuth2PasswordBearer
import hashlib,joblib,numpy as np,pandas as pd
import smtplib,os
from email.message import EmailMessage
import os
from dotenv import load_dotenv

load_dotenv()

EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")
DB_PORT=os.getenv("DB_PORT")

SECRET_KEY = os.getenv("SECRET_KEY")


app=FastAPI()

secret_key=SECRET_KEY

algo="HS256"
token_expires_minute=30

oauth_scheme=OAuth2PasswordBearer(tokenUrl="login")

pwd_context=CryptContext(schemes=["bcrypt"],deprecated="auto")

def hash_password(password:str):
    hashlib_password=hashlib.sha256(password.encode()).hexdigest()
    return pwd_context.hash(hashlib_password)

def verify_password(plain:str,hashed:str):
    hashlib_password=hashlib.sha256(plain.encode()).hexdigest()
    return pwd_context.verify(hashlib_password,hashed)

origins = [
    "http://localhost:5173",           # Local Vite development
    "https://pulse-health-system.vercel.app", # Replace with your REAL Vercel URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,             
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    scaler=joblib.load("scaler.pkl")
    diabetes_model=joblib.load("diabetes_model.pkl")
    heart_model=joblib.load("heart_model.pkl")
except Exception as e:
    print(f"Error in loading models >>>>> {e}")

class HealthInput(BaseModel):
    sex: str
    patientName:str
    age: int
    height: float
    weight: float
    smoker: str
    activity: str
    bp_systolic: float = 124.0
    cholesterol: float = 175.0
    genHlth: str = "3"  
    stroke: str = "no"

def map_age_category(age:int):

    if age<25 : return 1
    if age<30 : return 2
    if age<35 : return 3
    if age<40 : return 4
    if age<45 : return 5
    if age<50 : return 6
    if age<55 : return 7
    if age<60 : return 8
    if age<65 : return 9
    if age<70 : return 10
    if age<75 : return 11
    if age<80 : return 12

    return 13


def get_connection():

    connection=sql.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
        port=DB_PORT
    )

    try:
        yield connection
    finally:
        connection.close()


class LoginDetails(BaseModel):
    email:EmailStr
    password:str

@app.get("/")
def home():
    return {"message": "PulseHealth Backend Running"}


def create_access_token(data:dict):
    to_encode=data.copy()
    expires=datetime.now() + timedelta(minutes=token_expires_minute)
    to_encode.update({"exp":expires})
    return jwt.encode(to_encode,secret_key,algorithm=algo)


def get_current_users(token:str=Depends(oauth_scheme)):

    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload=jwt.decode(token,secret_key,algorithms=[algo])
        email:str=payload.get("sub")

        if email is None:
            raise credentials_exception
        
        return email
    except:
        raise credentials_exception

@app.get("/")
def home_page():
    return {
        "message":"welcome to the fastapi  "
    }

@app.post("/register")
def user_register(details:LoginDetails,db=Depends(get_connection)):
    try:
        cursor=db.cursor()

        cursor.execute("SELECT email FROM dataset WHERE email=%s",(details.email,))
        existing_email=cursor.fetchone()

        if existing_email is not None:
            raise HTTPException(status_code=404,detail="Email already exists !")
        
        cleaned_password=details.password.strip()

        hashed_password=hash_password(cleaned_password)

        cursor.execute("INSERT INTO dataset (email,password) VALUES (%s,%s)",(details.email,hashed_password))
        db.commit()

        return {
            "message":"Successfully registered !",
            "type":"success",
            "Username":details.email
        }

    except Exception as e:
        raise HTTPException(status_code=400,detail=str(e))
    

@app.post("/login")
def login_user(register_details:LoginDetails,db=Depends(get_connection)):
    try:
        cursor=db.cursor()

        cursor.execute("SELECT email FROM dataset WHERE email=%s",(register_details.email,))
        existing_email=cursor.fetchone()

        if existing_email is  None:
            raise HTTPException(status_code=400,detail="Login Credentials does not exists in the system !")
        
        cursor.execute("SELECT password FROM dataset WHERE email=%s",(register_details.email,))
        existing_hashed_password=cursor.fetchone()[0]

        if not verify_password(register_details.password,existing_hashed_password):
            raise HTTPException(status_code=400,detail="Invalid password entered !")
        
        access_token=create_access_token({"sub":register_details.email})

        send_login_email(register_details.email)
        
        return {
            "access_token":access_token,
            "token_type":"bearer",
            "message":"Successfully login !",
            "type":"success"
        }
    
    except Exception as e:
        raise HTTPException(status_code=400,detail=str(e))
    

FEATURE_NAMES = [
    "HighBP", "HighChol", "CholCheck", "BMI", 
    "Smoker", "Stroke", "PhysicalActivity", 
    "HvyAlcoholConsump", "AnyHealthcare", "NoDocbcCost", "GenHlth", 
    "MentHlth", "Sex", "Age", "Income"
]

@app.post("/prediction")
async def predict_health(data: HealthInput,db=Depends(get_connection),current_user:str=Depends(get_current_users)):
    try:

        cursor=db.cursor()
       
        bmi = data.weight / ((data.height / 100) ** 2)
        sex_val = 1 if data.sex.lower() == "male" else 0
        smoker_val = 1 if data.smoker.lower() == "yes" else 0
        stroke_val = 1 if data.stroke.lower() == "yes" else 0
        
       
        activity_val = 1 if str(data.activity) in ["1", "2"] else 0
        
     
        high_bp = 1 if data.bp_systolic >= 140 else 0
        high_chol = 1 if data.cholesterol >= 200 else 0
        age_cat = map_age_category(data.age)

        
        processed_data = {
            
            "HighBP": high_bp,
            "HighChol": high_chol,
            "CholCheck": 1,     
            "BMI": bmi,
            "Smoker": smoker_val,
            "Stroke": stroke_val,

            "PhysicalActivity": activity_val,
            "HvyAlcoholConsump": 0,    
            "AnyHealthcare": 1,        
            "NoDocbcCost": 0,          
            "GenHlth": data.genHlth if hasattr(data, 'genHlth') else 3,
            "MentHlth": 0,             
            "Sex": sex_val,
            "Age": age_cat,
            "Income": 5             
        }

        df = pd.DataFrame([processed_data])[FEATURE_NAMES]

        features_scaled = scaler.transform(df)

        diab_prob = diabetes_model.predict_proba(features_scaled)[0][1]
        heart_prob = heart_model.predict_proba(features_scaled)[0][1]

        avg_risk = (diab_prob + heart_prob) / 2
        health_score = round(100 - (avg_risk * 100), 1)

        risk = "Low"
        if avg_risk >= 0.3: risk = "Moderate"
        if avg_risk >= 0.6: risk = "High"

        advice = "Your metrics look great!"
        if risk == "Moderate": advice = "Consider a more active lifestyle."
        if risk == "High": advice = "High risk. Please consult a doctor."

        cursor.execute("INSERT INTO HealthPredictData (currentUser,healthScore,risk,diabetes,heartDisease,advice,predictionDate,patientName) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)",
                       (current_user,health_score,risk,round(diab_prob * 100, 1),round(heart_prob * 100, 1),advice,datetime.now(),data.patientName))
        db.commit()
        
        return {
            "score": health_score,
            "risk": risk,
            "advice": advice,
            "details": {
                "diabetes_risk": f"{round(diab_prob * 100, 1)}%",
                "heart_risk": f"{round(heart_prob * 100, 1)}%"
            }
        }
    
    except Exception as e:
        print(f"Prediction Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    

class feedbackData(BaseModel):
    accuracy:int
    easyToUse:int
    rating:int
    suggestions:str
    

@app.post("/feedback")
def user_feedback(feedback:feedbackData,db=Depends(get_connection),current_user:str=Depends(get_current_users)):

    try:
        cursor=db.cursor()

        cursor.execute("INSERT INTO feedbackData (currentUser,accuracy,easyToUse,rating,suggestions,duration) VALUES (%s,%s,%s,%s,%s,%s)",
                       (current_user,feedback.accuracy,feedback.easyToUse,feedback.rating,feedback.suggestions,datetime.now()))
        db.commit()

        return {
            "message":"Successfully submitted feedback",
            "reply":"Thank you so much for your precious time !"
        }

    except Exception as e:
        raise HTTPException(status_code=500,detail=str(e))


@app.get("/history/{email}")
def get_history(email:str,db=Depends(get_connection)):
    try:
        cursor=db.cursor()

        cursor.execute("SELECT * FROM HealthPredictData WHERE currentUser=%s",(email,))
        health_data_user=cursor.fetchall()


        if health_data_user is None:
            raise HTTPException(status_code=400,detail="History does not exists !")
        
        return health_data_user
    
    except Exception as e:
        raise HTTPException(status_code=400,detail=str(e))
    
@app.delete("/history/{id}")
def delete_history(id:int,userEmail:str=Depends(get_current_users),db=Depends(get_connection)):

    try:
        cursor=db.cursor()

        cursor.execute("DELETE FROM HealthPredictData WHERE id=%s and currentUser=%s",(id,userEmail))

        db.commit()

    except Exception as e:
        raise HTTPException(status_code=400,detail=str(e))


def send_login_email(to_email: str):
    try:
        msg = EmailMessage()
        msg["Subject"] = "Successful Login – ❤️PulseHealth"
        msg["From"] = f"PulseHealth <{EMAIL_ADDRESS}>"
        msg["To"] = to_email

        msg.set_content(f"""
Hello,

You have successfully logged in to your PulseHealth account.

If this was you, no action is needed.
If this wasn’t you, please reset your password immediately.

❤️ PulseHealth – Your AI Health Partner 🩺
""")

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            server.send_message(msg)

        print("Login email sent")

    except Exception as e:
        print("Email error:", e)

