import { Tasker } from "@/Domain/entities/Tasker";


export interface ITaskerService {
    createTasker(tasker: Tasker): Promise<Tasker>;
    getTaskerById(id: number): Promise<Tasker>;
    updateTasker(tasker: Tasker): Promise<string>;
    deleteTasker(id: number): Promise<string>;
    getTaskerByUserId(userId: number): Promise<Tasker>;
    
    // getTaskerByEmail(email: string): Promise<Tasker>;
    // getTaskerByCategory(category: string): Promise<Tasker[]>;
    // getTaskerBySkill(skill: string): Promise<Tasker[]>;
    // getTaskerByLocation(location: string): Promise<Tasker[]>;
    // getTaskerByRating(rating: number): Promise<Tasker[]>;
    // getTaskerByPrice(price: number): Promise<Tasker[]>;
    // getTaskerByAvailability(availability: boolean): Promise<Tasker[]>;
    // getTaskerSkills(id: number): Promise<Skills[]>;
    // addTaskerSkill(taskerId: number, skillId: number): Promise<TaskerSkills>;
    // deleteTaskerSkill(taskerId: number, skillId: number): Promise<boolean>;
    // getTaskerCategories(id: number): Promise<Category[]>;
    // addTaskerCategory(taskerId: number, categoryId: number): Promise<TaskerCategories>;
    // deleteTaskerCategory(taskerId: number, categoryId: number): Promise<boolean>;


}
