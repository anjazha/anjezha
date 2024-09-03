import { Router } from "express";
import { Container } from "inversify";
import { CategoryController } from "../controllers/categoryController";
import { ICategoryRepository } from "@/Application/interfaces/ICategoryRepositoy";
import { INTERFACE_TYPE } from "@/helpers";
import { createInflateRaw } from "zlib";
import { CategoryRepository } from "@/Application/repositories/categoryRpository";
import { ICategoryService } from "@/Application/interfaces/ICategoryService";
import { CategoryService } from "@/Application/services/categoryService";
import { alllowTo, isAuth } from "../middlewares/isAuth";



const categoryRoute = Router();


const container = new Container();

// resolve depenceies injedction category repository
container.bind<ICategoryRepository>(INTERFACE_TYPE.CategoryRepository).to(CategoryRepository);

// resolve depenceies injection category service
container.bind<ICategoryService>(INTERFACE_TYPE.CategoryService).to(CategoryService);

// resolve depenceies injection category controller
container.bind<CategoryController>(INTERFACE_TYPE.CategoryController).to(CategoryController);

const categoryController = container.get<CategoryController>(INTERFACE_TYPE.CategoryController);



categoryRoute.use(isAuth,alllowTo('manger, admin'));

categoryRoute.route('/category')
.post( categoryController.createCategory.bind(categoryController))
.get( categoryController.getCategories.bind(categoryController));

categoryRoute.route('/category/:id')
.get( categoryController.getCategoryById.bind(categoryController))
.post( categoryController.getCategoryById.bind(categoryController))
.delete( categoryController.deleteCategory.bind(categoryController));





export default categoryRoute;