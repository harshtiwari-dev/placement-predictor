# API Contract — Placement Prediction Service

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

### Field meanings
| Field | Meaning | Type / Range |
|---|---|---|
| CGPA | Cumulative GPA | number, 6.5-9.1 (dataset range; UI accepts 0-10) |
| Internships | Number of internships completed | number, 0-2 |
| Projects | Number of projects completed | number, 0-3 |
| Workshops/Certifications | Number of workshops/certifications completed | number, 0-3 |
| AptitudeTestScore | Aptitude test score | number, 60-90 (dataset range; UI accepts 0-100) |
| SoftSkillsRating | Soft skills rating | number, 3.0-4.8 (dataset's native scale — frontend converts a 0-5 user input to this range) |
| ExtracurricularActivities | 1 if participates in extracurricular activities, 0 if not | 0 or 1 |
| PlacementTraining | 1 if completed placement training, 0 if not | 0 or 1 |
| SSC_Marks | 10th (SSC) percentage | number, 55-90 (dataset range; UI accepts 0-100) |
| HSC_Marks | 12th (HSC) percentage | number, 57-88 (dataset range; UI accepts 0-100) |

Note: UI input ranges are wider than the dataset's native ranges for better UX 
(e.g., CGPA out of 10 instead of 6.5-9.1). Values outside the dataset's original 
range are technically extrapolated by the model — reliable for realistic student 
inputs, less validated at extreme edges.

## Response Format

```json
{
  "probability": 51.4,
  "readiness_score": 51,
  "percentile": 59,
  "strengths": [
    { "feature": "AptitudeTestScore", "label": "Aptitude Test Score", "impact": 0.42 },
    { "feature": "Projects", "label": "Projects Completed", "impact": 0.31 },
    { "feature": "PlacementTraining", "label": "Placement Training", "impact": 0.28 }
  ],
  "weaknesses": [
    {
      "feature": "ExtracurricularActivities",
      "label": "Extracurricular Activities",
      "impact": -0.35,
      "suggestion": "Participation in extracurricular activities is affecting your prediction — getting involved in clubs, sports, or events could help."
    },
    {
      "feature": "HSC_Marks",
      "label": "12th (HSC) Marks",
      "impact": -0.22,
      "suggestion": "Your 12th (HSC) marks are a factor — this reflects your pre-college academic performance."
    },
    {
      "feature": "Internships",
      "label": "Internships Completed",
      "impact": -0.15,
      "suggestion": "Completing internships is affecting your prediction — consider taking up an internship to strengthen your profile."
    }
  ]
}
```

- `probability`: percentage chance of placement (0-100)
- `readiness_score`: same as probability, rounded, shown as "X/100" in UI
- `percentile`: what percentage of the training-set population this prediction outperforms (0-100) — provides relative context alongside the raw probability, since the dataset's base placement rate (~42%) means moderate probabilities are actually above-average
- `feature`: raw internal column name (for debugging/logging only — don't show this in UI)
- `label`: human-readable name — use this in the UI instead of `feature`
- `impact`: SHAP value (positive = helped, negative = hurt)
- `suggestion`: only present on weaknesses — actionable text to display to the student
- `strengths`/`weaknesses`: top 3 factors each

## Notes for Backend Integration
- Server runs locally on port 5000 during development
- All fields must be present in the request; missing fields default to 0 (may reduce prediction accuracy — form should enforce required fields)
- CORS is enabled on the Flask server — safe to call directly from a browser-based frontend
- Dataset base placement rate is ~42% (well-balanced) — moderate-profile students 
  now receive intuitive, non-discouraging probability scores, unlike the earlier 
  dataset iteration (see decisions.md / experiments.md for history)