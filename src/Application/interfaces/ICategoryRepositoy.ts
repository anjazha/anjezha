import { Category } from "@/Domain/entities/Category";


export interface ICategoryRepository {

    createCategory(category: string): Promise<Category>;

    getCategories(): Promise<Category[]>;

    getCategoryById(id: number): Promise<Category>;

    getCategoryByName(categoryName: string): Promise<Category | null>;

    updateCategory(category: string, id: number): Promise<any>;

    deleteCategory(id: number): Promise<any>;

}