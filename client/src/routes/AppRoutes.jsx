import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing/Landing";
import Login  from "../pages/Auth/Login";
import Register from "../pages/Auth/Register"; 
import StudentDashboard from "../pages/Dashboard/StudentDashboard";
// import Jobs from "../pages/Jobs/Jobs";
import ApplyJob from "../pages/Applications/ApplyJob";
import Applicants from "../pages/Recruiter/Applicants";
import ProtectedRoute from "../components/ProtectedRoute";
import RecruiterDashboard from "../pages/Recruiter/Dashboard";
import MyJobs from "../pages/Recruiter/MyJobs";
import EditJob from "../pages/Recruiter/EditJob";
import Interviews from "../pages/Recruiter/Interviews";
import ScheduleInterview from "../pages/Recruiter/ScheduleInterview";
import CreateJob from "../pages/Recruiter/CreateJob";
import Jobs from "../pages/Dashboard/Jobs";
import MyApplications from "../pages/Dashboard/Applications";
import RecruiterProfile from "../pages/Recruiter/Profile";
import MyProfile from "../pages/Dashboard/Profile";
import ApplicationDetails from "../pages/Dashboard/ApplicationDetails";
import StudentResumeAnalysis from "../pages/Dashboard/StudentResumeAnalysis";
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/apply/:jobId" element={<ApplyJob />} />
        <Route
  path="/recruiter/jobs/:jobId/applicants"
  element={<Applicants />}
/>
<Route
path='/applications/:applicationId'
element={<ApplicationDetails/>}
/>
        <Route
  path="/student/dashboard"
  element={<StudentDashboard />}  
/>
<Route
path="/student/me"
element={<MyProfile/>}
/>


<Route
path="/student/my-applications"
element={<MyApplications/>}
></Route>

<Route
path="/recruiter/my"
element={<RecruiterProfile/>}
/>


<Route
  path="/student/jobs"
  element={
    <ProtectedRoute allowedRole="Student">
      <Jobs />
    </ProtectedRoute>
  }
/>

<Route
  path="/recruiter/jobs/:jobId/applicants"
  element={
    <ProtectedRoute allowedRole="Recruiter">
      <Applicants />
    </ProtectedRoute>
  }
/>

<Route
  path="/recruiter/dashboard"
  element={
    <ProtectedRoute allowedRole="Recruiter">
      <RecruiterDashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/recruiter/my-jobs"
  element={
    <ProtectedRoute allowedRole="Recruiter">
      <MyJobs />
    </ProtectedRoute>
  }
/>
<Route
  path="/recruiter/jobs/:jobId/edit"
  element={
    <ProtectedRoute allowedRole="Recruiter">
      <EditJob />
    </ProtectedRoute>
  }
/>

<Route
  path="/recruiter/interviews"
  element={
    <ProtectedRoute allowedRole="Recruiter">
      <Interviews />
    </ProtectedRoute>
  }
/>

<Route
  path="/recruiter/interviews/schedule/:jobId/:studentId"
  element={
    <ProtectedRoute allowedRole="Recruiter">
      <ScheduleInterview />
    </ProtectedRoute>
  }
/>

<Route
  path="/recruiter/createjob"
  element={
    <ProtectedRoute allowedRole="Recruiter">
      <CreateJob />
    </ProtectedRoute>
  }
/>

<Route
  path="/student/analyze-resume"
  element={<StudentResumeAnalysis />}
/>
      </Routes>
    </BrowserRouter>

    
  );

  
}

export default AppRoutes;