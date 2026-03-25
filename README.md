# 💓 PulseHealth — AI-Powered Health Risk Prediction System

> An intelligent full-stack web application that predicts health risks using Machine Learning, built with a FastAPI backend, ReactJS frontend, and secured with JWT authentication.

🌐 **Live Demo:** [pulsehealth-fron.onrender.com](https://pulsehealth-fron.onrender.com)

---

## 🧠 About the Project

**PulseHealth** is an AI-based health risk prediction platform that allows users to input their health parameters and receive an instant risk assessment powered by a Machine Learning model. The system analyzes factors like blood pressure, glucose levels, BMI, and age to predict potential health risks.

The goal is to make early health risk detection accessible to everyone through a simple, clean web interface.

---

## ✨ Features

-  **Secure Authentication** — JWT-based login and registration system
-  **ML Risk Prediction** — Trained machine learning model for health risk analysis
-  **Real-time Results** — Instant prediction feedback on the frontend
-  **Database Integration** — User data and history stored in MySQL
-  **Deployed & Live** — Hosted on Render for public access
-  **Responsive UI** — Clean ReactJS frontend that works on all screen sizes

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | ReactJS, CSS |
| Backend | Python, FastAPI |
| Database | MySQL |
| Authentication | JWT (JSON Web Tokens) |
| ML Library | Scikit-Learn |
| Deployment | Render |

---

## 📁 Project Structure

```
PulseHealth/
│
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── models.py            # SQLAlchemy DB models
│   ├── database.py          # DB connection setup
│   ├── auth.py              # JWT authentication logic
│   ├── ml_model.py          # ML model loading & prediction
│   └── requirements.txt     # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Login, Register, Dashboard
│   │   ├── App.js           # Main app component
│   │   └── index.js         # Entry point
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

```bash
Python 3.10+
Node.js 18+
MySQL 8.0+
```

### Backend Setup

```bash
# 1. Clone the repository
git clone https://github.com/Vaibhavnegi41/PulseHealth.git
cd PulseHealth/backend

# 2. Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create .env file
DATABASE_URL=mysql://user:password@localhost/pulsehealth
SECRET_KEY=your_secret_key_here

# 5. Run the server
uvicorn main:app --reload
```

### Frontend Setup

```bash
cd PulseHealth/frontend

# Install dependencies
npm install

# Start development server
npm start
```

---


## 🔮 Future Improvements

-  Add more ML models and compare accuracy
-  Add visual charts for health trend tracking
-  Email notifications for high-risk predictions
-  Admin dashboard for analytics
-  Mobile app version using React Native

---


> ⭐ If you found this project helpful, please give it a star on GitHub!
