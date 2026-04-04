import axios from "axios";

export default class ApiService {
    static baseURL = "http://localhost:8080/api";

    static getHeaders() {
        const token = localStorage.getItem("token");
        return {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        };
    }

    // Thêm method login
    static async login(username, password) {
        const response = await axios.post(`${this.baseURL}/auth/login`, {
            username,
            password,
        });
        return response; // trả về response object có dạng { data: { token, ... }, status, ... }
    }
}