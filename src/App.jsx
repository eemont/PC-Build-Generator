import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./routes/ProtectedRoute";

import Auth from "./Auth";
import Reset from "./reset";
import Home from "./pages/Home/Home";
import GenerateBuild from "./pages/GenerateBuild/GenerateBuild";
import CustomBuild from "./pages/CustomBuild/CustomBuild";
import SavedBuilds from "./pages/SavedBuilds/SavedBuilds";

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [parts, setParts] = useState([]);

  const isResetRoute = window.location.pathname === "/reset";

  useEffect(() => {
    async function loadParts() {
      try {
        const fetchedParts = await findParts({
          partType: "cpu", 
          limit: 5
        });
        setParts(fetchedParts);
        console.log("Fetched Supabase parts:", fetchedParts);
      } catch (error) {
        console.error("Error fetching parts from Supabase:", error);
      }
    }

    loadParts();
  }, []);

  useEffect(() => {
    async function loadSession() {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    }

    loadSession();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  if (isResetRoute) return <Reset />;

  if (loading) {
    return <div style={{ padding: 24 }}>Loading...</div>;
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/build" element={<GenerateBuild />} />
        <Route path="/custom-build" element={<CustomBuild />} />

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