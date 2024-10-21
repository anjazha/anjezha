import { INTERFACE_TYPE } from "@/helpers/containerConst";
import { inject, injectable } from "inversify";
import { INotificationRepository } from "../interfaces/Notification/INotificationRepository";
import { INotificationService } from "../interfaces/Notification/INotificationService";
import { Notification } from "@/Domain/entities/Notification";
import { safePromise } from "@/helpers/safePromise";
import { io } from "@/Infrastructure/socket/cofigureSocket";
import OnlineUsersService from "./onlineUsersService";

@injectable()
export class NotificationService implements INotificationService {
  
  constructor(
    @inject(INTERFACE_TYPE.NotificationRepository)
    private readonly notificationRepository: INotificationRepository,
    private onlineUsers = OnlineUsersService.getInstance() // online users service  should be injected using DI
  ) {}

  async sendNotification(notification: Notification): Promise<boolean> {
    // console.log(notification)
    const [error, isCreated] = await safePromise(() =>
      this.notificationRepository.create(notification)
    );
    if (error) throw error;

    // send real-time notification
    const userScoketId = this.onlineUsers.getUserSocket(String(notification.userId));
    if (userScoketId) io?.to(String(userScoketId)).emit("notification", notification);
    
    return isCreated;
  }

     getUserNotifications(userId: number): Promise<Notification[]> {
    return this.notificationRepository.getUserNotifications(userId);
  }

  getUnreadNotifications(userId: number): Promise<Notification[]> {
      return this.notificationRepository.getUnreadNotifications(userId);
  }
  markAsRead(notificationIds: number[]): Promise<boolean> {
    return this.notificationRepository.markAsRead(notificationIds);
  }
}
