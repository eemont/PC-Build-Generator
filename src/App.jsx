import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import Auth from "./Auth";
import Reset from "./reset";

import { findParts } from "./utils/getParts";
import { mockCPUs } from "./data/mockCPUs";

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const [parts, setParts] = useState({});

  const isResetRoute = window.location.pathname === "/reset";

  useEffect(() => {
    (async function getParts() {
      const parts = await findParts('cpu', 5, true);
      setParts(parts);      
    })();
  }, []);
  console.log('"fetched" parts', parts);
  console.log('mock cpu fully populated:', mockCPUs[0]);


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
