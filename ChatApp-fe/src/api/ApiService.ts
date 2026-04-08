import axios, { AxiosResponse } from "axios";

interface LoginResponse {
  token: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  displayName?: string; // tuỳ chọn
}

export default class ApiService {
  static BASE_URL: string = "http://localhost:8080/api";

  static getHeader(): { headers: { Authorization: string; "Content-Type": string } } {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  }

  /* ================= AUTH ================= */

  // Login - trả về toàn bộ response (có .data)
  static async login(username: string, password: string): Promise<AxiosResponse<LoginResponse>> {
    const response = await axios.post<LoginResponse>(`${this.BASE_URL}/auth/login`, {
      username,
      password,
    });
    return response;
  }

  // Register - trả về toàn bộ response
  static async register(userData: RegisterData): Promise<AxiosResponse<any>> {
    const response = await axios.post(`${this.BASE_URL}/auth/register`, userData);
    return response;
  }
}