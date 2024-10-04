import { SubCategory } from "./SubCategory";


export class Category{
    constructor(
        public category: string, 
        public imageUrl?:string, 
        public description?:string, 
        public id?: number, 
        public subcategories?: SubCategory[]
    ) {}
};
