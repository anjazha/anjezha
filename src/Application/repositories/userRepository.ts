import { injectable } from "inversify";
import { Client, Pool } from "pg";

import { pgClient, connectDB, disconnectDB } from "@/Infrastructure/database";
import { User } from "@/Domain/entities/User";
import { IUserRepository } from "../interfaces/User/IUserRepository";
import { HTTP500Error } from "@/helpers/ApiError";

// repository for user

@injectable()
export class UserRepository implements IUserRepository {
  private client: Pool;
  constructor() {
    //    this.pool = pgClient;
    this.client = pgClient;
  }

  async create(user: User): Promise<User> {
    // await connectDB();
    console.log(user);

    try{
      //users
      let query = `INSERT INTO users (name, email, password, phone_number`;
      const values = [user.name, user.email, user.password,  user.phoneNumber];
      let placeholders = `($1, $2, $3, $4`;
      
      if (user.profilePicture){
          query += 'profile_picture';
          values.push(user.profilePicture);
          placeholders+=`, $${values.length}`;
      }
      
       query += `) values ${placeholders}) RETURNING *`;
      
      
      const { rows } = await this.client.query(query, values);
      // console.log(rows[0]);
      // await disconnectDB();
      return new User(rows[0].name, rows[0].email, rows[0].password, rows[0].phone_number, rows[0].id, rows[0].profile_picture);
    } catch(err:any){
      throw new Error('An error occurred' + err.message + err.stack);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
   try{ // await connectDB();
    const { rows } = await this.client.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    // await disconnectDB();
       return rows[0] || null;
      } catch(err:any){
        throw new Error('An error occurred ' + err.message + err.stack);
    }
  }

  async findById(id: number): Promise<User> {
    try{// await connectDB();
        const { rows } = await this.client.query("SELECT * FROM users WHERE id = $1", [
          id,
        ]);
    // await disconnectDB();
        return rows[0] || null;
      }  catch(err:any){
      throw new Error('An error occurred' + err);
      }
  }

  async update(id: number, user: any): Promise<any> {
    // await connectDB();
    // Object.keys(user).forEach((key, i) => {
    //     query.concat(`${key} = $${i + 1}, `);
    //     values.push(user[key]);
    // })
     //  not sure if this is the best way to do thispre
    // if (user.name) {
    //   query.concat(`name = $1`);
    //   values.push(user.name);
    // }

    // if (user.email) {
    //   query.concat(`, email = $${values.length + 1}`);
    //   values.push(user.email);
    // }

    // if (user.password) {
    //   query.concat(`, password = $${values.length + 1}`);
    //   values.push(user.password);
    // }

    // if (user.phoneNumber) {
    //   query.concat(`, phone_number = $${values.length + 1}`);
    //   values.push(user.phoneNumber);
    // }

    // if (user.profilePicture) {
    //   query.concat(`, profile_picture = $${values.length + 1}`);
    //   values.push(user.profilePicture);
    // }

    
     // for(let key in user) {

       
     //   if(user.hasOwnProperty(key)) {

     //     if (key == 'profilePicture') {

     //        values.push(user[key]);
     //        key='profile_picture'
     //        query += `${key} = $${index}, `
     //     }
     //     // key = key == 'profilePicture'? 'profile_picture': key;
     //   else {
     //     query += `${key} = $${index}, `;
     //     values.push(user[key]);
     //   }

     //   index++;            
     //   }
     // }
      try{ 

       let query = `UPDATE users SET `;
        const values = [];
        let index=1;

        Object.keys(user).forEach(key => {

          let dbkey ='';
          // if( key == 'profilePicture' || key == 'phoneNumber'  ){}
          if (key == 'profilePicture' )  dbkey = 'profile_picture';
          else if (key == 'phoneNumber')  dbkey = 'phone_number';
          else    dbkey = key;
        

           query += `${dbkey} = $${index}, `;

           values.push(user[key]);

           index++;
        })

        query = query.slice(0, -2);
        

        query += (` WHERE id = $${index} RETURNING *`);
        values.push(id);

      console.log(query);

      console.log(values)

      
      const { rows } = await this.client.query(query, values);
    // await disconnectDB();
     const {name, email, password, phone_number, profile_picture } = rows[0]

    return  new User(name, email, password, phone_number, profile_picture);
    
    
    } catch(err:any){
        throw new Error('Could not update user' + err.message + err.stack);

   }
  }

  async updateProfilePicture(id:string, profilePicture:any):Promise<any>{

   try{ 
        const query = `update users set profile_picture = $1 where id=$2`
        const values=[profilePicture, id];

        const {rows} = await this.client.query(query, values);
        // extract fields from rows 
        const {name, email, password, phone_number, profile_picture}= rows[0];
        // return user data
        return new User(name, email, password, phone_number, profile_picture);
    }catch(err:any){
      return new HTTP500Error(`error in update profile picture + ${err.message}`)
    }
    
  }

async delete(id: number): Promise<string> {
   try{ // await connectDB();
    await this.client.query("DELETE FROM users WHERE id = $1", [id]);
    // await disconnectDB();
    return "user deleted";
      } catch(err:any){
         throw new Error('An error occurred' + err);
      }
  }

  async findAll(): Promise<User[]> {
    try { // await connectDB();
        const { rows } = await this.client.query("SELECT * FROM users");
        // await disconnectDB();
        
      
        
        return rows.map((user:any) =>{
           const {name, email, password, phone_number, profile_picture } = user;
  
            return  new User(name, email, password, phone_number, profile_picture);
         
        }
        )
    } catch(err:any){
      throw new Error('An error occurred' + err.message + err.stack);
    }
}
  
}
