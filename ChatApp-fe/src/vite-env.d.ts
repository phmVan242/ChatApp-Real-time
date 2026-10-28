/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Gọi thẳng backend (bỏ trống = dùng proxy cùng origin, khuyến nghị) */
  readonly VITE_API_BASE_URL?: string;
  /** Endpoint SockJS/STOMP (mặc định "/ws" — đi qua proxy của dev server) */
  readonly VITE_WS_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
