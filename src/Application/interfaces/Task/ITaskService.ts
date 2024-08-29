import { Task } from "@/Domain/entities/Task";


export interface ITaskService {
    createTask(userId:number,task : Task) : Promise<Task>;
    updateTask(id: number , task : Task) : Promise<Task | null>;
    deleteTask(id: number) : Promise<boolean>;
    findAllTasks() : Promise<Task[]>;
    findTaskById(id: number) : Promise<Task | null>;
}