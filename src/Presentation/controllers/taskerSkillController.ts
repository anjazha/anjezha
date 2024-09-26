import { inject, injectable } from "inversify";
import { Response, NextFunction } from "express";
import RequestWithUserId from "@/Application/interfaces/Request";
import { ITaskerSkillsService } from "@/Application/interfaces/Skills/ITaskerSkillsService";
import { INTERFACE_TYPE } from "@/helpers/containerConst";
import { HTTP500Error } from "@/helpers/ApiError";



@injectable()
export class TaskerSkillController   {

    constructor(
        @inject(INTERFACE_TYPE.TaskerSkillsService) private taskerSkillsService: ITaskerSkillsService
    ) {}

    async createSkill(req: RequestWithUserId, res: Response, next: NextFunction): Promise<any> {
        try {
            const taskerId = Number(req.userId)
            
            const { skill } = req.body;
            if (!taskerId || !skill) {
                return next(new HTTP500Error('Tasker id and skill are required'));
            }

            const createSkill = await this.taskerSkillsService.createSkill(taskerId, skill);

            return res.status(201).json(createSkill);
        } catch (error) {
            return next(error);
        }
    }

    async updateSkill(req: RequestWithUserId, res: Response, next: NextFunction): Promise<any> {
        try {
            const taskerId = Number(req.userId)
        
            const { id } = req.params;
            const { skill } = req.body;

            if (!taskerId || !id || !skill) {
                return next(new HTTP500Error('Tasker id, skill id and skill are required'));
            }

            const updateSkill = await this.taskerSkillsService.updateSkill(Number(id), skill);

            return res.status(200).json(updateSkill);
        } catch (error) {
            return next(error);
        }
    }

    async deleteSkill(req: RequestWithUserId, res: Response, next: NextFunction): Promise<any> {
        try {
            const taskerId = Number(req.userId)
            const { id } = req.params;
            if (!taskerId || !id) {
                return next(new HTTP500Error('Tasker id and skill id are required'));
            }

            const deleteSkill = await this.taskerSkillsService.deleteSkill(Number(id));

            return res.status(200).json({message: 'skill is deleted'});
        } catch (error) {
            return next(error);
        }
    }

    async getSkillById(req: RequestWithUserId, res: Response, next: NextFunction): Promise<any> {
        try {
            const taskerId = Number(req.userId)
            const { id } = req.params;
            if (!taskerId || !id) {
                return next(new HTTP500Error('Tasker id and skill id are required'));
            }

            const skill = await this.taskerSkillsService.getSkillById(Number(id));

            return res.status(200).json(skill);
        } catch (error) {
            return next(error);
        }
    }

    async getTaskerSkills(req: RequestWithUserId, res: Response, next: NextFunction): Promise<any> {
        try {
            const taskerId = Number(req.userId)
            if (!taskerId) {
                return next(new HTTP500Error('Tasker id is required'));
            }

            const taskerSkills = await this.taskerSkillsService.getTaskerSkills(taskerId);

            return res.status(200).json(taskerSkills);
        } catch (error) {
            return next(error);
        }
    }

    async deleteTaskerSkill(req: RequestWithUserId, res: Response, next: NextFunction): Promise<any> {
        try {
            const taskerId = Number(req.userId)
            const { id } = req.params;
            if (!taskerId || !id) {
                return next(new HTTP500Error('Tasker id and skill id are required'));
            }

            const deleteSkill = await this.taskerSkillsService.deleteTaskerSkill(taskerId, Number(id));

            return res.status(200).json(deleteSkill);
        } catch (error) {
            return next(error);
        }
    }


    async getSkills(req: RequestWithUserId, res: Response, next: NextFunction): Promise<any> {
        try {
            if (!this.taskerSkillsService) {
                throw new Error("TaskerSkillsService is not initialized");
            }
                const skills = await this.taskerSkillsService.getSkills();
            return res.status(200).json(skills);
        } catch (error) {
            return next(error);
        }
    }


}