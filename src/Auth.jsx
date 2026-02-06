import { useState } from "react";
import { supabase } from "./lib/supabaseClient";

export default function Auth() {
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        setMessage(
          "Account created! If email confirmation is enabled, check your email to confirm."
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        setMessage("Signed in!");
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword() {
    setMessage("");

    if (!email) {
      setMessage("Enter your email first, then click 'Forgot password?'.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/reset",
      });
      if (error) throw error;

      setMessage("Password reset email sent! Check your inbox (and spam).");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420, border: "1px solid #ddd", borderRadius: 12, padding: 20 }}>
        <h2 style={{ marginTop: 0 }}>
          {mode === "signup" ? "Create an account" : "Sign in"}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <label style={{ display: "grid", gap: 6 }}>
            Email
            <input
              type="email"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            Password
            <input
              type="password"
              value={password}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: 10,
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
            }}
          >
            {loading ? "Please wait..." : mode === "signup" ? "Sign up" : "Sign in"}
          </button>

          {/* Reset password button (only show on sign-in mode) */}
          {mode === "signin" && (
            <button
              type="button"
              onClick={handleResetPassword}
              disabled={loading}
              style={{
                padding: 10,
                borderRadius: 8,
                border: "1px solid #ccc",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              Forgot password?
            </button>
          )}
        </form>

        {message && <p style={{ marginTop: 12 }}>{message}</p>}

        <hr style={{ margin: "16px 0" }} />

        <button
          type="button"
          onClick={() => {
            setMessage("");
            setMode(mode === "signup" ? "signin" : "signup");
          }}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 8,
            border: "1px solid #ccc",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          {mode === "signup"
            ? "Already have an account? Sign in"
            : "New here? Create an account"}
        </button>
      </div>
    </div>
  );
}
