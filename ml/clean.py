import pandas as pd

df = pd.read_csv("placement_data.csv")

df = df.drop(columns=["College_ID"])

df["Placement"] = df["Placement"].map({"Yes": 1, "No": 0})

df = pd.get_dummies(df, columns=["Internship_Experience"], drop_first=True)

bool_cols = df.select_dtypes(include="bool").columns
df[bool_cols] = df[bool_cols].astype(int)

print(df.shape)
print(df.columns.tolist())
print(df.head())

df.to_csv("placement_data_cleaned.csv", index=False)
print("Saved cleaned data")