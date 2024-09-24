import { Notification } from "@/Domain/entities/Notification";
import { HTTP500Error } from "@/helpers/ApiError";
import { safePromise } from "@/helpers/safePromise";
import { pgClient } from "@/Infrastructure/database";
import { INotificationRepository } from "../interfaces/Notification/INotificationRepository";
import { injectable } from "inversify";

@injectable()
export class NotificationRepository implements INotificationRepository{
    constructor(){}
    async create(notification : Notification): Promise<boolean>{
        const query = `INSERT INTO notifications (user_id, message, type, is_read, created_at) VALUES ($1, $2, $3, $4, $5)`;
        const values = [notification.userId, notification.message, notification.type, notification.isRead, notification.createdAt];
        const [error, result ] = await safePromise(()=>pgClient.query(query, values));
        if(error) throw new HTTP500Error("Error while creating notification" + error.message);
        return true;
    }
    async getUserNotifications(userId : number): Promise<Notification[]>{
        const query = `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC`;
        const values = [userId];
        const [error, result ] = await safePromise(()=>pgClient.query(query, values));
        if(error) throw new HTTP500Error("Error while fetching notifications" + error.message);
        return result.rows;
    }

    async getUnreadNotifications(userId : number): Promise<Notification[]>{ 
        const query = `SELECT * FROM notifications WHERE user_id = $1 AND is_read = false ORDER BY created_at DESC`;
        const values = [userId];
        const [error, result ] = await safePromise(()=>pgClient.query(query, values));
        if(error) throw new HTTP500Error("Error while fetching notifications" + error.message);
        return result.rows;
    }

    async markAsRead(notificationIds: number[]): Promise<boolean> {
        console.log(notificationIds)
        const query = `UPDATE notifications SET is_read = true WHERE id = ANY($1)`;
        const values = [notificationIds];
        const [error, result ] = await safePromise(()=>pgClient.query(query, values));
        console.log(error)
        if(error) throw new HTTP500Error("Error while marking notifications as read" + error.message);
        return true;
    }
}