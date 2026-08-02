import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, classification_report, roc_auc_score

df = pd.read_csv("placement_data_cleaned.csv")

X = df.drop(columns=["PlacementStatus"])
y = df["PlacementStatus"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# ---------------------------------------------------------------------
# Logistic Regression

model_lr = LogisticRegression(max_iter=1000)
model_lr.fit(X_train, y_train)
y_pred = model_lr.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print("Logistic Regression Accuracy:", accuracy)

# ---------------------------------------------------------------------
# Logistic Regression with class_weight="balanced"

model_lr_balanced = LogisticRegression(max_iter=1000, class_weight="balanced")
model_lr_balanced.fit(X_train, y_train)
y_pred_lr_balanced = model_lr_balanced.predict(X_test)
accuracy_lr_balanced = accuracy_score(y_test, y_pred_lr_balanced)
print("Logistic Regression (balanced) Accuracy:", accuracy_lr_balanced)

# ---------------------------------------------------------------------
# RandomForest & XGBoost (plain)

model_rf = RandomForestClassifier(random_state=42)
model_rf.fit(X_train, y_train)
y_pred_rf = model_rf.predict(X_test)
accuracy_rf = accuracy_score(y_test, y_pred_rf)
print("Random Forest Accuracy:", accuracy_rf)

model_xgb = XGBClassifier(random_state=42, eval_metric="logloss")
model_xgb.fit(X_train, y_train)
y_pred_xgb = model_xgb.predict(X_test)
accuracy_xgb = accuracy_score(y_test, y_pred_xgb)
print("XGBoost Accuracy:", accuracy_xgb)

# ---------------------------------------------------------------------
# RandomForest & XGBoost with class_weight/scale_pos_weight (balanced versions)

model_rf_balanced = RandomForestClassifier(random_state=42, class_weight="balanced")
model_rf_balanced.fit(X_train, y_train)
y_pred_rf_balanced = model_rf_balanced.predict(X_test)
accuracy_rf_balanced = accuracy_score(y_test, y_pred_rf_balanced)
print("Random Forest (balanced) Accuracy:", accuracy_rf_balanced)

# XGBoost uses scale_pos_weight instead of class_weight
scale_pos_weight = (y_train == 0).sum() / (y_train == 1).sum()
model_xgb_balanced = XGBClassifier(random_state=42, eval_metric="logloss", scale_pos_weight=scale_pos_weight)
model_xgb_balanced.fit(X_train, y_train)
y_pred_xgb_balanced = model_xgb_balanced.predict(X_test)
accuracy_xgb_balanced = accuracy_score(y_test, y_pred_xgb_balanced)
print("XGBoost (balanced) Accuracy:", accuracy_xgb_balanced)

# ---------------------------------------------------------------------
# Full Metrics — all six models

print("\n--- Logistic Regression ---")
print(classification_report(y_test, y_pred))
print("ROC-AUC:", roc_auc_score(y_test, model_lr.predict_proba(X_test)[:, 1]))

print("\n--- Logistic Regression (balanced) ---")
print(classification_report(y_test, y_pred_lr_balanced))
print("ROC-AUC:", roc_auc_score(y_test, model_lr_balanced.predict_proba(X_test)[:, 1]))

print("\n--- Random Forest ---")
print(classification_report(y_test, y_pred_rf))
print("ROC-AUC:", roc_auc_score(y_test, model_rf.predict_proba(X_test)[:, 1]))

print("\n--- Random Forest (balanced) ---")
print(classification_report(y_test, y_pred_rf_balanced))
print("ROC-AUC:", roc_auc_score(y_test, model_rf_balanced.predict_proba(X_test)[:, 1]))

print("\n--- XGBoost ---")
print(classification_report(y_test, y_pred_xgb))
print("ROC-AUC:", roc_auc_score(y_test, model_xgb.predict_proba(X_test)[:, 1]))

print("\n--- XGBoost (balanced) ---")
print(classification_report(y_test, y_pred_xgb_balanced))
print("ROC-AUC:", roc_auc_score(y_test, model_xgb_balanced.predict_proba(X_test)[:, 1]))