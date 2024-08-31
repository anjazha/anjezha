import { Tasker } from "@/Domain/entities/Tasker";
import { ITaskerService } from "../interfaces/User/ITaskerService";
import { injectable } from "inversify";


@injectable()
export class TaskerService implements ITaskerService {

    constructor(private taskerRepository: ITaskerService) {}

    async createTasker(tasker: Tasker): Promise<Tasker> {
        return this.taskerRepository.createTasker(tasker)
    }

    async getTaskerById(id: number): Promise<Tasker> {
        return this.taskerRepository.getTaskerById(id)
    }

    async updateTasker(tasker: Tasker): Promise<string> {
         this.taskerRepository.updateTasker(tasker);
         return "Tasker updated successfully"
    }

    async deleteTasker(id: number): Promise<string> {
        this.taskerRepository.deleteTasker(id);
        return "Tasker deleted successfully"
    }

    // async getTaskerByUserId(userId: number): Promise<Tasker> {
    //     return this.taskerRepository.getTaskerByUserId(userId)
    // }

    // async getTaskerByCategoryId(categoryId: number): Promise<Tasker[]> {
    //     return this.taskerRepository.getTaskerByCategoryId(categoryId)
    // }

    // async getTaskerByLocation(location: string): Promise<Tasker[]> {
    //     return this.taskerRepository.getTaskerByLocation(location)
    // }

    // async getTaskerByRating(rating: number): Promise<Tasker[]> {
    //     return this.taskerRepository.getTaskerByRating(rating)
    // }

}