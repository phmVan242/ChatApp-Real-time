import axios from "axios";

/**
 * Mặc định gọi cùng origin (""), để dev server proxy /api → backend.
 * Nhờ vậy app chạy được trên localhost, IP LAN, domain preview hay ngrok
 * mà không cần sửa code và không vướng CORS.
 *
 * Chỉ set VITE_API_BASE_URL khi muốn trình duyệt gọi thẳng backend
 * (khi đó backend phải cho phép origin của FE trong CORS_ALLOWED_ORIGINS).
 */
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/+$/, "");

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers["Content-Type"] = "application/json";
  return config;
});

// ========== Interfaces ==========
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

export interface UserBasicInfo {
  id: number;
  username: string;
  displayName: string;
  avatarUrl?: string | null;
}

export interface RoomResponse {
  id: number;
  name?: string | null;
  description?: string | null;
  avatarUrl?: string | null;
  type: "PRIVATE" | "GROUP";
  createdBy: UserBasicInfo;
  createdAt: string;
  members: UserBasicInfo[];
}

export interface MessageResponse {
  id: number;
  roomId: number;
  sender: UserResponse;
  content: string;
  type: string;
  attachmentUrl?: string | null;
  isDeleted: boolean;
  replyToId?: number | null;
  replyToContent?: string | null;
  createdAt: string;
}

export interface MessagePageResponse {
  messages: MessageResponse[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
}

export interface PageResponse<T> {
  content: T[];
  totalPages?: number;
  totalElements?: number;
}

// ========== API Service ==========
export default class ApiService {
  /** Base URL đang dùng ("" = qua proxy cùng origin) */
  static BASE_URL = API_BASE_URL;

  static async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await axiosClient.post<LoginResponse>("/api/auth/login", data);
    return response.data;
  }

  static async register(data: RegisterRequest): Promise<void> {
    await axiosClient.post("/api/auth/register", data);
  }

  static async getMyInfo(): Promise<UserResponse> {
    const response = await axiosClient.get<UserResponse>("/api/users/my-infor");
    return response.data;
  }

  static async getAllUsers(): Promise<UserResponse[]> {
    const response = await axiosClient.get<UserResponse[]>("/api/users");
    return response.data;
  }

  static async getUserById(id: number): Promise<UserResponse> {
    const response = await axiosClient.get<UserResponse>(`/api/users/${id}`);
    return response.data;
  }

  static async getRooms(page = 0, size = 20): Promise<Page<RoomResponse>> {
    const response = await axiosClient.get<Page<RoomResponse>>("/api/rooms", {
      params: { page, size, sort: "createdAt", direction: "desc" },
    });
    return response.data;
  }

  static async createPrivateRoom(otherUserId: number): Promise<RoomResponse> {
    const response = await axiosClient.post<RoomResponse>(`/api/rooms/private?otherUserId=${otherUserId}`);
    return response.data;
  }

  static async getMessages(roomId: number, page = 0, size = 30): Promise<MessagePageResponse> {
    const response = await axiosClient.get<MessagePageResponse>(`/api/rooms/${roomId}/messages`, {
      params: { page, size },
    });
    return response.data;
  }

  static async deleteMessage(roomId: number, messageId: number): Promise<void> {
    await axiosClient.delete(`/api/rooms/${roomId}/messages/${messageId}`);
  }

  static async editMessage(roomId: number, messageId: number, content: string): Promise<MessageResponse> {
    const response = await axiosClient.put<MessageResponse>(`/api/rooms/${roomId}/messages/${messageId}`, { content });
    return response.data;
  }

  static async markAsRead(roomId: number, messageId: number): Promise<void> {
    await axiosClient.put(`/api/rooms/${roomId}/messages/${messageId}/read`);
  }

  static async updateProfile(userId: number, data: Partial<UserResponse>): Promise<UserResponse> {
    const response = await axiosClient.put<UserResponse>(`/api/users/${userId}`, data);
    return response.data;
  }
}

interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  last: boolean;
  first: boolean;
  empty: boolean;
}
