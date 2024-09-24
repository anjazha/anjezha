import multer from "multer";
import { Router } from "express";
import { Container } from "inversify";
import { CategoryController } from "../controllers/categoryController";
import { ICategoryRepository } from "@/Application/interfaces/ICategoryRepositoy";
import { INTERFACE_TYPE } from "@/helpers/containerConst";
import { createInflateRaw } from "zlib";
import { CategoryRepository } from "@/Application/repositories/categoryRpository";
import { ICategoryService } from "@/Application/interfaces/ICategoryService";
import { CategoryService } from "@/Application/services/categoryService";
import { allowTo, isAuth } from "../middlewares/isAuth";
import { fileUpload, upload } from "../middlewares/filesUpload";



const categoryRoute = Router();

const container = new Container();

// resolve depenceies injedction category repository
container
  .bind<ICategoryRepository>(INTERFACE_TYPE.CategoryRepository)
  .to(CategoryRepository);

// resolve depenceies injection category service
container
  .bind<ICategoryService>(INTERFACE_TYPE.CategoryService)
  .to(CategoryService);

// resolve depenceies injection category controller
container
  .bind<CategoryController>(INTERFACE_TYPE.CategoryController)
  .to(CategoryController);

const categoryController = container.get<CategoryController>(
  INTERFACE_TYPE.CategoryController
);

// categoryRoute.use(isAuth,alllowTo('manager', 'admin'));
// const upload = multer({ storage: multer.memoryStorage() }, fi);

categoryRoute.route('/category')
.post(
       isAuth, 
       alllowTo('admin'), 
        fileUpload('imageUrl', 'categories'),
       categoryController.createCategory.bind(categoryController))

.get( categoryController.getCategories.bind(categoryController));

categoryRoute.route('/category/:id')
.get(categoryController.getCategoryById.bind(categoryController))
.put( 
    isAuth, 
    alllowTo('admin'),  
    fileUpload('imageUrl', 'categories'),
    categoryController.updateCategory.bind(categoryController))
.delete(
    isAuth, 
    alllowTo('admin'), 
    categoryController.deleteCategory.bind(categoryController));



export default categoryRoute;
