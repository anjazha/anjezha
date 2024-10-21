

import { inject, injectable } from "inversify";
import { Message } from "../../Domain/entities/Message";
import { IConversationService } from "../interfaces/conversation/IConversationService";
import { IMessageService } from "../interfaces/conversation/IMessageService";
import { INTERFACE_TYPE } from "@/helpers/containerConst";
import { IMessageRepository } from "../interfaces/conversation/IMessageRepository";


@injectable()
export class MessageService implements IMessageService{
    constructor(
        @inject(INTERFACE_TYPE.MessageRepository) private messageRepository:IMessageRepository
    ){}

    async createMessage(message : Message): Promise<Message>{
        return await this.messageRepository.createMessage(message); 
    }

    async getMessages(conversationId : number): Promise<Message[]>{
        return await this.messageRepository.getMessages(conversationId);
    
    }

   async getUnreadMessages(chatId : number): Promise<Message[]>{
        return await this.messageRepository.getUnreadMessages(chatId);
    }

    async markAsRead(messageIds : number[]): Promise<boolean>{
       return await this.messageRepository.markAsRead(messageIds);
    }

    async getMessageById(messageId : number): Promise<Message>{
        return await this.messageRepository.getMessageById(messageId)
    }

    async updateMessage(message : Message, messageId:number): Promise<string>{
        return await this.messageRepository.updateMessage(message.message, +messageId)
    }

    async deleteMessage(messageId : number): Promise<string>{
        return await this.messageRepository.deleteMessage(messageId);
    }



}