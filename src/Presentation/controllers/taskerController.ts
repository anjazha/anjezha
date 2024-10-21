import { ITaskerService } from "@/Application/interfaces/User/Tasker/ITaskerService";
import { TaskerService } from "@/Application/services/taskerService";
import { Tasker } from "@/Domain/entities/Tasker";
import { INTERFACE_TYPE } from "@/helpers/containerConst";
import { inject, injectable } from "inversify";

import { Request, Response, NextFunction } from "express";
import RequestWithUserId from "@/Application/interfaces/Request";
import { HTTP500Error } from "@/helpers/ApiError";
import { generateToken } from "@/helpers/tokenHelpers";
import { safePromise } from "@/helpers/safePromise";
import { apiResponse } from "@/helpers/apiResponse";


@injectable()
export class TaskerController {

    constructor(
        @inject(INTERFACE_TYPE.TaskerService) private taskerService: ITaskerService
    ) {}

    public async addTasker(req: RequestWithUserId, res: Response, next:NextFunction) {
        try {
            const taskerBody = req.body;

            taskerBody.userId = req.userId;

            const tasker = new Tasker(taskerBody.userId,
                                      taskerBody.bio,
                                      taskerBody.pricing,
                                      taskerBody.longitude,
                                      taskerBody.latitude,
                                      taskerBody.categoryId,
                                      taskerBody.biding);

            await this.taskerService.createTasker(tasker);

            const token =  generateToken({userId:req.userId, role:'tasker'});


            res.status(201).json({token});

        } catch (error : any) {
             next(new HTTP500Error('An error occurred ' + error.message));
        }
    }

    public async getTaskerById(req: RequestWithUserId, res: Response, next:NextFunction) {
        try {
            // const userId = Number(req.userId);
            const id = Number(req.params.taskerId);

            // console.log(id);
            
            const tasker = await this.taskerService.getTaskerById(id);

            res.status(200).json(tasker);
        } catch (error : any) {
            next(new HTTP500Error('An error occurred ' + error.message + error.stack));
        }
    }

    public async getTaskerByUserId(req: RequestWithUserId, res: Response, next:NextFunction) {
        try {
            const id = Number(req.userId);
            console.log(id);
            const tasker = await this.taskerService.getTaskerByUserId(id);
            res.status(200).json(tasker);
        } catch (error : any) {
            next(error);
        }
    }

    public async getTaskers(req: Request, res: Response, next:NextFunction) {
        try {
            // const taskers = await this.taskerService.getAllTaskers();
            // res.status(200).json(taskers);
        } catch (error : any) {
            next(error);
        }
    }

    public async updateTasker(req: RequestWithUserId, res: Response, next:NextFunction) {
        try {
            const id = Number(req.userId);
            const tasker = req.body;
            tasker.id = id;
            const updateTasker = await this.taskerService.updateTasker(tasker);
            res.status(200).json(updateTasker);
        } catch (error : any) {
            next(error);
        }
    }

    public async deleteTasker(req: RequestWithUserId, res: Response, next:NextFunction) {
        try {
            const id = Number(req.userId);
            await this.taskerService.deleteTasker(id);
            res.status(200).json({ message: "Tasker deleted successfully" });
        } catch (error : any) {
            next(error);
        }
    }

    public async getTaskerFeed(req: RequestWithUserId, res: Response, next:NextFunction){
        //  const 
        // let {longitude, latitude, category, skills, page, limit} =req.query;

        // skills =skills?.split(',') ;
        let skills = String(req.query.skills)? String(req.query.skills).split(',') : [" "];
        let category = Number(req.query.category);
        let longitude = Number(req.query.longitude);
        let latitude = Number(req.query.latitude);
        let page =  Number(req.query.page) | 1;
        let limit = Number(req.query.limit) | 10;

        console.log(skills, category, longitude, latitude, page, limit);


        // req.query.skills= String(skills)?.split(',');
        // req.query.category = Number(category);
        // req.query.longitude = Number(longitude);
        // req.query.latitude = Number(latitude);
        // req.query.page = Number(page);
        // req.query.limit = Number(limit);

        const [error, result] = await safePromise(
            () => this.taskerService.getTaskerFeed(
                {longitude, latitude, category,skills, limit, page}));

        // if any error
        if(error) return next(new HTTP500Error(error.message));

        res.json(
            apiResponse(
             result.taskers,
            'Tasker feed',
             true,
             result.pagination
        ))



    }
}