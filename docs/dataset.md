# Dataset

## Source

**Name:** Placement Prediction Dataset

**Author:** ruchikakumbhar

**Platform:** Kaggle

https://www.kaggle.com/datasets/ruchikakumbhar/placement-prediction-dataset

---

## Overview

This project uses the **Placement Prediction Dataset** containing **10,000 student records** to train a binary classification model that predicts placement probability.

**Target Variable**

`PlacementStatus`

- Placed → 1
- Not Placed → 0

### Class Distribution

| Class | Records |
|--------|--------:|
| Not Placed | 5,803 |
| Placed | 4,197 |

Approximately **42%** of students are placed, providing a reasonably balanced dataset for binary classification.

---

## Original Features

| Column |
|---------|
| StudentID |
| CGPA |
| Internships |
| Projects |
| Workshops/Certifications |
| AptitudeTestScore |
| SoftSkillsRating |
| ExtracurricularActivities |
| PlacementTraining |
| SSC_Marks |
| HSC_Marks |
| PlacementStatus |

---

## Data Preprocessing

The following preprocessing steps were performed before model training.

### Removed Columns

- `StudentID`
  - Unique identifier
  - No predictive value

### Binary Encoding

| Original | Converted |
|----------|-----------|
| PlacementStatus | Placed → 1, NotPlaced → 0 |
| PlacementTraining | Yes → 1, No → 0 |
| ExtracurricularActivities | Yes → 1, No → 0 |

### Numeric Features

The remaining variables were already numeric and required no additional encoding.

- CGPA
- Internships
- Projects
- Workshops/Certifications
- AptitudeTestScore
- SoftSkillsRating
- SSC_Marks
- HSC_Marks

No missing values or duplicate records were found.

---

## Final Feature Set

The deployed model is trained using the following ten features.

| Feature |
|---------|
| CGPA |
| Internships |
| Projects |
| Workshops/Certifications |
| AptitudeTestScore |
| SoftSkillsRating |
| ExtracurricularActivities |
| PlacementTraining |
| SSC_Marks |
| HSC_Marks |

---

## Dataset Quality Checks

The selected dataset was validated before training.

- No missing values
- No duplicate records
- No identifier leakage
- No dominant feature indicating target leakage
- Feature correlations with the target ranged approximately **0.26–0.52**
- Produced realistic model performance across multiple algorithms

---

## Assumptions and Limitations

- The dataset represents simulated student placement data rather than verified institutional records.
- No demographic or protected attributes (such as gender, caste, religion, or socioeconomic status) are included.
- Consequently, fairness or bias evaluation was outside the scope of this project.
- The model should be interpreted as a decision-support tool rather than a definitive predictor of placement outcomes.

---

## Related Documents

- `clean.py` — dataset preprocessing implementation
- `experiments.md` — model evaluation results
- `decisions.md` — rationale for selecting this dataset over earlier alternatives