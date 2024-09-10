import { ETaskStatus } from "@/Application/interfaces/enums/ETaskStatus";
import { ITaskAssignmentService } from "@/Application/interfaces/TaskAssignment/ITaskAssignmentService";
import { TaskAssignment } from "@/Domain/entities/TaskAssignment";
import { INTERFACE_TYPE } from "@/helpers";
import { HTTP500Error } from "@/helpers/ApiError";
import { safePromise } from "@/helpers/safePromise";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class TaskAssignmentController {
  constructor(
    @inject(INTERFACE_TYPE.TaskAssignmentService)
    private taskAssignmentService: ITaskAssignmentService
  ) {}

  async assign(req: Request, res: Response, next: NextFunction): Promise<any> {
    const {taskId} = req.params;
    const { taskerId } = req.body;
    const assignment = new TaskAssignment(
      +taskId,
      +taskerId,
      ETaskStatus.ASSIGNED,
      new Date()
    );

    const [error, result] = await safePromise(()=>this.taskAssignmentService.assign(assignment));

    if(error) return next(error)
    if (!result) return next(new HTTP500Error("Failed to assign task"));

    res
      .status(200)
      .json({ success: true, message: "Task assigned successfully" });
  }

  async cancel(req: Request, res: Response, next: NextFunction): Promise<any> {
    const {taskId} = req.params;

    const [error, result] = await safePromise(()=>this.taskAssignmentService.cancel(+taskId));

    if(error) return next(error)
    if (!result) return next(new HTTP500Error("Failed to cancel task"));

    res
      .status(200)
      .json({ success: true, message: "Task canceled successfully" });
  }

  async complete(req: Request, res: Response, next: NextFunction): Promise<any> {
    const {taskId} = req.params;

    const [error, result] = await safePromise(()=>this.taskAssignmentService.complete(+taskId));

    if(error) return next(error)
    if (!result) return next(new HTTP500Error("Failed to complete task"));

    res
      .status(200)
      .json({ success: true, message: "Task completed successfully" });
  }
}
