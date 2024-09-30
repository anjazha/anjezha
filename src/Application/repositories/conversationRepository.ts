import { injectable } from "inversify";
import {Pool} from 'pg'
import { pgClient } from "../../Infrastructure/database";
import { safePromise } from "../../helpers/safePromise";
import { HTTP500Error } from "../../helpers/ApiError";
import { Conversation } from "../../Domain/entities/Conversation";



@injectable()
export class ConversationRepository{
    private client:Pool;
    constructor(){
        this.client= pgClient;
    }

    async create(userId:number, taskerId:number): Promise<boolean>{
        const query = `INSERT INTO conversations (user_id, tasker_id) VALUES ($1, $2)`;

        const values = [userId, taskerId];

        const [error, result ] = await safePromise(()=>this.client.query(query, values));
        if(error) throw new HTTP500Error("Error while creating conversation" + error.message);
        return true;
    }
 
    async getConversations(userId : number): Promise<Conversation[]>{

        const query = `SELECT * FROM conversations WHERE user_id = $1 ORDER BY created_at DESC`;
        const values = [userId];
        const [error, result ] = await safePromise(()=>this.client.query(query, values));
        if(error) throw new HTTP500Error("Error while fetching conversations" + error.message);
        return result.rows;
    }

    async getUnreadConversations(userId : number): Promise<Conversation[]>{
        const query = `SELECT * FROM conversations WHERE user_id = $1 AND conversation_status = $2 ORDER BY created_at DESC`;
        const values = [userId, "SENT"];
        const [error, result ] = await safePromise(()=>this.client.query(query, values));
        if(error) throw new HTTP500Error("Error while fetching conversations" + error.message);
        return result.rows;
    }

    async markAsRead(conversationIds : number[]): Promise<boolean>{
        const query = `UPDATE conversations SET conversation_status = $1 WHERE id = ANY($2)`;
        const values = ["READ", conversationIds];
        const [error, result ] = await safePromise(()=>this.client.query(query, values));
        if(error) throw new HTTP500Error("Error while marking conversations as read" + error.message);
        return true;
    }

    async getConversationById(conversationId : number): Promise<Conversation>{
        const query = `SELECT * FROM conversations WHERE id = $1`;
        const values = [conversationId];
        const [error, result ] = await safePromise(()=>this.client.query(query, values));
        if(error) throw new HTTP500Error("Error while fetching conversation" + error.message);
        return result.rows[0];
    }

    async getConversationByTaskerId(taskerId : number): Promise<Conversation>{
        const query = `SELECT * FROM conversations WHERE tasker_id = $1`;
        const values = [taskerId];
        const [error, result ] = await safePromise(()=>this.client.query(query, values));
        if(error) throw new HTTP500Error("Error while fetching conversation" + error.message);
        return result.rows[0];
    }

    // async updateConversation(conversation : Conversation): Promise<boolean>{
    //     const query = `UPDATE conversations SET conversation_status = $1 WHERE id = $2`;
    //     const values = [conversation.conversationStatus, conversation.id];
    //     const [error, result ] = await safePromise(()=>this.client.query(query, values));
    //     if(error) throw new HTTP500Error("Error while updating conversation" + error.message);
    //     return true;
    // }

    async deleteConversation(conversationId : number): Promise<boolean>{
        const query = `DELETE FROM conversations WHERE id = $1`;
        const values = [conversationId];
        const [error, result ] = await safePromise(()=>this.client.query(query, values));
        if(error) throw new HTTP500Error("Error while deleting conversation" + error.message);
        return true;
    }

    async deleteConversationByTaskerId(taskerId : number): Promise<boolean>{
        const query = `DELETE FROM conversations WHERE tasker_id = $1`;
        const values = [taskerId];
        const [error, result ] = await safePromise(()=>this.client.query(query, values));
        if(error) throw new HTTP500Error("Error while deleting conversation" + error.message);
        return true;
    }

    async deleteConversationByUserId(userId : number): Promise<boolean>{
        const query = `DELETE FROM conversations WHERE user_id = $1`;
        const values = [userId];
        const [error, result ] = await safePromise(()=>this.client.query(query, values));
        if(error) throw new HTTP500Error("Error while deleting conversation" + error.message);
        return true;
    }

    async deleteConversationByUserIdAndTaskerId(userId : number, taskerId : number): Promise<boolean>{
        const query = `DELETE FROM conversations WHERE user_id = $1 AND tasker_id = $2`;
        const values = [userId, taskerId];
        const [error, result ] = await safePromise(()=>this.client.query(query, values));
        if(error) throw new HTTP500Error("Error while deleting conversation" + error.message);
        return true;
    }




}