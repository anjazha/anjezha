import { Conversation } from "@/Domain/entities/Conversation";

export interface IConversationService {
       createConversation(conversation:Conversation):Promise<Conversation|undefined>;
       getConversationsByUserId(userId:number):Promise<Conversation[]|undefined>;
       getConversationById(conversationId:number) : Promise<Conversation|undefined>;
       // getConversationBySenderAndReceiverIds(senderId:number, receiverId:number): Promise<Conversation|null>;
       deleteConversaitonByUserId(userId:number):Promise<any|undefined>;
}