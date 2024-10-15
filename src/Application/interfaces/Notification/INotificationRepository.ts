import { Notification } from "@/Domain/entities/Notification";

// import { Notification } from "@/";

export interface INotificationRepository{
    create(notification : Notification): Promise<boolean>;
    getUserNotifications(userId : number): Promise<Notification[]>
    getUnreadNotifications(userId : number): Promise<Notification[]>
    markAsRead(notificationIds : number[]): Promise<boolean>;
}