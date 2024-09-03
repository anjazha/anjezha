import { Router } from "express";
import { Container } from "inversify";

import { INTERFACE_TYPE } from "@/helpers";
import { alllowTo, isAuth } from "../middlewares/isAuth";
import { SubCategoryRepository } from "@/Application/repositories/subcategoryRepository";
import { ISubCategoryRepository } from "@/Application/interfaces/ISubCategoryRepository";
import { ISubCategoryService } from "@/Application/interfaces/ISubCategoryService";
import { CategoryService } from "@/Application/services/categoryService";
import { SubCategoryService } from "@/Application/services/subcategoryService";
import { SubCategoryController } from "../controllers/subcategoryController";



const subcategoryRoute = Router();


const container = new Container();

// resolve depenceies injedction category repository
container.bind<ISubCategoryRepository>(INTERFACE_TYPE.SubCategoryRepository).to(SubCategoryRepository);

// resolve depenceies injection category service
container.bind<ISubCategoryService>(INTERFACE_TYPE.SubCategoryService).to(SubCategoryService);

// resolve depenceies injection category controller
container.bind<SubCategoryController>(INTERFACE_TYPE.SubCategoryController).to(SubCategoryController);

const subcateroyController = container.get<SubCategoryController>(INTERFACE_TYPE.SubCategoryController);



subcategoryRoute.use(isAuth,alllowTo('manger, admin'));

subcategoryRoute.route('/subcategory')
.post( subcateroyController.createSubCategory.bind(subcateroyController))
.get( subcateroyController.getSubCategories.bind(subcateroyController));

subcategoryRoute.route('/subcategory/:id')
.get( subcateroyController.getSubCategoriesByCategory.bind(subcateroyController))
.put( subcateroyController.updateSubCategory.bind(subcateroyController))
.delete( subcateroyController.deleteSubCategory.bind(subcateroyController));





export default subcategoryRoute;