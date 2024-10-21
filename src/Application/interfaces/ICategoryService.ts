import { Category } from "@/Domain/entities/Category";


export interface ICategoryService {
    createCategory(category: Category): Promise<Category>;
    getCategories(limit:number, offset:number): Promise<Category[]>;
    getCategoryById(id: number): Promise<Category>;
    getCategoryByName(categoryName: string): Promise<Category | null>;
    updateCategory(category: Category, id: number): Promise<any>;
    deleteCategory(id: number): Promise<any>;
    totalCountCategory():Promise<number>;
}