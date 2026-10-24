
from pathlib import Path

import joblib
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(title="PlaceSynce Resume Analysis API")

MODEL_PATH = Path(__file__).parent / "resume_model.joblib"
model = joblib.load(MODEL_PATH)


class ResumeRequest(BaseModel):
    resume_text: str = Field(min_length=1)
    job_description: str = Field(min_length=1)


@app.get("/health")
def health_check():
    return {"status": "running"}


@app.post("/analyze")
def analyze_resume(request: ResumeRequest):
    resume_text = request.resume_text.strip()
    job_description = request.job_description.strip()

    if not resume_text or not job_description:
        raise HTTPException(
            status_code=400,
            detail="Resume and job description are required."
        )

    combined_text = f"{resume_text} {job_description}"

    prediction = int(model.predict([combined_text])[0])

    return {
        "prediction": prediction,
        "relevance": (
            "Relevant" if prediction == 1
            else "Not Relevant"
        )
    }
