import { inject, injectable } from "inversify";

import { IConversationService } from "../interfaces/conversation/IConversationService";
import { INTERFACE_TYPE } from "@/helpers/containerConst";
import { IConversationRepository } from "../interfaces/conversation/IConversationRepository";
import { Conversation } from "@/Domain/entities/Conversation";
import { safePromise } from "@/helpers/safePromise";


@injectable()
export class ConversationService implements IConversationService{
    constructor(        
        @inject(INTERFACE_TYPE.ConversationRepository) private conversationRepository:IConversationRepository    
    ){ }


    async createConversation(conversation: Conversation): Promise<string|undefined> {
       return await this.conversationRepository.createConversation(conversation);
    }

     async getConversationsByUserId(userId: number): Promise<Conversation[]|undefined> {
        return await this.conversationRepository.getConversationsByUserId(userId);
    }

    async getConversationById(conversationId: number): Promise<Conversation|undefined> {
        return await this.conversationRepository.getConversationById(conversationId)
    }

    async deleteConversaitonByUserId(userId: number): Promise<any|undefined> {
        
        return  await this.conversationRepository.deleteConversationByUserId(userId);

    }

    // async updateConversation(conversation: Conversation): Promise<any|undefined> {

     

    // async deleteConversationById(conversationId: number): Promise<any|undefined> {
    //     return await this.conversationRepository.deleteConversationById(conversationId);
    // }

}