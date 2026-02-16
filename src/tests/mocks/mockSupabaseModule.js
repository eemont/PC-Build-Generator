import { vi } from "vitest";

// Create a single mock supabase object
export const supabaseMock = {
  auth: {
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(),
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
  },
  from: vi.fn(() => ({
    insert: vi.fn(),
    select: vi.fn(),
    delete: vi.fn(),
    update: vi.fn(),
    eq: vi.fn(),
    order: vi.fn(),
    single: vi.fn(),
  })),
};

// Default: onAuthStateChange should return an unsubscribe shape
supabaseMock.auth.onAuthStateChange.mockReturnValue({
  data: { subscription: { unsubscribe: vi.fn() } },
});

// IMPORTANT: mock your real supabase client module path
// Change this path to match where YOU export `supabase` from.
vi.mock("../../lib/supabaseClient", () => {
  return { supabase: supabaseMock };
});
