import { inject, injectable } from "inversify";
import { IReviewService } from "../interfaces/IReviewService";
import { INTERFACE_TYPE } from "@/helpers/containerConst";
import { IReviewRepository } from "../interfaces/IReviewRepository";
import { Review } from "@/Domain/entities/Review";
import { ITaskerRepository } from "../interfaces/User/Tasker/ITaskerRepository";
import { HTTP400Error, HTTP500Error } from "@/helpers/ApiError";

@injectable()
export class ReviewService implements IReviewService {

     constructor(
        @inject(INTERFACE_TYPE.TaskerRepository) private taskerRepository: ITaskerRepository,
        @inject(INTERFACE_TYPE.ReviewRepository) private reviewRepository: IReviewRepository) { }


    async createReview(review: Review, userId: number): Promise<Review | null> {
        try {
            let {taskerId} = review;
            // check if taskerId is valid
            // check in db if tasker is exist or not 
             const tasker = await this.taskerRepository.getTaskerById(taskerId!);
            // if tasker is not exist throw error
            if (!tasker) {
                throw new HTTP400Error("Tasker id is required");
            }

            // check if taskerId is equal to userId
            if (+tasker.userId! === +review.User! || +taskerId! === +tasker.id! ) 
                throw new HTTP400Error("You can't write review to yourself");


                const userReviews = await this.reviewRepository.getReviewByUserId(Number(review.User));

                // if user have reviews and if user already review the tasker throw error
                if (userReviews) {
                    const reviewExist = userReviews.some((r) => r.taskerId == taskerId);
                    if (reviewExist) {
                        throw new HTTP400Error("Review already exist");
                    }
                }

            // const reviewExist = await this.reviewRepository.getReviewByTaskerId(taskerId!);
            // // if review exist throw error
            // if (reviewExist) {
            //     throw new HTTP500Error("Review already exist");
            // }

            // call createReview method from reviewRepository  and pass review object
            return await this.reviewRepository.createReview(review);

            // return review object
        } catch (err:any) {
            throw new HTTP500Error(`Error creating review: ${err.message}`);
        }
    }


    async getReviewById(id: number): Promise<Review | null> {
        try {
            // call getReviewById method from reviewRepository  and pass id
            return await this.reviewRepository.getReviewById(id);
        } catch (err:any) {

            throw new HTTP500Error(`Error fetching review: ${err.message} `);
        }

    }

    async getReviews(): Promise<Review[] | null> {
        try {
            // call getReviews method from reviewRepository
            return await this.reviewRepository.getReviews();
        } catch (err:any) {
            throw new HTTP500Error(`Error fetching reviews: ${err.message} `);
        }
    }

    async getReviewByUserId(userId: number): Promise<Review[] | null> {
        try {
            // call getReviewByUserId method from reviewRepository  and pass userId
            return await this.reviewRepository.getReviewByUserId(userId);
        } catch (err:any) {
            throw new HTTP500Error(`Error fetching reviews: ${err.message} `);
        }
    }


    async getReviewByTaskerId(taskerId: number): Promise<Review[] | null> {
        try {
            console.log(taskerId);
            // call getReviewByTaskerId method from reviewRepository  and pass taskerId
            return await this.reviewRepository.getReviewByTaskerId(taskerId);
        } catch (err:any) {
            throw new HTTP500Error(`Error fetching reviews: ${err.message} `);
        }
    }

    async updateReview(id: number, review: Review): Promise<Review | null> {
        try {
            // call updateReview method from reviewRepository  and pass id and review object
            return await this.reviewRepository.updateReview(id, review);
        } catch (err:any) {
            throw new HTTP500Error(`Error updating review: ${err.message} `);
        }
    }

    async deleteReview(id: number): Promise<boolean> {
        try {
            // call deleteReview method from reviewRepository  and pass id
            return await this.reviewRepository.deleteReview(id);
        } catch (err:any) {
            throw new HTTP500Error(`Error deleting review: ${err.message} `);
        }
    }
    


}

