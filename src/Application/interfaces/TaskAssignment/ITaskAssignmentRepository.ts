import { TaskAssignment } from "@/Domain/entities/TaskAssignment";
import { ETaskStatus } from "../enums/ETaskStatus";

export interface ITaskAssignmentRepository {
    assign(assignment : TaskAssignment) : Promise<boolean>;
    getAssignments(taskId: number) : Promise<TaskAssignment[] | null >;
    updateStatus(taskId: number, status: ETaskStatus) : Promise<boolean>;
}