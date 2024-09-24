import { Pool } from "pg";
import {injectable } from "inversify";


import { pgClient } from "@/Infrastructure/database";
import { SubCategory } from "@/Domain/entities/SubCategory";
import { ISubCategoryRepository } from "../interfaces/ISubCategoryRepository";
import { HTTP500Error } from "@/helpers/ApiError";



@injectable()
export class SubCategoryRepository implements ISubCategoryRepository {
  private client:Pool;

    constructor(){
        this.client= pgClient;
      }

    async createSubCategory(subCategoryData: SubCategory): Promise<SubCategory> {
      try {

        let {subcategory, categoryId, imageUrl, description } = subCategoryData;
        console.log('repository ', description);

        description = description? description: '';

        imageUrl = imageUrl? imageUrl: '';
        
        // write query to insert subcategory
        const query = 'INSERT INTO subcategories (subcategory, category_id, image_url, description) VALUES ($1, $2, $3, $4) RETURNING *';
        // pass subcategory
        const values = [subcategory, +categoryId, imageUrl, description];
        // execute query
        const { rows } = await this.client.query(query, values);
        // map rows to subcategory object
        return  new SubCategory(rows[0].subcategory, rows[0].category_id, rows[0].image_url, rows[0].description, rows[0].id);
        } catch(err:any){
           throw new HTTP500Error(`Error creating subcategory: ${err.message} ${err.stack}`);
        }
    }

    async getSubCategories(): Promise<SubCategory[]> {
        try {

            // write query to get all subcategories
           const query = 'SELECT * FROM subcategories';
              // execute query
           const { rows } = await this.client.query(query);
              // map rows to subcategory object
           return rows.map((subcategory: SubCategory) => new SubCategory(subcategory.subcategory, subcategory.categoryId,subcategory.imageUrl, subcategory.description, subcategory.id));
        } catch(err:any){
              throw new Error(`Error getting subcategories: ${err.message} ${err.stack}`);
        }
    }

    async getSubCategoryById(id: number): Promise<SubCategory> {
        try {

            // write query to get subcategory by id
           const query = 'SELECT * FROM subcategories WHERE id = $1';
           // pass id as value
           const values = [id];
           // execute query
           const { rows } = await this.client.query(query, values);
              //  rows[0] to subcategory object
           return new SubCategory(rows[0].subcategory, rows[0].category_id, rows[0].id);

        } catch(err:any){
           throw new Error(`Error getting subcategory by id: ${err.message} ${err.stack}`);
        }
    }

    async getSubCategoryByName(subCategoryName: string): Promise<SubCategory> {
        try {
            // write query to get subcategory by name
             const query = 'SELECT * FROM subcategories WHERE subcategory = $1';
             //  pass name as value
             const values = [subCategoryName];
             // execute query
             const { rows } = await this.client.query(query, values);
             // map rows to subcategory object
             return new SubCategory(rows[0].subcategory, rows[0].category_id, rows[0].id);

        } catch(err:any){
            throw new Error(`Error getting subcategory by name: ${err.message} ${err.stack}`);
        }
    }

    async updateSubCategory(subCategoryData: SubCategory, id: number): Promise<any> {
        try {
            // write query to update subcategory
             let query = 'UPDATE subcategories SET ';
             let index=1;
             const values:any[] = [];


             for(let key in subCategoryData) {

                  key = key == 'imageUrl'?'image_url': key;
                  key = key == 'categoryId'?'category_id': key;

                  if(subCategoryData.hasOwnProperty(key)){
                     query += `${key} = $${index}, `;
                     values.push((subCategoryData as any)[key]);
                     index++;
                  }
             }

             // pass subcategory
             query = query.slice(0, -2);
             query += ` WHERE id = $${index} RETURNING *`;
             values.push(id);
             // execute query
              const { rows } = await this.client.query(query, values);
             // map rows to subcategory object
              return  new SubCategory(rows[0].subcategory, rows[0].category_id,rows[0].imageUrl, rows[0].description, rows[0].id);

             } catch(err:any){
               throw new HTTP500Error(`Error updating subcategory: ${err.message} ${err.stack}`);
        }
    }

    async deleteSubCategory(id: number): Promise<any> {
        try {
        // write query to delete subcategory
        const query = 'DELETE FROM subcategories WHERE id = $1';
        // pass id as value
        const values = [id];
        // execute query
        await this.client.query(query, values);
        // return message
        return 'Subcategory deleted';
        } catch(err:any){
            throw new HTTP500Error(`Error deleting subcategory: ${err.message} ${err.stack}`);
        }
    }

    async getSubCategoriesByCategory(categoryId: number): Promise<any> {
        try {
        // write query to get subcategories by category
        const query = 'SELECT * FROM subcategories WHERE category_id = $1';
        // pass category id as value
        const values = [categoryId];
        // execute query
        const { rows } = await this.client.query(query, values);
        // map rows to subcategory object
        return rows.map((subcategory: SubCategory) => new SubCategory(subcategory.subcategory, subcategory.categoryId,subcategory.imageUrl, subcategory.description, subcategory.id));
        } catch(err:any){
           throw new HTTP500Error(`Error getting subcategories by category: ${err.message} ${err.stack}`);
        }
    }
}