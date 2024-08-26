import { injectable } from "inversify";
import { Pool } from "pg";

import { pgClient, connectDB, disconnectDB } from "@/Infrastructure/database";
import { User } from "@/Domain/entities/User";
import { IUserRepository } from "../interfaces/User/IUserRepository";

// repository for user


@injectable()
export class UserRepository implements IUserRepository{
    private client: any;
    constructor(){
    //    this.pool = pgClient;
      this.client = pgClient;
    }


    async create(user: any): Promise<User> {
        // await connectDB();
        const query = `INSERT INTO users (name, email, password, phone_number `;
        const values = [user.name, user.email, user.password,  user.phoneNumber];
        let placeholders = `($1, $2, $3, $4`;

        if(user.profilePicture){
            query.concat(`, profile_picture `);
            values.push(user.profilePicture);
            placeholders.concat(`, $${values.length}`);
        }

        query.concat(`) VALUES ${placeholders}) RETURNING *`);



        const { rows } = await pgClient.query(query, values);
        // await disconnectDB();
        return rows[0];
    }

    async findByEmail(email: string): Promise<User | null> {
        // await connectDB();
        const { rows } = await pgClient.query('SELECT * FROM users WHERE email = $1', [email]);
        // await disconnectDB();
        return rows[0] || null;
    }

    async findById(id: number): Promise<User | null> {
        // await connectDB();
        const { rows } = await pgClient.query('SELECT * FROM users WHERE id = $1', [id]);
        // await disconnectDB();
        return rows[0] || null;
    }


    async update(id:number, user: any): Promise<User> {
        // await connectDB();
        const query = `UPDATE users SET `;
        const values = [];

        // not sure if this is the best way to do thispre
        if(user.name){
            query.concat(`name = $1`);
            values.push(user.name);
        }

        if(user.email){
            query.concat(`, email = $${values.length + 1}`);
            values.push(user.email);
        }

        if(user.password){
            query.concat(`, password = $${values.length + 1}`);
            values.push(user.password);
        }

        if(user.phoneNumber){
            query.concat(`, phone_number = $${values.length + 1}`);
            values.push(user.phoneNumber);
        }

        
        if(user.profilePicture){
            query.concat(`, profile_picture = $${values.length + 1}`);
            values.push(user.profilePicture);
        }

        query.concat(` WHERE id = $${values.length+1} RETURNING *`);
        values.push(id);

        const { rows } = await pgClient.query(query, values);
        // await disconnectDB();
        return rows[0];
    }

    async delete(id: number): Promise<boolean> {
        // await connectDB();
        await pgClient.query('DELETE FROM users WHERE id = $1', [id]);
        // await disconnectDB();
        return true;
        }

     async findAll(): Promise<User[]> {
        // await connectDB();
        const { rows } = await pgClient.query('SELECT * FROM users');
        // await disconnectDB();
        return rows;
    }


}



