import { Request, Response, NextFunction } from "express";

import { ITaskService } from "@/Application/interfaces/Task/ITaskService";
import { INTERFACE_TYPE } from "@/helpers";
import { inject, injectable } from "inversify";
import { safePromise } from "@/helpers/safePromise";
import { HTTP500Error } from "@/helpers/ApiError";



@injectable()
export class TaskController {

    constructor(@inject(INTERFACE_TYPE.TaskService) private readonly taskService: ITaskService) {
        // resolve instance of TaskService
    }

    async createTask(req : Request, res : Response, next : NextFunction) : Promise<any> {
        const task = req.body;
        const userId : number = 4;
        console.log(task)
        const [error , user] = await safePromise(()=>this.taskService.createTask(userId, task));
        if(error){
            console.log(error);
            
            return next(new HTTP500Error(error.message || "Some thing went wrong while creating new task"));
        }
        res.status(201).json(user);
    }
}