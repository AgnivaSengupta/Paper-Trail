import type { User } from "./domain";

export interface AuthStoreState {
  user: User | null;
  isCheckingAuth: boolean;
  authFormOpen: boolean;
  setAuthFormOpen: (val: boolean) => void;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
  logout: () => void;
}
