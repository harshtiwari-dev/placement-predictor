import pandas as pd

df = pd.read_csv("placement_data.csv")

df = df.drop(columns=["StudentID"])

df["PlacementStatus"] = df["PlacementStatus"].map({"Placed": 1, "NotPlaced": 0})
df["PlacementTraining"] = df["PlacementTraining"].map({"Yes": 1, "No": 0})
df["ExtracurricularActivities"] = df["ExtracurricularActivities"].map({"Yes": 1, "No": 0})

print(df.shape)
print(df.columns.tolist())
print(df.head())

df.to_csv("placement_data_cleaned.csv", index=False)
print("Saved cleaned data")