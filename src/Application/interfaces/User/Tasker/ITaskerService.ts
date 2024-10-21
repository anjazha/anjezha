import { Tasker } from "@/Domain/entities/Tasker";


export interface ITaskerService {
    createTasker(tasker: Tasker): Promise<Tasker | undefined>;
    getTaskerById(id: number): Promise<Tasker | undefined>;
    updateTasker(tasker: Tasker): Promise<string | undefined>;
    deleteTasker(id: number): Promise<string | undefined>;
    getTaskerByUserId(userId: number): Promise<Tasker | undefined>;
    getTaskerFeed(match:any):Promise<any | undefined>

    // getTaskerByEmail(email: string): Promise<Tasker | undefined>;
    // getTaskerByCategory(category: string): Promise<Tasker[] | undefined>;
    // getTaskerBySkill(skill: string): Promise<Tasker[] | undefined>;
    // getTaskerByLocation(location: string): Promise<Tasker[] | undefined>;
    // getTaskerByRating(rating: number): Promise<Tasker[] | undefined>;
    // getTaskerByPrice(price: number): Promise<Tasker[] | undefined>;
    // getTaskerByAvailability(availability: boolean): Promise<Tasker[] | undefined>;
    // getTaskerSkills(id: number): Promise<Skills[] | undefined>;
    // addTaskerSkill(taskerId: number, skillId: number): Promise<TaskerSkills | undefined>;
    // deleteTaskerSkill(taskerId: number, skillId: number): Promise<boolean | undefined>;
    // getTaskerCategories(id: number): Promise<Category[] | undefined>;
    // addTaskerCategory(taskerId: number, categoryId: number): Promise<TaskerCategories | undefined>;
    // deleteTaskerCategory(taskerId: number, categoryId: number): Promise<boolean | undefined>;


}
