import { injectable } from "inversify";

import {ICategoryRepository} from "@/Application/interfaces/ICategoryRepositoy";
import { pgClient } from "@/Infrastructure/database";
import { Pool } from "pg";
import { Category } from "@/Domain/entities/Category";

@injectable()

export class CategoryRepository implements ICategoryRepository{
    private client:Pool;
    cosntructor() {
        this.client=  pgClient;
    }

    async createCategory(category: string): Promise<Category> {
      try{

          const query = 'INSERT INTO categories (name) VALUES ($1) RETURNING *';
          const values = [category];
          const { rows } = await this.client.query(query, values);
          return rows[0];
        } catch(err){
          throw new Error(`Error creating category: ${err.message} ${err.stack}`);
      }
    }

    async getCategories(): Promise<Category[]> {
        try{
            const query = 'SELECT * FROM categories';
            const { rows } = await this.client.query(query);
            return rows;
        } catch(err){
            throw new Error(`Error getting categories: ${err.message} ${err.stack}`);
        }
    }

    async getCategoryById(id: number): Promise<Category> {
        try{
            const query = 'SELECT * FROM categories WHERE id = $1';
            const values = [id];
            const { rows } = await this.client.query(query, values);
            return rows[0];
        } catch(err){
            throw new Error(`Error getting category by id: ${err.message} ${err.stack}`);
        }
    }

    async getCategoryByName(categoryName: string): Promise<Category | null> {
        try{
            const query = 'SELECT * FROM categories WHERE name = $1';
            const values = [categoryName];
            const { rows } = await this.client.query(query, values);
            return rows[0];
        } catch(err){
            throw new Error(`Error getting category by name: ${err.message} ${err.stack}`);
        }
    }

    async updateCategory(category: string, id: number): Promise<any> {
        try{
            const query = 'UPDATE categories SET name = $1 WHERE id = $2 RETURNING *';
            const values = [category, id];
            const { rows } = await this.client.query(query, values);
            return rows[0];
        } catch(err){
            throw new Error(`Error updating category: ${err.message} ${err.stack}`);
        }
    }

    async deleteCategory(id: number): Promise<any> {
        try{
            const query = 'DELETE FROM categories WHERE id = $1';
            const values = [id];
            await this.client.query(query, values);
            return {message: 'category is deleted'};
        } catch(err){
            throw new Error(`Error deleting category: ${err.message} ${err.stack}`);
        }
    }

    
}