import { IConversationService } from "@/Application/interfaces/conversation/IConversationService";
import RequestWithUserId from "@/Application/interfaces/Request";
import { Conversation } from "@/Domain/entities/Conversation";
import { HTTP400Error, HTTP500Error } from "@/helpers/ApiError";
import { INTERFACE_TYPE } from "@/helpers/containerConst";
import { getRoomId } from "@/helpers/getRoom";
import { safePromise } from "@/helpers/safePromise";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class ConversationController{
    constructor(
        @inject(INTERFACE_TYPE.ConversationService) private conversationService: IConversationService
    ){ }

    public async createConversation(req: RequestWithUserId, res: Response, next:NextFunction){
        // const {userId} = req.params;
        const {taskerId, userId} = req.body;
        // combine user & tasker id to get conversation id 
        
        // const conversationId = (getRoomId(String(userId), String(taskerId)));

        // console.log(taskerId, userId, (conversationId));
        // user safepromise instead of try .. catch
        const [error, result] = await safePromise(()=> {
            this.conversationService.createConversation(new Conversation(+userId, +taskerId,new Date()))
        })

        // return error if exist 
        if(error)
            return next(new HTTP500Error('something wentwrong!'+ error.message + error.stack))
        // const conversation = await this.conversationService.getConversation(userId, chatId);
        res.status(201).json(result)
    }

    public async getConversationByUser(req: RequestWithUserId, res: Response, next:NextFunction){

        const {userId} = req.params;
         const [error, result] = await safePromise( 
              () => this.conversationService.getConversationsByUserId(Number(userId))
         )

         if (error)
             return next(
              new HTTP400Error('some thing went wrong!' + error.message + error.stack)
            )
        // const conversations = await this.conversationService.getUserConversations(userId);
        // console.log(result);
        res.status(200).json(result);
    }

    public async deleteConversaitonByUserId(req:RequestWithUserId, res:Response, next:NextFunction) {

        const userId= req.params;

        const [error, result] = await safePromise(() => {
            this.conversationService.deleteConversaitonByUserId(Number(userId))
        })    

        if(error) 
             return next(
                new HTTP500Error('some thing went wrong!'+error.message)
            );

        res.status(200).json(result);
    }
    



    // public async createConversation(req: any, res: any){
    //     const {userId} = req.params;
    //     const {chatId} = req.params;
    //     const [error , result] = await safePromise(()=>{
            
    //     })
    //     // const conversation = await this.conversationService.createConversation(userId, chatId);
    //     res.json('conversation');
    // }


}