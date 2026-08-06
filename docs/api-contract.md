# API Contract

## Overview

This document defines the REST API contract used between the React frontend, Express backend, and Flask ML service.

The project follows a layered architecture:

- **React Frontend** communicates only with the Express backend.
- **Express Backend** handles authentication, authorization, MongoDB operations, and API routing.
- **Flask ML Service** performs machine learning inference and explainability.

All protected endpoints require a valid JWT token in the `Authorization` header.

---

# Flask ML Service

## Endpoint

`POST http://localhost:5000/predict`

## Request Format

Send a JSON body with the following fields (all required):

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

### Field Meanings

| Field | Meaning | Type / Range |
|-------|---------|--------------|
| CGPA | Cumulative GPA | Number (UI: 0–10) |
| Internships | Number of internships completed | Integer (0–2) |
| Projects | Number of academic/personal projects | Integer (0–3) |
| Workshops/Certifications | Workshops or certifications completed | Integer (0–3) |
| AptitudeTestScore | Aptitude test score | Number (UI: 0–100) |
| SoftSkillsRating | Soft skills rating | Number (UI: 0–5, internally mapped) |
| ExtracurricularActivities | Participates in extracurricular activities | 0 or 1 |
| PlacementTraining | Completed placement training | 0 or 1 |
| SSC_Marks | Class 10 percentage | Number (0–100) |
| HSC_Marks | Class 12 percentage | Number (0–100) |

> **Note:** The frontend accepts wider input ranges than the original dataset. Predictions remain reliable for realistic student profiles.

---

## Response Format

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
    },
    {
      "feature": "Projects",
      "label": "Projects Completed",
      "impact": 0.31
    },
    {
      "feature": "PlacementTraining",
      "label": "Placement Training",
      "impact": 0.28
    }
  ],
  "weaknesses": [
    {
      "feature": "ExtracurricularActivities",
      "label": "Extracurricular Activities",
      "impact": -0.35,
      "suggestion": "Participation in extracurricular activities is affecting your prediction."
    },
    {
      "feature": "HSC_Marks",
      "label": "12th (HSC) Marks",
      "impact": -0.22,
      "suggestion": "Your 12th marks are lowering your placement readiness."
    },
    {
      "feature": "Internships",
      "label": "Internships Completed",
      "impact": -0.15,
      "suggestion": "Consider completing one or more internships."
    }
  ]
}
```

### Response Field Description

| Field | Description |
|------|-------------|
| probability | Placement probability (0–100%) |
| readiness_score | Rounded probability displayed as readiness score |
| percentile | Relative ranking compared to the training dataset |
| strengths | Top 3 positive SHAP feature contributions |
| weaknesses | Top 3 negative SHAP feature contributions |
| feature | Internal model feature name |
| label | Human-readable feature name |
| impact | SHAP contribution value |
| suggestion | Actionable recommendation (only for weaknesses) |

---

# Express Backend APIs

## Predict Placement

### Endpoint

`POST http://localhost:5001/api/predict`

### Authentication

Protected Route

Header

```
Authorization: Bearer <JWT_TOKEN>
```

### Request Body

Same JSON body used by the Flask `/predict` endpoint.

### Backend Flow

1. Verify JWT token.
2. Forward request to Flask.
3. Receive ML prediction.
4. Save prediction in MongoDB.
5. Return prediction to the frontend.

---

## User Signup

### Endpoint

`POST http://localhost:5001/api/auth/signup`

### Request

```json
{
  "name": "Harsh",
  "email": "example@gmail.com",
  "password": "password123"
}
```

### Success Response

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

## User Login

### Endpoint

`POST http://localhost:5001/api/auth/login`

### Request

```json
{
  "email": "example@gmail.com",
  "password": "password123"
}
```

### Success Response

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

## Prediction History

### Endpoint

`GET http://localhost:5001/api/predictions/history`

### Authentication

Protected Route

Header

```
Authorization: Bearer <JWT_TOKEN>
```

### Response

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

Returns every prediction belonging to the authenticated user, ordered newest first.

---

# Admin APIs

All admin APIs require:

- Valid JWT token
- User role = `admin`

---

## Get All Users

### Endpoint

`GET http://localhost:5001/api/admin/users`

### Authentication

```
Authorization: Bearer <JWT_TOKEN>
```

### Response

Returns all registered users (password excluded).

---

## Get All Predictions

### Endpoint

`GET http://localhost:5001/api/admin/predictions`

### Authentication

```
Authorization: Bearer <JWT_TOKEN>
```

### Response

Returns every stored prediction together with the associated user information.

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

- Flask ML API runs on **Port 5000** during development.
- Express Backend runs on **Port 5001**.
- React Frontend runs on **Port 5173**.
- Prediction requests always pass through the Express backend before reaching the Flask ML service.
- Passwords are securely hashed using **bcrypt** before storage.
- JWT tokens expire after **7 days**.
- MongoDB Atlas stores user accounts and prediction history.
- Every prediction is linked to the authenticated user through a MongoDB ObjectId reference.
- Only authenticated users can generate predictions.
- Only administrators can access the Admin Dashboard APIs.
- The frontend communicates exclusively with the Express backend; it never calls the Flask ML service directly.