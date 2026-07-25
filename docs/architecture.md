# System Architecture

## Overview
Explainable AI-Based Student Placement Prediction and Skill Recommendation System.
Two-backend architecture: Node.js/Express handles application logic (auth, data storage), 
Flask handles ML inference. This separation lets ML and full-stack development happen 
in parallel by different team members.

## Architecture Diagram
┌─────────────────────────────────────────────────────────┐
│ FRONTEND (React) │
│ Student Dashboard │ Login/Signup │ Prediction Result UI │
└───────────────────────┬───────────────────────────────────┘
│ REST API calls (axios/fetch)
▼
┌─────────────────────────────────────────────────────────┐
│ NODE.JS + EXPRESS (Main Backend) │
│ - User auth (student/admin) │
│ - CRUD: profile, resume, skills, internships │
│ - Stores/fetches data from MongoDB │
│ - Forwards prediction requests to ML API │
└──────────┬──────────────────────────────┬─────────────────┘
│ │
▼ ▼
┌─────────────────────┐ ┌─────────────────────────────┐
│ MongoDB │ │ FLASK API (Python, ML) │
│ student profiles, │ │ Endpoint: POST /predict │
│ predictions history │ │ Port: 5000 (local dev) │
└─────────────────────┘ └───────────┬───────────────────┘
▼
┌─────────────────────────────┐
│ Logistic Regression model │
│ + SHAP Explainer │
│ (trained on startup, │
│ held in memory) │
└─────────────────────────────┘

## Data Flow (Prediction Request)
1. Student fills placement details form in React frontend
2. Frontend sends form data to Node/Express backend
3. Node/Express forwards this data as JSON to Flask API (`POST /predict`)
4. Flask API converts JSON into a DataFrame matching the trained model's feature columns
5. Logistic Regression model returns a placement probability
6. SHAP explainer computes per-student feature impact (which factors helped/hurt)
7. Flask API returns JSON: `probability`, `readiness_score`, `strengths[]`, `weaknesses[]`
   (exact format documented in `api-contract.md`)
8. Node/Express receives this response, optionally saves it to MongoDB as prediction history
9. Node/Express sends the result to React frontend
10. React frontend displays probability, readiness score, and recommendations to the student

## ML Pipeline (Offline / Model Preparation)
Separate from the live prediction flow — this is how the model itself was built:
Kaggle Dataset (215 records)
↓
clean.py — drop irrelevant/leaking columns, encode categorical features,
fix boolean dtype for SHAP compatibility
↓
train.py — train & compare Logistic Regression, Random Forest, XGBoost
(Accuracy, Precision, Recall, F1, ROC-AUC — see experiments.md)
↓
explain.py — apply SHAP to best model (Logistic Regression), generate
global feature importance chart
↓
recommend.py — convert SHAP output into readiness score + strengths/weaknesses
(validated on both high and low scoring students)
↓
app.py — wrap trained model + SHAP explainer in a Flask API for live use


## Tech Stack

| Layer | Technology | Owner |
|---|---|---|
| Frontend | React, Tailwind CSS | Team |
| Application Backend | Node.js, Express | Team |
| Database | MongoDB | Team |
| ML Model | Python, pandas, scikit-learn | ML Lead |
| Explainability | SHAP | ML Lead |
| ML API | Flask | ML Lead |

## Why Two Backends
Node/Express and Flask serve different purposes and are not redundant:
- **Node/Express**: handles everything app-related — authentication, user data, 
  MongoDB storage, routing between frontend and services.
- **Flask**: purpose-built to serve a trained Python ML model. Python's ML ecosystem 
  (scikit-learn, SHAP) has no equivalent maturity in Node.js, so the model is served 
  via its own lightweight API rather than reimplemented in JavaScript.

This also allows the ML component and full-stack component to be built, tested, and 
run independently before final integration — Node/React can be developed against the 
documented API contract using mock data even before the Flask API is complete.

## Model Details
- Algorithm: Logistic Regression (selected after comparison with Random Forest, XGBoost)
- Training data: 215 records, 172 train / 43 test (80/20 split, random_state=42)
- Features: 14 (after encoding), covering academic percentages, board, stream, 
  work experience, specialization, gender
- Explainability: SHAP (Explainer, applied per-prediction at inference time)