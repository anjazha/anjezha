import { Container } from "inversify";
import { TaskerController } from "../controllers/taskerController";
import { TaskerService } from "@/Application/services/taskerService";
import { TaskerRepository } from "@/Application/repositories/taskerRepository";
import { INTERFACE_TYPE } from "@/helpers/containerConst";
import { ITaskerRepository } from "@/Application/interfaces/User/Tasker/ITaskerRepository";
import { ITaskerService } from "@/Application/interfaces/User/Tasker/ITaskerService";
import { Router } from "express";
import {isAuth, allowTo} from "../middlewares/isAuth";
import { IRoleRepository } from "@/Application/interfaces/User/IRoleRepository";
import { RoleRepository } from "@/Application/repositories/roleRepository";
import { IRoleService } from "@/Application/interfaces/User/IRoleService";
import { RoleService } from "@/Application/services/roleService";


const router = Router();

const container = new Container();

container.bind<ITaskerRepository>(INTERFACE_TYPE.TaskerRepository).to(TaskerRepository);

// resolve roelRepository with depencies injection
container.bind<IRoleRepository>(INTERFACE_TYPE.RoleRepository).to(RoleRepository);


container.bind<ITaskerService>(INTERFACE_TYPE.TaskerService).to(TaskerService);

container.bind<IRoleService>(INTERFACE_TYPE.RoleService).to(RoleService);

container.bind<TaskerController>(INTERFACE_TYPE.TaskerController).to(TaskerController);


const taskerController = container.get<TaskerController>(INTERFACE_TYPE.TaskerController);


router.post('/become-tasker', isAuth,  taskerController.addTasker.bind(taskerController));


// alllow only user authenticate and become tasker 1-creat middlware
router.get('/about-tasker', isAuth, allowTo('tasker'),  taskerController.getTasker.bind(taskerController));

router.put('/update-tasker', isAuth, allowTo('tasker'), taskerController.updateTasker.bind(taskerController));

router.delete('/delete-tasker', isAuth, allowTo('tasker'), taskerController.deleteTasker.bind(taskerController));


export default router;