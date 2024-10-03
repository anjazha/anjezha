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

     async createMessage(message : Message): Promise<string>{

        const query = `INSERT INTO messages (conversation_id, sender_id, message) VALUES ($1, $2, $3)`;

        const values = [message.conversationId, message.senderId,message.message];

        const [error, result ] = await safePromise(()=> this.client.query(query, values));

        if(error)  
             throw new HTTP500Error("Error while creating message" + error.message);

        return "message is created";
     }
    

      async getMessages(conversationId : number): Promise<Message[]>{

        const query = `SELECT * FROM messages WHERE conversation_id = $1 ORDER BY sent_at DESC`;
        const values = [conversationId];

        const [error, result ] = await safePromise( () => this.client.query(query, values));

        if(error) throw new HTTP500Error("Error while fetching messages" + error.message + error.stack);
        const messages = result.rows.map((message:any) => 

            new Message(
                message.sender_id, 
                message.conversation_id, 
                message.message, 
                message.message_status, 
                message.change_status_at,
                message.receiver_id, 
                message.sent_at, 
                message.id, 
                message.attachments)
        )

        return messages;
       }

        async getUnreadMessages(conversationId : number): Promise<Message[]>{
            const query = `SELECT * FROM messages WHERE conversation_id = $1 AND message_status = $2 ORDER BY created_at DESC`;
            const values = [conversationId, "SENT"];
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

            // use safePromise to handle the promise rejection
            const [error, result ] = await safePromise(()=>this.client.query(query, values));

            // throw an error if there is an error
            if(error) throw new HTTP500Error("Error while fetching message" + error.message + error.stack);

            // return the message object
            const message = result.rows[0];

            // return the message object
            return new Message(
                message.sender_id, 
                message.conversation_id, 
                message.message, 
                message.message_status, 
                message.change_status_at,
                message.receiver_id, 
                message.sent_at, 
                message.id, 
                message.attachments)
        }

        async updateMessage(message : Message, messageId:number): Promise<string>{
            // update the message with the given id
            const query = `UPDATE messages SET message = $1 WHERE id = $2`;

            // values to be updated
            const values = [message.message, messageId];

            // use safePromise to handle the promise rejection
            const [error, result ] = await safePromise( ()=>this.client.query(query, values));
            // throw an error if there is an error
            if(error) throw new HTTP500Error("Error while updating message" + error.message);
            // return a success message
            return 'message updated';
        }

        async deleteMessage(messageId : number): Promise<string>{

            // delete the message with the given id
            const query = `DELETE FROM messages WHERE id = $1`;
            // messageId to be delete message
            const values = [messageId];

            // use safePromise to handle the promise rejection
            const [error, result ] = await safePromise(()=>this.client.query(query, values));

            // throw an error if there is an error
            if(error) throw new HTTP500Error("Error while deleting message" + error.message);
            // return a success message
            return "message deleted";
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

        async getMessagesByconversationId(conversationId : number): Promise<Message[]>{
            const query = `SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at DESC`;
            const values = [conversationId];
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