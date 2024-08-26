import "reflect-metadata";
import { App } from "./app"
;
import {userRouter} from "./Presentation/routes";


const app = new App([userRouter]); 

app.listen()

// import { UserRoute } from "./Presentation/routes/userRoute";

// Register UserRepository


// const userRepostry = new UserRepostry();
// const userService = new UserService(userRepostry);

// const userController = new UserController(userService);

// const userRoute = new UserRoute();




// const userRoute = new UserService(new UserController(new UserService(new UserRepostry())));


