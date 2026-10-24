import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchJobs = async () => {
      try {
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
          setError(data.message || "Failed to fetch jobs");
          return;
        }

        setJobs(data.jobs);
      } catch (error) {
        console.error(error);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-10 text-white">
        Loading available jobs...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-slate-800 bg-slate-900 p-6">

        <div className="mb-10">
          <h1 className="text-2xl font-bold">
            Place<span className="text-blue-500">Sync</span>
          </h1>

          <div className="mt-1 text-sm text-slate-500">
            Student Portal
          </div>
        </div>

        <nav className="space-y-2">

          <button
            onClick={() => navigate("/student/dashboard")}
            className="w-full rounded-lg px-4 py-3 text-left text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            Dashboard
          </button>

          {/* Active */}
          <button
            onClick={() => navigate("/student/jobs")}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-left text-white"
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
            onClick={() => navigate("/student/dashboard")}
            className="w-full rounded-lg px-4 py-3 text-left text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            Profile
          </button>

        </nav>

        <div className="absolute bottom-6 left-6 right-8">
          <button
            onClick={handleLogout}
            className="w-full rounded-lg px-4 py-3 text-left text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            Logout
          </button>
        </div>

      </aside>

      {/* Main content */}
      <main className="ml-64 p-8">

        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-8">
            <p className="text-sm text-slate-500">
              Student Portal
            </p>

            <h2 className="mt-1 text-3xl font-bold">
              Available Jobs
            </h2>

            <p className="mt-2 text-slate-400">
              Explore job opportunities available through PlaceSync.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* No jobs */}
          {!error && jobs.length === 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
              <h3 className="text-lg font-semibold">
                No jobs available
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                There are currently no open job opportunities.
              </p>
            </div>
          )}

          {/* Jobs */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {jobs.map((job) => (
              <div
                key={job._id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-700"
              >

                {/* Company */}
                <div className="mb-5">
                  <p className="text-sm text-blue-400">
                    {job.company}
                  </p>

                  <h3 className="mt-1 text-xl font-semibold">
                    {job.title}
                  </h3>
                </div>

                {/* Job information */}
                <div className="space-y-3 text-sm text-slate-400">

                  <div className="flex justify-between">
                    <span>Location</span>
                    <span className="text-slate-200">
                      {job.location}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Job Type</span>
                    <span className="text-slate-200">
                      {job.jobType}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Salary</span>
                    <span className="text-slate-200">
                      {job.salary || "Not specified"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Minimum CGPA</span>
                    <span className="text-slate-200">
                      {job.eligibility?.minCGPA}
                    </span>
                  </div>

                </div>

                {/* Branches */}
                <div className="mt-5">
                  <p className="mb-2 text-xs text-slate-500">
                    Eligible Branches
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {job.eligibility?.branches?.map((branch) => (
                      <span
                        key={branch}
                        className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300"
                      >
                        {branch}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Deadline */}
                <div className="mt-5 border-t border-slate-800 pt-4">
                  <p className="text-xs text-slate-500">
                    Application Deadline
                  </p>

                  <p className="mt-1 text-sm text-slate-300">
                    {new Date(job.deadline).toLocaleString()}
                  </p>
                </div>

                {/* Apply */}
                <button
                  onClick={() => navigate(`/apply/${job._id}`)}
                  className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium hover:bg-blue-500"
                >
                  View & Apply
                </button>

              </div>
            ))}

          </div>

        </div>

      </main>

    </div>
  );
}

export default Jobs;