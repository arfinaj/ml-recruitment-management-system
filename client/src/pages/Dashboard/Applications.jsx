import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/applications/my-applications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Error loading applications");
          return;
        }

        setApplications(data.applications);
      } catch (error) {
        console.error(error);
        setError("Unable to load applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Applied":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";

      case "Shortlisted":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";

      case "Interview":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";

      case "Selected":
        return "bg-green-500/10 text-green-400 border-green-500/20";

      case "Rejected":
        return "bg-red-500/10 text-red-400 border-red-500/20";

      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-10 text-white">
        Loading your applications...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

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
            className="w-full rounded-lg px-4 py-3 text-left text-slate-400 hover:bg-slate-500 hover:text-white"
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
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-left text-white"
          >
            Applications
          </button>

          <button
            onClick={() => navigate("/student/me")}
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

      <main className="ml-64 p-8">
        <div className="mx-auto max-w-7xl">

          <div className="mb-8">
            <p className="text-sm text-slate-500">
              Student Portal
            </p>

            <h2 className="mt-1 text-3xl font-bold">
              My Applications
            </h2>

            <p className="mt-2 text-slate-400">
              Track the jobs you have applied to through PlaceSync.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {!error && applications.length === 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
              <h3 className="text-lg font-semibold">
                You haven't applied for any jobs yet.
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Explore available opportunities and submit your first application.
              </p>

              <button
                onClick={() => navigate("/student/jobs")}
                className="mt-6 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium hover:bg-blue-500"
              >
                Browse Jobs
              </button>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {applications.map((application) => (
              <div
                key={application._id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-700"
              >

                <div className="mb-5">
                  <p className="text-sm text-blue-400">
                    {application.job?.company}
                  </p>

                  <h3 className="mt-1 text-xl font-semibold">
                    {application.job?.title}
                  </h3>
                </div>

                <div className="space-y-3 text-sm text-slate-400">

                  <div className="flex justify-between gap-4">
                    <span>Location</span>

                    <span className="text-right text-slate-200">
                      {application.job?.location}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span>Job Type</span>

                    <span className="text-slate-200">
                      {application.job?.jobType}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span>Salary</span>

                    <span className="text-slate-200">
                      {application.job?.salary || "Not specified"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span>Applied On</span>

                    <span className="text-right text-slate-200">
                      {new Date(
                        application.createdAt
                      ).toLocaleDateString()}
                    </span>
                  </div>

                </div>

                <div className="mt-6 border-t border-slate-800 pt-5">

                  <p className="mb-2 text-xs text-slate-500">
                    Application Status
                  </p>

                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyle(
                      application.status
                    )}`}
                  >
                    {application.status}
                  </span>

                </div>

                {application.job?.deadline && (
                  <div className="mt-5">
                    <p className="text-xs text-slate-500">
                      Application Deadline
                    </p>

                    <p className="mt-1 text-sm text-slate-300">
                      {new Date(
                        application.job.deadline
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}

                <button
                  onClick={() =>
                    navigate(`/applications/${application._id}`)
                  }
                  className="mt-6 w-full rounded-lg border border-slate-700 px-4 py-3 text-sm font-medium text-slate-200 hover:bg-slate-800"
                >
                  View Job
                </button>

              </div>
            ))}

          </div>
        </div>
      </main>
    </div>
  );
}

export default MyApplications;