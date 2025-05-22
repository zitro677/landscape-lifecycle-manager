
import { createContext } from "react";
import { Session, User } from "@supabase/supabase-js";

export interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);
