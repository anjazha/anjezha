import { injectable } from "inversify";
import {Pool} from 'pg'
import { pgClient } from "../../Infrastructure/database";
import { safePromise } from "../../helpers/safePromise";
import { HTTP500Error } from "../../helpers/ApiError";
import { Conversation } from "../../Domain/entities/Conversation";
import { IConversationRepository } from "../interfaces/conversation/IConversationRepository";



@injectable()
export class ConversationRepository implements IConversationRepository{
    private client:Pool;
    constructor(){
        this.client= pgClient;
    }

    async createConversation(conversation:Conversation): Promise<string | undefined>{

        const {userId, taskerId, conversationId} = conversation;
        const query = `INSERT INTO conversations (user_id, tasker_id, id) VALUES ($1, $2, $3)`;

        const values = [userId, taskerId, conversationId];

        // handle try catch 
        const [error, result ] = await safePromise( 
            () => this.client.query(query, values)
        );

        if(error) 
            throw new HTTP500Error("Error while creating conversation" + error.message);

         return "conversation created sucessfuly" ;
    }
 
    async getConversationsByUserId(userId : number): Promise<Conversation[] | undefined>{

        const query = `SELECT * FROM conversations WHERE user_id = $1 ORDER BY created_at DESC`;
        const values = [userId];

        const [error, result ] = await safePromise( ()=> this.client.query(query, values));

        if(error) 
            throw new HTTP500Error("Error while fetching conversations" + error.message);
         // mapping to entites       
        const conversations = result.rows.map((conversation:any) => { 
            return new Conversation(
                    conversation.user_id, 
                    conversation.tasker_id, 
                    conversation.created_at, 
                    conversation.id
                );
        })    

      
        return conversations;
    }

    async getUnreadConversations(userId : number): Promise<Conversation[]> {

        const query = `SELECT * FROM conversations WHERE user_id = $1 AND conversation_status = $2 ORDER BY created_at DESC`;
        const values = [userId, "SENT"];
        const [error, result ] = await safePromise(()=>this.client.query(query, values));
        if(error) throw new HTTP500Error("Error while fetching conversations" + error.message);
        return result.rows;
    }

    async markAsRead(conversationIds : number[]): Promise<boolean|undefined>{
        const query = `UPDATE conversations SET conversation_status = $1 WHERE id = ANY($2)`;
        const values = ["READ", conversationIds];
        const [error, result ] = await safePromise(()=>this.client.query(query, values));
        if(error)  
            throw new HTTP500Error("Error while marking conversations as read" + error.message);
        return true;
    }

    async getConversationById(conversationId : number): Promise<Conversation>{

        const query = `SELECT * FROM conversations WHERE id = $1`;
        const values = [conversationId];

        // handle try catch
        const [error, result ] = await safePromise(()=> this.client.query(query, values));
        // if error throw error
        if(error) throw new HTTP500Error("Error while fetching conversation" + error.message);

        // if result is empty throw
        if (result.rows.length === 0) throw new HTTP500Error("Conversation not found");
        

        const {user_id, tasker_id, created_at, id} =  result.rows[0];

        // return conversation
        return new Conversation(user_id, tasker_id, created_at, id);

    }

    // async getConversationByTaskerId(taskerId : number): Promise<Conversation>{
    //     const query = `SELECT * FROM conversations WHERE tasker_id = $1`;
    //     const values = [taskerId];
    //     const [error, result ] = await safePromise(()=>this.client.query(query, values));
    //     if(error) throw new HTTP500Error("Error while fetching conversation" + error.message);
    //     return result.rows[0];
    // }

    // async updateConversation(conversation : Conversation): Promise<boolean>{
    //     const query = `UPDATE conversations SET conversation_status = $1 WHERE id = $2`;
    //     const values = [conversation.conversationStatus, conversation.id];
    //     const [error, result ] = await safePromise(()=>this.client.query(query, values));
    //     if(error) throw new HTTP500Error("Error while updating conversation" + error.message);
    //     return true;
    // }

    async deleteConversationByUserId(conversationId : number): Promise<string>{
        const query = `DELETE FROM conversations WHERE id = $1`;
        const values = [conversationId];
        const [error, result ] = await safePromise(()=>this.client.query(query, values));
        if(error) throw new HTTP500Error("Error while deleting conversation" + error.message);
        return "true";
    }

    // async deleteConversationByTaskerId(taskerId : number): Promise<boolean>{
    //     const query = `DELETE FROM conversations WHERE tasker_id = $1`;
    //     const values = [taskerId];
    //     const [error, result ] = await safePromise(()=>this.client.query(query, values));
    //     if(error) throw new HTTP500Error("Error while deleting conversation" + error.message);
    //     return true;
    // }

   

    // async deleteConversationByUserIdAndTaskerId(userId : number, taskerId : number): Promise<boolean>{
    //     const query = `DELETE FROM conversations WHERE user_id = $1 AND tasker_id = $2`;
    //     const values = [userId, taskerId];
    //     const [error, result ] = await safePromise(()=>this.client.query(query, values));
    //     if(error) throw new HTTP500Error("Error while deleting conversation" + error.message);
    //     return true;
    // }




}