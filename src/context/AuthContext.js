import { createContext } from "react";

export const AuthContext = createContext({ session: null, loading: false });