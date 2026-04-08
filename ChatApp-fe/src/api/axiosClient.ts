import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from "axios";

const axiosClient: AxiosInstance = axios.create({
  baseURL: "http://localhost:8080",
});

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

export default axiosClient;