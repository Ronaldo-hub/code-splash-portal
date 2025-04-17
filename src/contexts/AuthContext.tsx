
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

interface User {
  email: string;
  name: string;
}

// Default credentials for demo purposes
const DEMO_USER = {
  email: "admin@khoisanvoice.org",
  password: "KhoisanVoice2025!", // In a real app, this would not be hardcoded
  name: "Admin User"
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  // Check if user is logged in on component mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('khoisanAuth');
    if (storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth);
        setIsAuthenticated(true);
        setUser(parsedAuth.user);
      } catch (error) {
        console.error('Failed to parse stored auth data:', error);
        localStorage.removeItem('khoisanAuth');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real application, you would make an API call to verify credentials
    // For demo purposes, we're using a hardcoded credential check
    if (email === DEMO_USER.email && password === DEMO_USER.password) {
      const userData = {
        email: DEMO_USER.email,
        name: DEMO_USER.name
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      
      // Store auth state in localStorage
      localStorage.setItem('khoisanAuth', JSON.stringify({
        user: userData
      }));
      
      toast.success("Login successful");
      return true;
    } else {
      toast.error("Invalid credentials");
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('khoisanAuth');
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
