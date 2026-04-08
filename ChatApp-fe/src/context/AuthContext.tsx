import { createContext, useState, useEffect, useContext, ReactNode } from "react";


interface User {
  name: string;
  email: string;
  role?: string;
  displayName?: string;
  avatarUrl?: string;
}

// Kiểu dữ liệu của Context
interface AuthContextType {
  user: User | null;
  token: string | null;
  role: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (tokenData: string, roleData: string, userData: User) => void;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
}

// Props cho AuthProvider (children)
interface AuthProviderProps {
  children: ReactNode;
}

// ========== Khởi tạo Context ==========
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ========== Custom hook sử dụng AuthContext ==========
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// ========== Provider Component ==========
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Load dữ liệu từ localStorage khi app khởi động
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedRole && storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setToken(storedToken);
        setRole(storedRole);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // Đăng nhập
  const login = (tokenData: string, roleData: string, userData: User) => {
    setToken(tokenData);
    setRole(roleData);
    setUser(userData);
    setIsAuthenticated(true);

    localStorage.setItem("token", tokenData);
    localStorage.setItem("role", roleData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Đăng xuất
  const logout = () => {
    setToken(null);
    setRole(null);
    setUser(null);
    setIsAuthenticated(false);

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
  };

  // Cập nhật thông tin user
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const value: AuthContextType = {
    user,
    token,
    role,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Export context để sử dụng trực tiếp (nếu cần), nhưng khuyến khích dùng useAuth
export { AuthContext };