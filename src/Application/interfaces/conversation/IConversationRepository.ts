import { Conversation } from "../../../Domain/entities/Conversation";



export interface IConversationRepository{
    createConversation(conversation : Conversation): Promise<Conversation|undefined>;
    getConversationsByUserId(userId : number): Promise<Conversation[]|undefined>
    getUnreadConversations(userId : number): Promise<Conversation[]|undefined>
    markAsRead(conversationIds : number[]): Promise<boolean|undefined>;
    getConversationById(conversationId:number):Promise<Conversation|undefined>;
    // getConversationBySenderAndReceiverIds(senderId : number, receiverId: number): Promise<Conversation| null>;
    deleteConversationByUserId(userId:number):Promise<string|undefined>
    getUnreadConversations(userId:Number):Promise<Conversation[]>
}