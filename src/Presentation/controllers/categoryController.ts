import { inject, injectable } from "inversify";
import { Request, Response, NextFunction} from "express";

import { ICategoryService } from "@/Application/interfaces/ICategoryService";
import { INTERFACE_TYPE } from "@/helpers/containerConst";
import { start } from "repl";

@injectable()
export class CategoryController {

    constructor(
       @inject(INTERFACE_TYPE.CategoryService)  private categoryService: ICategoryService
    ) {}

    async createCategory(req: Request, res: Response, next:NextFunction) {
        try {
            const { category } = req.body;
            const newCategory = await this.categoryService.createCategory(category);
            return res.status(201).json({
                status: "success",
                data: newCategory
            });
        } catch (err:any) {
            return res.status(500).json({
                status: "error",
                message: err.message,
                stack:err.stack
            });
        }
    }


    async getCategories(req: Request, res: Response, next:NextFunction) {

        try {
            const categories = await this.categoryService.getCategories();
            return res.status(200).json({
                status: "success",
                data: categories
            });
        } catch (err:any) {
            return res.status(500).json({
                status: "error",
                message: err.message
            });
        }
    }

    async getCategoryById(req: Request, res: Response, next:NextFunction) {

        try {
            const { id } = req.params;
            const category = await this.categoryService.getCategoryById(Number(id));
            return res.status(200).json({
                status: "success",
                data: category
            });
        } catch (err:any) {
            return res.status(500).json({
                status: "error",
                message: err.message,
                stack:err.stack
            });
        }
    }


    async getCategoryByName(req: Request, res: Response, next:NextFunction) {
            
            try {
                const { categoryName } = req.params;
                const category = await this.categoryService.getCategoryByName(categoryName);
                return res.status(200).json({
                    status: "success",
                    data: category
                });
            } catch (err:any) {
                return res.status(500).json({
                    status: "error",
                    message: err.message,
                    stack:err.stack
                });
            }
        }

    async updateCategory(req: Request, res: Response, next:NextFunction) {
        try {
            const { category } = req.body;
            const { id } = req.params;
            const updatedCategory = await this.categoryService.updateCategory(category, Number(id));
            return res.status(200).json({
                status: "success",
                data: updatedCategory
            });
        } catch (err:any) {
            return res.status(500).json({
                status: "error",
                message: err.message,
                stack:err.stack
            });
        }
    }

    async deleteCategory(req: Request, res: Response, next:NextFunction) {
        try {
            const { id } = req.params;
            await this.categoryService.deleteCategory(Number(id));
            return res.status(200).json({
                status: "success",
                message: "category is deleted"
            });
        } catch (err:any) {
            return res.status(500).json({
                status: "error",
                message: err.message,
                stack:err.stack
            });
        }
    }


}