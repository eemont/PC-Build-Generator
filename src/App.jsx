import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./routes/ProtectedRoute";

import Auth from "./Auth";
import Reset from "./reset";
import Home from "./pages/Home/Home";
import GenerateBuild from "./pages/GenerateBuild/GenerateBuild";
import CustomBuild from "./pages/CustomBuild/CustomBuild";
import SavedBuilds from "./pages/SavedBuilds/SavedBuilds";
import FAQ from "./pages/FAQ/FAQ";

export default function App() {

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/build" element={<GenerateBuild />} />
        <Route path="/custom-build" element={<CustomBuild />} />
        <Route path="/faq" element={<FAQ />} />

        <Route
          path="/saved"
          element={
            <ProtectedRoute>
              <SavedBuilds />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}