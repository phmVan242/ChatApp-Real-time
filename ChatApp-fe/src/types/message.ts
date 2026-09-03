// src/types/message.ts
export interface MessageResponse {
  id: number;
  content: string;
  type: string;       // TEXT, JOIN, LEAVE, etc.
  senderId: number;
  senderName: string;
  senderAvatar?: string;
  createdAt: string;
  isDeleted: boolean;
  replyToId?: number;
  attachmentUrl?: string;
}