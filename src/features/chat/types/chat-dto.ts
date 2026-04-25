import type { PaginationParams } from "@/shared/types/api.types";

export interface StartConversationDto {
  participantId: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageAt: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMessageDto {
  conversationId: string;
  content: string; //max 2000
}

export interface DeleteMessageDto {
  messageId: string;
  conversationId: string;
}

export interface GetMessagesParams extends PaginationParams {
  conversationId: string;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: string;
  content: string;
  seen: boolean;
  seenAt: Date | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MarkSeenDto {
  conversationId: string;
  seenBy: string;
}
