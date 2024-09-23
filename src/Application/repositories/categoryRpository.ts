import { injectable } from "inversify";

import {ICategoryRepository} from "@/Application/interfaces/ICategoryRepositoy";
import { pgClient } from "@/Infrastructure/database";
import { Client, Pool } from "pg";
import { Category } from "@/Domain/entities/Category";
import { SubCategory } from "@/Domain/entities/SubCategory";
import { an } from "@faker-js/faker/dist/airline-BBTAAfHZ";

@injectable()
export class CategoryRepository implements ICategoryRepository{
   
    private client: Client | Pool;
     constructor(){
        this.client = pgClient;
     }  

    async createCategory(categoryData: Category): Promise<Category> {
      try{

        let {category, imageUrl, description} = categoryData;

         description = description? description: '';

         imageUrl= imageUrl? imageUrl: '';
          
          const query = 'INSERT INTO categories (category, image_url, description ) VALUES ($1, $2, $3) RETURNING *';

          const values = [category, imageUrl, description];

          const { rows } = await this.client.query(query, values);

          return new Category(rows[0].name, rows[0].image_url, rows[0].description, rows[0].id);

        } catch(err:any){

          throw new Error(`Error creating category: ${err.message} ${err.stack}`);

      }
    }

    async getCategories(): Promise<Category[]> {
        try{
            // wreite query to get all categories
          const query = `
            SELECT 
                categories.id as category_id, 
                categories.category as category_name, 
                categories.image_url as category_image_url,
                categories.description as category_description,
                subcategories.id as subcategory_id, 
                subcategories.image_url as subcategory_image_url
                subcategories.description as subcategory_description
                subcategories.subcategory as subcategory_name 
              FROM categories 
              LEFT JOIN subcategories ON categories.id = subcategories.category_id`;

            // execute query
            const { rows } = await this.client.query(query);

            // map rows to category object
            // map between categoriesand subcategoies
            // console.log(rows);
     
            const categoriesMap:{ [key: string]: Category } = {};

            rows.map((row:any) => {
                // check if category is exist or not
                if(row.category_id in categoriesMap){ 
                    // check if subcategory is exist or not
                    if(row.subcategory_id){
                        categoriesMap[row.category_id].subcategories.push(new SubCategory(row.subcategory_name, row.subcategory_id, row.subcategory_image_url, row.subcategory_description));
                    }

                 } else {
                    categoriesMap[row.category_id] = new Category(row.category_name, row.category_id,row.category_image_url, row.category_description , []);

                    if(row.subcategory_id){
                        categoriesMap[row.category_id].subcategories.push(new SubCategory(row.subcategory_name, row.subcategory_id, row.subcategory_image_url, row.subcategory_description))
                    }
    
                 }
              
                });

                return Object.values(categoriesMap);

        } catch(err:any){
            throw new Error(`Error getting categories: ${err.message} ${err.stack}`);
        }
    }


    async getCategoryById(id: number): Promise<Category> {
        try{
            // write query to get category by id
            const query = 'SELECT * FROM categories WHERE id = $1';
            // pass id as value
            const values = [id];
            // execute query
            const { rows } = await this.client.query(query, values);
            // map rows to category object
            return new Category(rows[0].category, rows[0].id);

        } catch(err:any){
            throw new Error(`Error getting category by id: ${err.message} ${err.stack}`);
        }
    }

    async getCategoryByName(categoryName: string): Promise<Category | null> {
        try{
            const query = 'SELECT * FROM categories WHERE category = $1';
            const values = [categoryName];
            const { rows } = await this.client.query(query, values);
            return rows[0];
        } catch(err:any){
            throw new Error(`Error getting category by name: ${err.message} ${err.stack}`);
        }
    }

    async updateCategory(categoryData: Category, id: number): Promise<any> {
        try{

            let query = 'UPDATE categories SET ';
            const values=[];
            let index=1;

            for (let key in categoryData){
                if(categoryData.hasOwnProperty(key)){
                    query += `${key} = $${index}, `; // imageUrl => 
                    values.push((categoryData as any)[key]); // cateting type from category to any
                    index++;
                }
            }

            query = query.slice(0, -2); // remove last comma

            query+= ` WHERE id = $${index} RETURNING *`;
            values.push(id);


            //  query = 'UPDATE categories SET category = $1 WHERE id = $2 RETURNING *';
            // const values = [category, id];
            const { rows } = await this.client.query(query, values);

            return new Category(rows[0].category,rows[0].image_url, rows[0].description, rows[0].id);

        } catch(err:any){
            throw new Error(`Error updating category: ${err.message} ${err.stack}`);
        }
    }

    async deleteCategory(id: number): Promise<any> {
        try{
            const query = 'DELETE FROM categories WHERE id = $1';
            const values = [id];
            await this.client.query(query, values);
            return {message: 'category is deleted'};
        } catch(err:any){
            throw new Error(`Error deleting category: ${err.message} ${err.stack}`);
        }
    }

    
}