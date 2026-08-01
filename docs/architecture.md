# System Architecture

## Overview
Explainable AI-Based Student Placement Prediction and Skill Recommendation System.
Two-backend architecture: Node.js/Express handles application logic (auth, data storage), 
Flask handles ML inference. This separation lets ML and full-stack development happen 
in parallel by different team members.

## Integration Status
The Node ↔ Flask integration has been built and tested end-to-end. A POST request 
to Node's /api/predict correctly forwards to Flask's /predict, returns the full 
prediction response (probability, readiness score, strengths, weaknesses with labels 
and suggestions), unmodified through the chain.

Prediction requests are now protected by JWT authentication (via middleware) and 
results are persisted to MongoDB in a `predictions` collection, linked to the 
authenticated user via a MongoDB ObjectId reference. Verified in Atlas that saved 
predictions correctly reference the user who made them.

Authentication (signup/login) is fully implemented and tested: passwords are hashed 
with bcrypt, sessions use JWT tokens (7-day expiry), and protected routes verify 
tokens via middleware before processing requests.

## Architecture Diagram
┌─────────────────────────────────────────────────────────┐
│ FRONTEND (React) │
│ Student Dashboard │ Login/Signup │ Prediction Result UI │
└───────────────────────┬───────────────────────────────────┘
│ REST API calls (axios/fetch)
▼
┌─────────────────────────────────────────────────────────┐
│ NODE.JS + EXPRESS (Main Backend) │
│ - User auth (student/admin) — JWT + bcrypt, implemented │
│ - CRUD: profile, resume, skills, internships │
│ - Stores/fetches data from MongoDB │
│ - Forwards prediction requests to ML API │
│ - Saves predictions linked to authenticated user │
└──────────┬──────────────────────────────┬─────────────────┘
│ │
▼ ▼
┌─────────────────────┐ ┌─────────────────────────────┐
│ MongoDB │ │ FLASK API (Python, ML) │
│ users, │ │ Endpoint: POST /predict │
│ predictions │ │ Port: 5000 (local dev) │
└─────────────────────┘ └───────────┬───────────────────┘
▼
┌─────────────────────────────┐
│ Logistic Regression model │
│ + SHAP Explainer │
│ (trained on startup, │
│ held in memory) │
└─────────────────────────────┘

## Data Flow (Prediction Request)
1. Student logs in via React frontend, receives a JWT token
2. Student fills placement details form in React frontend
3. Frontend sends form data to Node/Express backend's `/api/predict`, with the JWT 
   token in the Authorization header
4. Node's auth middleware verifies the token before proceeding
5. Node/Express forwards the form data as JSON to Flask API (`POST /predict`)
6. Flask API converts JSON into a DataFrame matching the trained model's feature columns
7. Logistic Regression model returns a placement probability
8. SHAP explainer computes per-student feature impact (which factors helped/hurt)
9. Flask API returns JSON: `probability`, `readiness_score`, `strengths[]`, `weaknesses[]`
   (exact format documented in `api-contract.md`)
10. Node/Express receives this response and saves it to MongoDB as a `predictions` 
    document, linked to the authenticated user's ID
11. Node/Express sends the result to React frontend
12. React frontend displays probability, readiness score, and recommendations to the student

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

| Layer | Technology | Status | Owner |
|---|---|---|---|
| Frontend | React, Tailwind CSS | Not started | Team |
| Application Backend | Node.js, Express | Complete (auth, predict route) | ML Lead + Backend |
| Database | MongoDB (Atlas) | Complete (users, predictions) | ML Lead + Backend |
| ML Model | Python, pandas, scikit-learn | Complete | ML Lead |
| Explainability | SHAP | Complete | ML Lead |
| ML API | Flask | Complete | ML Lead |

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

## Auth & Data Model
- **User model**: name, email (unique), hashed password (bcrypt, 10 salt rounds), 
  role (student/admin), createdAt
- **Prediction model**: user (ObjectId reference to User), inputData, probability, 
  readinessScore, strengths, weaknesses, createdAt
- JWT tokens signed with a secret stored in `.env` (excluded from git), 7-day expiry
- Protected routes verified via `middleware/auth.js`, which checks the 
  `Authorization: Bearer <token>` header