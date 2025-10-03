"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface ActiveContextType {
  active: boolean;
  setActive: (active: boolean) => void;
}

const ActiveContext = createContext<ActiveContextType | undefined>(undefined);

export function ActiveProvider({ children }: { children: ReactNode }) {
  const [active, setActiveState] = useState(true);

  const setActive = (value: boolean) => {
    console.log("setActive called with:", value);
    console.trace("Stack trace:");
    setActiveState(value);
  };

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
