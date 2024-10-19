import { Tasker } from "@/Domain/entities/Tasker";


export interface ITaskerRepository {
    createTasker(tasker: Tasker): Promise<Tasker | undefined>;
    getTaskerById(id: number): Promise<Tasker | undefined>;
    getTaskerByUserId(userId: number): Promise<Tasker | undefined>;
    getAllTaskers(): Promise<Tasker[] | undefined>;
    getTaskerByEmail?(email: string): Promise<Tasker | undefined>;
    getTaskerByPhoneNumber?(phoneNumber: string): Promise<Tasker | undefined>;
    getTaskerByLocation?(location: string): Promise<Tasker[] | undefined>;
    getTaskerByRating?(rating: number): Promise<Tasker[] | undefined>;
    search(q: string, filters: {}, sortBy: string): Promise<any[] | undefined>;
    getTaskerByTask?(task: any): Promise<Tasker[] | undefined>;
    updateTasker(tasker: Tasker): Promise<string | undefined>;
    deleteTasker(tasker: number): Promise<string | undefined>;
    matchTaskerByCategoryAndLocations(mathc:any):Promise<any[]>
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