import { TaskAssignment } from "@/Domain/entities/TaskAssignment";
import { ETaskStatus } from "../enums/ETaskStatus";

export interface ITaskAssignmentRepository {
    assign(assignment : TaskAssignment) : Promise<boolean>;
    isTaskExist(taskId: number) : Promise<boolean>;
    updateStatus(taskId: number, status: ETaskStatus) : Promise<boolean>;
}