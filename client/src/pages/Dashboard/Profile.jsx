import { useEffect, useState } from "react"
import { Navigate, useNavigate } from "react-router-dom";

function MyProfile(){

    const [profile,setProfile]=useState(null);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState("");

    const navigate=useNavigate();

    const token=localStorage.getItem("token")
    useEffect(()=>{

        const fetchProfile=async()=>{

            try{
            const response=await fetch("http://localhost:5000/api/auth/me",
                {
                    headers:{
                        Authorization:`Bearer ${token}`,
                    },
                }
            )
            const data=await response.json();
            if(!response.ok){
                setError(data.message)
            }

            setProfile(data.user)

            }catch(error){
                setError(error || "Error loading Profile")
            }finally{
                setLoading(false)
            }

            
        };
        fetchProfile();

    },[])

    const handleLogout=()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    if(loading){
        <div className="min-h-screen text-white bg-slate-950 p-10">
            Loading Profile
        </div>
    }
    if(error){
        <div className="min-h-screen text-white bg-slate-950 p-10">
            Error loading profile
        </div>
    }

    return(
        <div className="min-h-screen bg-slate-950 text-white">

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-slate-900 p-6">

        <div className="mb-10">
          <h1 className="text-xl font-bold">
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
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-left text-white"
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

      {/* Main */}
      <main className="ml-64 p-8">

        <div className="mx-auto max-w-6xl">

          {/* Header */}
          <div className="mb-8">
            <p className="text-sm text-slate-500">
              Student Portal
            </p>

            <h2 className="mt-1 text-3xl font-bold">
              My Profile
            </h2>

            <p className="mt-2 text-slate-400">
              Manage and view your personal, academic, and professional information.
            </p>
          </div>

          {/* Profile Header Card */}
          <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="flex items-center gap-5">

              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold">
                {profile?.name?.charAt(0).toUpperCase()}
              </div>

              <div>
                <h3 className="text-2xl font-bold">
                  {profile?.name}
                </h3>

                <p className="mt-1 text-slate-400">
                  {profile?.email}
                </p>

                <span className="mt-3 inline-block rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
                  {profile?.role}
                </span>
              </div>

            </div>

          </div>

          {/* Personal Information */}
          <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <h3 className="mb-6 text-xl font-semibold">
              Personal Information
            </h3>

            <div className="grid gap-6 md:grid-cols-2">

              <div>
                <p className="text-sm text-slate-500">
                  Full Name
                </p>

                <p className="mt-1 text-slate-200">
                  {profile?.name || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Email
                </p>

                <p className="mt-1 text-slate-200">
                  {profile?.email || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Phone
                </p>

                <p className="mt-1 text-slate-200">
                  {profile?.phone || "Not provided"}
                </p>
              </div>

            </div>

          </div>

          {/* Academic Information */}
          <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <h3 className="mb-6 text-xl font-semibold">
              Academic Information
            </h3>

            <div className="grid gap-6 md:grid-cols-2">

              <div>
                <p className="text-sm text-slate-500">
                  College
                </p>

                <p className="mt-1 text-slate-200">
                  {profile?.college || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Roll Number
                </p>

                <p className="mt-1 text-slate-200">
                  {profile?.rollNumber || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Branch
                </p>

                <p className="mt-1 text-slate-200">
                  {profile?.branch || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  CGPA
                </p>

                <p className="mt-1 text-slate-200">
                  {profile?.cgpa ?? "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Graduation Year
                </p>

                <p className="mt-1 text-slate-200">
                  {profile?.graduationYear || "Not provided"}
                </p>
              </div>

            </div>

          </div>

          {/* Professional Information */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <h3 className="mb-6 text-xl font-semibold">
              Professional Information
            </h3>

            <div className="mb-6">

              <p className="text-sm text-slate-500">
                Skills
              </p>

              <div className="mt-3 flex flex-wrap gap-2">

                {profile?.skills?.length > 0 ? (
                  profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-500">
                    No skills added
                  </span>
                )}

              </div>

            </div>

            <div className="grid gap-6 md:grid-cols-2">

              <div>
                <p className="text-sm text-slate-500">
                  GitHub
                </p>

                {profile?.github ? (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 block text-blue-400 hover:text-blue-300"
                  >
                    {profile.github}
                  </a>
                ) : (
                  <p className="mt-1 text-slate-500">
                    Not provided
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  LinkedIn
                </p>

                {profile?.linkedin ? (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 block text-blue-400 hover:text-blue-300"
                  >
                    {profile.linkedin}
                  </a>
                ) : (
                  <p className="mt-1 text-slate-500">
                    Not provided
                  </p>
                )}
              </div>

            </div>

          </div>

        </div>

      </main>
    </div>
        

    );
}

export default MyProfile;