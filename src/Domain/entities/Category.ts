import { SubCategory } from "./SubCategory";


export class Category{
    constructor(public category: string, public id?: number, public subcategories: SubCategory[] = []
    ) {}
};
