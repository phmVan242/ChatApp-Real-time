package com.example.ChatApp.service.impl;

import com.example.ChatApp.dto.message.EditMessageRequest;
import com.example.ChatApp.dto.message.MessagePageResponse;
import com.example.ChatApp.dto.message.MessageResponse;
import com.example.ChatApp.dto.message.SendMessageRequest;
import com.example.ChatApp.exception.*;
import com.example.ChatApp.mapper.MessageMapper;
import com.example.ChatApp.entity.*;
import com.example.ChatApp.entity.enums.MessageType;
import com.example.ChatApp.entity.enums.UserRole;
import com.example.ChatApp.repository.*;
import com.example.ChatApp.service.MessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class MessageServiceImpl implements MessageService {

    private final MessageRepository     messageRepository;
    private final UserRepository        userRepository;
    private final RoomRepository        roomRepository;
    private final RoomMemberRepository  roomMemberRepository;
    private final MessageMapper         messageMapper;
    private final SimpMessagingTemplate messagingTemplate;

    // ── Helpers ──────────────────────────────────────────────

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        return userRepository.findUserByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User không tồn tại"));
    }

    private RoomMember requireMembership(Long roomId, Long userId) {
        return roomMemberRepository.findByRoomIdAndUserId(roomId, userId)
                .orElseThrow(() -> new RuntimeException("Bạn không phải thành viên của room này"));
    }

    // ── Send ──────────────────────────────────────────────────

    @Override
    public MessageResponse sendMessage(Long roomId, SendMessageRequest req, String senderUsername) {

        User sender = userRepository.findUserByUsername(senderUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User không tồn tại: " + senderUsername));

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room không tồn tại: " + roomId));

        requireMembership(roomId, sender.getId());

        Message replyTo = null;
        if (req.getReplyToId() != null) {
            replyTo = messageRepository.findById(req.getReplyToId())
                    .orElseThrow(() -> new ResourceNotFoundException("Tin nhắn reply không tồn tại"));
            if (!replyTo.getRoom().getId().equals(roomId)) {
                throw new RuntimeException("Tin nhắn reply không thuộc room này");
            }
        }

        MessageType type;
        try {
            type = MessageType.valueOf(
                    req.getType() != null ? req.getType().toUpperCase() : "TEXT"
            );
        } catch (IllegalArgumentException e) {
            type = MessageType.TEXT;
        }

        Message message = Message.builder()
                .sender(sender)
                .room(room)
                .replyTo(replyTo)
                .content(req.getContent())
                .type(type)
                .attachmentUrl(req.getAttachmentUrl())
                .build();

        message = messageRepository.save(message);

        // Broadcast tin nhắn mới
        MessageResponse response = messageMapper.toResponse(message);
        messagingTemplate.convertAndSend("/topic/room/" + roomId, response);

        log.debug("Message gửi: id={}, room={}, sender={}", message.getId(), roomId, senderUsername);
        return response;
    }

    // ── Read ──────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public MessagePageResponse getMessages(Long roomId, int page, int size) {
        User current = getCurrentUser();
        requireMembership(roomId, current.getId());

        Pageable pageable = PageRequest.of(page, size);
        Page<Message> messagePage = messageRepository
                .findByRoomIdOrderByCreatedAtDesc(roomId, pageable);

        return MessagePageResponse.builder()
                .messages(messagePage.getContent().stream()
                        .map(messageMapper::toResponse)
                        .toList())
                .currentPage(page)
                .totalPages(messagePage.getTotalPages())
                .totalElements(messagePage.getTotalElements())
                .hasNext(messagePage.hasNext())
                .build();
    }

    // ── Delete ────────────────────────────────────────────────

    @Override
    public void deleteMessage(Long messageId) {
        User current = getCurrentUser();

        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Tin nhắn không tồn tại: " + messageId));

        // ✅ Kiểm tra user có trong room
        requireMembership(message.getRoom().getId(), current.getId());

        // Chỉ người gửi hoặc ADMIN được xóa
        boolean isSender   = message.getSender().getId().equals(current.getId());
        boolean isSysAdmin = current.getRole() == UserRole.ADMIN;

        if (!isSender && !isSysAdmin) {
            throw new RuntimeException("Bạn không có quyền xóa tin nhắn này");
        }

        // Soft delete
        message.softDelete();
        messageRepository.save(message);

        // ✅ Broadcast trạng thái đã xóa — cùng format MessageResponse
        // Frontend sẽ tìm message theo ID và UPDATE (thay vì thêm mới)
        MessageResponse deletedResponse = messageMapper.toResponse(message);
        messagingTemplate.convertAndSend(
                "/topic/room/" + message.getRoom().getId(),
                deletedResponse
        );

        log.info("Message {} đã bị xóa bởi user {}", messageId, current.getUsername());
    }

    // ── Edit ──────────────────────────────────────────────────

    @Override
    public MessageResponse editMessage(Long messageId, EditMessageRequest req) {
        User current = getCurrentUser();

        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Tin nhắn không tồn tại"));

        // ✅ Kiểm tra user có trong room
        requireMembership(message.getRoom().getId(), current.getId());

        // Chỉ người gửi được sửa
        if (!message.getSender().getId().equals(current.getId())) {
            throw new RuntimeException("Bạn không có quyền sửa tin nhắn này");
        }

        message.edit(req.getContent());
        message = messageRepository.save(message);

        // Broadcast nội dung mới — cùng format MessageResponse
        MessageResponse updatedResponse = messageMapper.toResponse(message);
        messagingTemplate.convertAndSend(
                "/topic/room/" + message.getRoom().getId(),
                updatedResponse
        );

        log.debug("Message {} được sửa bởi {}", messageId, current.getUsername());
        return updatedResponse;
    }

    // ── Mark as read ──────────────────────────────────────────

    @Override
    public void markAsRead(Long roomId, Long messageId) {
        User current = getCurrentUser();

        RoomMember member = requireMembership(roomId, current.getId());

        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Tin nhắn không tồn tại"));

        if (member.getLastReadMessage() == null
                || messageId > member.getLastReadMessage().getId()) {
            member.setLastReadMessage(message);
            roomMemberRepository.save(member);
        }
    }
}
