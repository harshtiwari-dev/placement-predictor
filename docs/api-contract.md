# API Contract — Placement Prediction Service

## Endpoint
`POST http://localhost:5000/predict`

## Request Format
Send a JSON body with the following fields (all required):

```json
{
  "IQ": 105,
  "Prev_Sem_Result": 8.0,
  "CGPA": 8.0,
  "Academic_Performance": 7,
  "Extra_Curricular_Score": 6,
  "Communication_Skills": 7,
  "Projects_Completed": 3,
  "Internship_Experience_Yes": 1
}
```

### Field meanings
| Field | Meaning | Type / Range |
|---|---|---|
| IQ | IQ score | number (typical range: 41-158) |
| Prev_Sem_Result | Previous semester result | number, 0-10 scale |
| CGPA | Cumulative GPA | number, 0-10 scale |
| Academic_Performance | Overall academic performance rating | number, 1-10 scale |
| Extra_Curricular_Score | Extra-curricular involvement score | number, 0-10 scale |
| Communication_Skills | Communication skills rating | number, 1-10 scale |
| Projects_Completed | Number of projects completed | number, 0-5 |
| Internship_Experience_Yes | 1 if has internship experience, 0 if not | 0 or 1 |

## Response Format

```json
{
  "probability": 78.4,
  "readiness_score": 78,
  "strengths": [
    { "feature": "Communication_Skills", "label": "Communication Skills", "impact": 1.2 },
    { "feature": "CGPA", "label": "CGPA", "impact": 0.9 }
  ],
  "weaknesses": [
    {
      "feature": "Projects_Completed",
      "label": "Projects Completed",
      "impact": -0.4,
      "suggestion": "The number of projects you've completed is affecting your prediction — building more hands-on projects strengthens your profile."
    }
  ]
}
```

- `probability`: percentage chance of placement (0-100)
- `readiness_score`: same as probability, rounded, shown as "X/100" in UI
- `feature`: raw internal column name (for debugging/logging only — don't show this in UI)
- `label`: human-readable name — use this in the UI instead of `feature`
- `impact`: SHAP value (positive = helped, negative = hurt)
- `suggestion`: only present on weaknesses — actionable text to display to the student
- `strengths`/`weaknesses`: top 3 factors each

## Notes for Backend Integration
- Server runs locally on port 5000 during development
- All fields must be present in the request; missing fields default to 0 (may reduce prediction accuracy — form should enforce required fields)
- CORS is enabled on the Flask server — safe to call directly from a browser-based frontend
- Dataset base placement rate is ~16.6% — moderate-profile students will naturally 
  show lower probabilities than might be intuitively expected; this reflects the 
  real class distribution, not a model error (see experiments.md / decisions.md)