import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient"; 

export default function Reset() {
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const init = async () => {
      setError("");
      setMessage("");

      const hash = window.location.hash;
      if (hash && hash.includes("error_code=")) {
        const params = new URLSearchParams(hash.slice(1));
        const code = params.get("error_code");
        const desc = (params.get("error_description") || "").replace(/\+/g, " ");
        setError(`${code || "error"}: ${desc || "Link invalid or expired."}`);
        setReady(true);
        return;
      }

      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        if (code) {
          const { error: exErr } = await supabase.auth.exchangeCodeForSession(code);
          if (exErr) throw exErr;

          url.searchParams.delete("code");
          window.history.replaceState({}, "", url.toString());
        }
      } catch (e) {
        setError(e?.message || "Could not initialize reset session.");
      } finally {
        setReady(true);
      }
    };

    init();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("Passwords do not match.");

    const { error } = await supabase.auth.updateUser({ password });
    if (error) return setError(error.message);

    setMessage("Password updated! You can now sign in with your new password.");
    setPassword("");
    setConfirm("");
  };

  if (!ready) return <div style={{ padding: 24 }}>Loading...</div>;

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420, border: "1px solid #ddd", borderRadius: 12, padding: 20 }}>
        <h2 style={{ marginTop: 0 }}>Reset Password</h2>

        {error && <p style={{ marginTop: 12 }}>{error}</p>}
        {message && <p style={{ marginTop: 12 }}>{message}</p>}

        {!message && !error && (
          <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, marginTop: 12 }}>
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              required
              style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
            />
            <button type="submit" style={{ padding: 10, borderRadius: 8, border: "none" }}>
              Update password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
