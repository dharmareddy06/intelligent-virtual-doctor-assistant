import pandas as pd
import os

# Set working directory
os.chdir('C:/AI Projects/Intelligent virtual doctor assistant/backend/datasets')

# Read the Disease-Symptom Dataset
print("=== Disease-Symptom Dataset ===")
df = pd.read_csv('Disease-Symptom Dataset.csv')
print(f"Shape: {df.shape}")
print(f"Columns: {df.columns.tolist()[:15]}")
print("\nFirst 3 rows:")
print(df.head(3))
print("\n")

# Read the Drug prescription dataset
print("=== Drug Prescription Dataset ===")
df_drug = pd.read_csv('Drug prescription to disease dataset.csv')
print(f"Shape: {df_drug.shape}")
print(f"Columns: {df_drug.columns.tolist()[:15]}")
print("\nFirst 3 rows:")
print(df_drug.head(3))

