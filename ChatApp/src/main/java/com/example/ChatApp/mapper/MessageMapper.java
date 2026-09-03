package com.example.ChatApp.mapper;

import com.example.ChatApp.dto.message.MessageResponse;
import com.example.ChatApp.entity.Message;
import org.springframework.stereotype.Component;

@Component
public class MessageMapper {

    public MessageResponse toResponse(Message message) {
        if (message == null) return null;

        MessageResponse res = new MessageResponse();

        res.setId(message.getId());
        res.setRoomId(message.getRoom().getId());

        res.setSenderId(message.getSender().getId());
        res.setSenderName(message.getSender().getDisplayName());
        res.setSenderAvatar(message.getSender().getAvatarUrl());

        res.setType(message.getType());
        res.setDeleted(message.isDeleted());
        res.setCreatedAt(message.getCreatedAt());

        // content
        if (!message.isDeleted()) {
            res.setContent(message.getContent());
            res.setAttachmentUrl(message.getAttachmentUrl());
        } else {
            res.setContent("Tin nhắn đã bị xóa");
        }

        // reply
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