// import {Message} from "@/Domain/entities/Message"
import {Message} from "../../../Domain/entities/Message"


export interface IMessageRepository{
    create(message : Message): Promise<boolean>;
    getMessages(chatId : number): Promise<Message[]>
    getUnreadMessages(chatId : number): Promise<Message[]>
    markAsRead(messageIds : number[]): Promise<boolean>;
    getMessageById(messageId : number): Promise<Message>
    updateMessage(message : Message): Promise<boolean>;
    deleteMessage(messageId : number): Promise<boolean>;
    getMessagesBySenderId(senderId : number): Promise<Message[]>
    getMessagesByReceiverId(receiverId : number): Promise<Message[]>
    getMessagesByChatId(chatId : number): Promise<Message[]>
    getMessagesByStatus(messageStatus : string): Promise<Message[]>
    getMessagesByDate(date : Date): Promise<Message[]>
    // getMessagesByDateRange(startDate : Date,endDate : Date): Promise<Message[]>
    // getMessagesBySenderIdAndReceiverId(senderId : number,receiverId : number): Promise<Message[]>
    // getMessagesBySenderIdAndChatId(senderId : number,chatId : number): Promise<Message[]>
    // getMessagesByReceiverIdAndChatId(receiverId : number,chatId : number): Promise<Message[]>
    // getMessagesBySenderIdAndReceiverIdAndChatId(senderId : number,receiverId : number,chatId : number): Promise<Message[]>
    // getMessagesBySenderIdAndStatus(senderId : number,messageStatus : string): Promise<Message[]>
}