import { ISkillsRepository } from "./ISkiilsRepository";

export interface ITaskerSkillsRepository {

    addSkillToTasker: (taskerId: number, skillId: number) => Promise<void>;
    findSkillsByTaskerId: (taskerId: number) => Promise<any>;
    deleteTaskerSkill: (taskerId: number, skillId: number) => Promise<any>;
}