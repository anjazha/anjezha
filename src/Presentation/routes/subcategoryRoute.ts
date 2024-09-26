import { Router } from "express";
import { Container } from "inversify";

import { INTERFACE_TYPE } from "@/helpers/containerConst";
import { allowTo, isAuth } from "../middlewares/isAuth";
import { SubCategoryRepository } from "@/Application/repositories/subcategoryRepository";
import { ISubCategoryRepository } from "@/Application/interfaces/ISubCategoryRepository";
import { ISubCategoryService } from "@/Application/interfaces/ISubCategoryService";
import { SubCategoryService } from "@/Application/services/subcategoryService";
import { SubCategoryController } from "../controllers/subcategoryController";
import { Interface } from "readline";



const subcategoryRoute = Router();


const container = new Container();

// resolve dependencies subcategory repository
container.bind<ISubCategoryRepository>(INTERFACE_TYPE.SubCategoryRepository).to(SubCategoryRepository);

// resolve dependencies subcategory service
container.bind<ISubCategoryService>(INTERFACE_TYPE.SubCategoryService).to(SubCategoryService);

// resolve dependencies subcategory controller
container.bind<SubCategoryController>(INTERFACE_TYPE.SubCategoryController).to(SubCategoryController);


const subcateroyController = container.get<SubCategoryController>(INTERFACE_TYPE.SubCategoryController);



// subcategoryRoute.use(isAuth,allowTo('manger, admin'),);
// subcategoryRoute.use(isAuth,allowTo('manger', 'admin'));

subcategoryRoute.route('/subcategory')
.post( 
    isAuth,
    allowTo('manger', 'admin'),
    subcateroyController.createSubCategory.bind(subcateroyController))

.get(subcateroyController.getSubCategories.bind(subcateroyController));

    
subcategoryRoute.route('/subcategory/:id')
.get(subcateroyController.getSubCategoryById.bind(subcateroyController))
.put( 
    isAuth,
    allowTo('manger, admin'),
    subcateroyController.updateSubCategory.bind(subcateroyController))
.delete( 
    isAuth,
    allowTo('manger, admin'), 
    subcateroyController.deleteSubCategory.bind(subcateroyController));





export default subcategoryRoute;
