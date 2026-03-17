import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import Auth from "./Auth";
import Reset from "./reset";
import { findParts } from "./domain/partsApi";

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [parts, setParts] = useState([]);

  const isResetRoute = window.location.pathname === "/reset";

  useEffect(() => {
    async function loadParts() {
      try {
        const fetchedParts = await findParts("cpu", 5);
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
    <div style={{ padding: 24 }}>
      {/* <h1>PC Build Generator</h1> */}
      <p>Signed in as: {session.user.email}</p>
      {/* <button onClick={() => supabase.auth.signOut()}>Sign out</button> */}

      {/* <h2 style={{ marginTop: 24 }}>Sample CPU Data from Supabase</h2>
      {parts.length === 0 ? (
        <p>No parts found.</p>
      ) : (
        <ul>
          {parts.map((part, index) => (
            <li key={index}>
              {part.brand} {part.model} - ${part.price}
            </li>
          ))}
        </ul>
      )} */}
    </div>
  );
}