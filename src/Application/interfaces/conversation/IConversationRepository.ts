import { Conversation } from "../../../Domain/entities/Conversation";



export interface IConversationRepository{
    create(conversation : Conversation): Promise<boolean>;
    getConversations(userId : number): Promise<Conversation[]>
    getUnreadConversations(userId : number): Promise<Conversation[]>
    markAsRead(conversationIds : number[]): Promise<boolean>;
}