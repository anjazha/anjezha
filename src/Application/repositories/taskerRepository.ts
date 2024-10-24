import { Client, Pool } from "pg";
import { injectable } from "inversify";

import { Tasker } from "@/Domain/entities/Tasker";
import { ITaskerRepository } from "../interfaces/User/Tasker/ITaskerRepository";
import { pgClient } from "@/Infrastructure/database";

import { HTTP500Error } from "@/helpers/ApiError";
import { safePromise } from "@/helpers/safePromise";
import { tsConfigLoader } from "tsconfig-paths/lib/tsconfig-loader";
import { Skills } from "@/Domain/entities/Skills";


@injectable()
export class TaskerRepository implements ITaskerRepository {
    private client: Pool | Client;
    constructor() {
        this.client = pgClient;
    }

    async createTasker(tasker: Tasker): Promise<Tasker | undefined> {      
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

    async getTaskerById(id: number): Promise<Tasker | undefined> { 
        // console.log(id)
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
                sks.name as skillName,
                rvs.rating,
                rvs.review,
                rvs.user_id,
                rvs.tasker_id
            FROM 
                taskers ts 
            INNER JOIN 
                users us ON us.id = ts.user_id
            INNER JOIN 
                roles rs ON ts.user_id = rs.user_id
            LEFT JOIN 
                tasker_skills tsk ON ts.user_id = tsk.tasker_id
            LEFT JOIN 
                skills sks ON sks.id = tsk.skill_id
             LEFT JOIN 
                reviews rvs ON ts.id = rvs.tasker_id 
            WHERE 
               ts.id = $1`;

            const values = [id];

            const { rows } = await this.client.query(query, values);

            console.log(rows[0]);
            
            if(rows.length == 0) return undefined;
            
            const data:Tasker = {
                id: rows[0].id,
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
                    category: rows[0].category,
                },
                profile: {
                    name: rows[0].name,
                    email: rows[0].email,
                    // phoneNumber: rows[0].phone,
                    password: '',
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
                reviews: [
                    // {
                    //     rating:rows[0].rating,
                    //     review:rows[0].review,
                    //     userId: rows[0].user_id,
                    //     taskerId:rows[0].tasker_id
                    // }
                ]
            }

         if(rows.length == 0) return undefined;

          return data;

        } catch (error:any) {
            throw new HTTP500Error('An error occurred ' + error.message + error.stack);
        } 
        // finally {
        //     this.client.release();
        // }
    }

    async checkTaskerById(id:number):Promise<any>{
        
        const query = `select * from taskers where id = $1 returning *`
        const [error, result] = await safePromise(()=> this.client.query(query, [+id]));

        if(error) throw new HTTP500Error('tasker not found');
        return result.rows[0];
    }

    async getTaskerByUserId(userId: number): Promise<Tasker| undefined> {
         console.log(userId)
        
          try {
                const query = 'SELECT * FROM taskers WHERE user_id = $1';
    
                const values = [userId];
    
                const { rows } = await this.client.query(query, values);
                
                console.log(rows)

                if(rows.length == 0) return undefined;

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

    async updateTasker(tasker: Tasker): Promise<string | undefined> {
      
        // try {  {categoryId , bio, pricing }
            let query = `UPDATE taskers SET `;
            const values:any = [];
            let idx = values.length + 1;

            // loop through tasker object and build query
            for (const key in tasker) {
                if (key !== 'id' && key !== "userId") {
                    let dbKey;
                    if(key === 'categoryId')  dbKey = 'category_id';
                    // if(key === 'userId')  dbKey = 'user_id';
                    else dbKey = key;

            
                    query += `${dbKey} = $${idx++}, `;
                    values.push((tasker as any)[key]);
                }
            }

            // remove last two string from query space and comma
            query = query.slice(0, -2);

            // add where clause to query
            query += ` WHERE user_id = $${idx}`;
            values.push(tasker['userId'])
            // query += ` returning *`

            console.log(query);
            console.log(values);

            const [error, result] =  await safePromise(() =>  this.client.query(query, values));

            console.log(result.rows);

            
            if (error) {
                throw new HTTP500Error(`An error occurred + ${error.message} + ${error.stack}`);
                console.log(error.message);
                console.log(error.stack);
            } 

            // if(result.rows.length == 0) throw {};

            // console.log(result.rows[0])

            // const {user_id, }
            return  'tasker updated'
        // finally {
        //     this.client.release();
        // }
    }


    async deleteTasker(id: number): Promise<string | undefined> {
      
        try {
            const query = 'DELETE FROM taskers WHERE user_id = $1';
            const values = [id];
            await this.client.query(query, values);
            return 'Tasker deleted successfully';
        } catch (error) {
            throw error;
        }

    }


    async getAllTaskers(): Promise<Tasker[] | undefined> {
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
                tasker_skills tsk ON ts.user_id = tsk.tasker_id
            LEFT JOIN 
                skills sks ON sks.id = tsk.skill_id
            /* LEFT JOIN 
                reviews rvs ON ts.id = rvs.tasker_id */
            `;

            const { rows } = await this.client.query(query);

            return rows.map((row: any) => {
                return {
                    userId: row?.userid,
                    bio: row?.bio,
                    pricing: row?.pricing,
                    longitude: row?.longitude,
                    latitude: row?.latitude,
                    bidding: row?.bidding,
                    role: row?.role,
                    categoryId: row?.categoryId,
                    category: {
                        id: row?.categoryId,
                        category: row?.category
                    },
                    profile: {
                        name: row?.name,
                        email: row?.email,
                        // phoneNumber: row.phone,
                        password: '',
                        profilePicture: row.profilePicture,
                        id: row?.userId,
                        phoneNumber: row?.phoneumber,
                    },
                    skills: row.map((row: any) => {
                        return {
                            id: row?.skillId,
                            skill: row?.skillName
                        };
                    }),
                    reviews: []
                };
            });

        } catch (error:any) {
            throw new HTTP500Error('An error occurred ' + error.message + error.stack);
        } 
        // finally {
        //     this.client.release();
        // }
    }

  async getTaskerFeed(match: any): Promise<any[] | undefined> {
    // let skills =Skills?:[];
    const { latitude, longitude, category, skills, limit, offset } = match;
    const VALUES = [latitude, longitude, category, 0, limit, offset, skills];
    const len = VALUES.length;

    let query = `
        SELECT 
            ts.id,
            count(distinct ts.id) as totalTaskersCount,
            ts.user_id as userId,
            us.email,
            us.phone_number as phoneNumber,
            us.profile_picture as profilePicture,   
            us.name,
            ts.bio,
            ARRAY_AGG(DISTINCT sks.name) AS skillName,
            COUNT(DISTINCT CASE WHEN sks.name = ANY($${len}) THEN sks.id END) AS matchedSkillsCount,  -- Count of matched skills
            2 * 6371 * asin(
                sqrt(
                    POWER(sin((radians($1) - radians(coalesce(ts.latitude, 0))) / 2), 2) + 
                    cos(radians($1)) * cos(radians(coalesce(ts.latitude, 0))) * 
                    POWER(sin((radians($2) - radians(coalesce(ts.longitude, 0))) / 2), 2)
                )
            ) AS distance
        FROM 
            taskers ts 
        INNER JOIN 
            users us ON us.id = ts.user_id
        LEFT JOIN 
            tasker_skills tsk ON ts.user_id = tsk.tasker_id
        LEFT JOIN 
            skills sks ON sks.id = tsk.skill_id
        WHERE 
            category_id = $3
    `;

     if (skills && skills.length > 0) {
        query += ` AND sks.name IS NOT NULL`;
      }

    query += `
        GROUP BY ts.id, us.email, us.phone_number, us.profile_picture, us.name, ts.bio
        HAVING 
            2 * 6371 * asin(
                sqrt(
                    POWER(sin((radians($1) - radians(coalesce(ts.latitude, 0))) / 2), 2) + 
                    cos(radians($1)) * cos(radians(coalesce(ts.latitude, 0))) * 
                    POWER(sin((radians($2) - radians(coalesce(ts.longitude, 0))) / 2), 2)
                )
            ) <> $4
        ORDER BY matchedSkillsCount DESC, distance 
        LIMIT $5 OFFSET $6`;

    //   VALUES.push(limit, offset);

    console.log(query);
    console.log(VALUES);

    const [error, result] = await safePromise(() => this.client.query(query, VALUES));

    if (error) throw new HTTP500Error(error.message);

    console.log(result.rows);

    return result.rows;
}


async search(q: string = "", filters: any, sortBy: string): Promise<any[] | undefined> {
    let {
        category,
        minBudget,
        maxBudget,
        minRating,
        maxRating,
        longitude,
        latitude,
        maxDistance,
        limitNum: limit,
        offset,
    } = filters || {};

    let query = `
        SELECT 
            ts.id,
            count(DISTINCT us.id) as totalTasker,
            ts.user_id as userId,
            ts.pricing as price,
            us.email,
            us.phone_number as phoneNumber,
            us.profile_picture as profilePicture,   
            us.name,
            ts.bio,
            array_agg(sks.name) as skillName
    `;

    // maxDistance = maxDistance? maxDistance:10;

    const values = [q || ""];
    let idx = values.length + 1;

    // if (longitude && latitude) {
    //     query += `,
    //          2 * 6371 * asin(
    //             sqrt(
    //                 POWER(sin((radians($${idx}) - radians(coalesce(ts.latitude, 0))) / 2), 2) + 
    //                 cos(radians($${idx})) * cos(radians(coalesce(ts.latitude, 0))) * 
    //                 POWER(sin((radians($${idx+1}) - radians(coalesce(ts.longitude, 0))) / 2), 2)
    //             )
    //         ) AS distance
    //     `;

    //     values.push(latitude, longitude);

    //     idx += 2;
    // }

    query += `
      FROM 
        taskers ts 
        INNER JOIN users us ON us.id = ts.user_id
        INNER JOIN roles rs ON ts.user_id = rs.user_id
        LEFT JOIN tasker_skills tsk ON ts.user_id = tsk.tasker_id
        LEFT JOIN skills sks ON sks.id = tsk.skill_id
        LEFT JOIN reviews rvs ON ts.id = rvs.tasker_id
      WHERE 
        (to_tsvector('english', coalesce(us.name, '') || ' ' || coalesce(ts.bio, '') || ' ' || coalesce(sks.name, '')) @@ plainto_tsquery('english', $1)
         OR
         to_tsvector('arabic', coalesce(us.name, '') || ' ' || coalesce(ts.bio, '') || ' ' || coalesce(sks.name, '')) @@ plainto_tsquery('arabic', $1)
         ) 
         OR
         (
         -- coalesce(us.name, '') like '%' || $1 || '%'
              coalesce(us.name, '') ILIKE '%' || $1 || '%'
               OR
              coalesce(ts.bio, '') ILIKE '%' || $1 || '%'
               OR
              coalesce(sks.name, '') ILIKE '%' || $1 || '%'
          )
          `;

    // Handle filters
    if (category) {
        query += ` AND category_id = $${idx} `;
        values.push(category);
        idx++;
    }
    if (minBudget) {
        query += `AND coalesce(pricing, 0) >= $${idx} `;
        values.push(minBudget);
        idx++;
    }
    if (maxBudget && maxBudget < 10000) {
        query += `AND coalesce(pricing, 0) <= $${idx} `;
        values.push(maxBudget);
        idx++;
    }
    if (minRating) {
        query += `AND coalesce(rating, 0) >= $${idx} `;
        values.push(minRating);
        idx++;
    }
    if (maxRating && maxRating <= 5) {
        query += `AND coalesce(rating, 0) <= $${idx} `;
        values.push(maxRating);
        idx++;
    }

    query += ` GROUP BY ts.id, us.name, us.email, us.phone_number, us.profile_picture, ts.bio`;

    if (longitude && latitude ) {
        // console.log('long')
    query +=`
        HAVING 
            2 * 6371 * asin(
                sqrt(
                    POWER(sin((radians($${idx}) - radians(coalesce(ts.latitude, 0))) / 2), 2) + 
                    cos(radians($${idx})) * cos(radians(coalesce(ts.latitude, 0))) * 
                    POWER(sin((radians($${idx+1}) - radians(coalesce(ts.longitude, 0))) / 2), 2)
                )
            ) <= $${idx + 2}`
      

       values.push(latitude, longitude, maxDistance);

        // values.push(maxDistance);

        // console.log(values[idx-1]);

        idx+=3;
    }

    if (sortBy !== undefined) {
        query += ` ORDER BY $${idx}`;
        values.push(sortBy);
        idx++;
    }

    if (sortBy === undefined && longitude && latitude) {
        query += ` ORDER BY distance ASC`;
    }

    query += ` LIMIT $${idx} OFFSET $${idx + 1}`;
    values.push(limit, offset);

    // console.log(values[1], values[2]);
    console.log(values);
    // Execute query
    const [error, result] = await safePromise(
           () => this.client.query(query, values));

    if (error) throw new HTTP500Error('An error occurred ' + error.message + error.stack);

    // Return an empty array if no results are found
    if (result.rows.length === 0) {
        return [];
    }

    // Debugging to check the structure
    console.log(result.rows[0]);

    return result.rows;
}



    async countAllTasker():Promise<number> {
        const query = `select count(*)  from taskers`
        const [error, result ] = await safePromise(()=> this.client.query(query));
        if(error) throw new HTTP500Error(error.message);
        return result.count;
    }
    

    async getTaskerByEmail(email: string): Promise<Tasker | undefined> {
        throw new Error("Method not implemented.");
    }


    async getTaskerByPhoneNumber(phoneNumber: string): Promise<Tasker | undefined> {
        throw new Error("Method not implemented.");
    }

    

    async getTaskerBySkillId(skillId: number): Promise<Tasker[] | undefined> {
        throw new Error("Method not implemented.");
    }


}


