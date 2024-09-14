import { INTERFACE_TYPE } from "@/helpers/containerConst";
import { ISearchRepository} from "../interfaces/Search/ISearchRepository";
import { ITaskRepository } from "../interfaces/Task/ITaskRepository";
import { ITaskerRepository } from "../interfaces/User/Tasker/ITaskerRepository";
import { inject, injectable } from "inversify";
import { Task } from "@/Domain/entities/Task";
import { Tasker } from "@/Domain/entities/Tasker";

@injectable()
export class SearchRepository implements ISearchRepository {
    // private _taskRepository: ITaskRepository;
    // private _taskerRepository: ITaskerRepository;
    constructor(@inject(INTERFACE_TYPE.TaskRepository) private readonly taskRepository: ITaskRepository,
                @inject(INTERFACE_TYPE.TaskerRepository) private readonly taskerRepository: ITaskerRepository) {
    }

    async tasksSearch(q : string, filters: {}, sortBy : string): Promise<Task[]> {
        return await this.taskRepository.search(q, filters, sortBy);
    }
    
    // async taskersSearch(filters: {}): Promise<Tasker[]> {
    //     // return await this.taskerRepository.search(filters);
    //     // return await this.taskerRepository.search(filters);
    //     // return await this.taskerRepository.search(filters);
    // }
}

