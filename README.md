# ChatApp Real-time

Ứng dụng chat real-time: **Spring Boot (Java 21) + MySQL + JWT + STOMP/WebSocket** và **React 19 + Vite + TypeScript**.

```
.
├── ChatApp/      Backend  — Spring Boot 4, REST + WebSocket (SockJS/STOMP)
└── ChatApp-fe/   Frontend — React 19 + Vite 6 + Tailwind 4
```

## Kiến trúc kết nối (quan trọng)

Frontend **không** gọi cứng `http://localhost:8080`. Trình duyệt luôn gọi **cùng origin** (`/api`, `/ws`), dev server Vite đứng giữa proxy sang backend:

```
Trình duyệt ──► http(s)://<bất kỳ host nào>:5173 ──┬─ /api  ──► http://backend:8080
   (localhost, IP LAN, preview domain, ngrok…)     └─ /ws   ──► http://backend:8080 (WebSocket upgrade)
```

Lợi ích:

- Chạy được trên **mọi host** (localhost, `192.168.x.x`, domain preview, tunnel) mà không sửa code.
- **Không vướng CORS** vì request là same-origin; không cần khai báo origin ở backend.
- WebSocket/SockJS cũng đi qua proxy nên không cần URL tuyệt đối.

## Chạy backend

```bash
cd ChatApp
cp .env.example .env        # điền DB_* và (nên) JWT_SECRET
./mvnw spring-boot:run      # http://localhost:8080
```

Cần MySQL đang chạy; database được tạo tự động (`createDatabaseIfNotExist=true`).

CORS/WebSocket origin được cấu hình bằng một property duy nhất:

```properties
# ChatApp/.env
CORS_ALLOWED_ORIGINS=*                            # dev
# CORS_ALLOWED_ORIGINS=https://chat.example.com   # production
```

| Biến | Ý nghĩa |
|---|---|
| `CORS_ALLOWED_ORIGINS` | Danh sách origin pattern (phân tách bằng `,`), dùng cho cả REST và WebSocket. Hỗ trợ wildcard `https://*.vercel.app`. `*` = mọi origin. |

## Chạy frontend

```bash
cd ChatApp-fe
npm install
cp .env.example .env.local   # chọn backend đích cho proxy
npm run dev                  # http://localhost:5173
```

| Biến (`.env.local`) | Mặc định | Ý nghĩa |
|---|---|---|
| `VITE_BACKEND_URL` | `http://localhost:8080` | Đích proxy của `/api` + `/ws` (chỉ dùng phía server, không lộ ra bundle) |
| `VITE_API_BASE_URL` | *(rỗng)* | Chỉ set khi muốn trình duyệt gọi thẳng backend (khi đó backend phải khai báo origin trong `CORS_ALLOWED_ORIGINS`) |
| `VITE_WS_URL` | `/ws` | Endpoint SockJS/STOMP |

Ví dụ backend chạy ở máy khác:

```bash
# ChatApp-fe/.env.local
VITE_BACKEND_URL=http://192.168.1.20:8080   # LAN
# VITE_BACKEND_URL=https://abc123.ngrok-free.app
```

## Build production

```bash
cd ChatApp-fe && npm run build   # ra ChatApp-fe/dist
```

Khi deploy tĩnh, reverse proxy (Nginx/Caddy) cần chuyển tiếp:

```nginx
location /api { proxy_pass http://backend:8080; }
location /ws  { proxy_pass http://backend:8080; proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade"; }
```

`npm run preview` cũng đã cấu hình sẵn proxy tương tự `npm run dev` để test bản build.

## API chính

| Nhóm | Endpoint |
|---|---|
| Auth | `POST /api/auth/register`, `POST /api/auth/login` |
| Users | `GET /api/users`, `GET /api/users/{id}`, `GET /api/users/my-infor`, `PUT /api/users/{id}` |
| Rooms | `POST /api/rooms/private`, `GET /api/rooms`, `GET/PUT/DELETE /api/rooms/{id}` |
| Messages | WS `/app/chat.send/{roomId}`, REST `GET/PUT/DELETE /api/rooms/{roomId}/messages[/{id}]` |
| Friends | `POST /api/friends/requests`, `PUT .../{id}/accept`, `GET /api/friends` |
| Notifications | `GET /api/notifications`, `GET .../unread/count`, `PUT .../{id}/read` |

WebSocket: handshake `/ws` (SockJS), server broadcast `/topic/room/{roomId}`, thông báo riêng `/user/queue/notifications`.
