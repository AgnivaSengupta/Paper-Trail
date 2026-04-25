import type { User } from "./domain";

type AuthType = "signup" | "signin";

export interface AuthStoreState {
  user: User | null;
  isCheckingAuth: boolean;
  authFormOpen: boolean;
  authType: AuthType;
  setAuthType: (val: AuthType) => void;
  setAuthFormOpen: (val: boolean) => void;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
  logout: () => void;
}
