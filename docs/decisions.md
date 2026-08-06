# Project Decisions — CareerLens AI

## SHAP + NumPy Compatibility Issue

During Explainable AI implementation, a `TypeError` was encountered while generating SHAP visualizations using `shap.plots.beeswarm()`.

The issue occurred because boolean (`True/False`) columns created during encoding were incompatible with NumPy rounding operations in the installed SHAP version.

### Resolution

All boolean columns were explicitly converted into integer (`0/1`) values inside `clean.py` after preprocessing.

This ensured compatibility between:

* SHAP
* NumPy
* scikit-learn pipeline

---

# Two-Backend Architecture (Node.js + Flask)

CareerLens AI uses two independent backend services.

## Node.js + Express Backend

Responsibilities:

* Authentication
* Authorization
* MongoDB operations
* API routing
* Prediction history management
* Admin APIs
* Communication with Flask ML service

---

## Flask ML Service

Responsibilities:

* Loading trained ML model
* Generating placement predictions
* Computing SHAP explanations
* Generating recommendation insights

Python's machine learning ecosystem provides mature support through:

* scikit-learn
* SHAP
* pandas
* numpy

Therefore, Flask was selected for serving the ML model instead of attempting to recreate the ML pipeline in Node.js.

This separation allowed frontend, backend, and machine learning development to progress independently before final integration.

---

# Authentication Strategy

CareerLens AI implements secure authentication using:

* bcrypt password hashing
* JWT-based authentication
* Express authentication middleware

Security decisions:

* Passwords are never stored in plaintext.
* Sensitive credentials are stored using environment variables.
* Protected routes require valid JWT authentication.

JWT payload contains:

* User ID
* User role

These values are used throughout the application for authentication and authorization.

---

# Role-Based Authorization

Instead of maintaining separate applications for students and administrators, CareerLens AI uses role-based authorization.

Available roles:

* `student`
* `admin`

A dedicated authorization middleware validates user roles and restricts admin-only routes.

Admin features include:

* View registered users
* View all prediction records
* Access dashboard statistics

This approach maintains a single authentication system while providing different permission levels.

---

# Database Naming

Initially, MongoDB connected to the default `test` database because no database name was specified.

The connection URI was updated to explicitly use:

```text
placement-predictor
```

This provides:

* Cleaner database organization
* Better separation of project data
* Reduced risk of accidental collections inside the default database

---

# Secrets Management

Sensitive configuration values are stored inside `.env`.

Examples:

* MongoDB connection URI
* JWT secret key

The `.env` file is excluded from Git using `.gitignore`.

Security practices:

* Secrets are never committed to version control.
* Database credentials were rotated after accidental exposure during debugging.

---

# React ↔ Express ↔ Flask Integration

CareerLens AI follows this prediction pipeline:

```text
React Frontend

↓

Express /api/predict

↓

JWT Verification

↓

Axios Request

↓

Flask /predict

↓

Machine Learning Model

↓

SHAP Explainability

↓

Express Stores Result

↓

MongoDB

↓

Frontend Response
```

The complete pipeline was tested end-to-end successfully.

---

# Prediction Persistence

Every generated prediction is automatically stored in MongoDB.

Each prediction document contains:

* Authenticated user ID
* Student input values
* Placement probability
* Readiness score
* Strengths
* Weaknesses
* Timestamp

Predictions are linked to users using MongoDB ObjectId references.

This design enabled the Prediction History feature without requiring schema redesign.

---

# Prediction History Feature

CareerLens AI includes a dedicated Prediction History module.

Backend endpoint:

```text
GET /api/predictions/history
```

Features:

* JWT protected
* Returns only logged-in user's predictions
* Sorted newest first
* Provides historical career readiness insights

---

# Admin Dashboard

A dedicated administrator dashboard was implemented.

Dashboard provides:

* Total Users
* Total Predictions
* Student Count
* Admin Count

Additional features:

* Complete users table
* Complete prediction records table

Only users with the `admin` role can access these features.

The frontend also hides admin navigation options from non-admin users.

---

# Dataset Switch — MBA Dataset to Engineering Dataset

The initial dataset focused mainly on MBA placement factors.

Since CareerLens AI targets engineering students, the dataset was replaced with engineering-relevant placement datasets.

This decision improved:

* Target audience alignment
* Practical relevance
* Research applicability
* Model usefulness

---

# Dataset Evaluation

Multiple datasets were evaluated before selecting the final dataset.

Rejected datasets included:

* Deterministic datasets where models achieved unrealistic 100% accuracy
* Highly imbalanced datasets
* Datasets producing unreliable probability outputs
* Datasets with weak predictive relationships

Selected dataset:

**Placement Prediction Dataset**

Source:

Kaggle — ruchikakumbhar

Reasons:

* 10,000 student records
* Balanced class distribution
* Engineering-relevant features
* Realistic model performance
* Suitable for Explainable AI analysis

---

# Model Selection

Multiple machine learning algorithms were compared:

Evaluated models:

* Logistic Regression
* Random Forest
* XGBoost

Evaluation metrics:

* Accuracy
* Precision
* Recall
* F1 Score
* ROC-AUC

Although tree-based models performed well on some datasets, Logistic Regression was selected because:

* It produced realistic generalization results.
* It provides interpretable probability outputs.
* It works effectively with SHAP explanations.

---

# Percentile Ranking

CareerLens AI includes percentile ranking along with prediction probability.

Instead of displaying only:

```text
58% placement probability
```

the system also provides relative ranking compared with the training population.

Percentile calculation:

* Uses saved training prediction probability distribution.
* Provides additional context.
* Does not modify the actual model prediction.

---

# Frontend Redesign

The frontend was redesigned from a simple application structure into a reusable React component architecture.

Implemented modules:

* Landing Page
* Login
* Signup
* Student Dashboard
* Prediction History
* Admin Dashboard

Reusable components include:

* Navbar
* Student Form
* Prediction Card
* Recommendation Card
* Charts
* Admin Tables
* Statistic Cards

This improves:

* Maintainability
* Scalability
* Future feature development

---

# CareerLens AI Branding Decision

The application branding was updated from a generic placement prediction portal to:

```text
CareerLens AI
Explainable Career Intelligence
```

Branding implementation:

*  BrainCircuit logo
*  favicon
* Purple-to-cyan gradient identity
* Clickable navbar branding

The navbar branding allows users to return to the top of the landing page by clicking:

* Logo
* CareerLens AI text
* Brand section

---

# Dashboard Loading Experience

Instead of showing an empty prediction section during ML processing, CareerLens AI provides a staged AI workflow animation.

Stages include:

1. Collecting student profile
2. Validating academic information
3. Running ML prediction
4. Applying SHAP explainability
5. Generating recommendations
6. Finalizing results

This improves user experience while accurately representing the prediction process.

---

# UI Design System

CareerLens AI follows a modern AI dashboard design system.

Design decisions:

* Dark theme
* Glassmorphism cards
* Purple and cyan accents
* Framer Motion animations
* Recharts visualizations
* Lucide React icons

Theme colors:

```text
Background:
#0B1020

Purple:
#8B5CF6

Cyan:
#06B6D4
```

The goal was to create an AI-powered career intelligence platform rather than a traditional academic portal.

---

# Future Deployment Strategy

CareerLens AI is designed for independent service deployment.

Planned deployment:

| Service          | Platform      |
| ---------------- | ------------- |
| React Frontend   | Vercel        |
| Express Backend  | Render        |
| Flask ML API     | Render        |
| MongoDB Database | MongoDB Atlas |

This architecture allows:

* Independent scaling
* Easier maintenance
* Production-style deployment workflow

---

# Final Decision Summary

CareerLens AI combines:

* Full-stack web architecture
* Machine learning prediction
* Explainable AI
* Secure authentication
* Personalized recommendations

The final design prioritizes transparency, scalability, and meaningful career guidance for students.
