import { TaskAssignment } from "@/Domain/entities/TaskAssignment";

export interface ITaskAssignmentService {
    assign(assignment : TaskAssignment) : Promise<boolean>;
    cancel(taskId: number) : Promise<boolean>;
    complete(taskId: number) : Promise<boolean>;
}