# System Architecture

## Overview

Explainable AI-Based Student Placement Prediction and Skill Recommendation System.

The project follows a multi-tier architecture consisting of three independent layers:

- **React + Vite Frontend** – User interface for students and administrators.
- **Node.js + Express Backend** – Handles authentication, authorization, API routing, database operations, and communication with the ML service.
- **Flask ML Service** – Hosts the trained Logistic Regression model, performs inference, SHAP explainability, and recommendation generation.

MongoDB Atlas serves as the central database for users and prediction history.

This separation allows the frontend, backend, and ML system to evolve independently while communicating through REST APIs.

## Integration Status

The complete system has been integrated and tested end-to-end.

Implemented features include:

- User authentication (Signup/Login)
- JWT-based authorization
- Student & Admin roles
- Prediction History
- Admin Dashboard
- Prediction storage in MongoDB
- React ↔ Node ↔ Flask communication
- SHAP explainability
- Protected API routes

Prediction flow:

React
→ Express Backend
→ Flask ML API
→ MongoDB
→ React

Every authenticated prediction request is saved to MongoDB and linked to the currently logged-in user through an ObjectId reference.

Admin users have access to platform analytics including:

- Registered users
- Prediction history
- User roles
- Platform statistics

                    +-----------------------------+
                    |      React Frontend         |
                    |-----------------------------|
                    | Landing Page               |
                    | Login / Signup             |
                    | Student Dashboard          |
                    | Prediction History         |
                    | Admin Dashboard            |
                    +-------------+--------------+
                                  |
                           REST API (Axios)
                                  |
                                  ▼
                +-----------------------------------+
                |      Node.js + Express Backend    |
                |-----------------------------------|
                | JWT Authentication                |
                | Role-based Authorization          |
                | Prediction API                    |
                | Admin APIs                        |
                | History API                       |
                | MongoDB Operations                |
                +-------------+---------------------+
                              |
             +----------------+----------------+
             |                                 |
             ▼                                 ▼
+---------------------------+      +----------------------------+
|      MongoDB Atlas        |      |     Flask ML Service       |
|---------------------------|      |----------------------------|
| Users Collection          |      | Logistic Regression        |
| Predictions Collection    |      | SHAP Explainer            |
|                           |      | Recommendation Engine     |
+---------------------------+      | Percentile Calculator     |
                                   +-------------+-------------+
                                                 |
                                                 ▼
                                      Trained ML Artifacts
                                      (joblib)

## Data Flow (Prediction Request)

1. Student logs into the application.
2. Express verifies credentials using bcrypt.
3. JWT token is generated and returned.
4. Student submits placement information.
5. React sends a POST request to `/api/predict` with the JWT token.
6. Express verifies the token using authentication middleware.
7. Express forwards the request to the Flask ML API.
8. Flask preprocesses the data into model-ready format.
9. Logistic Regression predicts placement probability.
10. SHAP identifies positive and negative feature contributions.
11. Readiness score and percentile are calculated.
12. Flask returns the prediction result.
13. Express stores the prediction in MongoDB.
14. React displays:
    - Probability
    - Readiness Score
    - Percentile
    - Strengths
    - Weaknesses
    - Recommendations
15. The prediction is automatically available inside Prediction History.


## Data Flow (Prediction History)
1. Authenticated user navigates to `/history`
2. Frontend calls `GET /api/predictions/history` with JWT token
3. Node's auth middleware verifies the token
4. Node queries MongoDB for all `predictions` documents matching `user: req.user.id`, 
   sorted newest-first, excluding raw input data
5. Frontend renders results as a timeline list with probability, readiness score, 
   and timestamp per entry

## Data Flow (Admin Dashboard)

1. Admin logs into the system.
2. JWT token is verified.
3. Admin Dashboard requests:
   - Registered users
   - Prediction history
4. Express verifies that the authenticated user has the `admin` role.
5. MongoDB returns users and predictions.
6. Dashboard displays:
   - Total Users
   - Total Predictions
   - Admin Count
   - Student Count
   - Registered Users Table
   - Recent Predictions Table

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

| Layer            | Technology                                                       | Status     |
| ---------------- | ---------------------------------------------------------------- | ---------- |
| Frontend         | React, Vite, Tailwind CSS, Framer Motion, Recharts, Lucide React | ✅ Complete |
| Backend          | Node.js, Express.js                                              | ✅ Complete |
| Authentication   | JWT, bcrypt                                                      | ✅ Complete |
| Database         | MongoDB Atlas, Mongoose                                          | ✅ Complete |
| Machine Learning | Python, Flask, scikit-learn                                      | ✅ Complete |
| Explainability   | SHAP                                                             | ✅ Complete |
| Visualization    | Recharts                                                         | ✅ Complete |


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

## Frontend Structure (Implemented)
The frontend was rebuilt from a single-file structure into reusable components.



### New folder structure
src/
├── components/
│   ├── Admin/
│   ├── Charts/
│   ├── Hero/
│   ├── Features/
│   ├── Stats/
│   ├── Workflow/
│   ├── Technology/
│   ├── About/
│   ├── CTA/
│   ├── Navbar/
│   ├── StudentForm/
│   ├── PredictionCard/
│   ├── RecommendationCard/
│   └── LoadingCard/
│
├── pages/
│   ├── LandingPage.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Dashboard.jsx
│   ├── History.jsx
│   └── AdminDashboard.jsx
│
├── services/
│   └── api.js
│
├── utils/
│   └── constants.js
│
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

### Design system (implemented)
- Dark theme, background `#0B1020`, accent colors purple (`#8B5CF6`) and cyan (`#06B6D4`)
- Glassmorphism cards (`bg-white/[0.03]`, `backdrop-blur-xl`, `border-white/10`)
- Framer Motion for fade-ins, staggered animations, hover states
- Recharts for radar/bar/pie charts; custom SVG for the circular probability gauge
- Smooth scroll + themed scrollbar (purple-to-cyan gradient) via global CSS
- Public landing page (Hero, Stats, Features, Workflow, About, CTA) separate from 
  authenticated Dashboard experience

### Routes
| Path         | Page               | Access             |
| ------------ | ------------------ | ------------------ |
| `/`          | Landing Page       | Public             |
| `/login`     | Login              | Public             |
| `/signup`    | Signup             | Public             |
| `/dashboard` | Student Dashboard  | Authenticated User |
| `/history`   | Prediction History | Authenticated User |
| `/admin`     | Admin Dashboard    | Admin Only         |




### Important correction from initial design spec
An earlier AI-generated design spec assumed a different API response shape 
(`prediction`, `placement_probability`, `confidence`, `areas_to_improve`, 
`recommendations`) that does not match the actual, tested API contract 
(`probability`, `readiness_score`, `percentile`, `strengths[]`, `weaknesses[]`). 
The redesign implementation must use the real field names from api-contract.md. 
A fabricated "confidence" score was also proposed but rejected — Logistic Regression's 
predict_proba() produces one probability value, not a separate confidence metric, 
and inventing one would misrepresent the model's actual output.