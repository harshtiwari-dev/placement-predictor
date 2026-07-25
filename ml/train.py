import pandas as pd
from sklearn.model_selection import train_test_split

df = pd.read_csv("placement_data_cleaned.csv")

X = df.drop(columns=["status"])   # features (everything except the answer)
y = df["status"]                   # target (what we're predicting)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# ---------------------------------------------------------------------
# Logistic Regression

from sklearn.linear_model import LogisticRegression

model_lr = LogisticRegression(max_iter=1000)
model_lr.fit(X_train, y_train)
from sklearn.metrics import accuracy_score

y_pred = model_lr.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print("Logistic Regression Accuracy:", accuracy)

# ---------------------------------------------------------------------
# RandomForest & XGBoost

from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier

# Random Forest
model_rf = RandomForestClassifier(random_state=42)
model_rf.fit(X_train, y_train)
y_pred_rf = model_rf.predict(X_test)
accuracy_rf = accuracy_score(y_test, y_pred_rf)
print("Random Forest Accuracy:", accuracy_rf)

# XGBoost
model_xgb = XGBClassifier(random_state=42, eval_metric="logloss")
model_xgb.fit(X_train, y_train)
y_pred_xgb = model_xgb.predict(X_test)
accuracy_xgb = accuracy_score(y_test, y_pred_xgb)
print("XGBoost Accuracy:", accuracy_xgb)

# ---------------------------------------------------------------------
# Full Metrics

from sklearn.metrics import classification_report, roc_auc_score

print("\n--- Logistic Regression ---")
print(classification_report(y_test, y_pred))
print("ROC-AUC:", roc_auc_score(y_test, model_lr.predict_proba(X_test)[:, 1]))

print("\n--- Random Forest ---")
print(classification_report(y_test, y_pred_rf))
print("ROC-AUC:", roc_auc_score(y_test, model_rf.predict_proba(X_test)[:, 1]))

print("\n--- XGBoost ---")
print(classification_report(y_test, y_pred_xgb))
print("ROC-AUC:", roc_auc_score(y_test, model_xgb.predict_proba(X_test)[:, 1]))

