# Dataset — CareerLens AI

## Source

**Dataset Name:** Placement Prediction Dataset

**Author:** ruchikakumbhar

**Platform:** Kaggle

**Source Link:**
https://www.kaggle.com/datasets/ruchikakumbhar/placement-prediction-dataset

---

# Overview

CareerLens AI uses the **Placement Prediction Dataset** to train a binary classification machine learning model that estimates student placement probability and provides explainable career insights.

The dataset contains:

* **10,000 student records**
* Academic performance indicators
* Skill-based attributes
* Placement preparation factors

The trained model predicts whether a student is likely to be placed based on their profile and generates Explainable AI insights highlighting improvement areas.

---

# Target Variable

The target variable used for prediction is:

```text
PlacementStatus
```

Encoding:

| Original Value | Encoded Value |
| -------------- | ------------: |
| Placed         |             1 |
| Not Placed     |             0 |

---

# Class Distribution

| Class      | Records |
| ---------- | ------: |
| Not Placed |   5,803 |
| Placed     |   4,197 |

Approximately **42% of students are placed**, making the dataset reasonably balanced for binary classification.

The class distribution allows the model to learn meaningful patterns without severe imbalance issues.

---

# Original Features

The original dataset contains the following columns:

| Column                    |
| ------------------------- |
| StudentID                 |
| CGPA                      |
| Internships               |
| Projects                  |
| Workshops/Certifications  |
| AptitudeTestScore         |
| SoftSkillsRating          |
| ExtracurricularActivities |
| PlacementTraining         |
| SSC_Marks                 |
| HSC_Marks                 |
| PlacementStatus           |

---

# Data Preprocessing

The dataset was preprocessed before training the CareerLens AI prediction model.

## Removed Columns

### StudentID

Reason:

* Unique identifier
* Does not contain meaningful predictive information
* Removed to prevent unnecessary model dependency

---

# Binary Encoding

Categorical values were converted into numerical representations.

| Original Feature          | Conversion                 |
| ------------------------- | -------------------------- |
| PlacementStatus           | Placed → 1, Not Placed → 0 |
| PlacementTraining         | Yes → 1, No → 0            |
| ExtracurricularActivities | Yes → 1, No → 0            |

---

# Numeric Features

The following features were already numerical and required no additional encoding:

* CGPA
* Internships
* Projects
* Workshops/Certifications
* AptitudeTestScore
* SoftSkillsRating
* SSC_Marks
* HSC_Marks

---

# Data Validation

Before model training, the dataset was evaluated for quality.

Validation checks performed:

* No missing values detected
* No duplicate records detected
* No identifier leakage
* No obvious target leakage
* Feature relationships with target variable were meaningful

Feature correlations with the target ranged approximately:

```text
0.26 – 0.52
```

The dataset produced realistic performance across multiple machine learning algorithms.

---

# Final Feature Set

The deployed CareerLens AI model uses the following ten input features:

| Feature                   |
| ------------------------- |
| CGPA                      |
| Internships               |
| Projects                  |
| Workshops/Certifications  |
| AptitudeTestScore         |
| SoftSkillsRating          |
| ExtracurricularActivities |
| PlacementTraining         |
| SSC_Marks                 |
| HSC_Marks                 |

These features represent:

* Academic performance
* Technical preparation
* Skill development
* Placement readiness activities

---

# Dataset Usage in CareerLens AI

The dataset supports the following system capabilities:

## Placement Prediction

The machine learning model analyzes student attributes and predicts:

* Placement probability
* Career readiness score
* Relative percentile ranking

---

## Explainable AI Analysis

SHAP explainability is applied to identify:

Positive contributors:

* Features improving placement probability

Negative contributors:

* Features reducing placement probability

The system converts these insights into actionable recommendations.

---

# Assumptions and Limitations

The dataset has certain limitations:

* The dataset represents simulated student placement data rather than verified institutional records.
* Placement outcomes may vary across universities, industries, and recruitment processes.
* Demographic and protected attributes such as gender, caste, religion, or socioeconomic background are not included.
* Fairness and bias evaluation based on protected attributes are outside the scope of this project.

The CareerLens AI model should be considered a **decision-support system** and not a guaranteed placement predictor.

---

# Related Documents

| Document                 | Purpose                                           |
| ------------------------ | ------------------------------------------------- |
| `clean.py`               | Dataset cleaning and preprocessing implementation |
| `experiments.md`         | Model comparison and evaluation results           |
| `decisions.md`           | Dataset selection decisions and project rationale |
| `api-contract.md`        | ML service input/output specifications            |
| `system-architecture.md` | Overall application architecture                  |

---

# Summary

The Placement Prediction Dataset provides the foundation for CareerLens AI's machine learning pipeline.

Through machine learning and Explainable AI techniques, the system transforms student data into:

* Placement probability predictions
* Career readiness assessment
* Personalized improvement recommendations
* Transparent feature-based explanations
