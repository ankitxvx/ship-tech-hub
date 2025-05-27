
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { getFromLocalStorage, saveToLocalStorage } from '../utils/localStorageUtils';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: User[] = [
  { id: "1", role: "Admin", email: "admin@entnt.in", password: "admin123", name: "Admin User" },
  { id: "2", role: "Inspector", email: "inspector@entnt.in", password: "inspect123", name: "Inspector User" },
  { id: "3", role: "Engineer", email: "engineer@entnt.in", password: "engine123", name: "Engineer User" }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Initialize mock data on first load
    if (!getFromLocalStorage('users')) {
      saveToLocalStorage('users', mockUsers);
    }

    // Check for existing session
    const savedUser = getFromLocalStorage('currentUser');
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const users = getFromLocalStorage('users') || mockUsers;
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userSession = { ...foundUser };
      delete userSession.password; // Don't store password in session
      setUser(userSession);
      saveToLocalStorage('currentUser', userSession);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
