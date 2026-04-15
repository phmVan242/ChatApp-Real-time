import axios from "axios";

// Cấu hình axios client với interceptor tự động gắn token
const axiosClient = axios.create({
  baseURL: "http://localhost:8080",
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers["Content-Type"] = "application/json";
  return config;
});

// ========== Các interface dữ liệu ==========
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterRequest {
  displayName?: string;
  username: string;
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  status: string;
  role: string;
  lastSeen?: string;
  createdAt: string;
}

export interface RoomResponse {
  id: number;
  name?: string | null;
  description?: string | null;
  avatarUrl?: string | null;
  type: "PRIVATE" | "GROUP";
  createdBy: {
    id: number;
    username: string;
    displayName: string;
    avatarUrl?: string | null;
  };
  createdAt: string;
}
export interface PageResponse<T> {
  content: T[];
  totalPages?: number;
  totalElements?: number;
  // thêm các trường phân trang khác nếu cần
}

// ========== API Service ==========
export default class ApiService {
  static BASE_URL = "http://localhost:8080";

  // Login – trả về toàn bộ response (để lấy token)
  static async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await axiosClient.post<LoginResponse>("/api/auth/login", data);
    return response.data;
  }

  // Register – gửi object { displayName, username, email, password }
  static async register(data: RegisterRequest): Promise<void> {
    await axiosClient.post("/api/auth/register", data);
  }

  // Lấy thông tin user hiện tại (token đã được gắn tự động)
  static async getMyInfo(): Promise<UserResponse> {
    const response = await axiosClient.get<UserResponse>("/api/users/my-infor");
    return response.data;
  }
    static async getRooms(page = 0, size = 20): Promise<PageResponse<RoomResponse>> {
    const response = await axiosClient.get<PageResponse<RoomResponse>>("/api/rooms", {
      params: { page, size },
    });
    return response.data;
  }
}