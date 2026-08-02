# Experiments Log

## Dataset
- Source: Kaggle "Factors Affecting Campus Placement" (benroshan)
- 215 rows, 15 columns after cleaning
- Train/test split: 80/20 (random_state=42)
- Dropped columns: sl_no (identifier), salary (data leakage — only exists for placed students)
- Categorical columns one-hot encoded (drop_first=True)

## Model Comparison — Run 1

| Model | Accuracy | Precision (1) | Recall (1) | F1 (1) | ROC-AUC |
|---|---|---|---|---|---|
| Logistic Regression | 0.884 | 0.91 | 0.94 | 0.92 | 0.930 |
| Random Forest | 0.814 | 0.83 | 0.94 | 0.88 | 0.849 |
| XGBoost | 0.837 | 0.85 | 0.94 | 0.89 | 0.874 |

## Observations
- Logistic Regression outperformed both ensemble methods across every metric, likely due to small dataset size (n=215) — RF/XGBoost typically need more data to outperform simpler linear models.
- All models show weaker recall for "Not Placed" (class 0) than "Placed" (class 1), consistent with class imbalance (148 Placed vs 67 Not Placed in full dataset).
- **Selected model for SHAP explainability: Logistic Regression** (best accuracy, F1, and ROC-AUC).
## SHAP Explainability — Logistic Regression

Applied SHAP to the selected Logistic Regression model to generate global and per-student explanations.

### Global Feature Importance (see shap_summary.png)
Ranked by overall impact on predictions:
1. **ssc_p (10th percentage)** — strongest predictor; high scores strongly push toward "Placed", low scores strongly push toward "Not Placed"
2. **degree_p (degree percentage)** — second strongest, same directional pattern
3. **mba_p (MBA percentage)** — high influence, but with more mixed/spread effect
4. **hsc_p (12th percentage)** — clear positive-value-correlates-with-placement pattern
5. **workex_Yes, gender_M** — moderate influence
6. degree_t_Sci&Tech, hsc_s_Commerce — small influence
7. etest_p and remaining features — minimal influence on this model

### Example — Individual Prediction (Student index 0 in test set)
- Predicted placement probability: 96.8%
- Top influencing factors for this specific student:
  - MBA percentage: strongly positive influence
  - 12th percentage: negative influence
  - Work experience: slightly negative influence
  - 10th percentage: positive influence
  - Gender: slightly positive influence

Note: individual predictions can differ from global patterns (e.g., 12th percentage 
hurt this particular student's prediction despite generally correlating positively 
with placement across the dataset) — this is expected and is exactly what makes 
per-student SHAP explanations more useful than global feature importance alone.
### Recommendation Engine Output — Sample Students

| Student | Probability | Readiness Score | Top Strength | Top Weakness |
|---|---|---|---|---|
| 0 | 96.8% | 97/100 | MBA % (+1.93) | 12th % (-0.69) |
| 1 | 97.1% | 97/100 | Degree % (+1.50) | MBA % (-1.55) |
| 2 | 98.3% | 98/100 | 10th % (+3.39) | MBA % (-1.97) |

Note: all sampled students show high readiness scores, consistent with dataset's 
overall 69% placement rate. To be verified: system correctly assigns LOW readiness 
scores to weaker-profile students (planned check before demo).
### Validation — Full Probability Range Check

Verified model discriminates correctly across the full spectrum, not just high scorers.

- Probability range across test set: 0.2% to 99.98%
- Lowest-scoring students (indices 23, 6, 5) correctly received readiness scores of 0-1/100
- Weaknesses correctly identified: ssc_p (10th percentage) was the dominant negative 
  factor for all three low-scoring students, consistent with it being the top global 
  predictor in the SHAP summary plot
- Confirms the model and recommendation engine behave coherently for both strong and 
  weak student profiles, not just a bias toward predicting "Placed"

## Dataset v2 — College Student Placement Factors (CSE-relevant)

Switched to a larger, CSE-relevant dataset (10,000 rows) after determining the 
original MBA-specific dataset was a poor fit for the project's target users. 
See decisions.md for full rationale.

### Dataset
- Source: Kaggle "College Student Placement Factors Dataset" (sahilislam007)
- 10,000 rows, 8 features + target
- Target: Placement (Yes/No) — 1,659 Placed / 8,341 Not Placed
- Features: IQ, Prev_Sem_Result, CGPA, Academic_Performance, Internship_Experience, 
  Extra_Curricular_Score, Communication_Skills, Projects_Completed

### Model Comparison

| Model | Accuracy | ROC-AUC | Notes |
|---|---|---|---|
| Logistic Regression | 0.904 | 0.944 | Selected for deployment |
| Random Forest | 1.00 | 1.00 | Suspiciously perfect — see decisions.md |
| XGBoost | 1.00 | 1.00 | Suspiciously perfect — see decisions.md |

### SHAP Explainability — Logistic Regression (v2)

Global feature importance (see shap_summary_v2.png), ranked by impact:
1. **Communication_Skills** — strongest predictor; high values strongly push toward placement
2. **CGPA** — second strongest, same directional pattern
3. **IQ** — high influence, widest spread of any feature
4. **Projects_Completed** — moderate influence
5. Prev_Sem_Result, Extra_Curricular_Score, Academic_Performance — minimal influence
6. **Internship_Experience_Yes** — near-zero influence, notably lower than expected given common assumptions about internship importance

### Example — Individual Prediction (Student index 0, test set)
- Predicted placement probability: 55.1%
- Top influencing factors: IQ (strong positive), Communication Skills (negative for 
  this student), Projects Completed (positive), CGPA (slightly negative), 
  Extra-Curricular Score (minimal)

  ### Class imbalance investigation
Tested class_weight="balanced" for Logistic Regression, Random Forest, and XGBoost 
to address the 16.6%/83.4% class imbalance. Results:
- Balancing had no effect on Random Forest/XGBoost (still 100% accuracy) — confirms 
  the earlier finding that near-perfect scores stem from the dataset's deterministic 
  synthetic generation, not class imbalance.
- Balanced Logistic Regression improved recall on the minority class (0.61 → 0.90) 
  but reduced precision (0.76 → 0.53) and overall accuracy (0.904 → 0.852), with 
  near-identical ROC-AUC (0.9442 vs 0.9443).
- Decision: retained standard (unbalanced) Logistic Regression, since the product 
  displays continuous probability/readiness scores rather than binary classification — 
  better-calibrated probabilities matter more here than adjusting the decision 
  threshold for class balance.

  ## Dataset v3 — Placement Prediction Dataset (ruchikakumbhar, Kaggle)

Switched again after determining Dataset v2 (College Student Placement Factors) had 
severe class imbalance (16.6% placed) causing unintuitively low scores for average 
students. Evaluated three additional candidates before selecting this one — see 
decisions.md for full comparison and rationale.

### Dataset
- Source: Kaggle "Placement Prediction Dataset" (ruchikakumbhar)
- 10,000 rows, 11 features + target
- Target: PlacementStatus — 5,803 Not Placed / 4,197 Placed (58%/42%, well-balanced)
- Features: CGPA, Internships, Projects, Workshops/Certifications, AptitudeTestScore, 
  SoftSkillsRating, ExtracurricularActivities, PlacementTraining, SSC_Marks, HSC_Marks
- Verified: no duplicates, no missing values, correlations with target range 0.26-0.52 
  (no single dominant feature, no leakage pattern)

### Model Comparison

| Model | Accuracy | ROC-AUC |
|---|---|---|
| Logistic Regression | 0.7945 | 0.877 | 
| Logistic Regression (balanced) | 0.7905 | 0.877 |
| Random Forest | 0.7815 | 0.867 |
| XGBoost | 0.7785 | 0.858 |

Logistic Regression selected — best on every metric, and class balancing had 
negligible effect given the dataset's already-reasonable 58/42 class split.

### SHAP Explainability (see shap_summary.png)
Top predictors, in order: AptitudeTestScore (dominant), PlacementTraining, 
ExtracurricularActivities, SoftSkillsRating, HSC_Marks, SSC_Marks, CGPA, Projects, 
Workshops/Certifications, Internships. All features show clean, coherent directional 
patterns (no mixed-signal noise), unlike the MBA dataset's mba_p feature in v1.