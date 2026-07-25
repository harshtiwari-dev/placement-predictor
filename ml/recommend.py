import pandas as pd
import shap
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression

df = pd.read_csv("placement_data_cleaned.csv")
X = df.drop(columns=["status"])
y = df["status"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model_lr = LogisticRegression(max_iter=1000)
model_lr.fit(X_train, y_train)

explainer = shap.Explainer(model_lr, X_train)
shap_values = explainer(X_test)

# --------------------------------------------------------------------------
# Check probability spread across all test students

import numpy as np

all_probs = model_lr.predict_proba(X_test)[:, 1]
print("\nProbability range across all test students:")
print("Min:", all_probs.min(), " Max:", all_probs.max())
print("\nLowest 3 students (weakest predicted candidates):")
lowest_indices = np.argsort(all_probs)[:3]
print(lowest_indices)

# --------------------------------------------------------------------------
# Build a function that converts one student's SHAP values into readable output

def generate_recommendation(student_index):
    probability = model_lr.predict_proba(X_test.iloc[[student_index]])[0][1]
    readiness_score = round(probability * 100)

    shap_row = shap_values[student_index]
    importance = pd.Series(shap_row.values, index=X_test.columns).sort_values(key=abs, ascending=False)

    strengths = importance[importance > 0].head(3)
    weaknesses = importance[importance < 0].head(3)

    print(f"\n=== Student {student_index} ===")
    print(f"Placement Probability: {probability*100:.1f}%")
    print(f"Placement Readiness Score: {readiness_score}/100")

    print("\nStrengths:")
    for feature, value in strengths.items():
        print(f"  + {feature} (impact: {value:.2f})")

    print("\nAreas to improve:")
    for feature, value in weaknesses.items():
        print(f"  - {feature} (impact: {value:.2f})")

# --------------------------------------------------------------------------
# Run it for a few students

generate_recommendation(0)
generate_recommendation(1)
generate_recommendation(2)
generate_recommendation(40)
generate_recommendation(20)
generate_recommendation(23)
generate_recommendation(6)
generate_recommendation(5)