import { TaskApplication } from "@/Domain/entities/TaskApplication";

export interface ITaskApplicationRepository {
    apply(application : TaskApplication) : Promise<boolean>;
    getApplications(taskId : number | null , taskerId : number | null) : Promise<TaskApplication[]>;
    // getApplicationsByTaskerId(taskerId : number) : Promise<TaskApplication[]>;
    acceptApplication(appId : number) : Promise<boolean>;
    checkIfTaskerApplied(taskId : number, taskerId : number) : Promise<boolean>;
    checkifTaskerIsTaskOwner(taskId : number, taskerId : number) : Promise<boolean>;
}