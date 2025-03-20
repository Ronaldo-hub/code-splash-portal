
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface BetaAccessContextType {
  hasBetaAccess: boolean;
  grantBetaAccess: (password: string) => boolean;
  revokeBetaAccess: () => void;
}

const BetaAccessContext = createContext<BetaAccessContextType | undefined>(undefined);

// This would normally be stored securely in an environment variable or backend
const BETA_PASSWORD = "quantum2024";

export const BetaAccessProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [hasBetaAccess, setHasBetaAccess] = useState<boolean>(false);
  
  // Check local storage on initial load
  useEffect(() => {
    const storedAccess = localStorage.getItem("betaAccess");
    if (storedAccess === "granted") {
      setHasBetaAccess(true);
    }
  }, []);

  const grantBetaAccess = (password: string): boolean => {
    if (password === BETA_PASSWORD) {
      setHasBetaAccess(true);
      localStorage.setItem("betaAccess", "granted");
      return true;
    }
    return false;
  };

  const revokeBetaAccess = () => {
    setHasBetaAccess(false);
    localStorage.removeItem("betaAccess");
  };

  return (
    <BetaAccessContext.Provider value={{ hasBetaAccess, grantBetaAccess, revokeBetaAccess }}>
      {children}
    </BetaAccessContext.Provider>
  );
};

export const useBetaAccess = (): BetaAccessContextType => {
  const context = useContext(BetaAccessContext);
  if (context === undefined) {
    throw new Error("useBetaAccess must be used within a BetaAccessProvider");
  }
  return context;
};
