import { inject, injectable } from "inversify";
import { Request, Response, NextFunction} from "express";

import { ICategoryService } from "@/Application/interfaces/ICategoryService";
import { INTERFACE_TYPE } from "@/helpers/containerConst";
import { start } from "repl";
import { Category } from "@/Domain/entities/Category";

@injectable()
export class CategoryController {

    constructor(
       @inject(INTERFACE_TYPE.CategoryService)  private categoryService: ICategoryService
    ) {}

    async createCategory(req: Request, res: Response, next:NextFunction) {
        try {
            const { category , imageUrl, description} = req.body;
            
            console.log(category , imageUrl, description)

            // console.log(attachments);
            // const { attachments } = req.body;
            // const imageUrl = attachments[0].file_path;

            const categoryData= new Category(category, imageUrl, description);

            const newCategory = await this.categoryService.createCategory(categoryData);
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

            const page = Number(req.query.limit) || 1; // default to page 1
            const limit = Number(req.query.limit) || 10; // default to 10 items per page

    // Calculate the offset (number of items to skip)
            const offset = (page - 1) * limit;
            const categories = await this.categoryService.getCategories(limit, offset);
            const totalCount =  await this.categoryService.totalCountCategory();

            const totalPage = Math.round(totalCount/limit);

            let nextPage =1;

            let prevPage = 1;

            if (page < totalPage) nextPage+=1;

            if(page > 1) prevPage -=1;

            return res.status(200).json({
                status: "success",
                limit,
                curPage:page,
                prevPage,
                nextPage,
                totalPage,
                data: categories
            });
        } catch (err:any) {
            return res.status(500).json({
                status: "error",
                err: err.message,
                stack:err.stack
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
            const { id } = req.params;
            const { category , attachments, description} = req.body;
            // const { attachments } = req.body;
            const imageUrl = attachments[0].file_path;

            const categoryData= new Category(category, imageUrl, description);
            
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