import { SubCategory } from "@/Domain/entities/SubCategory";


export interface ISubCategoryService {
        
            createSubCategory(subCategory: SubCategory): Promise<SubCategory>;
        
            getSubCategories(): Promise<SubCategory[]>;
        
            getSubCategoryById(id: number): Promise<SubCategory>;
        
            getSubCategoryByName(subCategoryName: string): Promise<SubCategory>;
        
            updateSubCategory(subCategory: SubCategory, id: number): Promise<any>;
        
            deleteSubCategory(id: number): Promise<any>;

            getSubCategoriesByCategory(categoryId: number): Promise<any>;

        }