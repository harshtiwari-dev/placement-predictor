import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
import shap

df = pd.read_csv("placement_data_cleaned.csv")
X = df.drop(columns=["Placement"])
y = df["Placement"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model_lr = LogisticRegression(max_iter=1000)
model_lr.fit(X_train, y_train)

explainer = shap.Explainer(model_lr, X_train)

joblib.dump(model_lr, "model.pkl")
joblib.dump(explainer, "explainer.pkl")
joblib.dump(X.columns.tolist(), "feature_columns.pkl")

print("Model, explainer, and feature columns saved successfully.")