import { Request, Response, NextFunction } from "express";

import { ITaskService } from "@/Application/interfaces/Task/ITaskService";
import { INTERFACE_TYPE } from "@/helpers";
import { inject, injectable } from "inversify";
import { safePromise } from "@/helpers/safePromise";
import { HTTP404Error, HTTP500Error } from "@/helpers/ApiError";
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
    try {
      const newTask = await this.taskService.createTask(task);
      return res
        .status(201)
        .json(apiResponse({ task: newTask }, "Task created successfully"));
    } catch (error) {
      return next(
        new HTTP500Error(
          error.message || "Some thing went wrong while creating new task"
        )
      );
    }
  }

  async getAllTasks(req: Request, res: Response, next: NextFunction) {
    // try {
    //   const tasks = await this.taskService.findAllTasks();
    //   res.status(200).json(apiResponse(tasks));
    // } catch (error) {
    //   next(error);
    // }
    const [error, tasks] = await safePromise(()=>this.taskService.findAllTasks());
    if (error) {
      return next(new HTTP500Error(error.message));
    }
    res.status(200).json(apiResponse(tasks));
  }

  async getTaskById(req: Request, res: Response, next: NextFunction) {
    const { taskId } = req.params;
    const [error, task] = await safePromise(() =>
      this.taskService.findTaskById(+taskId)
    );
    if (error) {
      return next(new HTTP500Error(error.message));
    }
    if (!task) {
      return next(new HTTP404Error("Task not found"));
    }
    res.status(200).json(apiResponse({ task }));
  }

  async deleteTask(req: Request, res: Response, next: NextFunction) {
    const { taskId } = req.params;
    const [error, isDeleted] = await safePromise(() =>
      this.taskService.deleteTask(+taskId)
    );
    if (error) {
      return next(new HTTP500Error(error.message));
    }
    if (!isDeleted) {
      return next(new HTTP404Error("Task not found"));
    }
    res.status(200).json(apiResponse({}, "Task deleted successfully"));
  }

  async updateTask(req: Request, res: Response, next: NextFunction) {
    const { taskId } = req.params;
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
    const [error, updatedTask] = await safePromise(() =>
      this.taskService.updateTask(+taskId, task)
    );
    if (error) {
      return next(new HTTP500Error(error.message));
    }
    if (!updatedTask) {
      return next(new HTTP404Error("Task not found"));
    }
    res.status(200).json(apiResponse({ task: updatedTask }));
  }
}
