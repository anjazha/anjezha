import { Review } from "@/Domain/entities/Review";


export interface IReviewService {
    createReview(review: Review): Promise<Review>;
    getReviewById(id: number): Promise<Review>;
    getReviews(): Promise<Review[]>;
    getReviewByUserId(userId: number): Promise<Review[]>;
    getReviewByTaskerId(taskerId: number): Promise<Review[]>;
    updateReview(id: number, review: Review): Promise<Review>;
    deleteReview(id: number): Promise<boolean>;
}