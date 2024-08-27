import { AuthService } from "@/Application/services/authService";
import { User } from "@/Domain/entities/User";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";


@injectable()
export class AuthController {
    constructor(@inject("AuthService") private authService:AuthService) {}
      
     async register(req:Request, res:Response, next:NextFunction) {
        const { name, email, password , phoneNumber, profilePicture} = req.body;

        const user = new User(name, email, password, phoneNumber, profilePicture);
        const newUser = await this.authService.register(user);
        res.status(201).json(newUser);
     }


        async login(req:Request, res:Response, next:NextFunction) {
            const { email, password } = req.body;
            const token = await this.authService.login(email, password);
            res.status(200).json({ token });
        }

        async forgotPassword(req:Request, res:Response, next:NextFunction) {
            const { email } = req.body;
            await this.authService.forgotPassword(email);
            res.status(200).json({ message: "Password reset link sent to your email" });
        }

}