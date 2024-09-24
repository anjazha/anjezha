import { RequestWithUserId } from "@/Application/interfaces/IRequestWithUserId";
import { INotificationService } from "@/Application/interfaces/Notification/INotificationService";
import { apiResponse } from "@/helpers/apiResponse";
import { INTERFACE_TYPE } from "@/helpers/containerConst";
import { safePromise } from "@/helpers/safePromise";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class NotificationController {

    constructor(@inject(INTERFACE_TYPE.NotificationService) private readonly notificationService: INotificationService) {}

    async getUserNotifications(req: Request, res : Response, next:NextFunction): Promise<any> {
        console.log("hello from notifications controller")
        const userId : number  = Number(req.userId)
        const [error, notifications] = await safePromise (()=>this.notificationService.getUserNotifications(userId))
        if(error) return next(error)
        return res.status(200).json(apiResponse(notifications))
    }
    async getUnReadNotifications(req: Request, res : Response, next:NextFunction): Promise<any> {
        const userId : number  = Number(req.userId)
        const [error, notifications] = await safePromise (()=>this.notificationService.getUnreadNotifications(userId))
        if(error) return next(error)
        return res.status(200).json(apiResponse(notifications))
    }
    async markAsRead(req: Request, res : Response, next:NextFunction): Promise<any> {
        const notificationIds : number[]  = req.body.notificationIds
        const [error, isDone] = await safePromise (()=>this.notificationService.markAsRead(notificationIds))
        if(error) return next(error)
        return res.status(200).json(apiResponse({}, "Notifications marked as read"))
    }

    
}