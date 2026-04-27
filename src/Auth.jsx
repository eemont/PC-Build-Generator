import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";

export default function Auth() {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from?.pathname || "/";

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
        navigate(redirectTo, { replace: true });
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
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "16px",
        background: "#0f0f14",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "clamp(16px, 4vw, 24px)",
          background: "#0f0f14",
          boxSizing: "border-box",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: "16px",
            fontSize: "clamp(1.4rem, 4vw, 1.8rem)",
            lineHeight: 1.2,
          }}
        >
          {mode === "signup" ? "Create an account" : "Sign in"}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <label style={{ display: "grid", gap: 6, fontSize: "0.95rem" }}>
            Email
            <input
              type="email"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 8,
                border: "1px solid #ccc",
                fontSize: "16px",
                boxSizing: "border-box",
              }}
            />
          </label>

          <label style={{ display: "grid", gap: 6, fontSize: "0.95rem" }}>
            Password
            <input
              type="password"
              value={password}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 8,
                border: "1px solid #ccc",
                fontSize: "16px",
                boxSizing: "border-box",
              }}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background: "rgb(160, 85, 255)",
              color: "#fff",
              fontWeight: 600,
              fontSize: "1rem",
            }}
          >
            {loading ? "Please wait..." : mode === "signup" ? "Sign up" : "Sign in"}
          </button>

          {mode === "signin" && (
            <button
              type="button"
              onClick={handleResetPassword}
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 8,
                border: "1px solid #ddd",
                background: "#0f0f14",
                color: "#fff",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Forgot password?
            </button>
          )}
        </form>

        {message && (
          <p
            style={{
              marginTop: 12,
              fontSize: "0.95rem",
              lineHeight: 1.4,
              wordBreak: "break-word",
            }}
          >
            {message}
          </p>
        )}

        <hr style={{ margin: "16px 0" }} />

        <button
          type="button"
          onClick={() => {
            setMessage("");
            setMode(mode === "signup" ? "signin" : "signup");
          }}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 8,
            border: "none",
            background: "rgb(160, 85, 255)",
            cursor: "pointer",
            color: "#fff",
            fontSize: "1rem",
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