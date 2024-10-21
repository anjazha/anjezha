// import {Message} from "@/Domain/entities/Message"
import {Message} from "../../../Domain/entities/Message"


export interface IMessageRepository{
    createMessage(message : Message): Promise<Message>;
    getMessages(conversationId : number): Promise<Message[]>
    getUnreadMessages(conversationId : number): Promise<Message[]>
    markAsRead(messageIds : number[]): Promise<boolean>;
    getMessageById(messageId : number): Promise<Message>
    updateMessage(message : string, messageId:number): Promise<string>;
    deleteMessage(messageId : number): Promise<string>;
    getMessagesBySenderId(senderId : number): Promise<Message[]>
    getMessagesByReceiverId(receiverId : number): Promise<Message[]>
    getMessagesByconversationId(conversationId : number, limit:number, skip:number): Promise<Message[]>
    getMessagesByStatus(messageStatus : string): Promise<Message[]>
    getMessagesByDate(date : Date): Promise<Message[]>
    // getMessagesByDateRange(startDate : Date,endDate : Date): Promise<Message[]>
    // getMessagesBySenderIdAndReceiverId(senderId : number,receiverId : number): Promise<Message[]>
    // getMessagesBySenderIdAndconversationId(senderId : number,conversationId : number): Promise<Message[]>
    // getMessagesByReceiverIdAndconversationId(receiverId : number,conversationId : number): Promise<Message[]>
    // getMessagesBySenderIdAndReceiverIdAndconversationId(senderId : number,receiverId : number,conversationId : number): Promise<Message[]>
    // getMessagesBySenderIdAndStatus(senderId : number,messageStatus : string): Promise<Message[]>
}