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
}, (error) => {    return Promise.reject(error);
});