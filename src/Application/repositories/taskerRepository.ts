import { Tasker } from "@/Domain/entities/Tasker";
import { ITaskerRepository } from "../interfaces/User/ITaskerRepository";
import { pgClient } from "@/Infrastructure/database";
import { Client } from "pg";
import { injectable } from "inversify";


@injectable()
export class TaskerRepository implements ITaskerRepository {
    private client: Client;
    constructor() {
        this.client = pgClient;
    }

    async createTasker(tasker: Tasker): Promise<Tasker> {      
        try {

            const { userId, bio, pricing, longitude, latitude, category_id, bidding } = tasker;

            const query = 'INSERT INTO taskers (user_id, bio, pricing, longitude, latitude, category_id, bidding) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
            const values = [userId, bio, pricing, longitude, latitude, category_id, bidding];
            const { rows } = await this.client.query(query, values);
            return rows[0];
        } catch (error) {
            throw error;
        } 
        // finally {
        //     this.client.release();
        // }
   
   
   
   
    }

    async getTaskerById(id: number): Promise<Tasker> {
      
        try {
            const query = 'SELECT * FROM taskers WHERE user_id = $1';
            const values = [id];
            const { rows } = await this.client.query(query, values);
            return rows[0];
        } catch (error) {
            throw error;
        } 
        // finally {
        //     this.client.release();
        // }
    }


    async getAllTaskers(): Promise<Tasker[]> {
      
        try {
            const { rows } = await this.client.query('SELECT * FROM taskers');
            return rows;
        } catch (error) {
            throw error;
        } 
        // finally {
        //     this.client.release();
        // }
    }

    async getTaskerByUserId(userId: number): Promise<Tasker> {
        
          try {
                const query = 'SELECT * FROM taskers WHERE user_id = $1';
                const values = [userId];
                const { rows } = await this.client.query(query, values);
                return rows[0];
          } catch (error) {
                throw error;
          } 
          // finally {
          //     this.client.release();
          // }
     }


     



    async updateTasker(tasker: Tasker): Promise<string> {
      
        try {

            let query = `UPDATE taskers SET `;
            let values = [];

            // loop through tasker object and build query
            for (const key in tasker) {
                if (key !== 'id') {
                    query += `${key} = $${values.length + 1}, `;
                    values.push(tasker[key]);
                }
            }

            // remove last two string from query space and comma
            query = query.slice(0, -2);

            // add where clause to query
            query += ` WHERE user_id = ${tasker.userId}`;

            await this.client.query(query, values);

            return 'Tasker updated successfully';

        } catch (error) {
            throw error;
        } 
        // finally {
        //     this.client.release();
        // }
    }


    async deleteTasker(id: number): Promise<string> {
      
        try {
            const query = 'DELETE FROM taskers WHERE user_id = $1';
            const values = [id];
            await this.client.query(query, values);
            return 'Tasker deleted successfully';
        } catch (error) {
            throw error;
        }

    }


}


