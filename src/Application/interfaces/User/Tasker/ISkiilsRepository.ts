

export interface ISkillsRepository {
    getSkills: () => Promise<any>;
    getSkillById: (id: number) => Promise<any>;
    getSkillByName: (skill: string) => Promise<any>;
    createSkill: (skill: string) => Promise<any>;
    updateSkill: (skill: string) => Promise<any>;
    deleteSkill: (id: number) => Promise<any>;
    // getTaskerSkills: (id: number) => Promise<any>;
    // addTaskerSkill: (taskerId: number, skillId: number) => Promise<any>;
    // deleteTaskerSkill: (taskerId: number, skillId: number) => Promise<any>;

}