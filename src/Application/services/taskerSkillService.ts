import { inject, injectable } from "inversify";
import { ITaskerSkillsService } from "../interfaces/Skills/ITaskerSkillsService";
import { INTERFACE_TYPE } from "@/helpers/containerConst";
import { ISkillsRepository } from "../interfaces/Skills/ISkiilsRepository";
import { ITaskerSkillsRepository } from "../interfaces/Skills/ITaskerSkillsRepository";


@injectable()
export class TaskerSkillService implements ITaskerSkillsService {
    
    constructor(
        @inject(INTERFACE_TYPE.SkillsRepository) private skillsRepository: ISkillsRepository,
        @inject(INTERFACE_TYPE.TaskerSkillsRepository) private taskerSkillsRepository: ITaskerSkillsRepository
    ){}
   

    async createSkill(taskerId:number, skill: string): Promise<any> {

        console.log(taskerId, skill);

    try{
    // retrun data from the repository include id and skill
        const createskill = await this.skillsRepository.createSkill(skill);

        console.log(createskill);

        let {id } = createskill;

          id = Number(id);

        // add to the tasker skill table
        await this.taskerSkillsRepository.addSkillToTasker(taskerId, id);

        return `skill ${skill} created`;
        }catch(err:any){
           throw new Error(`Error creating skill ${err.message} ${err.stack}`);
        }

    }


    async updateSkill(id:number, skill: string): Promise<any> {
        console.log(id, skill);
        try{
           //  const {id} = await this.taskerSkillsRepository.findSkillsByTaskerId(taskerId);

            const updateskill = await this.skillsRepository.updateSkill(skill, id);

            return updateskill;
        }catch(err:any){
            throw new Error(`Error updating skill ${err.message} ${err.stack}`);
        }
    }

    async deleteSkill(id: number): Promise<any> {
        try{
            const deleteskill = await this.skillsRepository.deleteSkill(id);

            return deleteskill;
        }catch(err){
            return err;
        }
    }

    async getSkillById(id: number): Promise<any> {
        try{
            const skill = await this.skillsRepository.getSkillById(id);

            return skill;
        }catch(err){
            return err;
        }
    }


    async getTaskerSkills(taskerId: number): Promise<any> {
        try{
            const taskerSkills = await this.taskerSkillsRepository.findSkillsByTaskerId(taskerId);

            return taskerSkills;
        }catch(err){
            return err;
        }
    }

    async deleteTaskerSkill(taskerId: number, skillId: number): Promise<any> {
        try{
            const deleteskill = await this.taskerSkillsRepository.deleteTaskerSkill(taskerId, skillId);

            return deleteskill;
        }catch(err){
            return err;
        }
    }

    async getSkills(): Promise<any> {
        try{
            const skills = await this.skillsRepository.getSkills();

            return skills;
        }catch(err){
            return err;
        }
    }

    
}