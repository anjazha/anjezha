import { Notification } from "@/Domain/entities/Notification";

export interface INotificationService {
    sendNotification(notification:Notification) : Promise<boolean>;
    getUserNotifications(userId : number): Promise<Notification[]>
    getUnreadNotifications(userId : number): Promise<Notification[]>
    markAsRead(notificationIds : number[]): Promise<boolean>;
}