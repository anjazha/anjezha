import { Container } from "inversify";
import { TaskerController } from "../controllers/taskerController";
import { TaskerService } from "@/Application/services/taskerService";
import { TaskerRepository } from "@/Application/repositories/taskerRepository";
import { INTERFACE_TYPE } from "@/helpers";
import { ITaskerRepository } from "@/Application/interfaces/User/ITaskerRepository";
import { ITaskerService } from "@/Application/interfaces/User/ITaskerService";
import { Router } from "express";
import isAuth from "../middlewares/isAuth";


const router = Router();

const container = new Container();

container.bind<ITaskerRepository>(INTERFACE_TYPE.TaskerRepository).to(TaskerRepository);

container.bind<ITaskerService>(INTERFACE_TYPE.TaskerService).to(TaskerService);

container.bind<TaskerController>(INTERFACE_TYPE.TaskerController).to(TaskerController);

const taskerController = container.get<TaskerController>(INTERFACE_TYPE.TaskerController);


router.post('/become-tasker', isAuth,  taskerController.addTasker.bind(taskerController));


router.get('/about-tasker', isAuth,  taskerController.getTasker.bind(taskerController));

router.put('/update-tasker', isAuth, taskerController.updateTasker.bind(taskerController));

router.delete('/delete-tasker', isAuth, taskerController.deleteTasker.bind(taskerController));


export default router;