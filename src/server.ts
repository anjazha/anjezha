import "reflect-metadata";
import { Request } from "express";
import { App } from "./app";
import {
  userRouter,
  authRouter,
  profileRouter,
  taskerRouter,
  taskRouter,
  taskerSkillRouter,
  categoryRoute,
  subcategoryRoute,
  searchRouter,
  taskAssignmentRouter,
  taskApplicationRouter,
  notificationRouter,
  reviewRouter,
} from "./Presentation/routes";

const app = new App([
  userRouter,
  authRouter,
  profileRouter,
  taskerRouter,
  taskRouter,
  taskerSkillRouter,
  categoryRoute,
  subcategoryRoute,
  searchRouter,
  notificationRouter,
  taskAssignmentRouter,
  taskApplicationRouter,
  notificationRouter,
  reviewRouter
]);

declare global {
    namespace Express {
        interface Request {
            userId?: Number | null;
            role?: string;
        }
    }
}


app.listen();

// import { UserRoute } from "./Presentation/routes/userRoute";

// Register UserRepository

// const userRepostry = new UserRepostry();
// const userService = new UserService(userRepostry);

// const userController = new UserController(userService);

// const userRoute = new UserRoute();

// const userRoute = new UserService(new UserController(new UserService(new UserRepostry())));
