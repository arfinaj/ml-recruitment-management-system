
from pathlib import Path

import pandas as pd
from sklearn.model_selection import train_test_split


# 1. Locate the dataset beside this Python file.
DATA_PATH = Path(__file__).parent / "dataset.csv"


# 2. Load the CSV into a pandas DataFrame.
df = pd.read_csv(DATA_PATH)

print("DATASET PREVIEW")
print("-" * 50)
print(df.head())

# 3. Check that all required columns exist.
required_columns = {
    "resume_text",
    "job_description",
    "label",
}

if not required_columns.issubset(df.columns):
    raise ValueError(
        f"CSV must contain these columns: {required_columns}"
    )

# 4. Check for missing values.
if df[list(required_columns)].isnull().any().any():
    raise ValueError(
        "Dataset contains missing values. Fix them first."
    )

# 5. Convert labels to numbers and validate them.
df["label"] = pd.to_numeric(df["label"], errors="raise")

if not set(df["label"].unique()).issubset({0, 1}):
    raise ValueError("Labels must be either 0 or 1.")

# 6. Check for duplicate examples.
duplicate_count = df.duplicated(
    subset=["resume_text", "job_description"]
).sum()

print(f"\nTotal examples: {len(df)}")
print(f"Duplicate pairs: {duplicate_count}")

# 7. Inspect the number of examples in each class.
print("\nCLASS DISTRIBUTION")
print(df["label"].value_counts().sort_index())

if df["label"].value_counts().min() < 2:
    raise ValueError(
        "Each class needs at least 2 examples for this split."
    )

# 8. Separate training data from test data.
train_df, test_df = train_test_split(
    df,
    test_size=0.25,
    random_state=42,
    stratify=df["label"],
)

print("\nDATA SPLIT")
print("-" * 50)
print(f"Training examples: {len(train_df)}")
print(f"Test examples: {len(test_df)}")

print("\nTraining label distribution:")
print(train_df["label"].value_counts().sort_index())

print("\nTest label distribution:")
print(test_df["label"].value_counts().sort_index())

print("\nDataset checks and splitting completed.")


from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
)

# 1. Prepare training inputs and labels
X_train = (
    train_df["resume_text"]
    + " "
    + train_df["job_description"]
)
y_train = train_df["label"]

# 2. Prepare testing inputs and labels
X_test = (
    test_df["resume_text"]
    + " "
    + test_df["job_description"]
)
y_test = test_df["label"]

# 3. Create the ML pipeline
model = Pipeline([
    ("tfidf", TfidfVectorizer()),
    ("classifier", LogisticRegression(max_iter=1000)),
])

# 4. Train the model
model.fit(X_train, y_train)

import joblib

MODEL_PATH = Path(__file__).parent / "resume_model.joblib"
joblib.dump(model, MODEL_PATH)

print(f"Model saved to: {MODEL_PATH}")

print("\nMODEL TRAINING COMPLETED!")

# 5. Make predictions on unseen test examples
y_pred = model.predict(X_test)



# 7. Analyze individual predictions

test_results = test_df[
    ["resume_text", "job_description", "label"]
].copy().reset_index(drop=True)

# Store actual and predicted labels side by side
test_results["actual_label"] = y_test.reset_index(drop=True)
test_results["predicted_label"] = y_pred

# Identify whether each prediction was correct
def identify_error(row):
    actual = row["actual_label"]
    predicted = row["predicted_label"]

    if actual == predicted:
        return "Correct"

    if actual == 0 and predicted == 1:
        return "False Positive"

    return "False Negative"


test_results["result"] = test_results.apply(
    identify_error,
    axis=1,
)

print("\nINDIVIDUAL PREDICTION ANALYSIS")
print("-" * 60)

for _, row in test_results.iterrows():
    print("\nResume:", row["resume_text"])
    print("Job Description:", row["job_description"])
    print("Actual Label:", row["actual_label"])
    print("Predicted Label:", row["predicted_label"])
    print("Result:", row["result"])
    print("-" * 60)

# Display only incorrect predictions
errors = test_results[
    test_results["result"] != "Correct"
]

print("\nINCORRECT PREDICTIONS")
print("-" * 60)

if errors.empty:
    print("No incorrect predictions in this test set.")
else:
    for _, row in errors.iterrows():
        print("\nError Type:", row["result"])
        print("Resume:", row["resume_text"])
        print("Job Description:", row["job_description"])
        print("Actual:", row["actual_label"])
        print("Predicted:", row["predicted_label"])
        print("-" * 60)


# 6. Evaluate the model
print("\nMODEL EVALUATION")
print("-" * 50)

print("Actual labels:    ", y_test.tolist())
print("Predicted labels: ", y_pred.tolist())

print("\nAccuracy:", accuracy_score(y_test, y_pred))

print("\nClassification Report:")
print(classification_report(
    y_test,
    y_pred,
    labels=[0, 1],
    target_names=["Not Relevant", "Relevant"],
    zero_division=0,
))

print("Confusion Matrix:")
print(confusion_matrix(y_test, y_pred, labels=[0, 1]))

