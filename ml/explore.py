import pandas as pd

df = pd.read_csv("placement_data.csv")

print(df.shape)
print(df.columns)
print(df.head())
print(df.info())
print(df.describe())