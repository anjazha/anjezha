import { ITaskApplicationRepository } from "@/Application/interfaces/TaskApplication/ITaskApplicationRepository"
import { ITaskApplicationService } from "@/Application/interfaces/TaskApplication/ITaskApplicationService"
import { TaskApplicationRepository } from "@/Application/repositories/taskApplicationRepository"
import { TaskApplicationService } from "@/Application/services/taskApplicationService"
import { INTERFACE_TYPE } from "@/helpers/containerConst"
import {Router} from "express"
import { Container } from "inversify"
import { TaskApplicationController } from "../controllers/taskAppliationController"
import {allowTo, isAuth} from "../middlewares/isAuth"

const router = Router()

const container = new Container()

container.bind<ITaskApplicationRepository>(INTERFACE_TYPE.TaskApplicationRepository).to(TaskApplicationRepository)
container.bind<ITaskApplicationService>(INTERFACE_TYPE.TaskApplicationService).to(TaskApplicationService)
container.bind<TaskApplicationController>(INTERFACE_TYPE.TaskApplicationController).to(TaskApplicationController)

const taskAppliationController = container.get<TaskApplicationController>(INTERFACE_TYPE.TaskApplicationController)

router.use(isAuth)
router.post("/task-application",allowTo("tasker"), taskAppliationController.apply.bind(taskAppliationController))
router.get('/task-application/:taskId', taskAppliationController.getApplications.bind(taskAppliationController))
router.get('/task-application/tasker/:taskerId',allowTo("tasker"), taskAppliationController.getApplicationsByTaskerId.bind(taskAppliationController))


export default router