import { inject, injectable } from "inversify";
import { IReviewService } from "../interfaces/IReviewService";
import { INTERFACE_TYPE } from "@/helpers/containerConst";
import { IReviewRepository } from "../interfaces/IReviewRepository";
import { Review } from "@/Domain/entities/Review";
import { ITaskerRepository } from "../interfaces/User/Tasker/ITaskerRepository";
import { HTTP500Error } from "@/helpers/ApiError";

@injectable()
export class ReviewService implements IReviewService {

     constructor(
        @inject(INTERFACE_TYPE.TaskerRepository) private taskerRepository: ITaskerRepository,
        @inject(INTERFACE_TYPE.ReviewRepository) private reviewRepository: IReviewRepository) { }


    async createReview(review: Review): Promise<Review | null> {
        try {
            let {taskerId} = review;
            // check if taskerId is valid
            // check in db if tasker is exist or not 
             const tasker = await this.taskerRepository.getTaskerById(taskerId!);
            // if tasker is not exist throw error
            if (!tasker) {
                throw new HTTP500Error("Tasker id is required valid");
            }

            // check if taskerId is equal to userId
            if (+taskerId! === +review.User!) 
                throw new HTTP500Error("You can't write review to yourself");

            // check if review exist befor or not 
            const reviewExist = await this.reviewRepository.getReviewByTaskerId(taskerId!);
            // if review exist throw error
            if (reviewExist) {
                throw new HTTP500Error("Review already exist");
            }

            // call createReview method from reviewRepository  and pass review object
            return await this.reviewRepository.createReview(review);

            // return review object
        } catch (err:any) {
            throw new HTTP500Error(`Error creating review: ${err.message} ${err.stack}`);
        }
    }


    async getReviewById(id: number): Promise<Review | null> {
        try {
            // call getReviewById method from reviewRepository  and pass id
            return await this.reviewRepository.getReviewById(id);
        } catch (err:any) {

            throw new HTTP500Error(`Error fetching review: ${err.message} ${err.stack}`);
        }

    }

    async getReviews(): Promise<Review[] | null> {
        try {
            // call getReviews method from reviewRepository
            return await this.reviewRepository.getReviews();
        } catch (err:any) {
            throw new HTTP500Error(`Error fetching reviews: ${err.message} ${err.stack}`);
        }
    }

    async getReviewByUserId(userId: number): Promise<Review[] | null> {
        try {
            // call getReviewByUserId method from reviewRepository  and pass userId
            return await this.reviewRepository.getReviewByUserId(userId);
        } catch (err:any) {
            throw new HTTP500Error(`Error fetching reviews: ${err.message} ${err.stack}`);
        }
    }


    async getReviewByTaskerId(taskerId: number): Promise<Review[] | null> {
        try {
            console.log(taskerId);
            // call getReviewByTaskerId method from reviewRepository  and pass taskerId
            return await this.reviewRepository.getReviewByTaskerId(taskerId);
        } catch (err:any) {
            throw new HTTP500Error(`Error fetching reviews: ${err.message} ${err.stack}`);
        }
    }

    async updateReview(id: number, review: Review): Promise<Review | null> {
        try {
            // call updateReview method from reviewRepository  and pass id and review object
            return await this.reviewRepository.updateReview(id, review);
        } catch (err:any) {
            throw new HTTP500Error(`Error updating review: ${err.message} ${err.stack}`);
        }
    }

    async deleteReview(id: number): Promise<boolean> {
        try {
            // call deleteReview method from reviewRepository  and pass id
            return await this.reviewRepository.deleteReview(id);
        } catch (err:any) {
            throw new HTTP500Error(`Error deleting review: ${err.message} ${err.stack}`);
        }
    }
    


}

