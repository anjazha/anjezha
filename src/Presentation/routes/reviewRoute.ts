import { Router } from "express";
import { Container } from "inversify";

import { ReviewController } from "../controllers/reviewController";
import { IReviewRepository } from "@/Application/interfaces/IReviewRepository";
import { ReviewRepository } from "@/Application/repositories/reviewRepository";
import { ReviewService } from "@/Application/services/reviewService";
import { IReviewService } from "@/Application/interfaces/IReviewService";
import { allowTo, isAuth } from "../middlewares/isAuth";
import { INTERFACE_TYPE } from "@/helpers/containerConst";
import { ITaskerRepository } from "@/Application/interfaces/User/Tasker/ITaskerRepository";
import { TaskerRepository } from "@/Application/repositories/taskerRepository";


const reviewRoute = Router();


const container = new Container();

// resolve the repository review 
container.bind<IReviewRepository>(INTERFACE_TYPE.ReviewRepository).to(ReviewRepository);

// bind taskerRepository and ITaskerRepository
container.bind<ITaskerRepository>(INTERFACE_TYPE.TaskerRepository).to(TaskerRepository);

// resolve the service injection
container.bind<IReviewService>(INTERFACE_TYPE.ReviewService).to(ReviewService);

// resolve the controller injection
container.bind(INTERFACE_TYPE.ReviewController).to(ReviewController);


const reviewController  = container.get<ReviewController>(INTERFACE_TYPE.ReviewController);

// create review route
reviewRoute.post("/review/:taskerId", isAuth, allowTo('user', 'tasker'), reviewController.createReview.bind(reviewController));

// get review by id route
reviewRoute
.route("/review/:id")
.all(isAuth, allowTo('user'))
 .get(reviewController.getReviewById.bind(reviewController))
 .put(reviewController.updateReview.bind(reviewController))
 .delete(reviewController.deleteReview.bind(reviewController));


reviewRoute.get("/tasker-reviews/:taskerId", reviewController.getReviewByTaskerId.bind(reviewController));

reviewRoute.get("/user-reviews/:userId", isAuth, allowTo('admin'), reviewController.getReviewByUserId.bind(reviewController));

reviewRoute.get("/reviews",isAuth, allowTo('admin'), reviewController.getReviews.bind(reviewController));


export default reviewRoute;