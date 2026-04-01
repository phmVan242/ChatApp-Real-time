package com.example.ChatApp.controller;

import com.example.ChatApp.dto.*;
import com.example.ChatApp.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
@Slf4j
public class MessageController {

    private final MessageService messageService;

    // ════════════════════════════════════════════════════
    // WebSocket endpoints
    // ════════════════════════════════════════════════════

    /**
     * Client gửi tin nhắn.
     *
     * JS:  stompClient.publish({
     *          destination: '/app/chat.send/42',
     *          body: JSON.stringify({ content: "Hello", type: "TEXT" })
     *      })
     *
     * Sau khi xử lý, service tự broadcast đến /topic/room/42
     * → tất cả client đang subscribe nhận được.
     */
    @MessageMapping("/chat.send/{roomId}")
    public void sendMessage(
            @DestinationVariable Long roomId,
            @Payload SendMessageRequest req,
            Principal principal) {

        log.debug("WS send: {} → room {}", principal.getName(), roomId);
        messageService.sendMessage(roomId, req, principal.getName());
    }

    /**
     * Client gửi sự kiện JOIN khi vào phòng.
     * Server broadcast thông báo hệ thống: "X đã vào phòng"
     */
    @MessageMapping("/chat.join/{roomId}")
    public void joinRoom(
            @DestinationVariable Long roomId,
            Principal principal) {

        SendMessageRequest joinEvent = new SendMessageRequest();
        joinEvent.setContent(principal.getName() + " đã vào phòng");
        joinEvent.setType("JOIN");
        messageService.sendMessage(roomId, joinEvent, principal.getName());
    }

    /**
     * Client gửi sự kiện LEAVE khi rời phòng.
     */
    @MessageMapping("/chat.leave/{roomId}")
    public void leaveRoom(
            @DestinationVariable Long roomId,
            Principal principal) {

        SendMessageRequest leaveEvent = new SendMessageRequest();
        leaveEvent.setContent(principal.getName() + " đã rời phòng");
        leaveEvent.setType("LEAVE");
        messageService.sendMessage(roomId, leaveEvent, principal.getName());
    }

    // ════════════════════════════════════════════════════
    // REST endpoints
    // ════════════════════════════════════════════════════

    /**
     * GET /api/rooms/{roomId}/messages?page=0&size=30
     * Load lịch sử tin nhắn (mới nhất trước, phân trang).
     */
    @GetMapping("/api/rooms/{roomId}/messages")
    @ResponseBody
    public ResponseEntity<MessagePageResponse> getMessages(
            @PathVariable Long roomId,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "30") int size) {

        return ResponseEntity.ok(messageService.getMessages(roomId, page, size));
    }

    /**
     * DELETE /api/rooms/{roomId}/messages/{messageId}
     * Xóa mềm tin nhắn — chỉ người gửi hoặc ADMIN.
     */
    @DeleteMapping("/api/rooms/{roomId}/messages/{messageId}")
    @ResponseBody
    public ResponseEntity<Void> deleteMessage(
            @PathVariable Long roomId,
            @PathVariable Long messageId) {

        messageService.deleteMessage(messageId);
        return ResponseEntity.noContent().build();
    }

    /**
     * PUT /api/rooms/{roomId}/messages/{messageId}
     * Sửa nội dung tin nhắn — chỉ người gửi.
     */
    @PutMapping("/api/rooms/{roomId}/messages/{messageId}")
    @ResponseBody
    public ResponseEntity<MessageResponse> editMessage(
            @PathVariable Long roomId,
            @PathVariable Long messageId,
            @Valid @RequestBody EditMessageRequest req) {

        return ResponseEntity.ok(messageService.editMessage(messageId, req));
    }

    /**
     * PUT /api/rooms/{roomId}/messages/{messageId}/read
     * Đánh dấu đã đọc đến tin này — cập nhật unread count.
     */
    @PutMapping("/api/rooms/{roomId}/messages/{messageId}/read")
    @ResponseBody
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long roomId,
            @PathVariable Long messageId) {

        messageService.markAsRead(roomId, messageId);
        return ResponseEntity.noContent().build();
    }
}