# Project Decisions

## SHAP + NumPy Compatibility Issue

Encountered a `TypeError` when running `shap.plots.beeswarm()` due to boolean (`True/False`) columns created during one-hot encoding being incompatible with NumPy's rounding functions in the installed SHAP version.

Resolved by explicitly converting all boolean columns to integer (`0/1`) values inside `clean.py` after encoding.

---

## Two-Backend Architecture (Node.js + Flask)

The application uses two independent backend services.

- **Node.js + Express**
  - Authentication
  - Authorization
  - MongoDB operations
  - API routing
  - Prediction history
  - Admin APIs
  - Communication with Flask

- **Flask**
  - Loads trained ML model
  - Generates predictions
  - Computes SHAP explanations
  - Returns recommendation data

Python's machine learning ecosystem (scikit-learn, SHAP) is significantly more mature than JavaScript's, making Flask the appropriate choice for serving the ML model instead of attempting to port it into Node.js.

This separation also allowed ML development and backend development to proceed independently before final integration.

---

## Authentication Strategy

Implemented authentication using:

- bcrypt for password hashing (12 salt rounds)
- JWT tokens with 7-day expiry
- Express authentication middleware protecting all private routes

Passwords are never stored in plaintext.

JWT contains:

- user id
- user role

which are used for authentication and authorization throughout the application.

---

## Role-Based Authorization

Instead of maintaining separate applications for administrators and students, the project uses role-based authorization.

Two roles exist:

- student
- admin

A dedicated `adminMiddleware` checks the decoded JWT and restricts admin-only endpoints.

Admin-only features include:

- View all registered users
- View all prediction history
- Dashboard statistics

This approach keeps one authentication system while providing different permissions.

---

## Database Naming

Initially MongoDB connected to the default `test` database because no database name existed inside the connection string.

The URI was updated to explicitly use:

`placement-predictor`

This keeps the database structure cleaner and avoids accidental collections inside the default database.

---

## Secrets Management

Sensitive configuration is stored inside `.env`.

Examples:

- MongoDB URI
- JWT Secret

The `.env` file is excluded from Git using `.gitignore`.

Database credentials were rotated after being exposed once during debugging.

---

## Node ↔ Flask Integration

Implemented the following prediction pipeline:

React

↓

Express `/api/predict`

↓

JWT verification

↓

Axios request

↓

Flask `/predict`

↓

Machine Learning model

↓

Express stores prediction

↓

MongoDB

↓

Frontend response

The integration was tested end-to-end and verified successfully.

---

## Prediction Persistence

Every prediction is automatically stored inside MongoDB.

Each prediction document contains:

- authenticated user id
- input values
- probability
- readiness score
- strengths
- weaknesses
- timestamp

Predictions are linked to users through a MongoDB ObjectId reference.

This design enabled prediction history without changing the schema later.

---

## Prediction History Feature

Added a dedicated history page allowing every authenticated student to review previous predictions.

Backend endpoint:

GET `/api/predictions/history`

Features:

- JWT protected
- returns only current user's predictions
- sorted newest first
- excludes raw input data

No schema changes were required because predictions were already linked to users.

---

## Admin Dashboard

Implemented a dedicated administrator dashboard.

The dashboard displays:

- Total Users
- Total Predictions
- Total Students
- Total Admins

It also provides:

- complete users table
- complete prediction table

Only users with the `admin` role can access these endpoints.

The frontend additionally hides the Admin Dashboard navigation link for non-admin users.

---

## Dataset Switch — MBA Dataset to Engineering Dataset

The original dataset ("Factors Affecting Campus Placement") focused primarily on MBA admissions and placements.

Since the target audience of this project is engineering students, the dataset was replaced with engineering-relevant placement datasets.

This also improves the originality and research value of the project.

---

## Dataset Evaluation

Several candidate datasets were evaluated.

Rejected datasets included:

- deterministic datasets where Random Forest achieved 100% accuracy
- highly imbalanced datasets producing unrealistic probabilities
- datasets with weak predictive relationships

The selected dataset:

**Placement Prediction Dataset (Kaggle — ruchikakumbhar)**

Reasons:

- 10,000 records
- balanced classes
- realistic feature relationships
- realistic model accuracy
- suitable for explainability

---

## Model Selection

Multiple algorithms were compared.

Models evaluated:

- Logistic Regression
- Random Forest
- XGBoost

Selection metrics:

- Accuracy
- Precision
- Recall
- F1 Score
- ROC-AUC

Although some tree-based models achieved higher scores on earlier datasets, Logistic Regression was selected because it generalized realistically on the final dataset and produces interpretable probabilities suitable for SHAP explanations.

---

## Percentile Ranking

Added a percentile metric alongside prediction probability.

Instead of showing only:

> 58% placement chance

the system also reports how the student compares with the training population.

Percentile is computed using the saved training prediction probability distribution.

This provides additional context without altering the actual model prediction.

---

## Frontend Redesign

The frontend was completely redesigned into reusable React components.

Major improvements include:

- Landing Page
- Dashboard
- Login
- Signup
- History
- Admin Dashboard

Reusable UI components include:

- Navbar
- Student Form
- Prediction Card
- Recommendation Card
- Charts
- Admin Tables
- Statistic Cards

The redesign improves maintainability and makes future feature additions easier.

---

## Dashboard Loading Experience

Instead of displaying a blank prediction card while waiting for the ML model, the dashboard now shows a staged loading animation representing the AI pipeline.

Stages include:

- Collecting student profile
- Validating academic records
- Running ML prediction
- Applying SHAP explainability
- Generating recommendations
- Finalizing results

This improves perceived responsiveness while accurately representing the prediction workflow.

---

## UI Design System

Adopted a consistent dark theme throughout the application.

Design choices:

- Background: `#0B1020`
- Purple/Cyan gradient accents
- Glassmorphism cards
- Framer Motion animations
- Recharts visualizations
- Lucide React icons

The goal was to create a modern AI dashboard rather than a traditional academic web application.

---

## Future Deployment Strategy

The project is designed for independent deployment of each service.

Planned deployment:

- React → Vercel
- Express Backend → Render
- Flask ML API → Render
- MongoDB Atlas → Cloud Database

This architecture allows each service to scale independently and mirrors production deployment practices used in modern full-stack applications.