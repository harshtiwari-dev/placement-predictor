# System Architecture — CareerLens AI

## Overview

**CareerLens AI — Explainable Career Intelligence**

CareerLens AI is an Explainable AI-based student placement prediction and skill recommendation system designed to help students understand their placement readiness and identify improvement areas.

The project follows a multi-tier architecture consisting of three independent layers:

* **React + Vite Frontend** – Provides the user interface for students and administrators.
* **Node.js + Express Backend** – Handles authentication, authorization, API routing, database operations, and communication with ML services.
* **Flask ML Service** – Hosts the trained machine learning model, performs inference, SHAP explainability, and recommendation generation.

MongoDB Atlas acts as the central database for storing:

* User accounts
* Roles
* Prediction history
* Student placement insights

This separation allows frontend, backend, and machine learning components to evolve independently while communicating through REST APIs.

---

# System Integration Status

The complete CareerLens AI system has been integrated and tested end-to-end.

Implemented features include:

* User authentication (Signup/Login)
* JWT-based authorization
* Student and Admin roles
* Placement prediction
* Prediction history
* Admin dashboard
* MongoDB prediction storage
* React ↔ Express ↔ Flask communication
* SHAP-based Explainable AI insights
* Skill improvement recommendations
* Protected API routes

---

# Overall System Flow

```
React Frontend
        |
        | REST API (Axios)
        |
        ▼
Express Backend
        |
        | ML Request
        |
        ▼
Flask ML Service
        |
        ▼
MongoDB Atlas
        |
        ▼
React Dashboard
```

Every authenticated prediction request is stored in MongoDB and linked to the currently logged-in user through an ObjectId reference.

---

# High-Level Architecture Diagram

```
                    +-----------------------------+
                    |      React Frontend         |
                    |-----------------------------|
                    | CareerLens AI Landing Page  |
                    | Login / Signup              |
                    | Student Dashboard           |
                    | Prediction History          |
                    | Admin Dashboard             |
                    | Navbar + Branding           |
                    +-------------+---------------+
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
| Predictions Collection   |      | SHAP Explainer             |
| User Roles               |      | Recommendation Engine      |
+---------------------------+      | Percentile Calculator      |
                                   +-------------+--------------+
                                                 |
                                                 ▼
                                      Trained ML Artifacts
                                      (joblib files)
```

---

# Data Flow — Prediction Request

1. Student logs into CareerLens AI.

2. Express verifies credentials using bcrypt.

3. JWT token is generated and returned.

4. Student submits placement-related information.

5. React sends a POST request to `/api/predict`.

6. Express validates JWT authentication.

7. Express forwards the request to Flask ML Service.

8. Flask preprocesses input data.

9. Machine learning model predicts placement probability.

10. SHAP analyzes positive and negative feature contributions.

11. Readiness score and percentile are calculated.

12. Flask returns prediction results.

13. Express stores prediction data in MongoDB.

14. React displays:

    * Placement Probability
    * Career Readiness Score
    * Percentile Ranking
    * Strengths
    * Weaknesses
    * Recommendations

15. The prediction becomes available in Prediction History.

---

# Data Flow — Prediction History

1. Authenticated user opens Prediction History.
2. Frontend sends:

```
GET /api/predictions/history
```

with JWT token.

3. Express authentication middleware validates the token.
4. Backend queries MongoDB predictions collection.
5. Predictions are filtered using:

```
user: req.user.id
```

6. Results are sorted newest-first.
7. Frontend displays prediction timeline with:

* Probability
* Readiness Score
* Timestamp

---

# Data Flow — Admin Dashboard

1. Admin logs into CareerLens AI.
2. JWT token authentication is verified.
3. Admin dashboard requests:

* Registered users
* Prediction records
* Platform statistics

4. Express verifies admin role.
5. MongoDB returns required information.
6. Dashboard displays:

* Total Users
* Total Predictions
* Admin Count
* Student Count
* Registered Users Table
* Recent Predictions Table

---

# Machine Learning Pipeline

The ML pipeline is separate from live prediction flow.

```
Kaggle Dataset
(10,000 records)

        ↓

clean.py
- Remove identifier columns
- Encode categorical features

        ↓

train.py
- Logistic Regression
- Random Forest
- XGBoost
- Balanced variants

Evaluation:
- Accuracy
- Precision
- Recall
- F1 Score
- ROC-AUC

        ↓

explain.py
- SHAP explainability
- Feature importance analysis

        ↓

recommend.py
- Recommendation validation

        ↓

save_model.py

Stores:
- Trained model
- SHAP explainer
- Feature columns
- Probability distribution

        ↓

app.py

Flask API Service
```

Dataset selection history and decisions are documented separately in `decisions.md`.

---

# Technology Stack

| Layer            | Technology                                                       | Status     |
| ---------------- | ---------------------------------------------------------------- | ---------- |
| Frontend         | React, Vite, Tailwind CSS, Framer Motion, Recharts, Lucide React | ✅ Complete |
| Backend          | Node.js, Express.js                                              | ✅ Complete |
| Authentication   | JWT, bcrypt                                                      | ✅ Complete |
| Database         | MongoDB Atlas, Mongoose                                          | ✅ Complete |
| Machine Learning | Python, Flask, scikit-learn                                      | ✅ Complete |
| Explainability   | SHAP                                                             | ✅ Complete |
| Visualization    | Recharts                                                         | ✅ Complete |

---

# Why Two Backends?

Node.js/Express and Flask serve different responsibilities.

## Node.js + Express

Handles:

* Authentication
* User management
* MongoDB operations
* API routing
* Frontend communication

## Flask

Handles:

* Machine learning inference
* SHAP explainability
* Recommendation generation

Python provides a mature ML ecosystem through:

* scikit-learn
* SHAP
* pandas
* numpy

Therefore, the ML model is served through Flask instead of being recreated in JavaScript.

---

# Model Details

* Algorithm: Logistic Regression
* Dataset: Placement Prediction Dataset
* Dataset Size: 10,000 records
* Train/Test Split: 80/20
* Random State: 42

## Features

1. CGPA
2. Internships
3. Projects
4. Workshops/Certifications
5. AptitudeTestScore
6. SoftSkillsRating
7. ExtracurricularActivities
8. PlacementTraining
9. SSC_Marks
10. HSC_Marks

## Performance

* Accuracy: 79.45%
* ROC-AUC: 0.877

## Explainability

SHAP is used for:

* Feature contribution analysis
* Strength identification
* Weakness detection
* Personalized recommendations

---

# Authentication & Data Model

## User Model

Contains:

* Name
* Email
* Password hash
* Role
* Created timestamp

Password security:

* bcrypt hashing
* 10 salt rounds

---

## Prediction Model

Contains:

* User reference
* Input data
* Probability
* Readiness score
* Strengths
* Weaknesses
* Created timestamp

JWT configuration:

* Secret stored in `.env`
* 7-day expiry
* Protected middleware validation

---

# Frontend Structure

The CareerLens AI frontend follows a reusable component-based architecture.

```
src/

├── assets/
│
├── components/
│   ├── Navbar/
│   ├── Hero/
│   ├── Features/
│   ├── Workflow/
│   ├── Technology/
│   ├── About/
│   ├── CTA/
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
```

---

# Branding Structure

CareerLens AI branding includes:


CareerLens AI
Explainable Career Intelligence
```

Clicking the logo or brand text navigates users smoothly to the top of the landing page.

---

# Design System

## Theme

* Dark background
* Purple and cyan accent colors
* Glassmorphism UI
* Rounded cards
* Soft shadows
* Blur effects

## Colors

Background:

```
#0B1020
```

Accent:

```
Purple: #8B5CF6
Cyan:   #06B6D4
```

## UI Features

* Framer Motion animations
* Recharts visualization
* Smooth scrolling
* Custom scrollbar
* Responsive layouts

---

# Application Routes

| Path         | Page                       | Access        |
| ------------ | -------------------------- | ------------- |
| `/`          | CareerLens AI Landing Page | Public        |
| `/login`     | Login                      | Public        |
| `/signup`    | Signup                     | Public        |
| `/dashboard` | Student Dashboard          | Authenticated |
| `/history`   | Prediction History         | Authenticated |
| `/admin`     | Admin Dashboard            | Admin Only    |

---

# Important API Correction

The frontend implementation follows the actual API response structure.

Actual response fields:

```json
{
 "probability": "",
 "readiness_score": "",
 "percentile": "",
 "strengths": [],
 "weaknesses": []
}
```

Earlier design concepts used:

* prediction
* confidence
* placement_probability
* recommendations

These fields are not used because they do not represent the actual ML API response.

The system avoids generating artificial confidence scores. Logistic Regression provides probability output, which is directly used for placement readiness calculation.

---

# Final Architecture Summary

CareerLens AI combines:

* Modern React frontend
* Secure Express backend
* Python-based ML service
* Explainable AI techniques
* MongoDB data management

The final system provides students with transparent placement predictions and actionable career improvement recommendations.
