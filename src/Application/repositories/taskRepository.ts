import { injectable } from "inversify";
import { ITaskRepository } from "../interfaces/Task/ITaskRepository";
import { connectDB, pgClient } from "@/Infrastructure/database";
import { safePromise } from "@/helpers/safePromise";
import { Task } from "@/Domain/entities/Task";
import { HTTP400Error, HTTP500Error } from "@/helpers/ApiError";

@injectable()
export class TaskRepository implements ITaskRepository {
  constructor() {}
  async createTask(task: Task): Promise<Task> {
    // let query = `INSERT INTO tasks (user_id `;
    // let placeholders = `($1`;
    // const values = [userId];

    // Object.keys(task).forEach((key, i) => {
    //   query += `,${key}`;
    //   placeholders += `,$${i + 2}`;
    //   values.push(task[key]);
    // });

    // query += `) VALUES ${placeholders}) RETURNING *`;
    // console.log(query)
    const client = await pgClient.connect();
    try {
      await client.query("BEGIN");
      const insertTaskText = `
      INSERT INTO tasks (user_id, title, description, date, budget, longitude, latitude, address, category_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`;
      const { rows,  } = await client.query(insertTaskText, [
        task.userId,
        task.title,
        task.description,
        task.date,
        task.budget,
        task.location.longitude,
        task.location.latitude,
        task.address,
        task.category_id,
      ]);
    //   console.log(rows);
      const taskId = rows[0].id;

      console.log(taskId);
      // set task status to its default value // pending
      await client.query(
        "INSERT INTO task_statuses (task_id, status) VALUES ($1, $2)",
        [taskId, "pending"]
      );

      // insert task skills
      for (let skill of task.skills) {
        let query = `INSERT INTO task_skills (task_id, name) VALUES ($1, $2)`;
        let values = [taskId, skill];
        await client.query(query, values);
      }

      // Insert into task_schedules table
      await client.query(
        `
    INSERT INTO task_schedules (task_id, start_time, schedule_type, end_time)
    VALUES ($1, $2, $3, $4)`,
        [
          taskId,
          task.schedule.start_time,
          task.schedule.schedule_type,
          task.schedule.end_time,
        ]
      );
      task.schedule;
      if (task.attachments) {
        task.attachments.forEach(
          async (attachment: {
            file_type: string;
            file_path: string;
            file_size: number;
          }) => {
            await client.query(
              `
        INSERT INTO task_attachments (task_id, file_type, file_path, file_size)
        VALUES ($1, $2, $3, $4)`,
              [
                taskId,
                attachment.file_type,
                attachment.file_path,
                attachment.file_size,
              ]
            );
          }
        );
      }
      await client.query("COMMIT");
    //   console.log(rows[0].id);
      return rows[0];
    } catch (e) {
      await client.query("ROLLBACK");
    //   console.error(e);
      throw new HTTP500Error("create task transaction failed " + e.message);
    } finally {
      client.release();
    }
  }

  updateTask(id: number, task: Task): Promise<Task | null> {
    throw new Error("Method not implemented.");
  }

  deleteTask(id: number): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  async findAllTasks(): Promise<Task[]> {
    try {
      const { rows } = await pgClient.query(`
SELECT 
    t.id,
    t.user_id,
    t.title,
    t.description,
    t.date,
    t.budget,
    t.longitude,
    t.latitude,
    t.address,
    tc.name as category,
    ARRAY_AGG(distinct ts.name) AS skills,  
	ARRAY_AGG(distinct ta.file_path) AS attachmets ,
    s.status,
    sch.schedule_type,
    sch.start_time,
    sch.end_time
FROM 
    tasks t
LEFT JOIN categories tc ON t.category_id = tc.id
LEFT JOIN 
    task_skills ts ON t.id = ts.task_id
LEFT JOIN 
    task_statuses s ON t.id = s.task_id
LEFT JOIN 
    task_schedules sch ON t.id = sch.task_id
LEFT JOIN 
    task_attachments ta ON t.id = ta.task_id
GROUP BY 
    t.id, s.status, sch.schedule_type, sch.start_time, sch.end_time, tc.name;`);
      return rows;
    } catch (error) {
      throw new HTTP500Error("Error while fetching tasks " + error.message);
    }
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
