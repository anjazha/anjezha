import { inject, injectable } from "inversify";

import { INTERFACE_TYPE } from "@/helpers/containerConst";
import { safePromise } from "@/helpers/safePromise";
import { IMessageService } from "@/Application/interfaces/conversation/IMessageService";
import RequestWithUserId from "@/Application/interfaces/Request";
import { NextFunction, Response, Request } from "express";
import { HTTP500Error } from "@/helpers/ApiError";
import { Message } from "@/Domain/entities/Message";


@injectable()
export class MessageController{

    constructor(
        @inject(INTERFACE_TYPE.MessageService) private messageService: IMessageService
    ){}

    async createMessage(req:RequestWithUserId, res:Response , next:NextFunction){

        const {senderId, message, conversationId} = req.body;

        const [error, result] = await safePromise(() =>
            this.messageService.createMessage(
                new Message(Number(senderId), Number(conversationId), message)
            ) );

            console.log(result);

        if(error) 
             return next( new HTTP500Error("Error creating message" + error.message))

        res.status(201).json(result)


    }

    async getMessages(req:RequestWithUserId, res:Response , next:NextFunction){
        const {conversationId} = req.params;

        console.log(conversationId);

        const [error, result] = await safePromise(() =>
            this.messageService.getMessages(Number(conversationId))
        );

        console.log(result);
        if(error) 
            return next( 
                   new HTTP500Error("Error getting messages" + error.message + error.stack))

        res.status(200).json(result)
    }

    async getMessageById(req:RequestWithUserId, res:Response , next:NextFunction){
        const {messageId} = req.params;

        const [error, result] = await safePromise(() =>
            this.messageService.getMessageById(Number(messageId))
        );

        if(error) 
            return next( new HTTP500Error("Error getting message" + error.message + error.stack))

        res.status(200).json(result)
    }

    async updateMessage(req:RequestWithUserId, res:Response , next:NextFunction){
        
        const {messageId, message, conversationId} = req.body;

        const [error, result] = await safePromise(() =>
            this.messageService.updateMessage(
                new Message(Number(req.userId),Number(conversationId), message),
                Number(messageId)
            )
        );

        if(error) 
            return  next( new HTTP500Error("Error updating message" + error.message))

        res.status(200).json(result)

    }

    async deleteMessage(req:RequestWithUserId, res:Response , next:NextFunction){
        const {messageId} = req.params;

        const [error, result] = await safePromise(() =>
            this.messageService.deleteMessage(Number(messageId))
        );

        if(error) 
            return next( new HTTP500Error("Error deleting message" + error.message + error.stack))

        res.status(200).json(result)
    }
}