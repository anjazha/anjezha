import "reflect-metadata";

import { App } from "./app"
;
import {userRouter, authRouter, profileRouter, taskerRouter, taskRouter, taskerSkillRouter, categoryRoute, subcategoryRoute,   searchRouter, taskAssignmentRouter, taskApplicationRouter} from "./Presentation/routes";


// build 
const appInstance = new App([userRouter, authRouter, profileRouter, taskerRouter, taskRouter, taskerSkillRouter, categoryRoute, subcategoryRoute, searchRouter, taskAssignmentRouter, taskApplicationRouter ]);

appInstance.listen();
const app = appInstance.getExpressApp();
// const app = getExpressApp();

export {app}

// import { UserRoute } from "./Presentation/routes/userRoute";

// Register UserRepository

// const userRepostry = new UserRepostry();
// const userService = new UserService(userRepostry);

// const userController = new UserController(userService);

// const userRoute = new UserRoute();

// const userRoute = new UserService(new UserController(new UserService(new UserRepostry())));
