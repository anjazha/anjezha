import userRouter from './userRoute';
import authRouter from './authRoute';
import profileRouter from './profileroute';
import taskerRouter from './taskerRoute'; 
import taskRouter from './taskRoute'
import searchRouter from './searchRoute';
import taskAssignmentRouter from './taskAssignmentRoute';
import taskApplicationRouter from './taskApplicationRoute';
import taskerSkillRouter from './taskerSkillRoute';
import categoryRoute from './categoryRoute';
import subcategoryRoute from './subcategoryRoute';
import notificationRouter from "./notificationRoute";

import { Container } from 'inversify';
import { NotificationRepository } from '@/Application/repositories/notificationRepository';
import { INTERFACE_TYPE } from '@/helpers/containerConst';
import { INotificationRepository } from '@/Application/interfaces/Notification/INotificationRepository';
import { NotificationService } from '@/Application/services/notificationService';
import { INotificationService } from '@/Application/interfaces/Notification/INotificationService';

// 
// const container = new Container();

// container.bind<INotificationRepository>(INTERFACE_TYPE.NotificationRepository).to(NotificationRepository);
// container.bind<INotificationService>(INTERFACE_TYPE.NotificationService).to(NotificationService);

export { userRouter, authRouter, profileRouter, taskerRouter, taskRouter, taskerSkillRouter, categoryRoute, subcategoryRoute, taskAssignmentRouter, searchRouter, taskApplicationRouter, notificationRouter};
