import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import Auth from "./Auth";
import Reset from "./reset";

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const isResetRoute = window.location.pathname === "/reset";

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  if (isResetRoute) return <Reset />;

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (!session) return <Auth />;

  return (
    <div style={{ padding: 24 }}>
      <h1>PC Build Generator</h1>
      <p>Signed in as: {session.user.email}</p>
      <button onClick={() => supabase.auth.signOut()}>Sign out</button>
    </div>
  );
}
