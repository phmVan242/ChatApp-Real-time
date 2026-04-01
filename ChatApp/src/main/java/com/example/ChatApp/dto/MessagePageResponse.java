package com.example.ChatApp.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessagePageResponse {

    private List<MessageResponse> messages;
    private int     currentPage;
    private int     totalPages;
    private long    totalElements;
    private boolean hasNext;
}