import { INTERFACE_TYPE } from "@/helpers";
import { Router } from "express";
import { Container } from "inversify";
import { ReviewController } from "../controllers/reviewController";
import { IReviewRepository } from "@/Application/interfaces/IReviewRepository";
import { ReviewRepository } from "@/Application/repositories/reviewRepository";
import { ReviewService } from "@/Application/services/reviewService";
import { IReviewService } from "@/Application/interfaces/IReviewService";
import { alllowTo, isAuth } from "../middlewares/isAuth";


const reviewRoute = Router();


const container = new Container();

// resolve the repository review 
container.bind<IReviewRepository>(INTERFACE_TYPE.ReviewRepository).to(ReviewRepository);

// resolve the service injection
container.bind<IReviewService>(INTERFACE_TYPE.ReviewService).to(ReviewService);

// resolve the controller injection
container.bind(INTERFACE_TYPE.ReviewController).to(ReviewController);


const reviewController  = container.get<ReviewController>(INTERFACE_TYPE.ReviewController);

// create review route
reviewRoute.post("review/:taskerId", isAuth, alllowTo('user'), reviewController.createReview.bind(reviewController));

// get review by id route
reviewRoute
.route("/review/:id")
.all(isAuth, alllowTo('user'))
 .get(reviewController.getReviewById.bind(reviewController))
 .patch(reviewController.updateReview.bind(reviewController))
 .delete(reviewController.deleteReview.bind(reviewController));


reviewRoute.get("/review/:taskerId", reviewController.getReviewByTaskerId.bind(reviewController));

reviewRoute.get("/review/:userId", reviewController.getReviewByUserId.bind(reviewController));

reviewRoute.get("/review",isAuth, alllowTo('admin'), reviewController.getReviews.bind(reviewController));


export default reviewRoute;