import { inject, injectable } from "inversify";
import { ITaskApplicationService } from "../interfaces/TaskApplication/ITaskApplicationService";
import { TaskApplication } from "@/Domain/entities/TaskApplication";
import { INTERFACE_TYPE } from "@/helpers/containerConst";
import { ITaskApplicationRepository } from "../interfaces/TaskApplication/ITaskApplicationRepository";
import { HTTP400Error } from "@/helpers/ApiError";

@injectable()
export class TaskApplicationService implements ITaskApplicationService {
  constructor(
    @inject(INTERFACE_TYPE.TaskApplicationRepository)
    private taskApplicationRepository: ITaskApplicationRepository
  ) {}

  private async checkIfTaskerApplied(taskeId: number, taskerId: number) : Promise<boolean> {
      const applications : TaskApplication [] = await this.taskApplicationRepository.getTaskerApplication(taskeId, taskerId);
      return applications.length > 0;
  }
  
  async apply(application: TaskApplication): Promise<boolean> {
    const isUserApplied =
      await this.checkIfTaskerApplied(
        application.taskId,
        application.taskerId
      );
    if (isUserApplied)
      throw new HTTP400Error("You have already applied for this task");
    const isTaskOwner =
      await this.taskApplicationRepository.checkifTaskerIsTaskOwner(
        application.taskId,
        application.taskerId
      );
    if (isTaskOwner) throw new HTTP400Error("You can not apply for your tasks");
    return this.taskApplicationRepository.apply(application);
  }

  getApplications(taskId: number): Promise<TaskApplication[]> {
    return this.taskApplicationRepository.getApplications(taskId, null);
  }

  getApplicationsByTaskerId(taskerId: number): Promise<TaskApplication[]> {
    return this.taskApplicationRepository.getApplications(null, taskerId);
  }

  acceptApplication(appId: number): Promise<boolean> {
    return this.taskApplicationRepository.acceptApplication(appId);
  }
}
