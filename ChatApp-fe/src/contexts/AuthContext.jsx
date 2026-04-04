// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    const storedUser = localStorage.getItem('user');

    // Chỉ xử lý khi có đủ dữ liệu
    if (storedToken && storedRole && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setRole(storedRole);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse user from localStorage:', error);
        // Xóa dữ liệu không hợp lệ để tránh lỗi lần sau
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = (tokenData, roleData, userData) => {
    setToken(tokenData);
    setRole(roleData);
    setUser(userData);
    setIsAuthenticated(true);

    localStorage.setItem('token', tokenData);
    localStorage.setItem('role', roleData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUser(null);
    setIsAuthenticated(false);

    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    token,
    role,
    isAuthenticated,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};