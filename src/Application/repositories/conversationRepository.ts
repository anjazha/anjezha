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

    async createConversation(conversation:Conversation): Promise<Conversation | undefined>{

        const {senderId, receiverId, conversationId} = conversation;
        const query = `INSERT INTO conversations (sender_id, receiver_id) VALUES ($1, $2) RETURNING *`;

        const values = [senderId, receiverId];

        // handle try catch 
        const [error, result ] = await safePromise( 
            () => this.client.query(query, values)
        );

        if(result.rows.length === 0) throw new HTTP500Error("Error while creating conversation");

        const {sender_id, receiver_id, update_at, id} = result.rows[0];
// 
        if(error) 
            throw new HTTP500Error("Error while creating conversation" + error.message);

         return new Conversation(sender_id, receiver_id, update_at, id);
    }
 
    async getConversationsByUserId(userId : number): Promise<Conversation[] | undefined>{

        // const query = `SELECT * FROM conversations
        //                WHERE sender_id = $1 or receiver_id = $1 
        //                ORDER BY update_at DESC`;

        const query = `SELECT 
                        conversations.id, 
                        json_build_object(
                            'senderId', sender_id, 
                            'name', se.name, 
                            'profilePicture', se.profile_picture
                        ) AS sender,
                        json_build_object(
                            'receiverId', receiver_id, 
                            'name', re.name, 
                            'profilePicture', re.profile_picture
                        ) AS receiver
                        FROM 
                        conversations
                        LEFT JOIN 
                        users se ON conversations.sender_id = se.id
                        LEFT JOIN 
                        users re ON conversations.receiver_id = re.id
                        WHERE sender_id = $1 or receiver_id = $1 
                        ORDER BY update_at DESC 
                        `
        const values = [userId];

        const [error, result ] = await safePromise( ()=> this.client.query(query, values));

        if(error) 
            throw new HTTP500Error("Error while fetching conversations" + error.message);
         // mapping to entites  
    //      let conversations;     
    //   if(result.rows)  
    //        conversations = result.rows.map((conversation:any) => { 
    //         return new Conversation(
    //                 conversation.sender_id, 
    //                 conversation.receiver_id, 
    //                 conversation.update_at, 
    //                 conversation.id
    //             );
    //     })    

      
        return result.rows;
    }

    // async getConversationBySenderAndReceiverIds(senderId : number, receiverId: number): Promise<Conversation| null>{

    //     const query = `SELECT * FROM conversations
    //                    WHERE sender_id IN ($1, $2) AND receiver_id IN ($1, $2) `;

    //     const values = [senderId, receiverId];

    //     const [error, result ] = await safePromise( ()=> this.client.query(query, values));

    //     if(error) 
    //         throw new HTTP500Error("Error while fetching conversations" + error.message);
        
   

    //     if(result.rows.length === 0) return null;

    //     let newConversation = new Conversation(
    //         result.rows[0].sender_id, 
    //         result.rows[0].receiver_id, 
    //         result.rows[0].update_at, 
    //         result.rows[0].id
    //     ); 

    //     return newConversation;
    // }

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

    async checkConversationExist (senderId:number, receiverId:number) : Promise<number> {
        
        const query = `
                 SELECT id 
                   FROM conversations 
                   WHERE ( sender_id = $1 AND receiver_id = $2) 
                   or  (sender_id = $2 And receiver_id = $1);

        `

        const values = [senderId, receiverId]

        const [error, result] = await safePromise(()=> this.client.query(query, values));

        // if (error) throw new HTTP500Error(error.messaage);

        // console.log(result)

       return result.rowCount > 0 ? result.rows[0] : null;


    }

    async updateConversation (conversationId:number): Promise<boolean>{

        const query = `
        update conversations set update_at = NOW()
        where id = $1`
        
        const values = [conversationId]

        const [error, result] = await safePromise( () => this.client.query(query, values));

        // check 
        if (error) throw new HTTP500Error(error.messaage);

        return result.rows[0] == true;

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