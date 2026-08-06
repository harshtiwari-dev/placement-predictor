# Experiments Log — CareerLens AI

## Objective

Evaluate multiple machine learning algorithms for student placement prediction, compare their performance, analyze Explainable AI capabilities using SHAP, and select the most suitable model for deployment in CareerLens AI.

The experiments focus on finding a model that provides:

* Realistic prediction behaviour
* Good predictive performance
* Interpretable outputs
* Reliable probability estimation
* Compatibility with Explainable AI analysis

---

# Experiment 1 — Initial Dataset (MBA Placement)

## Dataset

Source:

Kaggle — **Factors Affecting Campus Placement**

Author:

benroshan

Dataset details:

* 215 records
* Train/Test Split: 80/20
* Random State: 42

Preprocessing:

Removed:

* `sl_no` — identifier column
* `salary` — target leakage risk

Applied:

* One-hot encoding for categorical features

---

## Model Comparison

| Model               | Accuracy | Precision | Recall |   F1 | ROC-AUC |
| ------------------- | -------: | --------: | -----: | ---: | ------: |
| Logistic Regression |    0.884 |      0.91 |   0.94 | 0.92 |   0.930 |
| Random Forest       |    0.814 |      0.83 |   0.94 | 0.88 |   0.849 |
| XGBoost             |    0.837 |      0.85 |   0.94 | 0.89 |   0.874 |

---

## SHAP Analysis

Global feature importance indicated:

1. SSC Percentage
2. Degree Percentage
3. MBA Percentage
4. HSC Percentage
5. Work Experience

---

## Observation

Although Logistic Regression achieved the best performance, the dataset represented MBA students rather than engineering students.

Since CareerLens AI targets engineering students, this dataset was not suitable.

### Decision

**Dataset rejected.**

---

# Experiment 2 — College Student Placement Factors Dataset

## Dataset

Source:

Kaggle — **College Student Placement Factors**

Dataset size:

* 10,000 records

Features included:

* IQ
* CGPA
* Communication Skills
* Internship Experience
* Projects
* Academic Performance
* Extra Curricular Score

---

## Class Distribution

| Class      | Records |
| ---------- | ------: |
| Placed     |   1,659 |
| Not Placed |   8,341 |

Placement rate:

Approximately 16.6%

The dataset showed strong class imbalance.

---

# Model Comparison

| Model               | Accuracy | ROC-AUC |
| ------------------- | -------: | ------: |
| Logistic Regression |    0.904 |   0.944 |
| Random Forest       |    1.000 |   1.000 |
| XGBoost             |    1.000 |   1.000 |

---

## Additional Experiment

Balanced versions of all models were tested using:

```python
class_weight="balanced"
```

Results:

* Logistic Regression improved minority class recall but reduced overall accuracy.
* Random Forest and XGBoost continued producing perfect scores.

---

## Observation

Perfect performance suggested possible deterministic label generation rather than genuine student placement patterns.

Additional issues:

* Severe class imbalance
* Unrealistic prediction probabilities
* Poor suitability for explainable student recommendations

### Decision

**Dataset rejected.**

---

# Experiment 3 — Final Dataset (Selected)

## Dataset

Source:

Kaggle — **Placement Prediction Dataset**

Author:

ruchikakumbhar

Dataset size:

* 10,000 student records

---

## Class Distribution

| Class      | Records |
| ---------- | ------: |
| Not Placed |   5,803 |
| Placed     |   4,197 |

The dataset provides a more balanced classification problem.

---

## Features

The final dataset contains:

* CGPA
* Internships
* Projects
* Workshops/Certifications
* Aptitude Test Score
* Soft Skills Rating
* Extracurricular Activities
* Placement Training
* SSC Marks
* HSC Marks

---

## Dataset Verification

Validation performed:

* No missing values
* No duplicate rows
* No identifier leakage
* No suspicious target leakage

Feature correlations with target:

```text
0.26 – 0.52
```

The dataset demonstrated realistic relationships suitable for machine learning experimentation.

---

# Model Comparison

| Model                          |   Accuracy |   ROC-AUC |
| ------------------------------ | ---------: | --------: |
| Logistic Regression            | **0.7945** | **0.877** |
| Logistic Regression (Balanced) |     0.7905 |     0.877 |
| Random Forest                  |     0.7815 |     0.867 |
| XGBoost                        |     0.7785 |     0.858 |

---

## Observation

Unlike previous datasets:

* No model achieved suspiciously perfect performance.
* Class balancing produced minimal improvement.
* Logistic Regression achieved the best overall balance between performance and interpretability.

### Decision

**Logistic Regression selected as the production model for CareerLens AI.**

---

# SHAP Explainability Experiment

SHAP was applied to the selected Logistic Regression model.

The analysis identifies how individual features influence prediction outcomes.

Top contributing features:

1. Aptitude Test Score
2. Placement Training
3. Extracurricular Activities
4. Soft Skills Rating
5. HSC Marks
6. SSC Marks
7. CGPA
8. Projects
9. Workshops / Certifications
10. Internships

---

## Explainable AI Output

For every prediction, CareerLens AI provides:

* Top three positive contributors
* Top three negative contributors
* Personalized improvement suggestions

This converts a simple prediction model into an explainable career guidance system.

---

# Probability Validation

The deployed model was evaluated using probability outputs rather than only binary predictions.

Observed behaviour:

## Weak Student Profiles

* Produced lower placement probabilities.

## Strong Student Profiles

* Produced higher placement probabilities.

## Average Student Profiles

* Produced moderate probabilities consistent with the dataset.

---

# Percentile Validation

CareerLens AI additionally calculates percentile ranking.

The percentile is generated using:

* Saved training-set prediction probability distribution.

Purpose:

* Provides relative comparison with training population.
* Adds context to raw placement probability.
* Does not modify the model output.

---

# Final Model Summary

| Property       | Value                                                           |
| -------------- | --------------------------------------------------------------- |
| Dataset        | Placement Prediction Dataset (ruchikakumbhar)                   |
| Records        | 10,000                                                          |
| Algorithm      | Logistic Regression                                             |
| Accuracy       | 79.45%                                                          |
| ROC-AUC        | 0.877                                                           |
| Explainability | SHAP                                                            |
| Output         | Probability, Readiness Score, Percentile, Strengths, Weaknesses |

---

# Conclusion

Three datasets and multiple machine learning algorithms were evaluated before selecting the final deployment model.

The selected CareerLens AI solution provides the best balance of:

* Predictive performance
* Interpretability
* Realistic probability behaviour
* Engineering student relevance
* Explainable career recommendations

The final system demonstrates how machine learning and Explainable AI can be combined to provide transparent placement readiness insights.
