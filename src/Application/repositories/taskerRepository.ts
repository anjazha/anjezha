import { Tasker } from "@/Domain/entities/Tasker";
import { ITaskerRepository } from "../interfaces/User/ITaskerRepository";
import { pgClient } from "@/Infrastructure/database";
import { Client, Pool } from "pg";
import { injectable } from "inversify";
import { HTTP500Error } from "@/helpers/ApiError";
import { an } from "@faker-js/faker/dist/airline-BBTAAfHZ";


@injectable()
export class TaskerRepository implements ITaskerRepository {
    private client: Pool;
    constructor() {
        this.client = pgClient;
    }

    async createTasker(tasker: Tasker): Promise<Tasker> {      
        try {

            const { userId, bio, pricing, longitude, latitude, category_id, bidding } = tasker;

            const query = 'INSERT INTO taskers (user_id, bio, pricing, longitude, latitude, category_id, bidding) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';

            const values = [userId, bio, pricing, longitude, latitude, category_id, bidding];

            const { rows } = await this.client.query(query, values);

            // return tasker data
            return new Tasker(
                 rows[0].user_id,
                 rows[0].bio,
                 rows[0].pricing,
                 rows[0].longitude,
                 rows[0].latitude,
                 rows[0].category_id,
                 rows[0].bidding,
                 rows[0].id);

        } catch (error:any) {
            throw new HTTP500Error('An error occurred ' + error.message + error.stack);
        } 
        // finally {
        //     this.client.release();
        // }
   
   
   
   
    }

    async getTaskerById(id: number): Promise<Tasker|null> {
      
        try {
            const query = 'SELECT * FROM taskers ts inner join users us on ts.user_id = us.id WHERE id = $1';

            const values = [id];

            const { rows } = await this.client.query(query, values);

         if(rows.length == 0) return null;

             return new Tasker(
                 rows[0].user_id,
                 rows[0].bio,
                 rows[0].pricing,
                 rows[0].longitude,
                 rows[0].latitude,
                 rows[0].category_id,
                 rows[0].bidding,
                 rows[0].id);

        } catch (error:any) {
            throw new HTTP500Error('An error occurred ' + error.message + error.stack);
        } 
        // finally {
        //     this.client.release();
        // }
    }

    async getTaskerByUserId(userId: number): Promise<Tasker| null> {
        
          try {
                const query = 'SELECT * FROM taskers WHERE user_id = $1';
    
                const values = [userId];
    
                const { rows } = await this.client.query(query, values);
    
                if(rows.length == 0) return null;
                return new Tasker(
                  rows[0].user_id,
                  rows[0].bio,
                  rows[0].pricing,
                  rows[0].longitude,
                  rows[0].latitude,
                  rows[0].category_id,
                  rows[0].bidding,
                  rows[0].id);
    
          } catch (error:any) {
                throw new HTTP500Error('An error occurred ' + error.message + error.stack);
          } 
        }

    async updateTasker(tasker: Tasker): Promise<string> {
      
        try {

            let query = `UPDATE taskers SET `;
            const values = [];

            // loop through tasker object and build query
            for (const key in tasker) {
                if (key !== 'id') {
                    query += `${key} = $${values.length + 1}, `;
                    values.push((tasker as any)[key]);
                }
            }

            // remove last two string from query space and comma
            query = query.slice(0, -2);

            // add where clause to query
            query += ` WHERE user_id = ${tasker.userId}`;

            await this.client.query(query, values);

            return 'Tasker updated successfully';

        } catch (error:any) {
            throw new HTTP500Error('An error occurred ' + error.message + error.stack);
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


