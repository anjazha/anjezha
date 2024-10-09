import { inject, injectable } from "inversify";
import { ITaskAssignmentRepository } from "../interfaces/TaskAssignment/ITaskAssignmentRepository";
import { ITaskAssignmentService } from "../interfaces/TaskAssignment/ITaskAssignmentService";
import { INTERFACE_TYPE } from "@/helpers/containerConst";
import { TaskAssignment } from "@/Domain/entities/TaskAssignment";
import { safePromise } from "@/helpers/safePromise";
import { HTTP400Error, HTTP403Error, HTTP404Error } from "@/helpers/ApiError";
import { ETaskStatus } from "../interfaces/enums/ETaskStatus";
import { ITaskRepository } from "../interfaces/Task/ITaskRepository";

@injectable()
export class TaskAssignmentService implements ITaskAssignmentService {
  constructor(
    @inject(INTERFACE_TYPE.TaskAssignmentRepository)
    private taskAssignmentRepository: ITaskAssignmentRepository,
    @inject(INTERFACE_TYPE.TaskRepository)
    private readonly taskRepository: ITaskRepository
  ) {}

  private async checkIfTaskIsAssigned(taskId: number) {
    const taskAssignments = await this.taskAssignmentRepository.getAssignments(
      taskId
    );
    const isAssigned = taskAssignments?.some(
      (assignment) => assignment.status == ETaskStatus.ASSIGNED
    );
    return isAssigned;
  }

  private async checkTaskOwner(taskId: number, userId: number) {
    const [error, task] = await safePromise(() =>
      this.taskRepository.findTaskById(taskId)
    );
    return task?.user_id == userId;
  }

  private async isTaskExist(taskId: number) {
    const [error, task] = await safePromise(() =>
      this.taskRepository.findTaskById(taskId)
    );
    return Boolean(task?.id);
  }

  async assign(assignment: TaskAssignment, userId: number): Promise<boolean> {
    // check if task exists
    const isTaskExist = await this.isTaskExist(assignment.taskId);
    if (!isTaskExist) throw new HTTP404Error("Task not found");

    // check for task owner
    const isTaskOwner = await this.checkTaskOwner(assignment.taskId, userId);
    if (!isTaskOwner) throw new HTTP403Error("You can not assign this task");

    // check if task is already assigned
    const isAssigned = await this.checkIfTaskIsAssigned(assignment.taskId);
    if (isAssigned) throw new HTTP400Error("Task is already assigned");

    return this.taskAssignmentRepository.assign(assignment);
  }

  async cancel(taskId: number): Promise<boolean> {
    // check if task is already assigned
    const isAssigned = await this.checkIfTaskIsAssigned(taskId);
    if (!isAssigned) throw new HTTP400Error("Task is not assigned");
    const changeStatus = await this.taskAssignmentRepository.updateStatus(
      taskId,
      ETaskStatus.CANCELED
    );
    if (!changeStatus)
      throw new HTTP404Error(
        `There is no task assignment for task with id ${taskId}`
      );
    return true;
  }

  async complete(taskId: number): Promise<boolean> {
    // check if task is already assigned
    const isAssigned = await this.checkIfTaskIsAssigned(taskId);
    if (!isAssigned) throw new HTTP400Error("Task is not assigned");
    return this.taskAssignmentRepository.updateStatus(
      taskId,
      ETaskStatus.COMPLETED
    );
  }
}
