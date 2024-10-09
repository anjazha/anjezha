import {Router} from 'express';
import { Container } from 'inversify';
import { TaskAssignmentController } from '../controllers/taskAssignmentController';
import { TaskAssignmentService } from '@/Application/services/taskAssignmentService';
import { INTERFACE_TYPE } from '@/helpers/containerConst';
import { ITaskAssignmentService } from '@/Application/interfaces/TaskAssignment/ITaskAssignmentService';
import { ITaskAssignmentRepository } from '@/Application/interfaces/TaskAssignment/ITaskAssignmentRepository';
import { TaskAssignmentRepository } from '@/Application/repositories/taskAssignmentRepository';
import { assignTaskValidate } from '@/helpers/validate/taskAssignmentValidate';
import {isAuth} from '../middlewares/isAuth';
import { ITaskRepository } from '@/Application/interfaces/Task/ITaskRepository';
import { TaskRepository } from '@/Application/repositories/taskRepository';

const router = Router();

const container = new Container();

container.bind<TaskAssignmentController>(INTERFACE_TYPE.TaskAssignmentController).to(TaskAssignmentController);
container.bind<ITaskAssignmentService>(INTERFACE_TYPE.TaskAssignmentService).to(TaskAssignmentService);
container.bind<ITaskAssignmentRepository>(INTERFACE_TYPE.TaskAssignmentRepository).to(TaskAssignmentRepository);
container.bind<ITaskRepository>(INTERFACE_TYPE.TaskRepository).to(TaskRepository);

const taskAssignmentController = container.get<TaskAssignmentController>(INTERFACE_TYPE.TaskAssignmentController);

router.use(isAuth);
router.post('/task-assignment/:taskId',assignTaskValidate, taskAssignmentController.assign.bind(taskAssignmentController));
router.put('/task-assignment/:taskId/cancel', taskAssignmentController.cancel.bind(taskAssignmentController));
router.put('/task-assignment/:taskId/complete', taskAssignmentController.complete.bind(taskAssignmentController));

export default router