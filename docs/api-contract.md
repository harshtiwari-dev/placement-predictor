# API Contract — CareerLens AI

## Overview

This document defines the REST API contract used between the **CareerLens AI React frontend**, **Express backend**, and **Flask ML service**.

CareerLens AI follows a layered architecture:

* **React Frontend** communicates only with the Express backend.
* **Express Backend** handles authentication, authorization, MongoDB operations, API routing, and communication with ML services.
* **Flask ML Service** performs machine learning inference, placement prediction, and Explainable AI analysis.

The architecture ensures separation between user interface, backend logic, database operations, and machine learning processing.

All protected endpoints require a valid JWT token in the `Authorization` header.

---

# Flask ML Service

## Endpoint

```
POST http://localhost:5000/predict
```

## Purpose

The Flask ML service receives student profile information, runs the trained machine learning model, and returns:

* Placement probability
* Career readiness score
* Percentile ranking
* Explainable AI insights
* Strengths and weaknesses based on feature contributions

---

## Request Format

Send a JSON body with the following fields:

```json
{
  "CGPA": 8.0,
  "Internships": 1,
  "Projects": 3,
  "Workshops/Certifications": 2,
  "AptitudeTestScore": 75,
  "SoftSkillsRating": 3.9,
  "ExtracurricularActivities": 1,
  "PlacementTraining": 1,
  "SSC_Marks": 80,
  "HSC_Marks": 78
}
```

---

## Field Meanings

| Field                     | Meaning                                      | Type / Range   |
| ------------------------- | -------------------------------------------- | -------------- |
| CGPA                      | Cumulative Grade Point Average               | Number (0–10)  |
| Internships               | Number of completed internships              | Integer (0–2)  |
| Projects                  | Academic or personal projects completed      | Integer (0–3)  |
| Workshops/Certifications  | Completed workshops and certifications       | Integer (0–3)  |
| AptitudeTestScore         | Aptitude assessment score                    | Number (0–100) |
| SoftSkillsRating          | Communication and soft skill rating          | Number (0–5)   |
| ExtracurricularActivities | Participation in extracurricular activities  | 0 or 1         |
| PlacementTraining         | Completion of placement preparation training | 0 or 1         |
| SSC_Marks                 | Class 10 percentage                          | Number (0–100) |
| HSC_Marks                 | Class 12 percentage                          | Number (0–100) |

> The frontend supports realistic student profiles beyond the original dataset range to provide better user experience while maintaining prediction reliability.

---

# Response Format

```json
{
  "probability": 51.4,
  "readiness_score": 51,
  "percentile": 59,
  "strengths": [
    {
      "feature": "AptitudeTestScore",
      "label": "Aptitude Test Score",
      "impact": 0.42
    }
  ],
  "weaknesses": [
    {
      "feature": "Internships",
      "label": "Internships Completed",
      "impact": -0.15,
      "suggestion": "Consider completing one or more internships."
    }
  ]
}
```

---

## Response Field Description

| Field           | Description                                         |
| --------------- | --------------------------------------------------- |
| probability     | Predicted placement probability (0–100%)            |
| readiness_score | Rounded probability shown as career readiness score |
| percentile      | Student ranking compared with training dataset      |
| strengths       | Top positive feature contributions                  |
| weaknesses      | Top negative feature contributions                  |
| feature         | Internal ML model feature name                      |
| label           | User-friendly feature name                          |
| impact          | Explainable AI feature contribution value           |
| suggestion      | Improvement recommendation for negative factors     |

---

# Express Backend APIs

The Express backend acts as the primary API layer between the CareerLens AI frontend and Flask ML service.

---

# Predict Placement

## Endpoint

```
POST http://localhost:5001/api/predict
```

## Authentication

Protected Route

Header:

```
Authorization: Bearer <JWT_TOKEN>
```

---

## Request Body

Uses the same JSON structure as the Flask `/predict` endpoint.

---

## Backend Flow

1. Verify JWT token.
2. Validate incoming student data.
3. Forward request to Flask ML service.
4. Receive prediction and Explainable AI results.
5. Store prediction details in MongoDB.
6. Return response to the React frontend.

---

# Authentication APIs

## User Signup

### Endpoint

```
POST http://localhost:5001/api/auth/signup
```

---

## Request

```json
{
  "name": "Harsh",
  "email": "example@gmail.com",
  "password": "password123"
}
```

---

## Success Response

```json
{
  "message": "User created successfully",
  "createdUser": {
    "_id": "...",
    "name": "Harsh",
    "email": "example@gmail.com",
    "role": "student"
  }
}
```

---

# User Login

## Endpoint

```
POST http://localhost:5001/api/auth/login
```

---

## Request

```json
{
  "email": "example@gmail.com",
  "password": "password123"
}
```

---

## Success Response

```json
{
  "token": "JWT_TOKEN",
  "user": {
    "name": "Harsh",
    "email": "example@gmail.com",
    "role": "student"
  }
}
```

---

# Prediction History

## Endpoint

```
GET http://localhost:5001/api/predictions/history
```

---

## Authentication

Protected Route

```
Authorization: Bearer <JWT_TOKEN>
```

---

## Response

```json
[
  {
    "_id": "6a72ac39cebecc528d487c52",
    "user": "6a67836dd0e10bf317ed8216",
    "probability": 89.5,
    "readinessScore": 90,
    "strengths": [],
    "weaknesses": [],
    "createdAt": "2026-08-05T03:21:29.652Z"
  }
]
```

---

Returns all predictions generated by the authenticated user.

Predictions are ordered from newest to oldest.

---

# Admin APIs

All admin APIs require:

* Valid JWT authentication token
* User role must be `admin`

---

# Get All Users

## Endpoint

```
GET http://localhost:5001/api/admin/users
```

---

## Authentication

```
Authorization: Bearer <JWT_TOKEN>
```

---

## Response

Returns all registered users excluding password information.

---

# Get All Predictions

## Endpoint

```
GET http://localhost:5001/api/admin/predictions
```

---

## Authentication

```
Authorization: Bearer <JWT_TOKEN>
```

---

## Response

Returns all stored predictions along with related user information.

---

# Common Error Responses

## 401 Unauthorized

```json
{
  "message": "No token provided"
}
```

```json
{
  "message": "Invalid or expired token"
}
```

---

## 403 Forbidden

```json
{
  "message": "Access denied"
}
```

---

## 500 Internal Server Error

```json
{
  "message": "Prediction service error"
}
```

---

# Development Notes

* Flask ML API runs on **Port 5000** during development.
* Express Backend runs on **Port 5001**.
* React Frontend runs on **Port 5173**.
* CareerLens AI frontend communicates only with Express backend.
* React never directly calls Flask ML endpoints.
* Express handles authentication and API communication.
* MongoDB Atlas stores user accounts and prediction history.
* Passwords are securely hashed using **bcrypt**.
* JWT authentication tokens expire after **7 days**.
* Each prediction is linked to the authenticated user using MongoDB ObjectId.
* Only authenticated users can generate placement predictions.
* Only administrators can access Admin Dashboard APIs.
* Explainable AI insights are generated using feature contribution analysis.
* The system provides personalized career readiness insights through machine learning.
