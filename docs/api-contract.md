# API Contract — Placement Prediction Service

## Endpoint
`POST http://localhost:5000/predict`

## Request Format
Send a JSON body with the following fields (all required, use 0/1 for binary/categorical fields):

```json
{
  "ssc_p": 65,
  "hsc_p": 60,
  "degree_p": 62,
  "etest_p": 70,
  "mba_p": 58,
  "gender_M": 1,
  "ssc_b_Others": 1,
  "hsc_b_Others": 1,
  "hsc_s_Commerce": 1,
  "hsc_s_Science": 0,
  "degree_t_Others": 0,
  "degree_t_Sci&Tech": 0,
  "workex_Yes": 0,
  "specialisation_Mkt&HR": 0
}
```

### Field meanings
| Field | Meaning | Type |
|---|---|---|
| ssc_p | 10th percentage | number (0-100) |
| hsc_p | 12th percentage | number (0-100) |
| degree_p | Degree percentage | number (0-100) |
| etest_p | Employability test percentage | number (0-100) |
| mba_p | MBA percentage | number (0-100) |
| gender_M | 1 if Male, 0 if Female | 0 or 1 |
| ssc_b_Others | 1 if 10th board = "Others", 0 if "Central" | 0 or 1 |
| hsc_b_Others | 1 if 12th board = "Others", 0 if "Central" | 0 or 1 |
| hsc_s_Commerce | 1 if 12th stream = Commerce | 0 or 1 |
| hsc_s_Science | 1 if 12th stream = Science | 0 or 1 |
| degree_t_Others | 1 if degree type = Others | 0 or 1 |
| degree_t_Sci&Tech | 1 if degree type = Sci&Tech | 0 or 1 |
| workex_Yes | 1 if has work experience | 0 or 1 |
| specialisation_Mkt&HR | 1 if MBA specialization = Mkt&HR | 0 or 1 |

Note: if hsc_s_Commerce=0 and hsc_s_Science=0, the model assumes stream = Arts (the dropped baseline category). Same logic applies to other one-hot pairs.

## Response Format

```json
{
  "probability": 75.3,
  "readiness_score": 75,
  "strengths": [
    { "feature": "mba_p", "label": "MBA Percentage", "impact": 0.86 },
    { "feature": "gender_M", "label": "Gender (Male)", "impact": 0.35 },
    { "feature": "degree_t_Sci&Tech", "label": "Degree Type (Science & Tech)", "impact": 0.21 }
  ],
  "weaknesses": [
    {
      "feature": "hsc_p",
      "label": "12th Percentage",
      "impact": -0.69,
      "suggestion": "Your 12th percentage is affecting your prediction — a stronger foundation here is associated with higher placement probability."
    },
    {
      "feature": "degree_p",
      "label": "Degree Percentage",
      "impact": -0.67,
      "suggestion": "Your degree percentage matters significantly — maintaining strong academic performance in your core degree improves your chances."
    },
    {
      "feature": "ssc_p",
      "label": "10th Percentage",
      "impact": -0.5,
      "suggestion": "Your 10th percentage is a strong influence — improving academic consistency early on correlates with better placement outcomes."
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
- Feature names must match exactly, including special characters like `&` in `degree_t_Sci&Tech`
- CORS is enabled on the Flask server — safe to call directly from a browser-based frontend