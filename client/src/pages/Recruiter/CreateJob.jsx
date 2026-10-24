import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company: "",
    title: "",
    description: "",
    location: "",
    jobType: "Full-time",
    salary: "",
    minCGPA: "",
    branches: "",
    deadline: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/jobs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            company: formData.company,
            title: formData.title,
            description: formData.description,
            location: formData.location,
            jobType: formData.jobType,
            salary: formData.salary,


              minCGPA: Number(formData.minCGPA),
              branches: formData.branches
                .split(",")
                .map((branch) => branch.trim())
                .filter(Boolean),
            

            deadline: formData.deadline,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to create job");
        return;
      }

      navigate("/recruiter/my-jobs");
    } catch (error) {
      console.error("Create job error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-slate-800 bg-slate-900 p-6">

        <div className="mb-10">
          <h1 className="text-2xl font-bold">
            Place<span className="text-blue-500">Sync</span>
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Recruiter Portal
          </p>
        </div>

        <nav className="space-y-2">

          <button
            onClick={() => navigate("/recruiter/dashboard")}
            className="w-full rounded-lg px-4 py-3 text-left text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/recruiter/my-jobs")}
            className="w-full rounded-lg px-4 py-3 text-left text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            My Jobs
          </button>

          <button
            onClick={() => navigate("/recruiter/interviews")}
            className="w-full rounded-lg px-4 py-3 text-left text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            Interviews
          </button>

          <button
          onClick={()=> navigate("/recruiter/createjob")}
           className="w-full rounded-lg bg-blue-600 px-4 py-3 text-left"
          >
            Post Jobs

          </button>

          <button
            className="w-full rounded-lg px-4 py-3 text-left text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            Profile
          </button>

        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/login");
            }}
            className="w-full rounded-lg px-4 py-3 text-left text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-64 p-8">

        <div className="mx-auto max-w-4xl">

          <div className="mb-8">
            <p className="text-sm text-slate-500">
              Recruiter Portal
            </p>

            <h2 className="mt-1 text-3xl font-bold">
              Post a New Job
            </h2>

            <p className="mt-2 text-slate-400">
              Create a job opening and publish it for eligible students.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-8"
          >

            {/* Company */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Company
              </label>

              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Amazon"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </div>

            {/* Job title */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Job Title
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Software Development Engineer"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Job Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the role and responsibilities..."
                rows={5}
                required
                className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </div>

            {/* Location + Job type */}
            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Hyderabad"
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Job Type
                </label>

                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

            </div>

            {/* Salary */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Salary
              </label>

              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g. ₹8–12 LPA"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </div>

            {/* Eligibility */}
            <div className="border-t border-slate-800 pt-6">

              <h3 className="mb-4 text-lg font-semibold">
                Eligibility
              </h3>

              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Minimum CGPA
                  </label>

                  <input
                    type="number"
                    name="minCGPA"
                    value={formData.minCGPA}
                    onChange={handleChange}
                    placeholder="e.g. 7.5"
                    min="0"
                    max="10"
                    step="0.1"
                    required
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Eligible Branches
                  </label>

                  <input
                    type="text"
                    name="branches"
                    value={formData.branches}
                    onChange={handleChange}
                    placeholder="CSE, IT, ECE"
                    required
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                  />

                  <p className="mt-2 text-xs text-slate-500">
                    Separate branches with commas.
                  </p>
                </div>

              </div>

            </div>

            {/* Deadline */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Application Deadline
              </label>

              <input
                type="datetime-local"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 border-t border-slate-800 pt-6">

              <button
                type="button"
                onClick={() => navigate("/recruiter/my-jobs")}
                className="rounded-lg border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Publishing..." : "Publish Job"}
              </button>

            </div>

          </form>
        </div>
      </main>
    </div>
  );
}

export default CreateJob;