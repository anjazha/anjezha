import { Request, Response, NextFunction } from "express";

import { AuthService } from "@/Application/services/authService";
import { User } from "@/Domain/entities/User";
import { INTERFACE_TYPE } from "@/helpers/containerConst";
import { inject, injectable } from "inversify";
import { INotificationService } from "@/Application/interfaces/Notification/INotificationService";
import { Notification } from "@/Domain/entities/Notification";
import { ENOTIFICATION_TYPES } from "@/Application/interfaces/enums/ENotificationTypes";
import { HTTP500Error } from "@/helpers/ApiError";
import { verfiyEmail } from "@/helpers/verfiyEmail";
import { safePromise } from "@/helpers/safePromise";


@injectable()
export class AuthController {
    constructor(@inject(INTERFACE_TYPE.AuthService) private authService:AuthService,@inject(INTERFACE_TYPE.NotificationService) private readonly notificationService : INotificationService) {}
      
       async sendCode(req:Request, res:Response, next:NextFunction){
        const { email} = req.body;
        req.body.email = email;

        const user = await this.authService.getUserByEmail(email);

        if(user) return next(new HTTP500Error("User already exists... login or reset-password"));

         await verfiyEmail.handleEmailVerification(email);

         res.status(200).json({message: 'Code sent to your email'});
       }

       async verifyCode(req:Request, res:Response, next:NextFunction){

         const {code, email} = req.body;
    
         // check code okay or  not if code true return true else throw error
          const [error, result] =  await safePromise(( )=>  verfiyEmail.verifyCode(email, code));

         if(error) return next(new HTTP500Error(error.message));

         res.status(200).json({message: 'Code verified'});

        //   if(!checkCode) throw new HTTP500Error("Code not valid");

        // if not throw error go to next middlware
        //   return true

        // req.verfiedCode=true;
       }

       async register(req:Request, res:Response, next:NextFunction) {
        
        // console.log(req.verfiedCode);

        try{
                 const { name, email, password , phoneNumber} = req.body;

                // await verfiyEmail.handleEmailVerification(email);

                // if(!this.authService.checkCodeValid(email)) throw new HTTP500Error("Code not valid");
                 const user = new User(name, email, password, phoneNumber);

                  // 1- handle unit test 1
                  // befor it verfiy if code validation or not 
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

                // const notification = new Notification(8, "مرحبا بك", ENOTIFICATION_TYPES.DEFAULT, false, new Date());
                // await this.notificationService.sendNotification(notification)

                res.status(200).json({ token });
            }  catch(err : any){
                // res.status(500).json({message: 'An error occurred' + err})
                next(new HTTP500Error("An error ocurred " + err.message))
            }
        }

        async forgotPassword(req:Request, res:Response, next:NextFunction) {
            try{
                // get email from req.body
                const { email } = req.body;

                // await to check if user exists
                await this.authService.forgotPassword(email);

                res.status(200).json({ message: "Password reset link sent to your email" });
            }  catch(err : any){
                next(new HTTP500Error("An error ocurred " + err.message))
            }
        }

        async resetPassword(req:Request, res:Response, next:NextFunction) {

          try{
            // get password from req.body
            const {password, token } = req.body;
            // get token from headers
            // const token = req.params.token;

            // console.log(token);
            
            
            // verfiy password
            const newToken = await this.authService.resetPassword(token, password);
            
            res.status(200).json({ newToken });
                } catch(err : any){
                    next(new HTTP500Error("An error ocurred " + err.message + err.stack))
                }
        }

        
}