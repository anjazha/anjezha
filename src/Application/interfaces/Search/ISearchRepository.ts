import { Task } from "@/Domain/entities/Task";
import { Tasker } from "@/Domain/entities/Tasker";
// import {Message} from "@/Domain/entities/Message"
// import {}  from '@'

export interface ISearchRepository {
  tasksSearch(
    q: string,
    filters: {},
    sortBy: string,
  ): Promise<Task[]>;

  // taskersSearch(filters: {}): Promise<Tasker[]>;
}
