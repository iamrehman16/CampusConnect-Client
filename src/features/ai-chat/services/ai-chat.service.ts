import api from "@/shared/api/axios.instance";
import type { ChatMessageDto, ChatResponseDto } from "../types/ai-chat.dto";


export class AiChatService{


    async sendMessage(dto:ChatMessageDto):Promise<ChatResponseDto>{

        const {data} = await api.post<ChatResponseDto>('chat',dto);
        return data;

    }

    async clearSession():Promise<ChatMessageDto>{
        const {data} = await api.delete('chat/session');
        return data;
    }

}

export const aiChatService = new AiChatService();
