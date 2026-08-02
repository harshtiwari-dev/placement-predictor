# System Architecture

## Overview
Explainable AI-Based Student Placement Prediction and Skill Recommendation System.
Two-backend architecture: Node.js/Express handles application logic (auth, data storage), 
Flask handles ML inference. This separation lets ML and full-stack development happen 
in parallel by different team members.

## Integration Status
The Node ↔ Flask integration has been built and tested end-to-end. A POST request 
to Node's /api/predict correctly forwards to Flask's /predict, returns the full 
prediction response (probability, readiness score, percentile, strengths, weaknesses 
with labels and suggestions), unmodified through the chain.

Prediction requests are protected by JWT authentication (via middleware) and results 
are persisted to MongoDB in a `predictions` collection, linked to the authenticated 
user via a MongoDB ObjectId reference. Verified in Atlas that saved predictions 
correctly reference the user who made them.

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
│ + Percentile Distribution │
│ (loaded from disk via joblib │
│ at startup, see save_model.py)│
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
9. Percentile is computed by comparing the prediction against the saved training-set 
   probability distribution
10. Flask API returns JSON: `probability`, `readiness_score`, `percentile`, 
    `strengths[]`, `weaknesses[]` (exact format documented in `api-contract.md`)
11. Node/Express receives this response and saves it to MongoDB as a `predictions` 
    document, linked to the authenticated user's ID
12. Node/Express sends the result to React frontend
13. React frontend displays probability, readiness score, percentile, and 
    recommendations to the student

## ML Pipeline (Offline / Model Preparation)
Separate from the live prediction flow — this is how the model itself was built:
Kaggle Dataset (10,000 records)
↓
clean.py — drop identifier column, encode Yes/No fields to 0/1
↓
train.py — train & compare Logistic Regression (standard + balanced), Random Forest 
(standard + balanced), XGBoost (standard + balanced)
(Accuracy, Precision, Recall, F1, ROC-AUC — see experiments.md)
↓
explain.py — apply SHAP to best model (Logistic Regression), generate
global feature importance chart
↓
recommend.py — exploratory script validating SHAP-based recommendation logic
↓
save_model.py — persist trained model, SHAP explainer, feature columns, and training 
probability distribution to disk via joblib (avoids retraining on every Flask startup)
↓
app.py — load persisted artifacts, wrap in a Flask API for live use

**Dataset history:** this project used three dataset iterations before settling on 
the current one (MBA-specific → CSE-relevant but imbalanced → CSE-relevant and 
well-balanced). Full rationale for each switch documented in decisions.md.

## Tech Stack

| Layer | Technology | Status | Owner |
|---|---|---|---|
| Frontend | React, Tailwind CSS, Framer Motion, Recharts, Lucide React | In progress (redesign) | Team |
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
- Algorithm: Logistic Regression (selected after comparison with Random Forest, XGBoost, 
  and class-balanced variants of all three — see experiments.md)
- Dataset: "Placement Prediction Dataset" (ruchikakumbhar, Kaggle), 10,000 records, 
  8,000 train / 2,000 test (80/20 split, random_state=42)
- Features (10): CGPA, Internships, Projects, Workshops/Certifications, 
  AptitudeTestScore, SoftSkillsRating, ExtracurricularActivities, PlacementTraining, 
  SSC_Marks, HSC_Marks
- Test accuracy: 79.45%, ROC-AUC: 0.877
- Explainability: SHAP (Explainer, applied per-prediction at inference time)
- Percentile: computed against the saved distribution of all training-set prediction 
  probabilities, giving relative context alongside the raw probability

## Auth & Data Model
- **User model**: name, email (unique), hashed password (bcrypt, 10 salt rounds), 
  role (student/admin), createdAt
- **Prediction model**: user (ObjectId reference to User), inputData, probability, 
  readinessScore, strengths, weaknesses, createdAt
- JWT tokens signed with a secret stored in `.env` (excluded from git), 7-day expiry
- Protected routes verified via `middleware/auth.js`, which checks the 
  `Authorization: Bearer <token>` header

## Frontend Redesign Plan (In Progress)
Planning a full visual redesign of the React frontend, moving from the current 
functional-but-plain UI to a premium, dashboard-style interface.

### New folder structure
src/
├── assets/
├── components/
│ ├── Navbar/
│ ├── StudentForm/
│ ├── PredictionCard/
│ ├── Charts/
│ │ ├── RadarChart.jsx
│ │ ├── BarChart.jsx
│ │ └── PieChart.jsx
│ ├── RecommendationCard/
│ ├── Loading/
│ └── Footer/
├── pages/
│ └── Home.jsx
├── layouts/
├── services/
│ └── api.js
├── hooks/
├── utils/
│ ├── constants.js
│ └── helpers.js
├── styles/
├── App.jsx
└── main.jsx


### New dependencies
Framer Motion (animations), Recharts (radar/bar/pie charts), Lucide React (icons) — 
in addition to existing React, Tailwind CSS, axios, react-router-dom.

### Design direction
- Dark theme, background `#0B1020`, accent colors purple (`#8B5CF6`) and cyan (`#06B6D4`)
- Glassmorphism cards, rounded corners, soft shadows, blur effects
- Radar chart comparing CGPA/AptitudeTestScore/SoftSkillsRating/SSC_Marks/HSC_Marks/
  ExtracurricularActivities; bar chart for Internships/Projects/Workshops; pie chart 
  for Placed/Not Placed probability split

### Important correction from initial design spec
An earlier AI-generated design spec assumed a different API response shape 
(`prediction`, `placement_probability`, `confidence`, `areas_to_improve`, 
`recommendations`) that does not match the actual, tested API contract 
(`probability`, `readiness_score`, `percentile`, `strengths[]`, `weaknesses[]`). 
The redesign implementation must use the real field names from api-contract.md. 
A fabricated "confidence" score was also proposed but rejected — Logistic Regression's 
predict_proba() produces one probability value, not a separate confidence metric, 
and inventing one would misrepresent the model's actual output.