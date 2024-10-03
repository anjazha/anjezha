import { ITaskerService } from "@/Application/interfaces/User/Tasker/ITaskerService";
import { TaskerService } from "@/Application/services/taskerService";
import { Tasker } from "@/Domain/entities/Tasker";
import { INTERFACE_TYPE } from "@/helpers/containerConst";
import { inject, injectable } from "inversify";

import { Request, Response, NextFunction } from "express";
import RequestWithUserId from "@/Application/interfaces/Request";
import { IRoleService } from "@/Application/interfaces/User/IRoleService";
import { Role } from "@/Domain/entities/role";


@injectable()
export class TaskerController {

    constructor(
        @inject(INTERFACE_TYPE.TaskerService) private taskerService: ITaskerService
    ) {}

    public async addTasker(req: RequestWithUserId, res: Response, next:NextFunction) {
        try {
          
            const userId = Number(req.userId);
            const taskerBody = req.body;
            taskerBody.userId = userId;
            const tasker = new Tasker(taskerBody.userId, taskerBody.bio, taskerBody.pricing, Number(taskerBody.longitude), Number(taskerBody.latitude), taskerBody.categoryId, taskerBody.biding);

            const data = await this.taskerService.createTasker(tasker);

            const newTasker = await data.tasker;

            //   console.log(newTasker);

             req.role= await data.role;
            //  console.log(data.role);
            res.status(201).json(newTasker);
        } catch (error) {
             next(error);
        }
    }

    public async getTasker(req: RequestWithUserId, res: Response, next:NextFunction) {
        try {
            // const id = Number(req.userId);
            const taskerId = +req.params.taskerId;
            const tasker = await this.taskerService.getTaskerById(taskerId);
            res.status(200).json(tasker);
        } catch (error) {
            next(error);
        }
    }

    public async getTaskers(req: Request, res: Response, next:NextFunction) {
        try {
            // const taskers = await this.taskerService.getAllTaskers();
            // res.status(200).json(taskers);
        } catch (error) {
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
        } catch (error) {
            next(error);
        }
    }

    public async deleteTasker(req: RequestWithUserId, res: Response, next:NextFunction) {
        try {
            const id = Number(req.userId);
            await this.taskerService.deleteTasker(id);
            res.status(200).json({ message: "Tasker deleted successfully" });
        } catch (error) {
            next(error);
        }
    }
}