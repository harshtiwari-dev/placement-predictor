import pandas as pd

df = pd.read_csv("placement_data.csv")
df = df.drop(columns=["sl_no", "salary"])
df["status"] = df["status"].map({"Placed": 1, "Not Placed": 0})
df = pd.get_dummies(df, columns=["gender", "ssc_b", "hsc_b", "hsc_s", "degree_t", "workex", "specialisation"], drop_first=True)

# Convert True/False columns to 0/1 integers (fixes a SHAP compatibility bug)
bool_cols = df.select_dtypes(include="bool").columns
df[bool_cols] = df[bool_cols].astype(int)

print(df.shape)
print(df.columns)
print(df.head())

df.to_csv("placement_data_cleaned.csv", index=False)
print("Saved cleaned data")