import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ApplicationDetails(){
const [application, setApplication] = useState([]);
    const [loading,setLoading]= useState(true);
    const [error,setError]=useState("");
    const navigate=useNavigate();
const { applicationId } = useParams();
    useEffect(() => {
  const fetchApplicationById = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("TOKEN:", token);
console.log("APPLICATION ID:", applicationId);

      const response = await fetch(
        `http://localhost:5000/api/applications/${applicationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Error loading application");
        return;
      }

      console.log("Application data:", data);

      setApplication(data.application);
    } catch (error) {
      console.error("Error:", error);
      setError("Unable to load application");
    } finally {
      setLoading(false);
    }
  };

  fetchApplicationById();
}, [applicationId]);
    return (
  <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
    <div className="max-w-5xl mx-auto">

      {/* Back Button */}
      <button
        onClick={() => navigate("/student/my-applications")}
        className="mb-6 text-slate-400 hover:text-white transition"
      >
        ← Back to Applications
      </button>

      {/* Job Details */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

          <div>
            <p className="text-blue-400 text-sm font-medium mb-2">
              {application.job?.company}
            </p>

            <h1 className="text-2xl md:text-3xl font-bold">
              {application.job?.title}
            </h1>

            <p className="text-slate-400 mt-2">
              {application.job?.location} • {application.job?.jobType}
            </p>
          </div>

          {/* Application Status */}
          <span className="px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm font-medium w-fit">
            {application.status}
          </span>

        </div>

        {/* Job Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

          <div className="bg-slate-800/50 rounded-xl p-4">
            <p className="text-slate-400 text-sm">Salary</p>
            <p className="font-medium mt-1">
              {application.job?.salary || "Not specified"}
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-4">
            <p className="text-slate-400 text-sm">Deadline</p>
            <p className="font-medium mt-1">
              {application.job?.deadline
                ? new Date(application.job.deadline).toLocaleDateString()
                : "Not specified"}
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-4">
            <p className="text-slate-400 text-sm">Applied On</p>
            <p className="font-medium mt-1">
              {application.createdAt
                ? new Date(application.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>

        </div>
      </div>

      {/* Job Description */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Job Description
        </h2>

        <p className="text-slate-300 leading-relaxed whitespace-pre-line">
          {application.job?.description || "No description available."}
        </p>
      </div>

      {/* Submitted Application */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

        <h2 className="text-xl font-semibold mb-6">
          Your Submitted Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Name */}
          <div>
            <p className="text-sm text-slate-400 mb-1">
              Full Name
            </p>
            <p className="text-white">
              {application.applicantDetails?.name || "Not provided"}
            </p>
          </div>

          {/* Email */}
          <div>
            <p className="text-sm text-slate-400 mb-1">
              Email
            </p>
            <p className="text-white">
              {application.applicantDetails?.email || "Not provided"}
            </p>
          </div>

          {/* Phone */}
          <div>
            <p className="text-sm text-slate-400 mb-1">
              Phone
            </p>
            <p className="text-white">
              {application.applicantDetails?.phone || "Not provided"}
            </p>
          </div>

          {/* College */}
          <div>
            <p className="text-sm text-slate-400 mb-1">
              College
            </p>
            <p className="text-white">
              {application.applicantDetails?.college || "Not provided"}
            </p>
          </div>

          {/* Roll Number */}
          <div>
            <p className="text-sm text-slate-400 mb-1">
              Roll Number
            </p>
            <p className="text-white">
              {application.applicantDetails?.rollNumber || "Not provided"}
            </p>
          </div>

          {/* Branch */}
          <div>
            <p className="text-sm text-slate-400 mb-1">
              Branch
            </p>
            <p className="text-white">
              {application.applicantDetails?.branch || "Not provided"}
            </p>
          </div>

          {/* CGPA */}
          <div>
            <p className="text-sm text-slate-400 mb-1">
              CGPA
            </p>
            <p className="text-white">
              {application.applicantDetails?.cgpa ?? "Not provided"}
            </p>
          </div>

          {/* Graduation Year */}
          <div>
            <p className="text-sm text-slate-400 mb-1">
              Graduation Year
            </p>
            <p className="text-white">
              {application.applicantDetails?.graduationYear || "Not provided"}
            </p>
          </div>

        </div>

        {/* Skills */}
        <div className="mt-6">
          <p className="text-sm text-slate-400 mb-2">
            Skills
          </p>

          <div className="flex flex-wrap gap-2">
            {application.applicantDetails?.skills?.length > 0 ? (
              application.applicantDetails.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-slate-500">
                No skills provided
              </p>
            )}
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">

          <div>
            <p className="text-sm text-slate-400 mb-1">
              GitHub
            </p>

            {application.applicantDetails?.github ? (
              <a
                href={application.applicantDetails.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline break-all"
              >
                {application.applicantDetails.github}
              </a>
            ) : (
              <p className="text-slate-500">
                Not provided
              </p>
            )}
          </div>

          <div>
            <p className="text-sm text-slate-400 mb-1">
              LinkedIn
            </p>

            {application.applicantDetails?.linkedin ? (
              <a
                href={application.applicantDetails.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline break-all"
              >
                {application.applicantDetails.linkedin}
              </a>
            ) : (
              <p className="text-slate-500">
                Not provided
              </p>
            )}
          </div>

        </div>

        {/* Resume */}
        <div className="mt-6 pt-6 border-t border-slate-800">
          <p className="text-sm text-slate-400 mb-2">
            Resume
          </p>

          {application.applicantDetails?.resume ? (
            <a
              href={application.applicantDetails.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition font-medium"
            >
              View Resume
            </a>
          ) : (
            <p className="text-slate-500">
              No resume provided
            </p>
          )}
        </div>

      </div>
    </div>
  </div>
);
};

export default ApplicationDetails;