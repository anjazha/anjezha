import { Review } from "@/Domain/entities/Review";


export interface IReviewRepository {
    createReview(review: Review): Promise<Review | null>;
    getReviewById(id: number): Promise<Review | null>;
    getReviews(): Promise<Review[] | null>;
    getReviewByUserId(userId: number): Promise<Review[] | null>;
    getReviewByTaskerId(taskerId: number): Promise<Review[] | null>;
    updateReview(id: number, review: Review): Promise<Review | null>;
    deleteReview(id: number): Promise<boolean>;
}