import { ITaskerService } from "@/Application/interfaces/User/Tasker/ITaskerService";
import { TaskerService } from "@/Application/services/taskerService";
import { Tasker } from "@/Domain/entities/Tasker";
import { INTERFACE_TYPE } from "@/helpers/containerConst";
import { inject, injectable } from "inversify";

import { Request, Response, NextFunction } from "express";
import RequestWithUserId from "@/Application/interfaces/Request";
import { HTTP500Error } from "@/helpers/ApiError";
import { generateToken } from "@/helpers/tokenHelpers";


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

            console.log(id);
            
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
}