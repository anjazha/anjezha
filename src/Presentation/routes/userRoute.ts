import { Router } from "express";
import { Container } from "inversify";

// call all classes used in depecencies injection
import { UserController } from "../controllers/userController";
import { IUserRepository } from "@/Application/interfaces/User/IUserRepository";
import { UserRepository } from "@/Application/repositories/userRepository";
import { IUserService } from "@/Application/interfaces/User/IUserService";
import { UserService } from "@/Application/services/userService";
import { INTERFACE_TYPE } from "@/helpers";




   const router = Router();



   const container= new Container();

// resolve depencoes injection in each rooute 

// bind the user repository to the user repository class userRepository implemnts IUserRepository
container.bind<IUserRepository>(INTERFACE_TYPE.UserRepository).to(UserRepository);

container.bind<IUserService>(INTERFACE_TYPE.UserService).to(UserService)

container.bind<UserController>(INTERFACE_TYPE.UserController).to(UserController);

const userController = container.get<UserController>(INTERFACE_TYPE.UserController);


router.route('/user')
 .get(userController.getUsers.bind(userController))
 .post(userController.createUser.bind(userController));

router.route('/user/:id')
  .get(userController.getUser.bind(userController))
  .put(userController.updateUser.bind(userController))
  .delete(userController.deleteUser.bind(userController));


  export default router;

// export class UserRoute {
//     public router : Router;
//     public  userController: UserController;
//     public container: Container;
//     constructor() {
//         this.router = Router();
//         this.routes(this.router);

//         this.container= new Container();


// // bind the user repository to the user repository class userRepository implemnts IUserRepository
//        this.container.bind<IUserRepository>(INTERFACE_TYPE.UserRepository).to(UserRepository);

//         // bind the user service to the user service class userService implemnts IUserService
//         this.container.bind<IUserService>(INTERFACE_TYPE.UserService).to(UserService);

//         // bind the user controller to the user controller
//         this.container.bind<UserController>(INTERFACE_TYPE.UserController).to(UserController);


//         this.userController = this.container.get<UserController>(INTERFACE_TYPE.UserController);

//     }

       

//     public routes(app: Router){
//         app.route('/user')
//         .post(this.userController.createUser.bind(this.userController))
//         .get(this.userController.getUsers.bind(this.userController));

//         app.route('/user/:id')
//         .get( this.userController.getUser.bind(this.userController))
//         .put( this.userController.updateUser.bind(this.userController))
//         .delete( this.userController.deleteUser.bind(this.userController));
//     }



//     // public getRouter(){
//     //     return this.router;
//     // }
// }




