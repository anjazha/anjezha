


interface ITaskerSkills {
    getTaskerSkills: (id: number) => Promise<any>;
    addTaskerSkill: (taskerId: number, skillId: number) => Promise<any>;
    deleteTaskerSkill: (taskerId: number, skillId: number) => Promise<boolean>;
}