import { TaskApplication } from "@/Domain/entities/TaskApplication";

export interface ITaskApplicationService {
    apply(application : TaskApplication) : Promise<boolean>;
    getApplications(taskId : number) : Promise<TaskApplication[]>;
    getApplicationsByTaskerId(taskerId : number) : Promise<TaskApplication[]>;
    acceptApplication(appId : number) : Promise<boolean>;
}