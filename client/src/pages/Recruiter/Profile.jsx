import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function RecruiterProfile(){

    const [profile,setProfile]=useState(null);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState("")
    const token=localStorage.getItem("token");

    const navigate=useNavigate();

    useEffect(()=>{
    
    const fetchProfile=async()=>{
        try{
        const response=await fetch("http://localhost:5000/api/auth/me",
            {
                headers:{
                    Authorization:`Bearer ${token}`,
                },
            },
        )
        const data= await response.json();
        if(!response.ok){
            return(
            setError(data.message)
            );
        }
        setProfile(data.user);
       
        }catch(error){
            setError(error.message||"error loading profile");

        }finally{
             setLoading(false);
        }
    }

    fetchProfile();
    },[])

    if(loading){
        return(
        <div className="min-h-screen bg-slate-950 text-white">
            Loading your Profile
        </div>
        );
        
    }
    if(error){
        <div className="min-h-screen text-white bg-slate-950">
            Error loading your profile
        </div>
    }

    const handleLogout=()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login")
    };

    return(
       <div className="min-h-screen bg-slate-950 text-white">

  {/* Sidebar */}
  <aside className="fixed left-0 top-0 h-screen w-64 border-r border-slate-900 p-6">

    <div className="mb-10">
      <h1 className="text-2xl font-bold">
        Place<span className="text-blue-500">Sync</span>
      </h1>

      <div className="mt-1 text-sm text-slate-500">
        Recruiter Portal
      </div>
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
        onClick={() => navigate("/recruiter/createjobs")}
        className="w-full rounded-lg px-4 py-3 text-left text-slate-400 hover:bg-slate-800 hover:text-white"
      >
        Post Jobs
      </button>

      <button
        onClick={() => navigate("/recruiter/interviews")}
        className="w-full rounded-lg px-4 py-3 text-left text-slate-400 hover:bg-slate-800 hover:text-white"
      >
        Interviews
      </button>

      {/* Active */}
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
          Recruiter Portal
        </p>

        <h2 className="mt-1 text-3xl font-bold">
          My Profile
        </h2>

        <p className="mt-2 text-slate-400">
          Manage and view your recruiter and company information.
        </p>
      </div>

      {/* Profile Header */}
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

          <div>
            <p className="text-sm text-slate-500">
              Designation
            </p>

            <p className="mt-1 text-slate-200">
              {profile?.designation || "Not provided"}
            </p>
          </div>

        </div>

      </div>

      {/* Company Information */}
      <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

        <h3 className="mb-6 text-xl font-semibold">
          Company Information
        </h3>

        <div className="grid gap-6 md:grid-cols-2">

          <div>
            <p className="text-sm text-slate-500">
              Company
            </p>

            <p className="mt-1 text-slate-200">
              {profile?.company || "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Website
            </p>

            {profile?.website ? (
              <a
                href={profile.website}
                target="_blank"
                rel="noreferrer"
                className="mt-1 block text-blue-400 hover:text-blue-300"
              >
                {profile.website}
              </a>
            ) : (
              <p className="mt-1 text-slate-500">
                Not provided
              </p>
            )}
          </div>

        </div>

      </div>

      {/* Professional Information */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

        <h3 className="mb-6 text-xl font-semibold">
          Professional Information
        </h3>

        <div className="grid gap-6 md:grid-cols-2">

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

          <div>
            <p className="text-sm text-slate-500">
              Account Role
            </p>

            <p className="mt-1 text-slate-200">
              {profile?.role || "Recruiter"}
            </p>
          </div>

        </div>

      </div>

    </div>

  </main>

</div>
    )
}

export default RecruiterProfile;