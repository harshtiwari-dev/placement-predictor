# Import SHAP and set up the explainer

import pandas as pd
import shap
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression

df = pd.read_csv("placement_data_cleaned.csv")
X = df.drop(columns=["Placement"])
y = df["Placement"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model_lr = LogisticRegression(max_iter=1000)
model_lr.fit(X_train, y_train)

# ----------------------------------------------------------------------
# Create the SHAP explainer

explainer = shap.Explainer(model_lr, X_train)
shap_values = explainer(X_test)

# ----------------------------------------------------------------------
# See the overall most important features (global view)

shap.plots.beeswarm(shap_values, show=False)
import matplotlib.pyplot as plt
plt.savefig("shap_summary.png", bbox_inches="tight")
print("Saved shap_summary.png")

# ----------------------------------------------------------------------
# See explanation for ONE specific student (individual view — this is our actual product feature)

student_index = 0  # first student in test set
print("\nPrediction for student", student_index)
print("Probability of placement:", model_lr.predict_proba(X_test.iloc[[student_index]])[0][1])

print("\nTop factors influencing this prediction:")
shap_row = shap_values[student_index]
importance = pd.Series(shap_row.values, index=X_test.columns).sort_values(key=abs, ascending=False)
print(importance.head(5))