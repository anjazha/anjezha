import { ISearchRepository } from "@/Application/interfaces/Search/ISearchRepository";
import { ISearchService } from "@/Application/interfaces/Search/ISearchService";
import { SearchRepository } from "@/Application/repositories/searchRepository";
import { SearchService } from "@/Application/services/searchService";
import { INTERFACE_TYPE } from "@/helpers";
import { Router } from "express";
import { Container } from "inversify";
import { SearchController } from "../controllers/searchController";
import { ITaskRepository } from "@/Application/interfaces/Task/ITaskRepository";
import { TaskRepository } from "@/Application/repositories/taskRepository";
import { ITaskerRepository } from "@/Application/interfaces/User/ITaskerRepository";
import { TaskerRepository } from "@/Application/repositories/taskerRepository";
import { tasksSearchValidate } from "@/helpers/validate/searchValidate";

const router = Router();

const container = new Container();

// task and tasker repositories resolvers
container
  .bind<ITaskRepository>(INTERFACE_TYPE.TaskRepository)
  .to(TaskRepository);
container
  .bind<ITaskerRepository>(INTERFACE_TYPE.TaskerRepository)
  .to(TaskerRepository);
//
container
  .bind<ISearchRepository>(INTERFACE_TYPE.SearchRepository)
  .to(SearchRepository);
container.bind<ISearchService>(INTERFACE_TYPE.SearchService).to(SearchService);
container
  .bind<SearchController>(INTERFACE_TYPE.SearchController)
  .to(SearchController);

const searchController = container.get<SearchController>(
  INTERFACE_TYPE.SearchController
);

router.get(
  "/search/tasks",
  tasksSearchValidate,
  searchController.tasksSearch.bind(searchController)
);

export default router;
