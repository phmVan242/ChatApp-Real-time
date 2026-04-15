import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import ApiService, { UserResponse } from '../api/ApiService';

interface AuthContextType {
  user: UserResponse | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (data: { displayName?: string; username: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const userData = await ApiService.getMyInfo();
        setUser(userData);
      } catch (error) {
        console.error('Failed to load user info:', error);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await ApiService.login({ username, password });
      const { token } = response;
      if (!token) throw new Error('Invalid response: missing token');
      localStorage.setItem('token', token);
      const userData = await ApiService.getMyInfo();
      setUser(userData);
    } catch (error) {
      console.error('Login error:', error);
      throw error; // ném lỗi để component xử lý
    }
  };

  const register = async (data: { displayName?: string; username: string; email: string; password: string }) => {
    await ApiService.register(data);
    // Không tự động login, để user đăng nhập thủ công
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = { user, loading, login, register, logout, isAuthenticated: !!user };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};