import { Tasker } from "@/Domain/entities/Tasker";
import { ITaskerRepository } from "../interfaces/User/ITaskerRepository";
import { pgClient } from "@/Infrastructure/database";
import { Client } from "pg";
import { injectable } from "inversify";


@injectable()
export class TaskerRepository implements ITaskerRepository {

    private client: Client;
    constructor(){
        this.client = pgClient
    }

    async createTasker(tasker: Tasker): Promise<Tasker> {
        
        const query = `INSERT INTO tasker (user_id, bio, pricing, longitude, latitude, category_id, biding) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
        const values = [tasker.userId, tasker.bio, tasker.pricing, tasker.longitude, tasker.latitude, tasker.category_id, tasker.biding];

        const result = this.client.query(query, values)
        return result.then((res) => {
            return res.rows[0]
        }).catch((err) => {
            console.log(err)
            return err
        })
        
    }

    async getTaskerById(id: number): Promise<Tasker> {
       const query = `select * from tasker where id = $1`;
         const values = [id];
        const result = this.client.query(query, values)
        return result.then((res) => {
            return res.rows[0]
        }).catch((err) => {
            console.log(err)
            return err
        })

    }
    async updateTasker(tasker: Tasker): Promise<string> {

        let query = `update tasker set `;
        let values = [];
        
        for(let key in tasker){
            if(tasker[key] !== undefined){
                query += `${key} = $${values.length + 1}, `;
                values.push(tasker[key])  
            }
        }
         

        query = query.slice(0, -2);

        query += ` where id = $${values.length + 1} RETURNING *`;
        values.push(tasker.id);

        await this.client.query(query, values);
        return "Tasker updated successfully"
    }
    async deleteTasker(Id:number): Promise<string> {

        const query = `delete from tasker where id = $1`;
        const values = [Id];
        await this.client.query(query, values);
        return "Tasker deleted successfully"
    }



    getTaskerByEmail?(email: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getTaskerByPhoneNumber?(phoneNumber: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getTaskerByLocation?(location: string): Promise<any[]> {
        throw new Error("Method not implemented.");
    }
    getTaskerByRating?(rating: number): Promise<any[]> {
        throw new Error("Method not implemented.");
    }
    getTaskerByTask?(task: any): Promise<any[]> {
        throw new Error("Method not implemented.");
    }

}
