import { inject, injectable } from "inversify";
import { ITaskAssignmentRepository } from "../interfaces/TaskAssignment/ITaskAssignmentRepository";
import { ITaskAssignmentService } from "../interfaces/TaskAssignment/ITaskAssignmentService";
import { INTERFACE_TYPE } from "@/helpers";
import { TaskAssignment } from "@/Domain/entities/TaskAssignment";
import { safePromise } from "@/helpers/safePromise";
import { HTTP404Error } from "@/helpers/ApiError";
import { ETaskStatus } from "../interfaces/enums/ETaskStatus";

@injectable()
export class TaskAssignmentService implements ITaskAssignmentService {
  constructor(@inject(INTERFACE_TYPE.TaskAssignmentRepository) private taskAssignmentRepository: ITaskAssignmentRepository) {}

  async assign(assignment: TaskAssignment): Promise<boolean> {
    const [error, isTaskExist] = await safePromise(()=>this.taskAssignmentRepository.isTaskExist(assignment.taskId));
    if(!isTaskExist) throw new HTTP404Error("Task not found");
    return this.taskAssignmentRepository.assign(assignment);
  }
  
  async cancel(taskId: number): Promise<boolean> {
    return this.taskAssignmentRepository.updateStatus(taskId, ETaskStatus.CANCELED);
  }

  async complete(taskId: number): Promise<boolean> {
    return this.taskAssignmentRepository.updateStatus(taskId, ETaskStatus.COMPLETED);
  }
}