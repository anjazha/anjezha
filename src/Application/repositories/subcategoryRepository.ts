import { Pool } from "pg";
import {injectable } from "inversify";


import { pgClient } from "@/Infrastructure/database";
import { SubCategory } from "@/Domain/entities/SubCategory";
import { ISubCategoryRepository } from "../interfaces/ISubCategoryRepository";



@injectable()
export class SubCategoryRepository implements ISubCategoryRepository {
  private client:Pool;

  constructor(){
    this.client= pgClient;
  }

    async createSubCategory(subCategory: string, categoryId: number): Promise<SubCategory> {
        try {
        const query = 'INSERT INTO subcategories (name, category_id) VALUES ($1, $2) RETURNING *';
        const values = [subCategory, categoryId];
        const { rows } = await this.client.query(query, values);
        return rows[0];
        } catch(err){
        throw new Error(`Error creating subcategory: ${err.message} ${err.stack}`);
        }
    }

    async getSubCategories(): Promise<SubCategory[]> {
        try {
        const query = 'SELECT * FROM subcategories';
        const { rows } = await this.client.query(query);
        return rows;
        } catch(err){
        throw new Error(`Error getting subcategories: ${err.message} ${err.stack}`);
        }
    }

    async getSubCategoryById(id: number): Promise<SubCategory> {
        try {
        const query = 'SELECT * FROM subcategories WHERE id = $1';
        const values = [id];
        const { rows } = await this.client.query(query, values);
        return rows[0];
        } catch(err){
        throw new Error(`Error getting subcategory by id: ${err.message} ${err.stack}`);
        }
    }

    async getSubCategoryByName(subCategoryName: string): Promise<SubCategory> {
        try {
        const query = 'SELECT * FROM subcategories WHERE name = $1';
        const values = [subCategoryName];
        const { rows } = await this.client.query(query, values);
        return rows[0];
        } catch(err){
        throw new Error(`Error getting subcategory by name: ${err.message} ${err.stack}`);
        }
    }

    async updateSubCategory(subCategory: string, id: number): Promise<any> {
        try {
        const query = 'UPDATE subcategories SET name = $1 WHERE id = $2 RETURNING *';
        const values = [subCategory, id];
        const { rows } = await this.client.query(query, values);
        return rows[0];
        } catch(err){
        throw new Error(`Error updating subcategory: ${err.message} ${err.stack}`);
        }
    }

    async deleteSubCategory(id: number): Promise<any> {
        try {
        const query = 'DELETE FROM subcategories WHERE id = $1';
        const values = [id];
        await this.client.query(query, values);
        return 'Subcategory deleted';
        } catch(err){
        throw new Error(`Error deleting subcategory: ${err.message} ${err.stack}`);
        }
    }

    async getSubCategoriesByCategory(categoryId: number): Promise<any> {
        try {
        const query = 'SELECT * FROM subcategories WHERE category_id = $1';
        const values = [categoryId];
        const { rows } = await this.client.query(query, values);
        return rows;
        } catch(err){
        throw new Error(`Error getting subcategories by category: ${err.message} ${err.stack}`);
        }
    }
}