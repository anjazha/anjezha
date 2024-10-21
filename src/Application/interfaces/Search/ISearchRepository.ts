import { Task } from "@/Domain/entities/Task";
import { Tasker } from "@/Domain/entities/Tasker";
// import {Message} from "@/Domain/entities/Message"
// import {}  from '@'

export interface ISearchRepository {
  // taskersSearch(q: string, filters: any, sortBy: string): unknown;
  tasksSearch(
    q: string,
    filters: {},
    sortBy: string,
  ): Promise<Task[]>;

  taskersSearch(q:string, filters: {}, sortBy:string): Promise<any[] |undefined>;
}
