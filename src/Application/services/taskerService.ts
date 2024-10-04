import { injectable , inject} from "inversify";


import { Tasker } from "@/Domain/entities/Tasker";
import { ITaskerService } from "../interfaces/User/ITaskerService";
import { INTERFACE_TYPE } from "@/helpers/containerConst";
import { ITaskerRepository } from "../interfaces/User/ITaskerRepository";

@injectable()
export class TaskerService implements ITaskerService {

    constructor(
        @inject(INTERFACE_TYPE.TaskerRepository) private taskerRepository: ITaskerRepository
    ) {}

    async createTasker(tasker: Tasker): Promise<Tasker> {
        return await this.taskerRepository.createTasker(tasker)
    }

    async getTaskerById(id: number): Promise<Tasker> {
        return await this.taskerRepository.getTaskerById(id)
    }

    async updateTasker(tasker: Tasker): Promise<string> {
         return await await this.taskerRepository.updateTasker(tasker);
    }

    async deleteTasker(id: number): Promise<string> {
         return  await await this.taskerRepository.deleteTasker(id);
    }

    async getTaskerByUserId(userId: number): Promise<Tasker> {
        return await this.taskerRepository.getTaskerByUserId(userId)
    }

    // async getTaskerByUserId(userId: number): Promise<Tasker> {
    //     return await this.taskerRepository.getTaskerByUserId(userId)
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