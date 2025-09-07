"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface ActiveContextType {
  active: boolean;
  setActive: (active: boolean) => void;
}

const ActiveContext = createContext<ActiveContextType | undefined>(undefined);

export function ActiveProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(true);

  return (
    <ActiveContext.Provider value={{ active, setActive }}>
      {children}
    </ActiveContext.Provider>
  );
}

export function useActive() {
  const context = useContext(ActiveContext);
  if (context === undefined) {
    throw new Error("useActive must be used within an ActiveProvider");
  }
  return context;
}
