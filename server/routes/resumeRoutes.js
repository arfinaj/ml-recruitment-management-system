
import express from "express";

const router = express.Router();

router.post("/analyze", async (req, res) => {
  try {
    const { resume_text, job_description } = req.body;

    if (
      typeof resume_text !== "string" ||
      !resume_text.trim() ||
      typeof job_description !== "string" ||
      !job_description.trim()
    ) {
      return res.status(400).json({
        message: "Resume text and job description are required.",
      });
    }

    const response = await fetch(
      "http://127.0.0.1:8000/analyze",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume_text,
          job_description,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.json(data);
  } catch (error) {
    console.error("Resume analysis failed:", error);

    return res.status(503).json({
      message:
        "Resume analysis service is unavailable. Please try again.",
    });
  }
});

export default router;
