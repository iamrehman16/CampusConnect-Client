import api from "@/shared/api/axios.instance";
import type {
  Conversation,
  GetMessagesParams,
  Message,
  StartConversationDto,
} from "../types/chat-dto";
import type { PaginatedResult } from "@/shared/types/api.types";

export class ChatService {
  async getMyConversations(): Promise<Conversation[]> {
    const { data } = await api.get<Conversation[]>("conversations");
    return data;
  }

  async findOrCreateConversation(
    dto: StartConversationDto,
  ): Promise<Conversation> {
    const { data } = await api.post<Conversation>("conversations", dto);
    return data;
  }

  async getMessages(
    params: GetMessagesParams,
  ): Promise<PaginatedResult<Message>> {
    const { data } = await api.get<PaginatedResult<Message>>("messages", {
      params,
    });
    return data;
  }
}

export const chatService = new ChatService();
