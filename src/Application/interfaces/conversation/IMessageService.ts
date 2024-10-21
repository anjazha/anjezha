// import {Message} from "@/Domain/entities/Message"
import {Message} from "@/Domain/entities/Message"


export interface IMessageService{
    createMessage(message : Message): Promise<Message>;
    getMessages(chatId : number): Promise<Message[]>
    getMessageById(messageId:number):Promise<Message>
    updateMessage(message:Message, messageId:number):Promise<string>
    deleteMessage(messageId:number):Promise<string>
    getUnreadMessages(chatId : number): Promise<Message[]>
    markAsRead(messageIds : number[]): Promise<boolean>;

}