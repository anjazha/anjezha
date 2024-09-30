import { inject, injectable } from "inversify";
import { Message } from "../../Domain/entities/Message";


@injectable()
export class ConversationService{
    constructor(){
        // @inject()

    }

    create(message : Message): Promise<boolean>{
        throw new Error("Method not implemented.");
    }

    getMessages(chatId : number): Promise<Message[]>{
        throw new Error("Method not implemented.");
    }

    getUnreadMessages(chatId : number): Promise<Message[]>{
        throw new Error("Method not implemented.");
    }

    markAsRead(messageIds : number[]): Promise<boolean>{
        throw new Error("Method not implemented.");
    }

    getMessageById(messageId : number): Promise<Message>{
        throw new Error("Method not implemented.");
    }

    updateMessage(message : Message): Promise<boolean>{
        throw new Error("Method not implemented.");
    }

    deleteMessage(messageId : number): Promise<boolean>{
        throw new Error("Method not implemented.");
    }



}