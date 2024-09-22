import { IProfileService } from "@/Application/interfaces/User/IProfileService";
import { INTERFACE_TYPE } from "@/helpers/containerConst";
import { inject, injectable } from "inversify";

import { Request, Response, NextFunction } from "express";

import RequestWithUserId from "@/Application/interfaces/Request";
import { HTTP500Error } from "@/helpers/ApiError";
import { User } from "@/Domain/entities/User";

@injectable()
export class ProfileController {

    constructor(@inject(INTERFACE_TYPE.ProfileService) private profileService:IProfileService){}

    async getPRofile(req: RequestWithUserId, res: Response, next: NextFunction) {
        console.log(req.userId);
        const userId =  Number(req.userId);
        try{

            const profile = await this.profileService.getProfile((userId));
            res.status(200).json(profile);

        } catch(err:any){

           next(new HTTP500Error(`An error occurred message:${err.message}\n stack:${err.stack}`));

        }
    }

    async updateProfile(req: RequestWithUserId, res: Response, next: NextFunction) {
        const userId = Number(req.userId);
        // console.log(userId)
        const data = req.body;
        try{

           if(data.password || data.profilePicture) 
                { delete data.password;  delete data.profilePicture;}

            const profile = await this.profileService.updateProfile(userId, data);
            res.status(200).json(profile);
        } catch(err:any){
            next(new HTTP500Error(`An error occurred message:${err.message}\n stack:${err.stack}`));
        }
    }

    async deleteProfile(req: RequestWithUserId, res: Response, next: NextFunction) {
        const userId = Number(req.userId);
        // console.log(userId);
        try{
            const profile = await this.profileService.dleteProfile(userId);
            res.status(200).json(profile);
        } catch(err:any){
            next(new HTTP500Error(`An error occurred message:${err.message}\n stack:${err.stack}`));
        }
    }

    async updateProfilePicture(req: RequestWithUserId, res: Response, next: NextFunction) {
        const userId = Number(req.userId);
        const {profilePicture} = req.body;

        
        try{
            const profile = await this.profileService.updateProfilePicture(userId, profilePicture);
            res.status(200).json(profile);
        } catch(err:any){
            next(new HTTP500Error(`An error occurred message:${err.message}\n stack:${err.stack}`));
        }
    }


    async changePassword(req: RequestWithUserId, res: Response, next: NextFunction) {
        // take userId from user token
        const userId = Number(req.userId);
        // take data from client side 
        const {oldPassword, newPassword} = req.body;
        try{
            
            const profile = await this.profileService.changePassword(userId, oldPassword, newPassword);
            res.status(200).json(profile);
        } catch(err:any){
            next(new HTTP500Error(`An error occurred message:${err.message}\n stack:${err.stack}`));
        }
    }

    async logout(req: RequestWithUserId, res: Response, next: NextFunction) {
        const userId = Number(req.userId);
        try{
            await this.profileService.logout(userId);
            res.status(200).json({message: 'User logged out successfully'});
        } catch(err:any){
            next(new HTTP500Error(`An error occurred message:${err.message}\n stack:${err.stack}`));
        }
    }

}
