import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

<<<<<<< HEAD
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: true,
  },
  define: {
    global: "globalThis",
  },
  optimizeDeps: {
    include: ["sockjs-client"],
  },
=======
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Đọc cả biến không có prefix VITE_ (VITE_BACKEND_URL chỉ dùng phía server,
  // không bị nhúng vào bundle trình duyệt).
  const env = loadEnv(mode, ".", "");

  // Backend mà dev server sẽ proxy /api và /ws tới.
  // Đổi bằng cách set VITE_BACKEND_URL trong .env.local — ví dụ:
  //   VITE_BACKEND_URL=https://abc123.ngrok-free.app   (backend chạy máy khác)
  //   VITE_BACKEND_URL=http://192.168.1.20:8080        (backend trong LAN)
  const backendUrl = env.VITE_BACKEND_URL || "http://localhost:8080";

  const proxy = {
    target: backendUrl,
    changeOrigin: true,
    secure: false, // cho phép backend https tự ký (ngrok/dev tunnel)
  };

  return {
    plugins: [
      react(),
      svgr({
        svgrOptions: {
          icon: true,
          exportType: "named",
          namedExport: "ReactComponent",
        },
      }),
    ],
    server: {
      host: "0.0.0.0",
      port: 5173,
      // Cho phép mọi Host header (preview domain, ngrok, IP LAN...)
      allowedHosts: true,
      // Nhờ proxy này, trình duyệt chỉ nói chuyện với origin hiện tại →
      // không cần CORS, không hardcode localhost, chạy được sau reverse proxy.
      proxy: {
        "/api": proxy,
        "/ws": { ...proxy, ws: true }, // SockJS/STOMP cần nâng cấp WebSocket
      },
    },
    preview: {
      host: "0.0.0.0",
      port: 4173,
      allowedHosts: true,
      proxy: {
        "/api": proxy,
        "/ws": { ...proxy, ws: true },
      },
    },
  };
>>>>>>> origin/arena/cee4dfe9-chatapp-real-time
});
