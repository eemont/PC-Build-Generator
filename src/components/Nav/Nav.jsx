import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import "./Nav.css";

export default function Nav() {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadSession() {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    }

    loadSession();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const links = document.querySelectorAll(".navbar .links a, .navbar .links button");
    const joinButton = document.querySelector(".navbar .links #join");

    if (!joinButton) return;

    let computedStyles = window.getComputedStyle(joinButton);
    const primaryPurple = computedStyles.getPropertyValue("--primary-purple");

    const h2 = document.querySelector(".navbar h2");
    computedStyles = window.getComputedStyle(h2);
    const grayText = computedStyles.getPropertyValue("color");

    links.forEach((link) => {
      link.addEventListener("mouseenter", (e) => {
        const img = e.currentTarget.querySelector(".img");
        if (img) img.style.background = primaryPurple;
      });

      link.addEventListener("mouseleave", (e) => {
        const img = e.currentTarget.querySelector(".img");
        if (img) img.style.background = grayText;
      });
    });
  }, [session]);

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
      return;
    }

    navigate("/");
  }

  return (
    <div className="navbar">
      <div className="brand">
        <div className="img" id="pc"></div>
        <h2>PC Build Generator</h2>
      </div>

      <div className="links">
        <Link to="/">
          <div className="img" id="home"></div>
          <span>Home</span>
        </Link>

        <Link to="/build">
          <div className="img" id="build"></div>
          <span>Build Your PC</span>
        </Link>

        {session && (
        <Link to="/saved">
            <div className="img" id="save"></div>
            <span>Saved Builds</span>
        </Link>
        )}

        {session ? (
            <button
            id="join"
            className="sign-out-btn"
            type="button"
            onClick={handleSignOut}
            >
            <div className="img" id="join"></div>
            <span>Sign Out</span>
            </button>
        ) : (
            <Link to="/login" id="join" className="join-now">
            <div className="img" id="join"></div>
            <span>Join Now</span>
            </Link>
        )}
      </div>
    </div>
  );
}