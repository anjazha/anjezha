import { NextFunction, Response, Request } from "express";
import { inject, injectable } from "inversify";

import { IReviewService } from "@/Application/interfaces/IReviewService";
import RequestWithUserId from "@/Application/interfaces/Request";
import { INTERFACE_TYPE } from "@/helpers";
import { Review } from "@/Domain/entities/Review";

@injectable()
export class ReviewController {
    constructor(
        @inject(INTERFACE_TYPE.ReviewService) private reviewService: IReviewService ){}

    async createReview(req: RequestWithUserId, res: Response, next: NextFunction) {

        try {
            // get review and rating from request body
            
            const {review, rating} = req.body;
            const taskerId = Number(req.params.taskerId);

            // set the taskerId and userId
            
            const userId = Number(req.userId);

            // call createReview method from reviewService  and pass review object
            const newReview = await this.reviewService.createReview(new Review(review, rating, taskerId, userId));

            // return review object
            res.status(201).json({
                message: "Review created successfully",
                data: newReview
            });
        } catch (err) {
            next(
                new Error(`Error creating review: ${err.message} ${err.stack}`)
            );
        }
       
           
   
    }

    async getReviewById(req: Request, res: Response, next: NextFunction) {
        try {
            // get id from request params
            const id = Number(req.params.id);
            // call getReviewById method from reviewService  and pass id
            const review = await this.reviewService.getReviewById(id);
            // return review object
            res.status(200).json({
                message: "Review fetched successfully",
                data: review
            });
        } catch (err) {
            next(
                new Error(`Error fetching review: ${err.message} ${err.stack}`)
            );
        }
    }

    async getReviews(req: Request, res: Response, next: NextFunction) {
        try {
            // call getReviews method from reviewService
            const reviews = await this.reviewService.getReviews();
            // return reviews
            res.status(200).json({
                message: "Reviews fetched successfully",
                data: reviews
            });
        } catch (err) {
            next(
                new Error(`Error fetching reviews: ${err.message} ${err.stack}`)
            );
        }
    }

    async getReviewByUserId(req: Request, res: Response, next: NextFunction) {
        try {
            // get userId from request params
            const userId = Number(req.params.userId);
            // call getReviewByUserId method from reviewService  and pass userId
            const reviews = await this.reviewService.getReviewByUserId(userId);
            // return reviews
            res.status(200).json({
                message: "Reviews fetched successfully",
                data: reviews
            });
        } catch (err) {
            next(
                new Error(`Error fetching reviews: ${err.message} ${err.stack}`)
            );
        }
    }

    async getReviewByTaskerId(req: Request, res: Response, next: NextFunction) {
        try {
            // get taskerId from request params
            const taskerId = Number(req.params.taskerId);
            // call getReviewByTaskerId method from reviewService  and pass taskerId
            const reviews = await this.reviewService.getReviewByTaskerId(taskerId);
            // return reviews
            res.status(200).json({
                message: "Reviews fetched successfully",
                data: reviews
            });
        } catch (err) {
            next(
                new Error(`Error fetching reviews: ${err.message} ${err.stack}`)
            );
        }
    }

    async updateReview(req: Request, res: Response, next: NextFunction) {
        try {
            // get id from request params
            const id = Number(req.params.id);
            // get review and rating from request body
            // const {review, rating} = req.body;
            // call updateReview method from reviewService  and pass id and review object
            const updatedReview = await this.reviewService.updateReview(id, req.body);
            // return updated review
            res.status(200).json({
                message: "Review updated successfully",
                data: updatedReview
            });
        } catch (err) {
            next(
                new Error(`Error updating review: ${err.message} ${err.stack}`)
            );
        }
    }

    async deleteReview(req: Request, res: Response, next: NextFunction) {
        try {
            // get id from request params
            const id = Number(req.params.id);
            // call deleteReview method from reviewService  and pass id
            const deleted = await this.reviewService.deleteReview(id);
            // return deleted status
            res.status(200).json({
                message: "Review deleted successfully",
                data: deleted
            });
        } catch (err) {
            next(
                new Error(`Error deleting review: ${err.message} ${err.stack}`)
            );
        }
    }

}
//