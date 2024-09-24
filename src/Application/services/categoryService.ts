import { INTERFACE_TYPE } from "@/helpers/containerConst";
import { inject, injectable } from "inversify";
import { ICategoryRepository } from "../interfaces/ICategoryRepositoy";
import { ICategoryService } from "../interfaces/ICategoryService";
import { Category } from "@/Domain/entities/Category";



@injectable()
export class CategoryService implements ICategoryService {

  
    constructor(
        @inject(INTERFACE_TYPE.CategoryRepository) private categoryRepository: ICategoryRepository) {
       
    }

    async createCategory(category: Category): Promise<Category> {
        try {
            return await this.categoryRepository.createCategory(category);
        } catch (err:any) {
            throw new Error(`Error creating category: ${err.message} ${err.stack}`);
        }
    }

    async getCategories(): Promise<Category[]> {
        try {
            return await this.categoryRepository.getCategories();
        } catch (err:any) {
            throw new Error(`Error getting categories: ${err.message} ${err.stack}`);
        }
    }

    async getCategoryById(id: number): Promise<Category> {
        try {
            return await this.categoryRepository.getCategoryById(id);
        } catch (err:any) {
            throw new Error(`Error getting category by id: ${err.message} ${err.stack}`);
        }
    }

    async getCategoryByName(categoryName: string): Promise<Category | null> {
        try {
            return await this.categoryRepository.getCategoryByName(categoryName);
        } catch (err:any) {
            throw new Error(`Error getting category by name: ${err.message} ${err.stack}`);
        }
    }

    async updateCategory(category: Category, id: number): Promise<any> {
        try {
            return await this.categoryRepository.updateCategory(category, id);
        } catch (err:any) {
            throw new Error(`Error updating category: ${err.message} ${err.stack}`);
        }
    }

    async deleteCategory(id: number): Promise<any> {
        try {
            return await this.categoryRepository.deleteCategory(id);
        } catch (err:any) {
            throw new Error(`Error deleting category: ${err.message} ${err.stack}`);
        }
    }
}