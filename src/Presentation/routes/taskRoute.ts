import { ITaskRepository } from "@/Application/interfaces/Task/ITaskRepository";
import { ITaskService } from "@/Application/interfaces/Task/ITaskService";
import { TaskRepository } from "@/Application/repositories/taskRepository";
import { TaskService } from "@/Application/services/taskService";
import { INTERFACE_TYPE } from "@/helpers";
import { Router } from "express";
import { Container } from "inversify";
import { TaskController } from "../controllers/taskController";
import { UserController } from "../controllers/userController";


const container = new Container();

container.bind<ITaskRepository>(INTERFACE_TYPE.TaskRepository).to(TaskRepository);
container.bind<ITaskService>(INTERFACE_TYPE.TaskService).to(TaskService);
container.bind<TaskController>(INTERFACE_TYPE.TaskController).to(TaskController);

const taskController = container.get<TaskController>(INTERFACE_TYPE.TaskController)
const router = Router();

router.route('/tasks')
    .post(taskController.createTask.bind(taskController))
    .get()

router.route('/tasks/:taskId')
        .get()
        .put()
        .delete()


router.route




export default router