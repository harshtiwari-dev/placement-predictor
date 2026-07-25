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