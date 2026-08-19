import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  loading: boolean;
  login: (email: string, name?: string) => Promise<void>;
  register: (data: { name: string; email: string; role?: UserRole; phone?: string; street?: string; city?: string; state?: string; zipCode?: string }) => Promise<void>;
  updateProfile: (data: { name?: string; email?: string; phone?: string; street?: string; city?: string; state?: string; zipCode?: string; country?: string }) => Promise<void>;
  switchRole: (role: UserRole, userId?: string) => Promise<void>;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalTab: 'login' | 'register' | 'profile';
  setAuthModalTab: (tab: 'login' | 'register' | 'profile') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register' | 'profile'>('login');

  const fetchUser = async () => {
    try {
      setLoading(true);
      const u = await api.getCurrentUser();
      setUser(u);
    } catch (err) {
      console.error('Failed to load user:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email: string, name?: string) => {
    setLoading(true);
    try {
      const u = await api.login(email, name);
      setUser(u);
      setIsAuthModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: { name?: string; email?: string; phone?: string; street?: string; city?: string; state?: string; zipCode?: string; country?: string }) => {
    setLoading(true);
    try {
      const u = await api.updateProfile(data);
      setUser(u);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: { name: string; email: string; role?: UserRole; phone?: string; street?: string; city?: string; state?: string; zipCode?: string }) => {
    setLoading(true);
    try {
      const u = await api.register(data);
      setUser(u);
      setIsAuthModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const switchRole = async (targetRole: UserRole, targetUserId?: string) => {
    setLoading(true);
    try {
      const u = await api.switchRole(targetRole, targetUserId);
      setUser(u);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('shopzone_user_id');
    localStorage.removeItem('shopnova_user_id');
    switchRole('customer');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'customer',
        loading,
        login,
        register,
        updateProfile,
        switchRole,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
