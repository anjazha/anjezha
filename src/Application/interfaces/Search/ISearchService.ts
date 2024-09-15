import { Task } from "@/Domain/entities/Task";
import { Tasker } from "@/Domain/entities/Tasker";
import { IPaginagion } from "../IPagination";


export interface ISearchService {
    tasksSearch(q: string, filters : {}, sortBy: string) : Promise<{tasks:Task[], pagination:IPaginagion}>;
    taskersSearch(filters : {}) : Promise<Tasker[]>;
}