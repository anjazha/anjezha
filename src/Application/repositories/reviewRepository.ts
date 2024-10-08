import { pgClient } from "@/Infrastructure/database";
import { injectable } from "inversify";
import { Client, Pool } from "pg";
import { IReviewRepository } from "../interfaces/IReviewRepository";
import { Review } from "@/Domain/entities/Review";
import { User } from "@/Domain/entities/User";


@injectable()
export class ReviewRepository implements IReviewRepository {
    private client:Pool|Client;
    constructor(){
        this.client= pgClient;
    }

    async createReview(review:Review):Promise<Review | null>{
        try {

            // write query to insert review
            const query = 'INSERT INTO reviews (review, rating, tasker_id, user_id) VALUES ($1, $2, $3, $4) RETURNING *';

            // pass review values
            const values = [review.review, review.rating, review.taskerId, review.User];
            // execute query
            const { rows } = await this.client.query(query, values);

            // rows is an array of reviews is empty return null
            if (!rows.length) return null;
            // map rows to review object
            return new Review(rows[0].review, rows[0].rating, rows[0].tasker_id, rows[0].user_id, rows[0].id, rows[0].created_at);
        } catch (err:any) {
            throw new Error(`Error creating review: ${err.message} ${err.stack}`);
        }
    }

    async getReviewById(id: number): Promise<Review | null> {
        try {

            // write query to get review by id
            const query = 'SELECT * FROM reviews WHERE id = $1';

            // pass id as value
            const values = [id];

            // execute query
            const { rows } = await this.client.query(query, values);

            // rows is an array of reviews is empty return null
            if (!rows.length) return null;

            // map rows[0] to review object
            const {review,
                rating,
                tasker_id,
                user_id,
                created_at, 
                name, 
                email,
                profile_picture,
                phone_number} = rows[0];

            const newUser= new User(name, email,"", phone_number, profile_picture, user_id)
            return new Review(
                rows[0].review, 
                rows[0].rating, 
                rows[0].tasker_id, 
                newUser, 
                rows[0].id, 
                rows[0].created_at);

        } catch (err:any) {
            throw new Error(`Error getting review : ${err.message} ${err.stack}`);
        }
    }

    async getReviews(): Promise<Review[] | null> {
        try {

            // write query to get all reviews
            const query = `
                  SELECT * FROM reviews rvs
                  JOIN 
                  users us on rvs.user_id = us.id`;

            // execute query
            const { rows } = await this.client.query(query);

            // rows is an array of reviews is empty return undefined
            if (!rows.length) return null;


            // map rows to review object
            return rows.map(
                (review: Review) => new Review(
                review.review, 
                review.rating, 
                review.taskerId, 
                review.User, 
                review.id, 
                review.timestamp));

        } catch (err:any) {
            throw new Error(`Error getting reviews: ${err.message} ${err.stack}`);
        }
    }

    async getReviewByUserId(userId: number): Promise<Review[] | null> {
        try {
            // write query to get review by user id
            const query = 'SELECT * FROM reviews WHERE user_id = $1';

            // pass user id as value
            const values = [userId];

            // execute query
            const { rows } = await this.client.query(query, values);

            // rows is an array of reviews is empty return null
            if (!rows.length) return null;

            // map rows to review object
            const reviews = rows.map( (review: Review) => new Review(
                review.review, 
                review.rating, 
                review.taskerId, 
                review.User, 
                review.id, 
                review.timestamp));

            return reviews;

        } catch (err:any) {
            throw new Error(`Error getting review by user id: ${err.message} ${err.stack}`);
        }
    }


    async getReviewByTaskerId(taskerId: number): Promise<Review[] | null> {
        try {

             
            // write query to get review by tasker id
            const query = `
                SELECT 
                     rvs.id as reviewId,
                     rvs.review,
                     rvs.rating,
                     rvs.tasker_id as taskerId,
                     us.id as userId,
                     us.name,
                     us.email, 
                     us.profile_picture,
                     us.phone_number
                     FROM reviews rvs
                     JOIN 
                     users us on rvs.user_id = us.id
                     WHERE rvs.tasker_id = $1`;

            // pass tasker id as value
            const values = [Number(taskerId)];

            // execute query
            const { rows } = await this.client.query(query, values);
            // rows is an array of reviews is empty return null
            console.log('rows')
            // console.log(rows);

            if (rows.length == 0) return null;

            // const {
            //     review,
            //     reviewId,
            //     rating,
            //     tasker_id,
            //     userId,
            //     created_at, 
            //     name, 
            //     email,
            //     profile_picture,
            //     phone_number} = rows[0];
            // // map rows to review object
            // const newUser= new User(name, email,"", phone_number, profile_picture, userId);

            const reviews = rows.map((review:any ) => 
                new Review(
                    review.review, review.rating, review.taskerid, 
                    new User(review.name, review.email, "", review.phone_number, review.profile_picture, review.userid),
                    review.reviewid
                )

            );

           return reviews;

        } catch (err:any) {
            throw new Error(`Error getting review by tasker id: ${err.message} ${err.stack}`);
        }
    }

    // async updateReview(id: number, review: Review): Promise<Review | null> {
    //     try {

    //         // write query to update review by id
    //         const query = 'UPDATE reviews SET review = $1, rating = $2, tasker_id = $3, user_id = $4 WHERE id = $5 RETURNING *';

    //         // pass review values
    //         const values = [review.review, review.rating, review.taskerId, review.userId, id];

    //         // execute query
    //         const { rows } = await this.client.query(query, values);

    //         // map rows to review object
    //         return new Review(rows[0].review, rows[0].rating, rows[0].tasker_id, rows[0].user_id, rows[0].id, rows[0].created_at);

    //     } catch (err:any) {
    //         throw new Error(`Error updating review: ${err.message} ${err.stack}`);
    //     }
    // }

    async updateReview(id: number, review: Review): Promise<Review | null> {
 
        try {
            // write query to update review by id
            let query = 'UPDATE reviews SET ';
            // pass review values
            const values:any = [];

            let index=1;

            // check if review is passed
             for(let key in review){
                if((review as any)[key]) {

                    query += `${key} = $${index++}, `;

                    values.push((review as any)[key]);

                }
            }
            // remove last comma
            query = query.slice(0, -2);

            // add where clause
            query += ` WHERE id = $${index} RETURNING *`;
            values.push(+id);
          
            // execute query
            const { rows } = await this.client.query(query, values);

            console.log(query);
            console.log(values);
            
            // rows is an array of reviews is empty return null
            if (!rows.length) return null;

            // map rows to review object
            return new Review(rows[0].review, rows[0].rating, rows[0].tasker_id, rows[0].user_id, rows[0].id, rows[0].created_at);
        } catch (err:any) {
            throw new Error(`Error updating review: ${err.message} ${err.stack}`);
        }
    }

    async deleteReview(id: number): Promise<boolean> {
        try {
            
            // write query to delete review by id
            const query = 'DELETE FROM reviews WHERE id = $1';

            // pass id as value
            const values = [+id];

            // execute query
            await this.client.query(query, values);

            return true;

        } catch (err:any) {
            throw new Error(`Error deleting review: ${err.message} ${err.stack}`);
        }
    }

}