import { Request, Response, NextFunction } from "express";

import { AuthService } from "@/Application/services/authService";
import { User } from "@/Domain/entities/User";
import { INTERFACE_TYPE } from "@/helpers/containerConst";
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
                

                // await to check if user exists
                const token = await this.authService.login(email, password);

                res.status(200).json({ token });
            }  catch(err){
                res.status(500).json({message: 'An error occurred' + err})
            }
        }

        async forgotPassword(req:Request, res:Response, next:NextFunction) {
            try{
                // get email from req.body
                const { email } = req.body;

                // await to check if user exists
                await this.authService.forgotPassword(email);

                res.status(200).json({ message: "Password reset link sent to your email" });
            }  catch(err){
                next(err)
            }
        }

        async resetPassword(req:Request, res:Response, next:NextFunction) {

          try{
            // get password from req.body
            const {password } = req.body;
            // get token from headers
            const token = req.params.token;

            console.log(token);
            
            
            // verfiy password
            const newPassword = await this.authService.resetPassword(token, password);
            
            res.status(200).json({ newPassword });
                } catch(err){
                    next(err)
                }
        }

        
}