import { inject, injectable } from "inversify";
import { ISearchService } from "../interfaces/Search/ISearchService";
import { ISearchRepository } from "../interfaces/Search/ISearchRepository";
import { Task } from "@/Domain/entities/Task";
import { Tasker } from "@/Domain/entities/Tasker";
import { INTERFACE_TYPE } from "@/helpers/containerConst";
import { IPaginagion } from "../interfaces/IPagination";

@injectable()
export class SearchService implements ISearchService {
    constructor(
        @inject(INTERFACE_TYPE.SearchRepository) private readonly  searchRepository : ISearchRepository
    ) {}

    async tasksSearch(q : string , filters: any, sortBy: string): Promise<{tasks:Task[], pagination:IPaginagion}> {
        let tasks =  await this.searchRepository.tasksSearch(q , filters, sortBy);
        const totalTasksCount = tasks[0]?.total_count || 0;
        console.log(totalTasksCount)
        const pagination : IPaginagion = {
            currentPage:filters['page'],
            prevPage:filters['page'] > 1 ? filters['page'] - 1 : null,
            nextPage: filters['page'] < Math.ceil(totalTasksCount/filters['limit']) ? filters['page'] + 1 : null,
            resultCount: tasks.length,
            totalPages: Math.ceil(totalTasksCount/filters['limit']),
        }
        if(filters['fields']){
            tasks = tasks.map((task:any) => {
                let newTask:any = {};
                filters['fields'].split(',').forEach((field:any) => {
                    newTask[field] = task[field];
                });
                return newTask;
            })
        }
        return {tasks, pagination};
    }

    async taskersSearch(filters: {}): Promise<any> {
        
        //return await this.searchRepository.taskersSearch(filters);
        return "taskers";
    }
}