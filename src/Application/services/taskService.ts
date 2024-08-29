import { inject, injectable } from "inversify";
import { ITaskService } from "../interfaces/Task/ITaskService";
import { Task } from "@/Domain/entities/Task";
import { INTERFACE_TYPE } from "@/helpers";
import { ITaskRepository } from "../interfaces/Task/ITaskRepository";
import { safePromise } from "@/helpers/safePromise";


@injectable()
export class TaskService implements ITaskService{

        constructor(@inject(INTERFACE_TYPE.TaskRepository) private readonly taskRepository: ITaskRepository) {
            // resolve instance of TaskService
        }


   async createTask(userId : number, task: any): Promise<Task> {
        return this.taskRepository.createTask(userId, task);
    }

   async updateTask(id: number, task: Task): Promise<Task | null> {
        
    }

   async deleteTask(id: number): Promise<boolean> {
        
    }

   async findAllTasks(): Promise<Task[]> {
        
    }

   async findTaskById(id: number): Promise<Task | null> {
        
    }
}