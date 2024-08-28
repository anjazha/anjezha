import { Request, Response, NextFunction } from "express";

import { AuthService } from "@/Application/services/authService";
import { User } from "@/Domain/entities/User";
import { INTERFACE_TYPE } from "@/helpers";
import { inject, injectable } from "inversify";


@injectable()
export class AuthController {
    constructor(@inject(INTERFACE_TYPE.AuthService) private authService:AuthService) {}
      
    async register(req:Request, res:Response, next:NextFunction) {

        
        try{
                 const { name, email, password , phoneNumber} = req.body;


                 const user = new User(name, email, password, phoneNumber);

                  // 1- handle unit test 1
                  const newUser = await this.authService.register(user);

                  // 2- handle unit test 2
                  res.status(201).json(newUser);
            
        }  catch(error){
            res.status(500).json({message: 'An error occurred' + error})
        }
        
          }

        async login(req:Request, res:Response, next:NextFunction) {
            
            try{
                const { email, password } = req.body;
                console.log(req.body);

                // await to check if user exists
                const token = await this.authService.login(email, password);

                res.status(200).json({ token });
            }  catch(err){
                res.status(500).json({message: 'An error occurred' + err})
            }
        }

        async forgotPassword(req:Request, res:Response, next:NextFunction) {
            const { email } = req.body;
            await this.authService.forgotPassword(email);
            res.status(200).json({ message: "Password reset link sent to your email" });
        }

        async resetPassword(req:Request, res:Response, next:NextFunction) {

            const {password } = req.body;
            // get token from headers
            const token = req.headers.authorization.split(" ")[1];


            // verfiy password
            const newPassword = await this.authService.resetPassword(token, password);

            res.status(200).json({ newPassword });
        }

        
}