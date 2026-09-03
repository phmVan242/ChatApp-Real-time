# PROJECT_CONTEXT.md — ChatAppRealtime

## 1. Tổng Quan Dự Án

| Thuộc tính          | Chi tiết |
| ------------------- | -------- |
| Tên dự án           | ChatAppRealtime |
| Loại dự án          | Full-stack Web Application — Ứng dụng nhắn tin thời gian thực |
| Mục tiêu            | Xây dựng hệ thống chat realtime hỗ trợ chat 1-1 (private) và nhóm (group), bạn bè, thông báo |
| Bài toán giải quyết | Nhắn tin tức thì giữa người dùng, quản lý phòng chat, kết bạn, thông báo realtime |
| Đối tượng sử dụng   | Người dùng cuối (USER), quản trị viên (ADMIN) |
| Trạng thái          | Đang phát triển — Backend hoàn chỉnh, Frontend đang hoàn thiện UI |

Dự án gồm hai phần tách biệt:

- **ChatApp** (Backend): Spring Boot 4.0.5, Java 21, cung cấp REST API và WebSocket endpoint.
- **ChatApp-fe** (Frontend): React 19 + TypeScript + Vite + TailwindCSS, giao diện người dùng.

Backend đã implement đầy đủ các tính năng: auth, rooms, messages (CRUD + realtime), friendship, notifications. Frontend đang được phát triển, hiện tại chỉ tập trung vào màn hình chat (ChatWindow/ChatBox) và sidebar hiển thị danh sách phòng.

---

## 2. Kiến Trúc Hệ Thống

```
Người dùng (Browser)
        │
        ├─── HTTP (REST)  ──────────────────────────────► Spring Boot API
        │    (axios / ApiService.ts)                      /api/auth/**
        │                                                 /api/users/**
        │                                                 /api/rooms/**
        │                                                 /api/friends/**
        │                                                 /api/notifications/**
        │
        └─── WebSocket (STOMP/SockJS) ──────────────────► Spring WebSocket Broker
             (websocket.ts / @stomp/stompjs)              /ws endpoint
                                                          /app/chat.send/{roomId}
                                                          /topic/room/{roomId}
                                                                │
                                                                ▼
                                                         MySQL Database
                                                         (JPA / Hibernate)
```

### Thành phần:

- **Frontend**: React 19, TypeScript, TailwindCSS 4, Vite 6. Build thành SPA. Chạy tại `http://localhost:5173`.
- **Backend**: Spring Boot 4.0.5 (Java 21). REST + WebSocket. Chạy tại `http://localhost:8080`.
- **Database**: MySQL. Auto-create/update schema qua `spring.jpa.hibernate.ddl-auto=update`. DB mặc định `chatapp`.
- **Authentication**: Stateless JWT (HS256, secret key hardcoded `MySuperSecretKeyForJWT1234567890`, TTL 86400000ms = 1 ngày). Token lưu trong `localStorage` phía client.
- **Realtime**: Spring WebSocket + STOMP + SockJS (fallback HTTP). In-memory broker (không dùng RabbitMQ/Kafka). Topic pattern: `/topic/room/{roomId}`.
- **Cache**: Không có — chưa implement.
- **Queue**: Không có — chưa implement.
- **Storage (file/media)**: Chưa implement — entity có trường `attachmentUrl` và `avatarUrl` nhưng chưa có service upload file.
- **AI/ML**: Không có.

---

## 3. Công Nghệ Sử Dụng

### Backend

| Công nghệ | Phiên bản | Mục đích |
| --------- | --------- | -------- |
| Java | 21 | Ngôn ngữ chính |
| Spring Boot | 4.0.5 | Framework chính |
| Spring Web MVC | (boot parent) | REST API |
| Spring WebSocket | (boot parent) | WebSocket + STOMP |
| Spring Security | (boot parent) | Authentication filter chain |
| Spring Data JPA | (boot parent) | ORM, repository pattern |
| Spring Validation | (boot parent) | Validate request body |
| Hibernate | (jpa parent) | JPA implementation, DDL auto-update |
| MySQL Connector/J | (runtime) | Driver kết nối MySQL |
| JJWT | 0.11.5 | JWT generate/validate/parse |
| Lombok | (optional) | Giảm boilerplate (getter/setter/builder) |
| spring-dotenv | 4.0.0 | Load biến môi trường từ `.env` |
| Maven | 3.x | Build tool |

### Frontend

| Công nghệ | Phiên bản | Mục đích |
| --------- | --------- | -------- |
| React | 19.0.0 | UI framework |
| TypeScript | ~5.7.2 | Type safety |
| Vite | 6.1.0 | Dev server, bundler |
| TailwindCSS | 4.0.8 | Utility-first CSS |
| React Router DOM | 7.14.1 | Client-side routing |
| Axios | 1.15.0 | HTTP client |
| @stomp/stompjs | 7.3.0 | STOMP over WebSocket |
| sockjs-client | 1.6.1 | SockJS fallback transport |
| jwt-decode | 4.0.0 | Decode JWT token phía client |
| date-fns | 4.4.0 | Format ngày giờ |
| lucide-react | 1.17.0 | Icon library |
| react-icons | 5.6.0 | Icon bộ Feather Icons, Bootstrap Icons |
| clsx + tailwind-merge | latest | Conditional CSS class |
| react-dropzone | 14.3.5 | Upload file UI |
| apexcharts + react-apexcharts | 4.1.0 | Chart (dashboard — hiện đang bị comment) |
| @fullcalendar/* | 6.1.15 | Calendar (hiện đang bị comment) |

### Database

| Thành phần | Chi tiết |
| ---------- | -------- |
| DBMS | MySQL (bất kỳ phiên bản tương thích) |
| Schema | Auto-generated bởi Hibernate DDL update |
| Connection | `jdbc:mysql://localhost:3306/chatapp?allowPublicKeyRetrieval=true&useSSL=false&createDatabaseIfNotExist=true` |

### DevOps / Tooling

| Thành phần | Chi tiết |
| ---------- | -------- |
| Build Backend | Maven Wrapper (`./mvnw`) |
| Build Frontend | Vite (`npm run dev` / `npm run build`) |
| Environment Config | `.env` file (backend: spring-dotenv) |
| IDE | IntelliJ IDEA (có file `.idea/`) |
| VCS | Git (có `.git/`) |

---

## 4. Cấu Trúc Thư Mục

```
ChatAppRealtime/
├── ChatApp/                          # Backend (Spring Boot)
│   ├── .env                          # Biến môi trường (DB, JWT, server port)
│   ├── pom.xml                       # Maven build config + dependencies
│   ├── src/main/java/com/example/ChatApp/
│   │   ├── ChatAppApplication.java   # Entry point @SpringBootApplication
│   │   ├── config/
│   │   │   ├── CorsConfig.java       # CORS configuration (allowedOriginPatterns=*)
│   │   │   ├── JwtAccessDeniedHandler.java   # 403 handler
│   │   │   ├── JwtAuthEntryPoint.java         # 401 handler
│   │   │   ├── SecurityConfig.java            # Spring Security filter chain
│   │   │   └── WebSocketConfig.java           # STOMP broker + JWT interceptor
│   │   ├── controller/
│   │   │   ├── AuthController.java            # POST /api/auth/register, /login
│   │   │   ├── FriendshipController.java      # /api/friends/**
│   │   │   ├── MessageController.java         # WebSocket @MessageMapping + REST /api/rooms/{id}/messages/**
│   │   │   ├── NotificationController.java    # /api/notifications/**
│   │   │   ├── RoomController.java            # /api/rooms/**
│   │   │   └── UserController.java            # /api/users/**
│   │   ├── dto/
│   │   │   ├── Dtos.java                      # Tập hợp nhiều DTO misc
│   │   │   ├── ErrorResponse.java
│   │   │   ├── message/
│   │   │   │   ├── EditMessageRequest.java
│   │   │   │   ├── MessagePageResponse.java
│   │   │   │   ├── MessageResponse.java
│   │   │   │   └── SendMessageRequest.java
│   │   │   ├── notification/
│   │   │   │   ├── CreateNotificationRequest.java
│   │   │   │   └── NotificationResponse.java
│   │   │   ├── room/
│   │   │   │   ├── AddMemberRequest.java
│   │   │   │   ├── RoomMemberResponse.java
│   │   │   │   ├── RoomRequest.java
│   │   │   │   ├── RoomResponse.java
│   │   │   │   ├── UpdateMemberRoleRequest.java
│   │   │   │   └── UpdateRoomRequest.java
│   │   │   └── user/
│   │   │       ├── FriendRequest.java
│   │   │       ├── FriendRequestResponse.java
│   │   │       ├── FriendshipResponse.java
│   │   │       ├── LoginRequest.java
│   │   │       ├── RegisterRequest.java
│   │   │       ├── UserBasicInfo.java
│   │   │       └── UserResponse.java
│   │   ├── entity/
│   │   │   ├── User.java
│   │   │   ├── Room.java
│   │   │   ├── RoomMember.java
│   │   │   ├── Message.java
│   │   │   ├── Friendship.java
│   │   │   ├── Notification.java
│   │   │   └── enums/
│   │   │       ├── FriendshipStatus.java   (PENDING, DECLINED, ACCEPTED, BLOCKED)
│   │   │       ├── MemberRole.java         (OWNER, ADMIN, MEMBER)
│   │   │       ├── MessageType.java        (TEXT, IMAGE, FILE, JOIN, LEAVE)
│   │   │       ├── NotificationType.java   (FRIEND_REQUEST, FRIEND_ACCEPTED, MESSAGE, ROOM_INVITE, SYSTEM)
│   │   │       ├── RoomType.java           (PRIVATE, GROUP)
│   │   │       ├── UserRole.java           (ADMIN, USER)
│   │   │       └── UserStatus.java         (ONLINE, OFFLINE, AWAY, BUSY)
│   │   ├── exception/
│   │   │   └── ResourceNotFoundException.java
│   │   ├── filter/
│   │   │   └── JwtFilter.java             # OncePerRequestFilter — đọc Bearer token từ header HTTP
│   │   ├── mapper/
│   │   │   ├── FriendRequestResponseMapper.java
│   │   │   ├── FriendshipMapper.java
│   │   │   ├── MessageMapper.java
│   │   │   ├── NotificationMapper.java
│   │   │   ├── RoomMapper.java
│   │   │   ├── RoomMemberMapper.java
│   │   │   └── UserMapper.java
│   │   ├── repository/
│   │   │   ├── FriendshipRepository.java
│   │   │   ├── MessageRepository.java
│   │   │   ├── NotificationRepository.java
│   │   │   ├── RoomMemberRepository.java
│   │   │   ├── RoomRepository.java
│   │   │   └── UserRepository.java
│   │   ├── security/
│   │   │   ├── CustomUserDetails.java           # Implement UserDetails, thêm field id (Long)
│   │   │   ├── CustomUserDetailsService.java    # Load user từ DB theo username
│   │   │   └── JwtAuthenticationFilter.java     # Filter thứ 2 (song song JwtFilter — xem lưu ý)
│   │   ├── service/
│   │   │   ├── AuthService.java (interface)
│   │   │   ├── FriendshipService.java (interface)
│   │   │   ├── MessageService.java (interface)
│   │   │   ├── NotificationService.java (interface)
│   │   │   ├── RoomService.java (interface)
│   │   │   ├── UserService.java (interface)
│   │   │   └── impl/
│   │   │       ├── AuthServiceImpl.java
│   │   │       ├── FriendshipServiceImpl.java
│   │   │       ├── MessageServiceImpl.java
│   │   │       ├── NotificationServiceImpl.java
│   │   │       ├── RoomServiceImpl.java
│   │   │       └── UserServiceImpl.java
│   │   ├── util/
│   │   │   ├── JwtUtil.java       # Static utils: generate/validate/extract (dùng cho WS + AuthController)
│   │   │   └── JwtUtils.java      # Bản thứ 2 (trùng lặp — xem lưu ý)
│   │   └── websocket/
│   │       └── NotificationWebSocketSender.java  # Gửi notification realtime qua /user/{username}/queue/notifications
│   └── src/main/resources/
│       └── application.properties               # Config chính, đọc từ .env
│
└── ChatApp-fe/                       # Frontend (React + Vite)
    ├── package.json
    ├── index.html
    ├── src/
    │   ├── main.tsx                   # Entry point ReactDOM.createRoot
    │   ├── App.tsx                    # Router setup, route definitions
    │   ├── index.css                  # Global styles + Tailwind directives
    │   ├── api/
    │   │   └── ApiService.ts          # Axios client + tất cả API call methods
    │   ├── components/
    │   │   ├── avatar/Avatar.tsx
    │   │   ├── btn/ActionBtn.tsx
    │   │   ├── chat/
    │   │   │   ├── ChatHeader.tsx     # Header phòng chat (tên, avatar, search, info panel toggle)
    │   │   │   ├── ChatWindow.tsx     # ★ Component chính của màn hình chat
    │   │   │   ├── InputArea.tsx      # Input gõ + gửi tin nhắn
    │   │   │   └── TypingIndicator.tsx
    │   │   ├── common/
    │   │   │   ├── PageMeta.tsx
    │   │   │   └── ScrollToTop.tsx
    │   │   ├── info-panel/            # Panel thông tin phòng chat (bên phải)
    │   │   │   ├── InfoPanel.tsx
    │   │   │   ├── InfoRow.tsx
    │   │   │   ├── QuickAction.tsx
    │   │   │   ├── Section.tsx
    │   │   │   ├── constants.ts
    │   │   │   └── types.ts
    │   │   └── message/
    │   │       ├── MessageArea.tsx    # Vùng hiển thị danh sách tin nhắn
    │   │       ├── MessageBubble.tsx  # Bubble UI cho từng tin nhắn
    │   │       ├── MessageInput.tsx   # Input gửi tin (dùng trong ChatWindow)
    │   │       ├── MessageInput1.tsx  # Input gửi tin (dùng trong ChatBox — version cũ)
    │   │       ├── MessageItem.tsx    # Item tin nhắn (dùng trong ChatBox — version cũ)
    │   │       └── MessageList.tsx
    │   ├── context/
    │   │   ├── AuthContext.tsx        # ★ Auth state global (user, login, logout, register)
    │   │   ├── SidebarContext.tsx     # Sidebar open/close state
    │   │   └── ThemeContext.tsx       # Dark/light mode
    │   ├── hooks/
    │   │   ├── useChat.ts
    │   │   ├── useChatSocket.ts       # ★ Hook WebSocket: connect/disconnect, nhận/gửi message
    │   │   ├── useGoBack.ts
    │   │   └── useModal.ts
    │   ├── layout/
    │   │   ├── ChatLayout.tsx         # Layout bọc: Sidebar + Outlet
    │   │   ├── Sidebar.tsx            # ★ Sidebar danh sách phòng chat
    │   │   └── SidebarWidget.tsx
    │   ├── pages/
    │   │   ├── AuthPages/
    │   │   │   ├── AuthPageLayout.tsx
    │   │   │   ├── LoginPage.tsx
    │   │   │   └── RegisterPage.tsx
    │   │   ├── Chat/
    │   │   │   └── ChatBox.tsx        # Version cũ của màn hình chat (legacy)
    │   │   └── Dashboard/
    │   │       └── Home.tsx           # Trang chủ (dashboard — hiện rất đơn giản)
    │   ├── services/
    │   │   └── websocket.ts           # ★ Singleton WebSocketService (STOMP client)
    │   ├── types/
    │   │   └── message.ts             # TypeScript types cho message
    │   └── utils/
    │       └── formatTime.ts          # Format timestamp
```

---

## 5. Chức Năng Hệ Thống

### Đã Implement (Backend hoàn chỉnh)

#### 5.1 Xác thực (Auth)

- **Đăng ký** (`POST /api/auth/register`): Tạo user mới, encode password bằng BCrypt. Trả về `UserResponse`.
- **Đăng nhập** (`POST /api/auth/login`): Xác thực username + password, trả về JWT token + userInfo (username, role, userId).

Luồng xử lý đăng nhập:
```
Client → POST /api/auth/login {username, password}
→ AuthController.loginUser()
→ UserRepository.findUserByUsername()
→ BCryptPasswordEncoder.matches()
→ JwtUtil.generateToken(username, role, userId)
→ Response: {token, username, role, userId}
```

Files liên quan: `AuthController.java`, `JwtUtil.java`, `UserRepository.java`

#### 5.2 Quản lý phòng (Room)

- **Tạo phòng 1-1** (`POST /api/rooms/private?otherUserId={id}`): Kiểm tra đã tồn tại phòng PRIVATE giữa hai người chưa, nếu chưa tạo mới. Thêm cả hai làm MEMBER.
- **Lấy thông tin phòng** (`GET /api/rooms/{roomId}`): Trả `RoomResponse` gồm name, type, members.
- **Lấy danh sách phòng của user** (`GET /api/rooms?page=0&size=20&sortBy=createdAt&direction=desc`): Phân trang.
- **Cập nhật thông tin phòng** (`PUT /api/rooms/{roomId}`): Chỉ ADMIN được đổi name, description, avatarUrl.
- **Xóa thành viên** (`DELETE /api/rooms/{roomId}/members/{memberId}`): Chỉ ADMIN/OWNER.
- **Đổi role thành viên** (`PATCH /api/rooms/{roomId}/members/{memberId}/role?role=ADMIN`).
- **Rời phòng** (`POST /api/rooms/{roomId}/leave`).
- **Xóa phòng** (`DELETE /api/rooms/{roomId}`): Chỉ creator.

Files liên quan: `RoomController.java`, `RoomServiceImpl.java`, `RoomRepository.java`, `RoomMemberRepository.java`

#### 5.3 Tin nhắn (Message)

- **Gửi tin nhắn realtime** (WebSocket `SEND /app/chat.send/{roomId}`): Kiểm tra membership, lưu vào DB, broadcast đến `/topic/room/{roomId}`.
- **Join/Leave room** (WebSocket `/app/chat.join/{roomId}`, `/app/chat.leave/{roomId}`): JOIN/LEAVE type KHÔNG lưu DB, KHÔNG broadcast (bị ignore ở service).
- **Lấy lịch sử tin nhắn** (`GET /api/rooms/{roomId}/messages?page=0&size=30`): Chỉ member được xem. Sắp xếp mới nhất trước.
- **Xóa mềm tin nhắn** (`DELETE /api/rooms/{roomId}/messages/{messageId}`): Người gửi hoặc ADMIN hệ thống. `softDelete()` → xóa content + attachmentUrl, set `isDeleted=true`. Broadcast update qua WS.
- **Sửa tin nhắn** (`PUT /api/rooms/{roomId}/messages/{messageId}`): Chỉ người gửi. Cập nhật content + `editedAt`. Broadcast update qua WS.
- **Đánh dấu đã đọc** (`PUT /api/rooms/{roomId}/messages/{messageId}/read`): Cập nhật `lastReadMessage` trong `RoomMember` — chỉ cập nhật nếu message mới hơn lần đọc cuối.

Files liên quan: `MessageController.java`, `MessageServiceImpl.java`, `MessageRepository.java`

#### 5.4 Bạn bè (Friendship)

- **Gửi lời mời** (`POST /api/friends/requests`): Tạo Friendship với status PENDING.
- **Chấp nhận** (`PUT /api/friends/requests/{id}/accept`): Đổi status → ACCEPTED, tự động tạo phòng PRIVATE.
- **Từ chối** (`PUT /api/friends/requests/{id}/decline`): Đổi status → DECLINED.
- **Hủy lời mời** (`DELETE /api/friends/requests/{id}`): Xóa Friendship đang PENDING.
- **Danh sách bạn bè** (`GET /api/friends`): Phân trang, chỉ trả ACCEPTED.
- **Lời mời đã nhận** (`GET /api/friends/requests/received`): Phân trang.
- **Lời mời đã gửi** (`GET /api/friends/requests/sent`): Phân trang.

Files liên quan: `FriendshipController.java`, `FriendshipServiceImpl.java`, `FriendshipRepository.java`

#### 5.5 Thông báo (Notification)

- **Lấy danh sách** (`GET /api/notifications`): Phân trang, sắp xếp mới nhất trước.
- **Đếm chưa đọc** (`GET /api/notifications/unread/count`).
- **Đánh dấu đã đọc 1 thông báo** (`PUT /api/notifications/{id}/read`).
- **Đánh dấu tất cả đã đọc** (`PUT /api/notifications/read-all`).
- **Gửi thông báo realtime**: `NotificationWebSocketSender` dùng `SimpMessagingTemplate.convertAndSendToUser()` → `/user/{username}/queue/notifications`.

Files liên quan: `NotificationController.java`, `NotificationServiceImpl.java`, `NotificationWebSocketSender.java`

#### 5.6 Quản lý User

- **Lấy tất cả users** (`GET /api/users`): (role check đang bị comment-out — hiện public).
- **Lấy user theo id** (`GET /api/users/{id}`).
- **Cập nhật user** (`PUT /api/users/{id}`).
- **Lấy thông tin bản thân** (`GET /api/users/my-infor`): Dùng SecurityContext.

Files liên quan: `UserController.java`, `UserServiceImpl.java`, `UserRepository.java`

---

### Chưa Hoàn Thành / Chưa Kết Nối

- **Tạo phòng nhóm (GROUP)**: Entity và enum `RoomType.GROUP` đã có, nhưng không thấy endpoint `POST /api/rooms/group` trong controller.
- **Thêm thành viên vào phòng nhóm**: DTO `AddMemberRequest.java` đã có nhưng không thấy endpoint.
- **Upload file/ảnh**: Entity `Message` có `attachmentUrl`, `MessageType.IMAGE/FILE` đã định nghĩa nhưng chưa có service upload.
- **User avatar upload**: Field `avatarUrl` trong `User` entity nhưng chưa có upload API.
- **Typing indicator**: Frontend có state `typingUsers` và component `TypingIndicator.tsx` nhưng `onTyping` callback truyền vào `InputArea` là hàm rỗng `() => {}`. Backend chưa có WS event cho typing.
- **Reply to message**: Frontend có state `replyTo` trong `ChatWindow.tsx` nhưng chưa truyền vào `sendMessage`. Backend entity `Message` có trường `replyTo_id`.
- **Tìm kiếm bạn bè / user**: Chưa có API tìm kiếm user theo username/displayName.
- **Xóa bạn bè (unfriend)**: Chưa thấy endpoint.
- **Block user**: `FriendshipStatus.BLOCKED` đã định nghĩa nhưng chưa có endpoint.
- **Dashboard/Analytics**: Frontend có nhiều chart components (apexcharts, fullcalendar) nhưng đang bị comment-out trong `App.tsx`.
- **Phân quyền chặt chẽ theo role**: `@PreAuthorize` đang bị comment ở `UserController`. `FriendshipController` dùng `@AuthenticationPrincipal Long currentUserId` nhưng cơ chế resolve principal này chưa nhất quán.

---

### Đang Phát Triển

- Giao diện frontend (ChatWindow mới nhất) đang tốt hơn ChatBox cũ (legacy).
- InfoPanel (thông tin phòng) đã có component nhưng chưa populate dữ liệu thực.

---

## 6. Database

### Bảng `users`

| Cột | Kiểu | Mục đích |
| --- | ---- | -------- |
| id | BIGINT PK AUTO_INCREMENT | ID user |
| username | VARCHAR(50) UNIQUE NOT NULL | Tên đăng nhập |
| email | VARCHAR(100) UNIQUE NOT NULL | Email |
| password_hash | VARCHAR NOT NULL | BCrypt hash của password |
| display_name | VARCHAR(100) | Tên hiển thị |
| avatar_url | VARCHAR(500) | URL ảnh đại diện |
| status | VARCHAR(20) NOT NULL | ONLINE/OFFLINE/AWAY/BUSY |
| role | VARCHAR(20) NOT NULL | ADMIN/USER |
| last_seen | DATETIME | Lần online cuối |
| created_at | DATETIME | Tự động tạo |

Index: `idx_users_username (username)`, `idx_users_email (email)`

---

### Bảng `rooms`

| Cột | Kiểu | Mục đích |
| --- | ---- | -------- |
| id | BIGINT PK AUTO_INCREMENT | ID phòng |
| name | VARCHAR(100) | Tên phòng (null với PRIVATE) |
| description | VARCHAR(500) | Mô tả phòng (null với PRIVATE) |
| avatar_url | VARCHAR(500) | Ảnh phòng (null với PRIVATE) |
| type | VARCHAR(20) NOT NULL | PRIVATE / GROUP |
| created_by | BIGINT FK → users.id | Người tạo |
| created_at | DATETIME | Tự động tạo |

---

### Bảng `room_members`

| Cột | Kiểu | Mục đích |
| --- | ---- | -------- |
| id | BIGINT PK AUTO_INCREMENT | ID record |
| room_id | BIGINT FK → rooms.id | Phòng |
| user_id | BIGINT FK → users.id | Thành viên |
| role | VARCHAR(20) NOT NULL | OWNER/ADMIN/MEMBER |
| last_read_msg_id | BIGINT FK → messages.id | Tin nhắn cuối đã đọc (unread tracking) |
| joined_at | DATETIME | Tự động tạo |

Unique constraint: `(room_id, user_id)`

---

### Bảng `messages`

| Cột | Kiểu | Mục đích |
| --- | ---- | -------- |
| id | BIGINT PK AUTO_INCREMENT | ID tin nhắn |
| sender_id | BIGINT FK → users.id | Người gửi |
| room_id | BIGINT FK → rooms.id | Phòng |
| reply_to_id | BIGINT FK → messages.id | Tin nhắn được reply (nullable) |
| content | TEXT | Nội dung (null nếu đã bị xóa) |
| type | VARCHAR(20) NOT NULL | TEXT/IMAGE/FILE/JOIN/LEAVE |
| attachment_url | VARCHAR(500) | URL file đính kèm |
| is_deleted | BOOLEAN NOT NULL DEFAULT false | Soft delete flag |
| edited_at | DATETIME | Thời điểm sửa (null nếu chưa sửa) |
| created_at | DATETIME | Tự động tạo |

Index: `idx_messages_room_created (room_id, created_at)`, `idx_messages_sender (sender_id)`

---

### Bảng `friendships`

| Cột | Kiểu | Mục đích |
| --- | ---- | -------- |
| id | BIGINT PK AUTO_INCREMENT | ID |
| requester_id | BIGINT FK → users.id | Người gửi lời mời |
| addressee_id | BIGINT FK → users.id | Người nhận lời mời |
| status | VARCHAR(20) NOT NULL | PENDING/DECLINED/ACCEPTED/BLOCKED |
| room_id | BIGINT FK → rooms.id | Phòng PRIVATE tự tạo khi ACCEPTED |
| created_at | DATETIME | Tự động tạo |

Unique constraint: `uk_friendships_requester_addressee (requester_id, addressee_id)`
Index: `idx_friendships_requester`, `idx_friendships_addressee`

---

### Bảng `notifications`

| Cột | Kiểu | Mục đích |
| --- | ---- | -------- |
| id | BIGINT PK AUTO_INCREMENT | ID |
| user_id | BIGINT FK → users.id | Người nhận thông báo |
| actor_id | BIGINT FK → users.id | Người thực hiện hành động (nullable — system notification) |
| type | VARCHAR(30) NOT NULL | FRIEND_REQUEST/FRIEND_ACCEPTED/MESSAGE/ROOM_INVITE/SYSTEM |
| message | VARCHAR(255) NOT NULL | Nội dung hiển thị |
| is_read | BOOLEAN NOT NULL DEFAULT false | Đã đọc chưa |
| created_at | DATETIME | Tự động tạo |

Index: `idx_notifications_user_read (user_id, is_read, created_at)`

---

### Quan hệ (ERD dạng text)

```
User (1) ──────────────── (N) RoomMember ──── (N) Room
  │                                              │
  │ (sender)                                     │ (room)
  └────────────────── (N) Message ───────────────┘
  
User (requester/addressee) ──── (N) Friendship ──── (1) Room (PRIVATE, optional)

User (1) ──── (N) Notification ◄──── (actor) User

Message ──── (reply_to) ──── Message (self-reference)

RoomMember ──── (last_read_msg_id) ──── Message
```

---

## 7. API Endpoints

### Auth

#### POST /api/auth/register
- **Authentication**: Public
- **Request**: `{ "username": "john", "email": "john@example.com", "password": "pass123", "displayName": "John" }`
- **Response 200**: `UserResponse` (id, username, email, displayName, avatarUrl, status, role, createdAt)
- **Response 406**: `"User already exist"`
- **Business Logic**: Hash password bằng BCrypt, lưu user với role=USER, status=OFFLINE.
- **Controller**: `AuthController.signupUser()` → `AuthService.createUser()` → `UserRepository.save()`

#### POST /api/auth/login
- **Authentication**: Public
- **Request**: `{ "username": "john", "password": "pass123" }`
- **Response 200**: `{ "token": "eyJ...", "username": "john", "role": "USER", "userId": 1 }`
- **Response 400**: `"Login failed"`
- **Business Logic**: Tìm user theo username, BCrypt.matches(), generate JWT (HS256, 24h, claims: username, role, userId).
- **Controller**: `AuthController.loginUser()` → `JwtUtil.generateToken()`

---

### Rooms

#### GET /api/rooms
- **Authentication**: JWT required
- **Request params**: `page=0`, `size=20`, `sortBy=createdAt`, `direction=desc`
- **Response 200**: `Page<RoomResponse>` (content, totalPages, totalElements, ...)
- **Business Logic**: Lấy tất cả phòng mà current user là member. RoomResponse gồm id, name, type, avatarUrl, createdBy (UserBasicInfo), members (List<UserBasicInfo>), createdAt.
- **Controller**: `RoomController.getUserRooms()` → `RoomService.getUserRooms()` → `RoomRepository.findRoomsByUserId()`

#### POST /api/rooms/private
- **Authentication**: JWT required
- **Request param**: `otherUserId=2`
- **Response 200**: `RoomResponse`
- **Business Logic**: Kiểm tra PRIVATE room giữa 2 user đã tồn tại chưa (idempotent). Nếu chưa, tạo mới Room(PRIVATE) + thêm cả hai làm MEMBER.
- **Controller**: `RoomController.createPrivateRoom()` → `RoomService.createPrivateRoom()`

#### GET /api/rooms/{roomId}
- **Authentication**: JWT required
- **Response 200**: `RoomResponse`

#### PUT /api/rooms/{roomId}
- **Authentication**: JWT + phải là ADMIN của phòng
- **Request**: `{ "name": "New Name", "description": "...", "avatarUrl": "..." }`
- **Response 200**: `RoomResponse` updated

#### DELETE /api/rooms/{roomId}
- **Authentication**: JWT + phải là creator
- **Response 204**

#### POST /api/rooms/{roomId}/leave
- **Authentication**: JWT
- **Response 204**

#### DELETE /api/rooms/{roomId}/members/{memberId}
- **Authentication**: JWT + ADMIN
- **Response 204**

#### PATCH /api/rooms/{roomId}/members/{memberId}/role
- **Authentication**: JWT + ADMIN
- **Request param**: `role=ADMIN`
- **Response 204**

---

### Messages

#### WebSocket: SEND /app/chat.send/{roomId}
- **Authentication**: JWT trong STOMP header `Authorization: Bearer {token}` lúc CONNECT
- **Payload**: `{ "content": "Hello!", "type": "TEXT" }`
- **Broadcast to**: `/topic/room/{roomId}` → tất cả subscriber nhận `MessageResponse`
- **Business Logic**: Kiểm tra sender là member, lưu DB, broadcast. JOIN/LEAVE bị ignore.

#### GET /api/rooms/{roomId}/messages
- **Authentication**: JWT + phải là member
- **Request params**: `page=0`, `size=30`
- **Response 200**: `{ "messages": [...], "currentPage": 0, "totalPages": 5, "totalElements": 142, "hasNext": true }`
- **Business Logic**: Sắp xếp `created_at DESC`, phân trang. Client đảo ngược mảng khi hiển thị.

#### DELETE /api/rooms/{roomId}/messages/{messageId}
- **Authentication**: JWT + sender hoặc ADMIN hệ thống
- **Response 204** + Broadcast cập nhật qua WS

#### PUT /api/rooms/{roomId}/messages/{messageId}
- **Authentication**: JWT + chỉ sender
- **Request**: `{ "content": "Edited content" }`
- **Response 200**: `MessageResponse` updated + Broadcast qua WS

#### PUT /api/rooms/{roomId}/messages/{messageId}/read
- **Authentication**: JWT
- **Response 204**: Cập nhật `lastReadMessage` trong `RoomMember`

---

### Friends

#### POST /api/friends/requests
- **Authentication**: JWT
- **Request**: `{ "addresseeId": 5 }`
- **Response 200**

#### PUT /api/friends/requests/{friendshipId}/accept
- **Authentication**: JWT
- **Response 200**: `FriendshipResponse` (gồm thông tin friendship + room đã tạo)
- **Business Logic**: Đổi status → ACCEPTED, gọi `createPrivateRoom()`

#### PUT /api/friends/requests/{friendshipId}/decline
- **Authentication**: JWT → **Response 204**

#### DELETE /api/friends/requests/{friendshipId}
- **Authentication**: JWT → **Response 204** (hủy lời mời PENDING)

#### GET /api/friends
- **Authentication**: JWT
- **Params**: pageable (size=20)
- **Response 200**: `Page<FriendshipResponse>` chỉ status=ACCEPTED

#### GET /api/friends/requests/received
- **Response 200**: `Page<FriendRequestResponse>` đang PENDING

#### GET /api/friends/requests/sent
- **Response 200**: `Page<FriendRequestResponse>` đang PENDING

---

### Notifications

#### GET /api/notifications
- **Authentication**: JWT
- **Response 200**: `Page<NotificationResponse>` (id, type, message, isRead, createdAt, actor UserBasicInfo)

#### GET /api/notifications/unread/count
- **Response 200**: `Long` (số thông báo chưa đọc)

#### PUT /api/notifications/{notificationId}/read
- **Response 204**

#### PUT /api/notifications/read-all
- **Response 204**

---

### Users

#### GET /api/users
- **Authentication**: JWT (role check bị comment — hiện tất cả authenticated user đều truy cập được)
- **Response 200**: `List<UserResponse>`

#### GET /api/users/{id}
- **Authentication**: JWT → **Response 200**: `UserResponse`

#### PUT /api/users/{id}
- **Authentication**: JWT → **Request/Response**: `UserResponse`

#### GET /api/users/my-infor
- **Authentication**: JWT
- **Response 200**: `UserResponse` của người đang đăng nhập (lấy từ SecurityContext)

---

## 8. Authentication & Authorization

### Cơ chế JWT

- **Thuật toán**: HS256
- **Secret key**: `MySuperSecretKeyForJWT1234567890` (hardcoded trong `JwtUtil.java` — **cần chuyển sang biến môi trường**)
- **TTL**: 86400000ms = 24 giờ
- **Claims**: `sub` (username), `role`, `userId`
- **Storage phía client**: `localStorage.getItem('token')`

### Luồng xác thực HTTP

```
Client gửi: Authorization: Bearer eyJ...
↓
JwtFilter.doFilterInternal()  (OncePerRequestFilter)
  → JwtUtil.extractUsername(token)
  → CustomUserDetailsService.loadUserByUsername()
    → UserRepository.findUserByUsername()
  → UsernamePasswordAuthenticationToken(userDetails, null, authorities)
  → SecurityContextHolder.getContext().setAuthentication(auth)
↓
Controller nhận @AuthenticationPrincipal UserDetails
  hoặc SecurityContextHolder.getContext().getAuthentication().getName()
```

### Luồng xác thực WebSocket

```
Client kết nối: STOMP CONNECT với header Authorization: Bearer eyJ...
↓
WebSocketConfig.configureClientInboundChannel() interceptor
  → accessor.getFirstNativeHeader("Authorization")
  → JwtUtil.validateToken(token)
  → JwtUtil.extractUsername(token)
  → accessor.setUser(new UsernamePasswordAuthenticationToken(username, null, null))
↓
@MessageMapping methods nhận Principal principal
  → principal.getName() = username
```

### Spring Security Rules

```
/api/auth/**  → permitAll (public)
/ws/**        → permitAll (WebSocket handshake)
/ws/info/**   → permitAll (SockJS polling)
Tất cả khác  → authenticated
```

### Authorization theo role

- `UserRole.ADMIN` / `UserRole.USER` — hệ thống role user-level
- `MemberRole.OWNER` / `MemberRole.ADMIN` / `MemberRole.MEMBER` — room-level role
- Kiểm tra room-level được thực hiện manually trong service (không dùng `@PreAuthorize`)

### Lưu ý quan trọng

- Có **hai filter JWT song song**: `JwtFilter.java` (trong package `filter`) và `JwtAuthenticationFilter.java` (trong package `security`). Cả hai đều làm nhiệm vụ tương tự. Cần xem xét loại bỏ một cái.
- Có **hai JwtUtil song song**: `JwtUtil.java` và `JwtUtils.java`. Cần hợp nhất.

---

## 9. Realtime Communication

### WebSocket Setup

- **Endpoint**: `/ws` (SockJS fallback)
- **STOMP broker**: In-memory SimpleBroker
- **Application prefix**: `/app` (gửi đến server handlers)
- **Broker destinations**: `/topic` (broadcast), `/queue` (point-to-point), `/user` (user-specific)
- **User destination prefix**: `/user`

### Channels

| Channel | Hướng | Mục đích |
| ------- | ----- | -------- |
| `/app/chat.send/{roomId}` | Client → Server | Gửi tin nhắn |
| `/app/chat.join/{roomId}` | Client → Server | Notify join (bị ignore ở service) |
| `/app/chat.leave/{roomId}` | Client → Server | Notify leave (bị ignore ở service) |
| `/topic/room/{roomId}` | Server → Client(s) | Broadcast tin nhắn + cập nhật (delete/edit) |
| `/user/{username}/queue/notifications` | Server → Client | Push notification cho user cụ thể |

### Luồng gửi/nhận tin nhắn realtime

```
Client A (ChatWindow)
  → websocketService.sendMessage(roomId, content)
  → STOMP publish: destination=/app/chat.send/42, body={content, type}
  → MessageController.sendMessage(roomId=42, req, principal)
  → MessageServiceImpl.sendMessage()
    → Kiểm tra membership
    → Lưu Message vào DB
    → messagingTemplate.convertAndSend("/topic/room/42", MessageResponse)
  → Broadcast đến tất cả subscriber của /topic/room/42
Client A, B, C (đang subscribe /topic/room/42)
  → onMessage callback
  → setMessages(prev => [...prev, msg])  ← cập nhật UI realtime
```

### Luồng frontend WebSocket

1. `useChatSocket(roomId)` hook được gọi khi mount `ChatWindow`.
2. Hook gọi `websocketService.connect(roomId, onMessage)`.
3. `WebSocketService` tạo STOMP client với SockJS transport, header `Authorization: Bearer {token}`.
4. Sau `onConnect`: subscribe `/topic/room/{roomId}`.
5. Khi reconnect (5000ms delay) sẽ tự subscribe lại.
6. Khi unmount: `websocketService.disconnect()`.
7. Tin nhắn realtime lưu trong state `liveMessages`.
8. `allMessages = [...historyMessages, ...liveMessages]` — gộp lịch sử + realtime.

---

## 10. Quy Trình Hoạt Động Chi Tiết

### Luồng Đăng Nhập

```
User nhập username/password
→ LoginPage.tsx → useAuth().login()
→ ApiService.login() → POST /api/auth/login
→ AuthController.loginUser()
→ UserRepository.findUserByUsername()
→ BCrypt.matches()
→ JwtUtil.generateToken()
→ Response: {token, username, role, userId}
→ localStorage.setItem('token', token)
→ ApiService.getMyInfo() → GET /api/users/my-infor
→ setUser(userData)
→ Redirect → / (Home)
```

### Luồng Load Màn Hình Chat

```
User click phòng trong Sidebar
→ navigate('/chat/{roomId}')
→ ChatWindow mount
→ useEffect: ApiService.getRoomById(roomId) → setRoom()
→ useEffect: ApiService.getMessages(roomId, 0, 30) → setHistoryMessages([...messages].reverse())
→ useChatSocket(roomId) → websocketService.connect() → subscribe /topic/room/{roomId}
→ Render: MessageArea hiển thị allMessages
```

### Luồng Gửi Tin Nhắn

```
User gõ text, nhấn Enter hoặc click Send
→ InputArea.onSend(text)
→ ChatWindow.handleSend(text)
→ useChatSocket.sendMessage(text)
→ websocketService.sendMessage(roomId, content, 'TEXT')
→ STOMP publish /app/chat.send/{roomId}
→ MessageServiceImpl.sendMessage()
  → validate membership
  → save to DB
  → broadcast /topic/room/{roomId}
→ useChatSocket onMessage callback
→ setMessages(prev => [...prev, newMsg])
→ UI cập nhật với tin nhắn mới
```

### Luồng Xóa Tin Nhắn

```
User click Delete trên MessageBubble
→ ChatWindow.handleDelete(messageId)
→ ApiService.deleteMessage(roomId, messageId)
→ DELETE /api/rooms/{roomId}/messages/{messageId}
→ MessageServiceImpl.deleteMessage()
  → check quyền (sender || ADMIN)
  → message.softDelete() → isDeleted=true, content=null
  → save
  → broadcast cập nhật qua WS /topic/room/{roomId}
→ setHistoryMessages: map → message.isDeleted=true
→ UI hiển thị "Tin nhắn đã bị xóa"
```

### Luồng Kết Bạn

```
User A gửi lời mời → POST /api/friends/requests {addresseeId: B.id}
  → Tạo Friendship(status=PENDING, requester=A, addressee=B)
User B chấp nhận → PUT /api/friends/requests/{id}/accept
  → Friendship.status = ACCEPTED
  → Tự động gọi roomService.createPrivateRoom(A.id, B.id)
  → Tạo Room(PRIVATE) + thêm cả hai làm MEMBER
→ Friendship.room = newRoom
→ A và B có thể chat ngay trong room vừa tạo
```

---

## 11. Cấu Hình Môi Trường

### `.env` (ChatApp backend)

```properties
APP_NAME=ChatApp
DB_HOST=localhost
DB_PORT=3306
DB_NAME=chatapp
DB_USERNAME=root
DB_PASSWORD=123456
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=dev
JWT_EXPIRATION=86400000
```

### `application.properties`

```properties
spring.config.import=optional:file:.env[.properties]
spring.application.name=${APP_NAME:ChatApp}
jwt.expiration=${JWT_EXPIRATION:ChatApp}   # ← BUG: default value sai, nên là 86400000

spring.datasource.url=jdbc:mysql://${DB_HOST}:${DB_PORT}/${DB_NAME}?allowPublicKeyRetrieval=true&useSSL=false&createDatabaseIfNotExist=true
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

spring.jpa.hibernate.ddl-auto=update
server.port=${SERVER_PORT}
spring.profiles.active=${SPRING_PROFILES_ACTIVE:dev}
```

### Frontend (hardcoded trong code)

```typescript
// ApiService.ts
baseURL: "http://localhost:8080"

// websocket.ts
new SockJS('http://localhost:8080/ws')
```

---

## 12. Lưu Ý Kỹ Thuật Quan Trọng

1. **Soft Delete**: Tin nhắn không bị xóa khỏi DB. Khi xóa: `isDeleted=true`, `content=null`, `attachmentUrl=null`. Client phải kiểm tra `isDeleted` để hiển thị placeholder "Tin nhắn đã bị xóa".

2. **Message pagination ngược**: Backend trả tin nhắn mới nhất trước (`ORDER BY created_at DESC`). Frontend phải `.reverse()` trước khi hiển thị (`[...data.messages].reverse()`).

3. **JOIN/LEAVE events bị ignore**: `MessageServiceImpl.sendMessage()` check nếu type là JOIN hoặc LEAVE thì return null ngay, không lưu DB, không broadcast. Frontend có thể gọi nhưng sẽ không có phản hồi.

4. **Private room idempotent**: `createPrivateRoom()` kiểm tra tồn tại trước khi tạo — gọi nhiều lần vẫn trả về cùng một room.

5. **Unread tracking**: `RoomMember.lastReadMessage` chỉ được cập nhật forward (chỉ khi messageId > lastReadMessage.id). Đảm bảo không bị reset do click tin nhắn cũ.

6. **JWT secret hardcoded**: Secret key `MySuperSecretKeyForJWT1234567890` viết cứng trong `JwtUtil.java`. Cần đọc từ biến môi trường.

7. **Lỗi cấu hình jwt.expiration**: Trong `application.properties`, `jwt.expiration=${JWT_EXPIRATION:ChatApp}` — default value là string "ChatApp" thay vì số. Nếu biến môi trường không set sẽ gây lỗi parse. Tuy nhiên `JwtUtil.java` dùng constant riêng nên không bị ảnh hưởng thực tế.

8. **Hai filter JWT trùng lặp**: `JwtFilter.java` (filter package) và `JwtAuthenticationFilter.java` (security package) — cả hai đều được đăng ký trong SecurityConfig (`addFilterBefore(jwtFilter, ...)`). Cần kiểm tra xem cái nào thực sự active.

9. **`@AuthenticationPrincipal Long currentUserId`**: Cơ chế này trong `FriendshipController` và `NotificationController` yêu cầu authentication principal phải resolve được thành `Long`. Nhưng `CustomUserDetails` implement `UserDetails` không phải `Long`. Đây là lỗi tiềm ẩn — cần xem xét cơ chế resolve principal.

10. **Frontend URL hardcoded**: `http://localhost:8080` được ghi cứng trong `ApiService.ts` và `websocket.ts`. Cần dùng biến môi trường Vite (`import.meta.env.VITE_API_URL`).

11. **CORS**: `CorsConfig.java` cho phép `allowedOriginPatterns("*")`. Cần giới hạn lại khi deploy production.

12. **Two ChatWindow versions**: `ChatBox.tsx` (pages/Chat/) là version cũ/legacy. `ChatWindow.tsx` (components/chat/) là version mới đang được dùng. `App.tsx` dùng `ChatWindow`.

---

## 13. Hạn Chế Hiện Tại

1. **JWT secret hardcoded** — bảo mật yếu.
2. **URL hardcoded** trong frontend (localhost:8080).
3. **Không có refresh token** — sau 24h user phải đăng nhập lại.
4. **Không có upload file** — `attachmentUrl` và `MessageType.IMAGE/FILE` chưa có backend xử lý.
5. **Không có group chat tạo thủ công** — chỉ có private room (tạo tự động khi kết bạn) và không có API tạo GROUP room.
6. **In-memory WebSocket broker** — không scale được horizontal (cần Redis Pub/Sub hoặc RabbitMQ để multi-instance).
7. **Không có pagination tin nhắn trên frontend** — chỉ load 30 tin nhắn đầu, không có scroll-to-load-more.
8. **Không có trạng thái Online/Offline realtime** — `UserStatus` có định nghĩa nhưng không có mechanism cập nhật khi user connect/disconnect WS.
9. **Không có search user** — cần thiết để gửi lời mời kết bạn.
10. **Không có test** — `ChatAppApplicationTests.java` chỉ có context load test.
11. **Không có Docker** — chưa có Dockerfile hoặc docker-compose.
12. **FriendshipController principal type mismatch** — `@AuthenticationPrincipal Long currentUserId` có thể không hoạt động đúng.

---

## 14. Hướng Phát Triển

### Ngắn hạn (ưu tiên cao)

- Fix JWT secret → đọc từ `.env`.
- Fix URL hardcoded frontend → dùng `.env.local` với `VITE_API_URL`.
- Implement scroll-to-load-more tin nhắn (infinite scroll lên trên).
- Implement trạng thái Online/Offline (WebSocket connect/disconnect events).
- Implement upload ảnh/file (tích hợp MinIO hoặc Cloudinary).
- Thêm API tìm kiếm user (`GET /api/users/search?q=...`).
- Fix `@AuthenticationPrincipal` trong FriendshipController.
- Hợp nhất `JwtUtil.java` + `JwtUtils.java`.
- Hợp nhất `JwtFilter.java` + `JwtAuthenticationFilter.java`.

### Trung hạn

- Implement GROUP room creation (`POST /api/rooms/group`).
- Thêm thành viên vào group (`POST /api/rooms/{id}/members`).
- Typing indicator realtime (WS event `/app/chat.typing/{roomId}` + broadcast).
- Reply to message (truyền `replyToId` khi gửi tin).
- Notification realtime hoạt động đầy đủ (friend request push notification).
- Đổi sang Redis-backed STOMP broker (Spring + Redis pub/sub).
- Cập nhật `User.status` và `User.lastSeen` realtime.

### Dài hạn

- Docker + docker-compose (MySQL + Spring Boot + React nginx).
- CI/CD pipeline.
- Refresh token mechanism.
- Message reactions (emoji).
- Read receipts hiển thị trên UI (dùng `lastReadMessage`).
- Full-text search tin nhắn.
- Rate limiting.

---

## 15. Các File Quan Trọng Nhất

| File | Vai trò |
| ---- | ------- |
| `ChatApp/src/main/java/com/example/ChatApp/config/WebSocketConfig.java` | Cấu hình STOMP broker, SockJS endpoint, JWT interceptor cho WS |
| `ChatApp/src/main/java/com/example/ChatApp/config/SecurityConfig.java` | Spring Security filter chain, permit rules |
| `ChatApp/src/main/java/com/example/ChatApp/util/JwtUtil.java` | Generate + validate + extract JWT (dùng cho cả HTTP và WS) |
| `ChatApp/src/main/java/com/example/ChatApp/filter/JwtFilter.java` | HTTP JWT filter (OncePerRequestFilter) |
| `ChatApp/src/main/java/com/example/ChatApp/controller/MessageController.java` | WebSocket @MessageMapping + REST message endpoints |
| `ChatApp/src/main/java/com/example/ChatApp/service/impl/MessageServiceImpl.java` | Business logic: send, delete (soft), edit, markAsRead, broadcast |
| `ChatApp/src/main/java/com/example/ChatApp/service/impl/RoomServiceImpl.java` | Business logic: createPrivateRoom (idempotent), getUserRooms, updateRoom |
| `ChatApp/src/main/java/com/example/ChatApp/service/impl/FriendshipServiceImpl.java` | Business logic: friend request lifecycle + auto-create private room |
| `ChatApp/src/main/java/com/example/ChatApp/entity/Message.java` | Entity với softDelete() và edit() business methods |
| `ChatApp/src/main/java/com/example/ChatApp/entity/User.java` | Entity trung tâm |
| `ChatApp/src/main/resources/application.properties` | Cấu hình ứng dụng, đọc từ .env |
| `ChatApp/.env` | Biến môi trường (DB credentials, port, JWT config) |
| `ChatApp-fe/src/api/ApiService.ts` | Tất cả HTTP call, interface types |
| `ChatApp-fe/src/services/websocket.ts` | STOMP WebSocket client singleton |
| `ChatApp-fe/src/hooks/useChatSocket.ts` | React hook kết nối WS + quản lý live messages |
| `ChatApp-fe/src/context/AuthContext.tsx` | Auth state global (user, login, logout) |
| `ChatApp-fe/src/components/chat/ChatWindow.tsx` | Main chat screen component |
| `ChatApp-fe/src/layout/Sidebar.tsx` | Danh sách phòng chat, navigation |
| `ChatApp-fe/src/App.tsx` | Route definitions |

---

## 16. Hướng Dẫn Cho AI

Khi hỗ trợ dự án này:

1. **File này là nguồn thông tin chính** — không cần đọc lại toàn bộ source code cho mỗi câu hỏi.
2. **Backend** = Spring Boot 4.0.5, Java 21, package root `com.example.ChatApp`.
3. **Frontend** = React 19 + TypeScript, tất cả trong `ChatApp-fe/src/`.
4. **Kiến trúc phân lớp backend**: Controller → Service (interface) → ServiceImpl → Repository → Entity.
5. **WebSocket flow**: Client → `/app/...` → `@MessageMapping` → `SimpMessagingTemplate.convertAndSend("/topic/...")` → subscribers.
6. **Khi viết code mới**: tuân thủ pattern Controller/Service interface/ServiceImpl/Repository. Dùng Lombok builder, `@RequiredArgsConstructor`, `@Transactional`.
7. **Khi sửa lỗi**: tham chiếu đúng file theo cấu trúc mục 4.
8. **Các lỗi đã biết**: JWT secret hardcoded, URL hardcoded frontend, `@AuthenticationPrincipal Long` có thể không hoạt động, jwt.expiration default value sai — ghi nhận khi liên quan.
9. **Database**: MySQL, schema auto-update, không có file SQL script riêng.
10. **Không có AI/ML** trong dự án này.