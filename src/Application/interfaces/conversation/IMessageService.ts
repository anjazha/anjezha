// import {Message} from "@/Domain/entities/Message"
import {Message} from "../../../Domain/entities/Message"


export interface IMessageService{
    create(message : Message): Promise<boolean>;
    getMessages(chatId : number): Promise<Message[]>
    getUnreadMessages(chatId : number): Promise<Message[]>
    markAsRead(messageIds : number[]): Promise<boolean>;
}