import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { SignIn, SignUp } from "./pages/auth";
import ProfileData from "./pages/dashboard/ProfileData";
import { ToastContainer } from "react-toastify";
function App() {
  const token = localStorage.getItem("token");

  return (
    <>
      {token ? (
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/dashboard/manage-products" replace />}
          />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/profile" element={<ProfileData />} />
          <Route path="/auth/*" element={<Auth />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="*" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
      )}
      <ToastContainer />
    </>
  );
}

export default App;
