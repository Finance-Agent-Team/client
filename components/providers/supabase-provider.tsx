"use client";

import { createContext, useContext, ReactNode } from "react";

const SupabaseContext = createContext({});

export function useSupabase() {
  return useContext(SupabaseContext);
}

export function SupabaseProvider({ children }: { children: ReactNode }) {
  // Mock provider - replace with actual Supabase client when ready
  const mockSupabase = {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
    },
  };

  return (
    <SupabaseContext.Provider value={mockSupabase}>
      {children}
    </SupabaseContext.Provider>
  );
}
