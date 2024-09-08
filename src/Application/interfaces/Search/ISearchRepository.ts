import { Task } from "@/Domain/entities/Task";
import { Tasker } from "@/Domain/entities/Tasker";

export interface ISearchRepository {
  tasksSearch(
    q: string,
    filters: {},
    sortBy: string,
  ): Promise<Task[]>;
  taskersSearch(filters: {}): Promise<Tasker[]>;
}
