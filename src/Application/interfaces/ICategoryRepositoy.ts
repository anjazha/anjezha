import { Category } from "@/Domain/entities/Category";


export interface ICategoryRepository {

    createCategory(category: Category): Promise<Category>;

    getCategories(): Promise<Category[]>;

    getCategoryById(id: number): Promise<Category>;

    getCategoryByName(categoryName: string): Promise<Category | null>;

    updateCategory(category: Category, id: number): Promise<any>;

    deleteCategory(id: number): Promise<any>;

}