

export interface ITaskerSkillsService {
    getSkillById: (id: number) => Promise<any>;
    createSkill: (taskerId:number, skill: string) => Promise<any>;
    updateSkill: (taskerId:number, skill: string) => Promise<any>;
    deleteSkill: (id: number) => Promise<any>;
    getTaskerSkills: (id: number) => Promise<any>;
    // addTaskerSkill: (taskerId: number, skillId: number) => Promise<any>;
    deleteTaskerSkill: (taskerId: number, skillId: number) => Promise<any>;
    getSkillByName?: (skill: string) => Promise<any>;
    getSkills?: () => Promise<any>;
}