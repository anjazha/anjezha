import { Conversation } from "@/Domain/entities/Conversation";

export interface IConversationService {
       createConversation(conversation:Conversation):Promise<string|undefined>;
       getConversationsByUserId(userId:number):Promise<Conversation[]|undefined>;
       getConversationById(conversationId:number) : Promise<Conversation|undefined>
       deleteConversaitonByUserId(userId:number):Promise<any|undefined>
}