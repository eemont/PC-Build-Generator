import { supabase } from "./supabaseClient";

// Sign up (docs: supabase.auth.signUp)
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

// Sign in (docs: supabase.auth.signInWithPassword)
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

// Magic link (docs: supabase.auth.signInWithOtp)
export async function signInWithMagicLink(email) {
  const { data, error } = await supabase.auth.signInWithOtp({ email });
  if (error) throw error;
  return data;
}

// OAuth (docs: supabase.auth.signInWithOAuth)
export async function signInWithGithub() {
  const { data, error } = await supabase.auth.signInWithOAuth({ provider: "github" });
  if (error) throw error;
  return data;
}

// Get user (docs: supabase.auth.getUser)
export async function getUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
}

// Reset password email (docs: resetPasswordForEmail)
export async function resetPassword(email) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + "/reset",
  });
  if (error) throw error;
  return data;
}

// Log out (docs: signOut)
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
