import { injectable } from "inversify";
import { ITaskRepository } from "../interfaces/Task/ITaskRepository";
import { connectDB, pgClient } from "@/Infrastructure/database";
import { safePromise } from "@/helpers/safePromise";
import { Task } from "@/Domain/entities/Task";
import { HTTP400Error } from "@/helpers/ApiError";

@injectable()
export class TaskRepository implements ITaskRepository{
        
       async createTask(userId : number  , task: any): Promise<Task> {
            let  query = `INSERT INTO tasks (user_id `
            let placeholders = `($1`;
            const values = [userId];

            Object.keys(task).forEach((key, i) => {
                query += `,${key}`;
                placeholders += `,$${i+2}`;
                values.push(task[key]);
            });

            query += `) VALUES ${placeholders}) RETURNING *`;

            // console.log(query, values);
            // await connectDB();

            const {rows} = await pgClient.query(query, values);
            return rows[0];
        }
        
        updateTask(id: number, task: Task): Promise<Task | null> {
            throw new Error("Method not implemented.");
        }
        
        deleteTask(id: number): Promise<boolean> {
            throw new Error("Method not implemented.");
        }
        
        findAllTasks(): Promise<Task[]> {
            throw new Error("Method not implemented.");
        }
        
        findTaskById(id: number): Promise<Task | null> {
            throw new Error("Method not implemented.");
        }
}


// const repo = new TaskRepository();

// repo.createTask(5, {
//     title: "Fix Leaky Faucet",
//     description: "Need a plumber to fix a leaky faucet in the kitchen.",
//     date: "2024-08-27", // YYYY-MM-DD format
//     budget: 150.00, // Budget in currency
//     longitude: -122.4194, // Longitude example (San Francisco)
//     latitude: 37.7749, // Latitude example (San Francisco)
//     address: "123 Market St, San Francisco, CA 94103",
//     category_id: 1 // Assuming category with ID 3 exists (e.g., Plumbing)
//   }
//   ).then((data) => {
//     console.log(data);
// }).catch((error) => {
//     console.log(error);
// })