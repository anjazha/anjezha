import { Tasker } from "@/Domain/entities/Tasker";


export interface ITaskerRepository {
    createTasker(tasker: Tasker): Promise<Tasker | null>;
    getTaskerById(id: number): Promise<Tasker | null>;
    getTaskerByUserId(userId: number): Promise<Tasker | null>;
    getTaskerByEmail?(email: string): Promise<Tasker | null>;
    getTaskerByPhoneNumber?(phoneNumber: string): Promise<Tasker | null>;
    getTaskerByLocation?(location: string): Promise<Tasker[] | null>;
    getTaskerByRating?(rating: number): Promise<Tasker[] | null>;
    getTaskerByTask?(task: any): Promise<Tasker[] | null>;
    updateTasker(tasker: Tasker): Promise<string | null>;
    deleteTasker(tasker: number): Promise<string | null>;

    // getTaskerByCategory(category: string): Promise<Tasker[]>;
    // getTaskerBySkill(skill: string): Promise<Tasker[]>;
    // getTaskerByPrice(price: number): Promise<Tasker[]>;
    // getTaskerByBiding(biding: boolean): Promise<Tasker[]>;
    // getTaskerByLocationAndCategory(location: string, category: string): Promise<Tasker[]>;
    // getTaskerByLocationAndSkill(location: string, skill: string): Promise<Tasker[]>;
    // getTaskerByLocationAndPrice(location: string, price: number): Promise<Tasker[]>;
    // getTaskerByLocationAndBiding(location: string, biding: boolean): Promise<Tasker[]>;
    // getTaskerByCategoryAndSkill(category: string, skill: string): Promise<Tasker[]>;
    // getTaskerByCategoryAndPrice(category: string, price: number): Promise<Tasker[]>;
    // getTaskerByCategoryAndBiding(category: string, biding: boolean): Promise<Tasker[]>;
    // getTaskerBySkillAndPrice(skill: string, price: number): Promise<Tasker[]>;
    // getTaskerBySkillAndBiding(skill: string, biding: boolean): Promise<Tasker[]>;
    // getTaskerByPriceAndBiding(price: number, biding: boolean): Promise<Tasker[]>;
    // getTaskerByLocationAndCategoryAndSkill(location: string, category: string, skill: string): Promise<Tasker[]>;
    // getTaskerByLocationAndCategoryAndPrice(location: string, category: string, price: number): Promise<Tasker[]>;
    // getTaskerByLocationAndCategoryAndBiding(location: string, category: string, biding: boolean): Promise<Tasker[]>;
    // getTaskerByLocationAndSkillAndPrice(location: string, skill: string, price: number): Promise<Tasker[]>;
    // getTaskerByLocationAndSkillAndBiding(location: string, skill: string, biding: boolean): Promise<Tasker[]>;
    // getTaskerByLocationAndPriceAndBiding(location: string, price: number, biding: boolean): Promise<Tasker[]>;
    // getTaskerByCategoryAndSkillAndPrice(category: string, skill: string, price: number): Promise<Tasker[]>;
    // getTaskerByCategoryAndSkillAndBiding(category: string, skill: string, biding: boolean): Promise<Tasker[]>;
    // getTaskerByCategoryAndPriceAndBiding(category: string, price: number, biding: boolean): Promise<Tasker[]>;
    // getTaskerBySkillAndPriceAndBiding(skill: string, price: number, biding: boolean): Promise<Tasker[]>;
    // getTaskerByLocationAndCategoryAndSkillAndPrice(location: string, category: string, skill: string, price: number): Promise<Tasker[]>;

}