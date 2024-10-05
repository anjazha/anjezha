import { inject, injectable } from "inversify";
import { Request, Response, NextFunction } from "express";

import { ISubCategoryService } from "@/Application/interfaces/ISubCategoryService";
import { INTERFACE_TYPE } from "@/helpers/containerConst";
import { SubCategory } from "@/Domain/entities/SubCategory";
import { console } from "inspector";

@injectable()
export  class SubCategoryController {
    
    constructor(
        @inject(INTERFACE_TYPE.SubCategoryService) private subCategoryService: ISubCategoryService
    ) { }

    async createSubCategory(req: Request, res: Response, next: NextFunction) {
        try {

            const { subcategory, categoryId, imageUrl, description} = req.body;

            // const imageUrl = attachments[0].file_path;

            console.log(subcategory, categoryId, imageUrl, description)
            

            const newSubCategory = await this.subCategoryService.createSubCategory(
                new SubCategory(subcategory, Number(categoryId), imageUrl, description)
            );

            return res.status(201).json({
                status: "success",
                data: newSubCategory
            });

        } catch (err:any) {
            return res.status(500).json({
                status: "error",
                message: err.message,
                stack: err.stack
            });
        }
    }

    async getSubCategories(req: Request, res: Response, next: NextFunction) {
            
            try {

                const subCategories = await this.subCategoryService.getSubCategories();
                return res.status(200).json({
                    status: "success",
                    data: subCategories
                });
            } catch (err:any) {
                return res.status(500).json({
                    status: "error",
                    message: err.message
                });
            }
        }

    async getSubCategoryById(req: Request, res: Response, next: NextFunction) {
            try {
                const { id } = req.params;
                const subCategory = await this.subCategoryService.getSubCategoryById(Number(id));
                return res.status(200).json({
                    status: "success",
                    data: subCategory
                });
            } catch (err:any) {
                return res.status(500).json({
                    status: "error",
                    message: err.message
                });
            }
        }

    async getSubCategoryByName(req: Request, res: Response, next: NextFunction) {
            try {
                const { subCategoryName } = req.params;
                const subCategory = await this.subCategoryService.getSubCategoryByName(subCategoryName);
                return res.status(200).json({
                    status: "success",
                    data: subCategory
                });
            } catch (err:any) {
                return res.status(500).json({
                    status: "error",
                    message: err.message
                });
            }
        }

    async updateSubCategory(req: Request, res: Response, next: NextFunction) {
         try {
                const { id } = req.params;

                const { subcategory, categoryId, imageUrl, description} = req.body;

                // const imageUrl =  attachments[0].file_path;

                const updatedSubCategory = await this.subCategoryService.updateSubCategory(
                    new SubCategory(subcategory, Number(categoryId), imageUrl, description),
                     Number(id));

                return res.status(200).json({
                    status: "success",
                    data: updatedSubCategory
                });
            } catch (err:any) {
                return res.status(500).json({
                    status: "error",
                    err: err.message,
                    stack:err.stack
                });
            }
        }
    
    async deleteSubCategory(req: Request, res: Response, next: NextFunction) {
            try {
                const { id } = req.params;
                await this.subCategoryService.deleteSubCategory(Number(id));
                return res.status(200).json({
                    status: "success",
                    message: "Subcategory deleted"
                });
            } catch (err:any) {
                return res.status(500).json({
                    status: "error",
                    message: err.message
                });
            }
        }

    async getSubCategoriesByCategory(req: Request, res: Response, next: NextFunction) {
            try {
                const { categoryId } = req.params;
                const subCategories = await this.subCategoryService.getSubCategoriesByCategory(Number(categoryId));
                return res.status(200).json({
                    status: "success",
                    data: subCategories
                });
            } catch (err:any) {
                return res.status(500).json({
                    status: "error",
                    message: err.message
                });
            }
        }
    
}



