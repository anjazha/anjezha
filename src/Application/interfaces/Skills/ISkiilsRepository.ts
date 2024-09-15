import { Skills } from "@/Domain/entities/Skills";


export interface ISkillsRepository {
    getSkills: () => Promise<Skills[]>;
    getSkillById: (id: number) => Promise<Skills>;
    getSkillByName: (skill: string) => Promise<Skills>;
    createSkill: (skill: string) => Promise<Skills>;
    updateSkill: (skill: string, id:number) => Promise<any>;
    deleteSkill: (id: number) => Promise<any>;
    // getTaskerSkills: (id: number) => Promise<any>;
    // addTaskerSkill: (taskerId: number, skillId: number) => Promise<any>;
    // deleteTaskerSkill: (taskerId: number, skillId: number) => Promise<any>;

}