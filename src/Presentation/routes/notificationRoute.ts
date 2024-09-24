import {Router} from "express"
import { Container } from "inversify";


import { INotificationRepository } from "@/Application/interfaces/Notification/INotificationRepository";
import { INotificationService } from "@/Application/interfaces/Notification/INotificationService";
import { NotificationRepository } from "@/Application/repositories/notificationRepository";
import { NotificationService } from "@/Application/services/notificationService";
import { INTERFACE_TYPE } from "@/helpers/containerConst";
import { NotificationController } from "../controllers/notificationController";
import { allowTo, isAuth } from "../middlewares/isAuth";

const notificationRouter = Router();

const container = new Container();

container.bind<INotificationRepository>(INTERFACE_TYPE.NotificationRepository).to(NotificationRepository);
container.bind<INotificationService>(INTERFACE_TYPE.NotificationService).to(NotificationService);
container.bind<NotificationController>(INTERFACE_TYPE.NotificationController).to(NotificationController);

const  notifiationController = container.get<NotificationController>(INTERFACE_TYPE.NotificationController);


notificationRouter.use(isAuth)
// notificationRouter.use(allowTo('user', "tasker"))

notificationRouter.get('/notifications', notifiationController.getUserNotifications.bind(notifiationController));
notificationRouter.get('/notifications/unread', notifiationController.getUnReadNotifications.bind(notifiationController));
notificationRouter.put('/notifications/mark-as-read', notifiationController.markAsRead.bind(notifiationController));

export default notificationRouter


