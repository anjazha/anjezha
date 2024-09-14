import { ITaskApplicationService } from "@/Application/interfaces/TaskApplication/ITaskApplicationService";
import { TaskApplication } from "@/Domain/entities/TaskApplication";
import { INTERFACE_TYPE } from "@/helpers/containerConst";
import { HTTP500Error } from "@/helpers/ApiError";
import { apiResponse } from "@/helpers/apiResponse";
import { safePromise } from "@/helpers/safePromise";
import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class TaskApplicationController {

  constructor(
    @inject(INTERFACE_TYPE.TaskApplicationService) private readonly taskApplicationService: ITaskApplicationService
  ) {}

  async apply(req: Request, res: Response, next: NextFunction): Promise<any> {
    const { taskId, taskerId, content } = req.body;
    const application = new TaskApplication(+taskId, +taskerId, content);

    const [error, result] = await safePromise(() =>
      this.taskApplicationService.apply(application)
    );
    if (error) return next(new HTTP500Error(error));

    res.json({
      success: true,
      message: "Your application submitted successfully",
    });
  }

  async getApplications(req: Request, res: Response, next: NextFunction): Promise<any> {
    const {taskId} = req.params;
    const [error, applications ] = await safePromise(() =>
      this.taskApplicationService.getApplications(+taskId)
    );
    if (error) return next(new HTTP500Error(error));

    res.json(apiResponse(applications));
  }

  async getApplicationsByTaskerId(req: Request, res: Response, next: NextFunction): Promise<any> {
    const {taskerId} = req.params;
    const [error, applications] = await safePromise(() =>
      this.taskApplicationService.getApplicationsByTaskerId(+taskerId)
    );
    if (error) return next(new HTTP500Error(error));

    res.json(apiResponse(applications));
  }
}
