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


   async createTask( task: Task): Promise<Task> {
        return this.taskRepository.createTask(task);
    }

   async updateTask(id: number, task: Task): Promise<Task | null> {
        return null
    }

   async deleteTask(id: number): Promise<boolean> {
        return false
    }

   async findAllTasks(): Promise<Task[]> {
        return this.taskRepository.findAllTasks();
    }

   async findTaskById(id: number): Promise<Task | null> {
        return null
    }
}