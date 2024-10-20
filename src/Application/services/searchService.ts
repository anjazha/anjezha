import { inject, injectable } from "inversify";
import { ISearchService } from "../interfaces/Search/ISearchService";
import { ISearchRepository } from "../interfaces/Search/ISearchRepository";
import { Task } from "@/Domain/entities/Task";
import { Tasker } from "@/Domain/entities/Tasker";
import { INTERFACE_TYPE } from "@/helpers/containerConst";
import { IPaginagion } from "../interfaces/IPagination";
import { safePromise } from "@/helpers/safePromise";

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

    async taskersSearch(q:string, filters: any, sortBy:string): Promise<any | undefined> {
        
        const {limitNum:limit, offset, pageNum:page} = filters;

        // console.log(offset);


        const taskers = await this.searchRepository.taskersSearch(q, filters, sortBy);

        
      if (!taskers) {
           return undefined; // or handle the case where no taskers are found
      }

        // const totalTasker = this.searchRepository.;
        const totalTasker =Number(taskers[0].totaltasker);
    
        console.log('totalTasker',totalTasker);

        // calculate all total page specify by tasker 
        const totalPages = Math.round(totalTasker/limit);

        let prevPage =1, nextPage=1;

        // find prevPage if page great than equal current page 
        if(page>1) prevPage = page -1;

        // can move to next page when  current page less than totalPages
        if ( page< totalPages )  nextPage = page +1;

        const pagination={
            page,
            prevPage,
            nextPage,
            totalPages,
        }

        return {pagination,taskers};
        
           
    }
}