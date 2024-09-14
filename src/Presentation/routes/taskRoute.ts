import { ITaskRepository } from "@/Application/interfaces/Task/ITaskRepository";
import { ITaskService } from "@/Application/interfaces/Task/ITaskService";
import { TaskRepository } from "@/Application/repositories/taskRepository";
import { TaskService } from "@/Application/services/taskService";
import { INTERFACE_TYPE } from "@/helpers/containerConst";
import { Router } from "express";
import { Container } from "inversify";
import { TaskController } from "../controllers/taskController";
import { createTaskValidations, updateTaskValidations } from "@/helpers/validate/taskValidate";
import {isAuth} from "../middlewares/isAuth";
import { filesUpload } from "../middlewares/filesUpload";



const container = new Container();

container.bind<ITaskRepository>(INTERFACE_TYPE.TaskRepository).to(TaskRepository);
container.bind<ITaskService>(INTERFACE_TYPE.TaskService).to(TaskService);
container.bind<TaskController>(INTERFACE_TYPE.TaskController).to(TaskController);

const taskController = container.get<TaskController>(INTERFACE_TYPE.TaskController)
const router = Router();

router.route('/tasks')
    .post(isAuth ,filesUpload("attachments", "tasks"), createTaskValidations,taskController.createTask.bind(taskController))
    .get(taskController.getAllTasks.bind(taskController))

router.route('/tasks/:taskId')
        .get(taskController.getTaskById.bind(taskController))
        .put(isAuth, updateTaskValidations,taskController.updateTask.bind(taskController))
        .delete(isAuth, taskController.deleteTask.bind(taskController))


// router.route




export default router