
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentResumeAnalysis() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [result, setResult] = useState(null);

  const [loadingJobs, setLoadingJobs] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/jobs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not load jobs.");
        }

        const availableJobs = Array.isArray(data.jobs)
          ? data.jobs
          : [];

        setJobs(availableJobs);

        if (availableJobs.length > 0) {
          setSelectedJob(String(availableJobs[0]._id));
        }
      } catch (err) {
        setError(err.message || "Could not load jobs.");
      } finally {
        setLoadingJobs(false);
      }
    };

    fetchJobs();
  }, []);

  const handleAnalyze = async (event) => {
    event.preventDefault();

    setError("");
    setResult(null);

    if (!resumeText.trim()) {
      setError("Please paste your resume text first.");
      return;
    }

    const job = jobs.find(
      (item) => String(item._id) === selectedJob
    );

    if (!job) {
      setError("Please select a valid job.");
      return;
    }

    // Support common job-description field names.
    const jobDescription =
      job.jobDescription ||
      job.description ||
      job.job_description ||
      "";

    if (typeof jobDescription !== "string" ||
        !jobDescription.trim()) {
      setError(
        "This job has no description available for analysis."
      );
      return;
    }

    try {
      setAnalyzing(true);

      const response = await fetch(
        "http://localhost:5000/api/resumes/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            resume_text: resumeText,
            job_description: jobDescription,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.detail || "Analysis failed."
        );
      }

      setResult({
        ...data,
        jobTitle: job.title || job.jobTitle || job.role || "Selected job",
      });
    } catch (err) {
      setError(
        err.message ||
          "Could not analyze your resume. Please try again."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-800 bg-slate-900 p-6 md:block">
        <h1 className="mb-1 text-2xl font-bold">
          Place<span className="text-blue-500">Sync</span>
        </h1>

        <p className="mb-10 text-sm text-slate-500">
          Student Portal
        </p>

        <nav className="space-y-2">
          <button
            onClick={() => navigate("/student")}
            className="w-full rounded-lg px-4 py-3 text-left text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/student/jobs")}
            className="w-full rounded-lg px-4 py-3 text-left text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            Jobs
          </button>

          <button
            onClick={() => navigate("/student/my-applications")}
            className="w-full rounded-lg px-4 py-3 text-left text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            Applications
          </button>

          <button
            onClick={() => navigate("/student/me")}
            className="w-full rounded-lg px-4 py-3 text-left text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            Profile
          </button>

          <button
            onClick={() => navigate("/student/analyze-resume")}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-left font-medium text-white"
          >
            Analyze Your Resume
          </button>
        </nav>
      </aside>

      <main className="p-5 md:ml-64 md:p-10">
        <header className="mb-8">
          <p className="text-sm text-blue-400">
            AI-POWERED CAREER TOOL
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Analyze Your Resume
          </h2>

          <p className="mt-3 max-w-2xl text-slate-400">
            Compare your resume with a placement opportunity
            and get an initial ML-based relevance assessment.
          </p>
        </header>

        <div className="grid gap-6 xl:grid-cols-3">
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 xl:col-span-2">
            <form onSubmit={handleAnalyze} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Select a job
                </label>

                <select
                  value={selectedJob}
                  onChange={(event) => {
                    setSelectedJob(event.target.value);
                    setResult(null);
                  }}
                  disabled={loadingJobs || jobs.length === 0}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 outline-none focus:border-blue-500"
                >
                  {loadingJobs && (
                    <option value="">Loading jobs...</option>
                  )}

                  {!loadingJobs && jobs.length === 0 && (
                    <option value="">No jobs available</option>
                  )}

                  {jobs.map((job) => (
                    <option
                      key={job._id}
                      value={String(job._id)}
                    >
                      {job.title || job.jobTitle || job.role || "Untitled job"}
                      {job.company ? ` — ${job.company}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Resume text
                </label>

                <textarea
                  value={resumeText}
                  onChange={(event) => {
                    setResumeText(event.target.value);
                    setResult(null);
                  }}
                  rows={12}
                  placeholder="Paste your resume text here, including your skills, education, projects, and experience..."
                  className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm leading-6 outline-none placeholder:text-slate-600 focus:border-blue-500"
                />

                <p className="mt-2 text-xs text-slate-500">
                  For this first version, paste text extracted
                  from your resume. PDF upload can be added next.
                </p>
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={analyzing || loadingJobs || jobs.length === 0}
                className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {analyzing ? "Analyzing..." : "Analyze My Resume"}
              </button>
            </form>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <span className="text-2xl">✦</span>
            </div>

            <h3 className="text-xl font-semibold">
              Your analysis
            </h3>

            {!result && (
              <div className="mt-5 rounded-xl border border-dashed border-slate-700 p-5">
                <p className="font-medium text-slate-300">
                  Results will appear here
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Select a job, paste your resume, and run the
                  analysis to see the model's prediction.
                </p>
              </div>
            )}

            {result && (
              <div className="mt-5 space-y-4">
                <p className="text-sm text-slate-400">
                  Selected position
                </p>

                <p className="font-medium">{result.jobTitle}</p>

                <div
                  className={`rounded-xl border p-5 ${
                    Number(result.prediction) === 1
                      ? "border-emerald-500/30 bg-emerald-500/10"
                      : "border-amber-500/30 bg-amber-500/10"
                  }`}
                >
                  <p className="text-sm text-slate-400">
                    ML relevance prediction
                  </p>

                  <p
                    className={`mt-2 text-2xl font-bold ${
                      Number(result.prediction) === 1
                        ? "text-emerald-400"
                        : "text-amber-400"
                    }`}
                  >
                    {result.relevance ||
                      (Number(result.prediction) === 1
                        ? "Relevant"
                        : "Not Relevant")}
                  </p>
                </div>

                <p className="text-xs leading-5 text-slate-500">
                  This is an experimental prediction from a
                  small demonstration dataset, not a hiring
                  decision or probability of selection.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default StudentResumeAnalysis;
