import axios from "axios";

export default class ApiService {
  static BASE_URL = "http://localhost:8080/api";

  static getHeader() {
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
  static async login(username, password) {
    const response = await axios.post(`${this.BASE_URL}/auth/login`, {
      username,
      password,
    });
    return response; // trả về response object { data, status, ... }
  }

  // Register - trả về toàn bộ response
  static async register(userData) {
    const response = await axios.post(`${this.BASE_URL}/auth/register`, userData);
    return response;
  }
}