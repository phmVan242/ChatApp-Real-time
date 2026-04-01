package com.example.ChatApp.mapper;

import com.example.ChatApp.dto.MessageResponse;
import com.example.ChatApp.entity.Message;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MessageMapper {

    private final UserMapper userMapper;

    public MessageResponse toResponse(Message message) {
        if (message == null) return null;

        MessageResponse res = new MessageResponse();
        res.setId(message.getId());
        res.setRoomId(message.getRoom().getId());
        res.setSender(userMapper.toResponse(message.getSender()));
        res.setType(message.getType());
        res.setDeleted(message.isDeleted());
        res.setCreatedAt(message.getCreatedAt());

        // Ẩn nội dung nếu tin đã bị xóa
        if (!message.isDeleted()) {
            res.setContent(message.getContent());
            res.setAttachmentUrl(message.getAttachmentUrl());
        }

        // Xử lý replyTo
        if (message.getReplyTo() != null) {
            res.setReplyToId(message.getReplyTo().getId());
            res.setReplyToContent(
                    message.getReplyTo().isDeleted()
                            ? "Tin nhắn đã bị xóa"
                            : message.getReplyTo().getContent()
            );
        }

        return res;
    }

}