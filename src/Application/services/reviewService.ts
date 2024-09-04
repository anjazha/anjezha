import { inject, injectable } from "inversify";
import { IReviewService } from "../interfaces/IReviewService";
import { INTERFACE_TYPE } from "@/helpers";
import { IReviewRepository } from "../interfaces/IReviewRepository";
import { Review } from "@/Domain/entities/Review";

@injectable()
export class ReviewService implements IReviewService {

     constructor(
        @inject(INTERFACE_TYPE.ReviewRepository) private reviewRepository: IReviewRepository) { }


    async createReview(review: Review): Promise<Review> {
        try {
            // call createReview method from reviewRepository  and pass review object
            return await this.reviewRepository.createReview(review);

            // return review object
        } catch (err) {
            throw new Error(`Error creating review: ${err.message} ${err.stack}`);
        }
    }


    async getReviewById(id: number): Promise<Review> {
        try {
            // call getReviewById method from reviewRepository  and pass id
            return await this.reviewRepository.getReviewById(id);
        } catch (err) {

            throw new Error(`Error fetching review: ${err.message} ${err.stack}`);
        }

    }

    async getReviews(): Promise<Review[]> {
        try {
            // call getReviews method from reviewRepository
            return await this.reviewRepository.getReviews();
        } catch (err) {
            throw new Error(`Error fetching reviews: ${err.message} ${err.stack}`);
        }
    }

    async getReviewByUserId(userId: number): Promise<Review[]> {
        try {
            // call getReviewByUserId method from reviewRepository  and pass userId
            return await this.reviewRepository.getReviewByUserId(userId);
        } catch (err) {
            throw new Error(`Error fetching reviews: ${err.message} ${err.stack}`);
        }
    }


    async getReviewByTaskerId(taskerId: number): Promise<Review[]> {
        try {
            // call getReviewByTaskerId method from reviewRepository  and pass taskerId
            return await this.reviewRepository.getReviewByTaskerId(taskerId);
        } catch (err) {
            throw new Error(`Error fetching reviews: ${err.message} ${err.stack}`);
        }
    }

    async updateReview(id: number, review: Review): Promise<Review> {
        try {
            // call updateReview method from reviewRepository  and pass id and review object
            return await this.reviewRepository.updateReview(id, review);
        } catch (err) {
            throw new Error(`Error updating review: ${err.message} ${err.stack}`);
        }
    }

    async deleteReview(id: number): Promise<boolean> {
        try {
            // call deleteReview method from reviewRepository  and pass id
            return await this.reviewRepository.deleteReview(id);
        } catch (err) {
            throw new Error(`Error deleting review: ${err.message} ${err.stack}`);
        }
    }
    


}

