import { Request, Response, NextFunction } from "express";

import { ITaskService } from "@/Application/interfaces/Task/ITaskService";
import { INTERFACE_TYPE } from "@/helpers";
import { inject, injectable } from "inversify";
import { safePromise } from "@/helpers/safePromise";
import { HTTP500Error } from "@/helpers/ApiError";
import { Task } from "@/Domain/entities/Task";
import { RequestWithUserId } from "@/Application/interfaces/IRequestWithUserId";
import { apiResponse } from "@/helpers/apiResponse";

@injectable()
export class TaskController {
  constructor(
    @inject(INTERFACE_TYPE.TaskService)
    private readonly taskService: ITaskService
  ) {
    // resolve instance of TaskService
  }

  async createTask(
    req: RequestWithUserId,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const {
      title,
      description,
      date,
      budget,
      location,
      address,
      status,
      category_id,
      schedule,
      skills,
    } = req.body;
    const task = new Task(
      +req.userId,
      title,
      description,
      date,
      budget,
      location,
      address,
      status,
      category_id,
      schedule,
      [],
      skills
    );
    // const {userId} = req;
    // console.log(task)
    try {
      const newTask = await this.taskService.createTask(task);
      return res.status(201).json(apiResponse({task : newTask}, "Task created successfully"));
    } catch (error) {
      return next(
        new HTTP500Error(
          error.message || "Some thing went wrong while creating new task"
        )
      );
    }
  }

  async getAllTasks(req: Request, res: Response, next: NextFunction) {
    try {
        const tasks = await this.taskService.findAllTasks();
        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
  }
}
