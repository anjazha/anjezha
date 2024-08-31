import { ITaskerService } from "@/Application/interfaces/User/ITaskerService";
import { TaskerService } from "@/Application/services/taskerService";
import { Tasker } from "@/Domain/entities/Tasker";
import { INTERFACE_TYPE } from "@/helpers";
import { inject, injectable } from "inversify";

import { Request, Response, NextFunction } from "express";


@injectable()
export class TaskerController {
    constructor(@inject(INTERFACE_TYPE.TaskerService) private taskerService: ITaskerService) {}

    public async addTasker(req: Request, res: Response) {
        try {
            const taskerBody = req.body;
            const tasker = new Tasker(taskerBody.userId, taskerBody.bio, taskerBody.location, taskerBody.pricing, taskerBody.longitude, taskerBody.latitude, taskerBody.category_id, taskerBody.biding);

            const newTasker = await this.taskerService.createTasker(tasker);
            res.status(201).json(newTasker);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    public async getTasker(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const tasker = await this.taskerService.getTaskerById(id);
            res.status(200).json(tasker);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    public async getTaskers(req: Request, res: Response) {
        try {
            // const taskers = await this.taskerService.getAllTaskers();
            // res.status(200).json(taskers);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    public async updateTasker(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const tasker = req.body;
            tasker.id = id;
            const updateTasker = await this.taskerService.updateTasker(tasker);
            res.status(200).json(updateTasker);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    public async deleteTasker(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await this.taskerService.deleteTasker(id);
            res.status(200).json({ message: "Tasker deleted successfully" });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}