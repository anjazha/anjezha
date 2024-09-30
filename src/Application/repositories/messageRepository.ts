import { injectable } from "inversify";
import { Pool } from "pg";
import { pgClient } from "../../Infrastructure/database";
import { Message } from "../../Domain/entities/Message";
import { HTTP500Error } from "../../helpers/ApiError";
import { safePromise } from "../../helpers/safePromise";
import { IMessageRepository } from "../interfaces/conversation/IMessageRepository";



@injectable()
export class MessageRepository implements IMessageRepository{
    private client:Pool;
    constructor(
        // @inject("IMessageService") private messageService: IMessageService
    ){
        this.client= pgClient;
    }

     async create(message : Message): Promise<boolean>{
        const query = `INSERT INTO messages (chat_id, sender_id, receiver_id, message, message_status, created_at) VALUES ($1, $2, $3, $4, $5, $6)`;

        const values = [message.chatId, message.senderId, message.reciverId, message.message, message.messageStatus, message.createdAt];

        const [error, result ] = await safePromise(()=>this.client.query(query, values));
        if(error) throw new HTTP500Error("Error while creating message" + error.message);
        return true;
     }
    

      async getMessages(chatId : number): Promise<Message[]>{

        const query = `SELECT * FROM messages WHERE chat_id = $1 ORDER BY created_at DESC`;
        const values = [chatId];
        const [error, result ] = await safePromise(()=>this.client.query(query, values));
        if(error) throw new HTTP500Error("Error while fetching messages" + error.message);
        return result.rows;
       }

        async getUnreadMessages(chatId : number): Promise<Message[]>{
            const query = `SELECT * FROM messages WHERE chat_id = $1 AND message_status = $2 ORDER BY created_at DESC`;
            const values = [chatId, "SENT"];
            const [error, result ] = await safePromise(()=>this.client.query(query, values));
            if(error) throw new HTTP500Error("Error while fetching messages" + error.message);
            return result.rows;
        }

        async markAsRead(messageIds : number[]): Promise<boolean>{
            const query = `UPDATE messages SET message_status = $1 WHERE id = ANY($2)`;
            const values = ["READ", messageIds];
            const [error, result ] = await safePromise(()=>this.client.query(query, values));
            if(error) throw new HTTP500Error("Error while marking messages as read" + error.message);
            return true;
        }

        async getMessageById(messageId : number): Promise<Message>{
            const query = `SELECT * FROM messages WHERE id = $1`;
            const values = [messageId];
            const [error, result ] = await safePromise(()=>this.client.query(query, values));
            if(error) throw new HTTP500Error("Error while fetching message" + error.message);
            return result.rows[0];
        }

        async updateMessage(message : Message): Promise<boolean>{
            const query = `UPDATE messages SET message = $1, message_status = $2, change_status_at = $3 WHERE id = $4`;
            const values = [message.message, message.messageStatus, message.changeStatusAt, message.id];
            const [error, result ] = await safePromise(()=>this.client.query(query, values));
            if(error) throw new HTTP500Error("Error while updating message" + error.message);
            return true;
        }

        async deleteMessage(messageId : number): Promise<boolean>{
            const query = `DELETE FROM messages WHERE id = $1`;
            const values = [messageId];
            const [error, result ] = await safePromise(()=>this.client.query(query, values));
            if(error) throw new HTTP500Error("Error while deleting message" + error.message);
            return true;
        }

        async getMessagesBySenderId(senderId : number): Promise<Message[]>{
            const query = `SELECT * FROM messages WHERE sender_id = $1 ORDER BY created_at DESC`;
            const values = [senderId];
            const [error, result ] = await safePromise(()=>this.client.query(query, values));
            if(error) throw new HTTP500Error("Error while fetching messages" + error.message);
            return result.rows;
        }

        async getMessagesByReceiverId(receiverId : number): Promise<Message[]>{
            const query = `SELECT * FROM messages WHERE receiver_id = $1 ORDER BY created_at DESC`;
            const values = [receiverId];
            const [error, result ] = await safePromise(()=>this.client.query(query, values));
            if(error) throw new HTTP500Error("Error while fetching messages" + error.message);
            return result.rows;
        }

        async getMessagesByChatId(chatId : number): Promise<Message[]>{
            const query = `SELECT * FROM messages WHERE chat_id = $1 ORDER BY created_at DESC`;
            const values = [chatId];
            const [error, result ] = await safePromise(()=>this.client.query(query, values));
            if(error) throw new HTTP500Error("Error while fetching messages" + error.message);
            return result.rows;
        }

        async getMessagesByStatus(messageStatus : string): Promise<Message[]>{
            const query = `SELECT * FROM messages WHERE message_status = $1 ORDER BY created_at DESC`;
            const values = [messageStatus];
            const [error, result ] = await safePromise(()=>this.client.query(query, values));
            if(error) throw new HTTP500Error("Error while fetching messages" + error.message);
            return result.rows;
        }


        async getMessagesByDate(date : Date): Promise<Message[]>{
            const query = `SELECT * FROM messages WHERE created_at = $1 ORDER BY created_at DESC`;
            const values = [date];
            const [error, result ] = await safePromise(()=>this.client.query(query, values));
            if(error) throw new HTTP500Error("Error while fetching messages" + error.message);
            return result.rows;
        }


}