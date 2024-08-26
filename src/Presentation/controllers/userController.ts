import { Request, Response, NextFunction } from "express";


import { IUserService } from "@/Application/interfaces/User/IUserService";
import { inject, injectable } from "inversify";
import { UserService } from "@/Application/services/userService";
import { INTERFACE_TYPE } from "@/helpers";



// how use depencie injection

@injectable()
export class UserController{

    // public  userService: IUserService
    // public  userService: IUserService
    
    constructor(@inject(INTERFACE_TYPE.UserService) private readonly userService: IUserService) {
        // resolve instance of UserServic
}


    async createUser(req:Request, res:Response, next:NewableFunction): Promise<any> {
        try {
            const { name, email, password, phoneNumber, profilePicture } = req.body;
            if (!name || !email || !password || !phoneNumber) {
                // handle by error 
                return res.status(400).json({ message: 'All fields are required' });
            }

            // create user
            const user = await this.userService.create(req.body);

            // return user
            return res.status(201).json(user);
        } catch (error) {
            // handling error
            return next(error);
        }
        
    }


    async getUser(req:Request, res:Response, next:NewableFunction): Promise<any> {
        try {
            const { id } = req.params;
            if (!id) {
                // handle by error 
                return res.status(400).json({ message: 'User id is required' });
            }

            // get user
            const user = await this.userService.findById(Number(id));

            // return user
            return res.status(200).json(user);
        } catch (error) {
            // handling error
            return next(error);
        }
    }


    async updateUser(req:Request, res:Response, next:NewableFunction): Promise<any> {
        try {
            const { id } = req.params;
            if (!id) {
                // handle by error 
                return res.status(400).json({ message: 'User id is required' });
            }

            // update user
            const user = await this.userService.update(Number(id), req.body);

            // return user
            return res.status(200).json(user);
        } catch (error) {
            // handling error
            return next(error);
        }
    }


    async deleteUser(req:Request, res:Response, next:NewableFunction): Promise<any> {
        try {
            const { id } = req.params;
            if (!id) {
                // handle by error 
                return res.status(400).json({ message: 'User id is required' });
            }

            // delete user
            const user = await this.userService.delete(Number(id));

            // return user
            return res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            // handling error
            return next(error);
        }
    }


    async getUsers(req:Request, res:Response, next:NewableFunction): Promise<any> {
        try {
            // get all users
            const users = await this.userService.findAll();

            // return users
            return res.status(200).json(users);
        } catch (error) {
            // handling error
            return next(error);
        }
    }




}