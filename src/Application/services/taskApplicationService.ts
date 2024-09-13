import { inject, injectable } from "inversify";
import { ITaskApplicationService } from "../interfaces/TaskApplication/ITaskApplicationService";
import { TaskApplication } from "@/Domain/entities/TaskApplication";
import { INTERFACE_TYPE } from "@/helpers";
import { ITaskApplicationRepository } from "../interfaces/TaskApplication/ITaskApplicationRepository";


@injectable()
export class TaskApplicationService implements ITaskApplicationService {

    constructor(@inject(INTERFACE_TYPE.TaskApplicationRepository) private taskApplicationRepository : ITaskApplicationRepository){}

    apply(application: TaskApplication): Promise<boolean> {
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