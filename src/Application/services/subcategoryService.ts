import { inject, injectable } from "inversify";
import { ISubCategoryService } from "../interfaces/ISubCategoryService";
import { INTERFACE_TYPE } from "@/helpers/containerConst";
import { ISubCategoryRepository } from "../interfaces/ISubCategoryRepository";
import { SubCategory } from "@/Domain/entities/SubCategory";

@injectable()
export class SubCategoryService implements ISubCategoryService{

    constructor(
        @inject(INTERFACE_TYPE.SubCategoryRepository) private subCategoryRepository: ISubCategoryRepository
    ){}

    async createSubCategory(subCategory: SubCategory) {
        try {
            return await this.subCategoryRepository.createSubCategory(subCategory);
        } catch (err:any) {
            throw new Error(`Error creating subcategory: ${err.message} ${err.stack}`);
        }
    }

    async getSubCategories() {
        try {
            return await this.subCategoryRepository.getSubCategories();
        } catch (err:any) {
            throw new Error(`Error getting subcategories: ${err.message} ${err.stack}`);
        }
    }

    async getSubCategoryById(id: number) {
        try {
            return await this.subCategoryRepository.getSubCategoryById(id);
        } catch (err:any) {
            throw new Error(`Error getting subcategory by id: ${err.message} ${err.stack}`);
        }
    }

    async getSubCategoryByName(subCategoryName: string) {
        try {
            return await this.subCategoryRepository.getSubCategoryByName(subCategoryName);
        } catch (err:any) {
            throw new Error(`Error getting subcategory by name: ${err.message} ${err.stack}`);
        }
    }

    async updateSubCategory(subCategory: SubCategory, id: number) {
        try {
            return await this.subCategoryRepository.updateSubCategory(subCategory, id);
        } catch (err:any) {
            throw new Error(`Error updating subcategory: ${err.message} ${err.stack}`);
        }
    }

    async deleteSubCategory(id: number) {
        try {
            return await this.subCategoryRepository.deleteSubCategory(id);
        } catch (err:any) {
            throw new Error(`Error deleting subcategory: ${err.message} ${err.stack}`);
        }
    }

    async getSubCategoriesByCategory(categoryId: number) {
        try {
            return await this.subCategoryRepository.getSubCategoriesByCategory(categoryId);
        } catch (err:any) {
            throw new Error(`Error getting subcategories by category: ${err.message} ${err.stack}`);
        }
    }


}