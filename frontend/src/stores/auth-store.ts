import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  token: string | null;
  isLoggedIn: boolean;
  userId: number | null;
};

type Action = {
  signIn: (token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<State & Action>()(
  persist(
    (set) => ({
      token: null,
      isLoggedIn: false,
      userId: null,
      signIn: (token: string) => {
        // Parse the JWT token to get the user ID
        const tokenPayload = token.split(".")[1];
        const decodedPayload = JSON.parse(atob(tokenPayload));
        const userId = parseInt(decodedPayload.sub, 10);
        set({ token, isLoggedIn: true, userId });
      },
      logout: () => {
        set({ token: null, isLoggedIn: false, userId: null });
      },
    }),
    { name: "session" }
  )
);
