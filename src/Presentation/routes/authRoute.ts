import { Router } from "express";
import { Container } from "inversify";


import { IAuthService } from "@/Application/interfaces/User/IAuthService";
import { IUserRepository } from "@/Application/interfaces/User/IUserRepository";
import { UserRepository } from "@/Application/repositories/userRepository";
import { AuthService } from "@/Application/services/authService";
import { INTERFACE_TYPE } from "@/helpers";
import { AuthController } from "../controllers/authController";
import { IRoleRepository } from "@/Application/interfaces/User/IRoleRepository";
import { RoleRepository } from "@/Application/repositories/roleRepository";


const router = Router();

//router.post("/login",);

const container = new Container();


// resolve depencoes injection in user repository
container.bind<IUserRepository>(INTERFACE_TYPE.UserRepository).to(UserRepository);

// resolve depencoes injection role repository
container.bind<IRoleRepository>(INTERFACE_TYPE.RoleRepository).to(RoleRepository);

// resolve depencoes injection in auth service
container.bind<IAuthService>(INTERFACE_TYPE.AuthService).to(AuthService);

// resolve depencoes injection in auth controller
container.bind<AuthController>(INTERFACE_TYPE.AuthController).to(AuthController);

const authController = container.get<AuthController>(INTERFACE_TYPE.AuthController);





router.post("/auth/signup", authController.register.bind(authController));
router.post("/auth/login", authController.login.bind(authController));
router.patch("/auth/forgot-password", authController.forgotPassword.bind(authController));
// router.get("/auth/reset-password/:token", authController.resetPassword.bind(authController));
router.post("/auth/reset-password/:token", authController.resetPassword.bind(authController));



export default router
