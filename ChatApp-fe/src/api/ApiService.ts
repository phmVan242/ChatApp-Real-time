import axios from "axios";

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

export interface PageResponse<T> {
  content: T[];
  totalPages?: number;
  totalElements?: number;
}

export interface MessageResponse {
  id: number;
  content: string;
  type: string;
  senderId: number;
  senderName: string;
  senderAvatar?: string;
  createdAt: string;
  isDeleted: boolean;
  replyToId?: number;
  attachmentUrl?: string;
}

export interface MessagePageResponse {
  messages: MessageResponse[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
}

export interface SendMessageRequest {
  content: string;
  type?: string;
}

export default class ApiService {
  static BASE_URL = "http://localhost:8080";

  // Auth
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

  // Users
  static async getUserById(id: number): Promise<UserResponse> {
    const response = await axiosClient.get<UserResponse>(`/api/users/${id}`);
    return response.data;
  }

  // Rooms
  static async getRooms(page = 0, size = 20): Promise<PageResponse<RoomResponse>> {
    const response = await axiosClient.get<PageResponse<RoomResponse>>("/api/rooms", {
      params: { page, size },
    });
    return response.data;
  }

  static async getRoomById(roomId: number): Promise<RoomResponse> {
    const response = await axiosClient.get<RoomResponse>(`/api/rooms/${roomId}`);
    return response.data;
  }

  // Messages
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

  // Friendships (nếu cần sau)
  static async sendFriendRequest(userId: number): Promise<void> {
    await axiosClient.post("/api/friends/requests", { addresseeId: userId });
  }

  static async acceptFriendRequest(requestId: number): Promise<void> {
    await axiosClient.put(`/api/friends/requests/${requestId}/accept`);
  }
}