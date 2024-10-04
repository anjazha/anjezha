import { Tasker } from "@/Domain/entities/Tasker";
import { ITaskerRepository } from "../interfaces/User/ITaskerRepository";
import { pgClient } from "@/Infrastructure/database";
import { Client, Pool } from "pg";
import { injectable } from "inversify";
import { HTTP500Error } from "@/helpers/ApiError";
import { an } from "@faker-js/faker/dist/airline-BBTAAfHZ";


@injectable()
export class TaskerRepository implements ITaskerRepository {
    private client: Pool | Client;
    constructor() {
        this.client = pgClient;
    }

    async createTasker(tasker: Tasker): Promise<Tasker> {      
        try {

            const { userId, bio, pricing, longitude, latitude, categoryId, bidding } = tasker;

            const query = 'INSERT INTO taskers (user_id, bio, pricing, longitude, latitude, category_id, bidding) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';

            const values = [userId, bio, pricing, longitude, latitude, categoryId, bidding];

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
        console.log(id)
        try {
            const query = `
            SELECT 
                ts.id,
                ts.user_id as userId,
                ts.bio,
                ts.pricing,
                ts.longitude,
                ts.latitude,
                ts.category_id as categoryId,
                ts.bidding,
                us.name,
                us.email,
                us.profile_picture as profilePicture,
                us.created_at as createdAt,
                us.phone_number as phoneNumber,
                rs.name as role,
                sks.id as skillId,
                sks.name as skillName
            FROM 
                taskers ts 
            INNER JOIN 
                users us ON us.id = ts.user_id
            INNER JOIN 
                roles rs ON ts.user_id = rs.user_id
            LEFT JOIN 
                tasker_skills tsk ON ts.user_id = tsk.user_id
            LEFT JOIN 
                skills sks ON sks.id = tsk.skill_id
            /* LEFT JOIN 
                reviews rvs ON ts.id = rvs.tasker_id */
            WHERE 
               ts.user_id = $1`;

            const values = [id];

            const { rows } = await this.client.query(query, values);

            console.log(rows[0]);
            
            if(rows.length == 0) return null;
            
            const data:Tasker = {
                userId: rows[0].userid,
                bio: rows[0].bio,
                pricing: rows[0].pricing,
                longitude: rows[0].longitude,
                latitude: rows[0].latitude,
                bidding: rows[0].bidding,
                role: rows[0].role,
                categoryId: rows[0].categoryId,

                category: {
                    id: rows[0].categoryId,
                    category: rows[0].category
                },
                profile: {
                    name: rows[0].name,
                    email: rows[0].email,
                    // phoneNumber: rows[0].phone,
                    password: null,
                    profilePicture: rows[0].profilepicture,
                    id: rows[0].userId,
                    phoneNumber: rows[0].phoneumber,
                },

                skills: rows.map((row: any) => {
                    return {
                        id: row.skillId,
                        skill: row.skillName
                    };
                }),
                reviews: []
            }

         if(rows.length == 0) return null;

             return data;

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


