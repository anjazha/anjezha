import { TaskApplication } from "@/Domain/entities/TaskApplication";
import { ITaskApplicationRepository } from "../interfaces/TaskApplication/ITaskApplicationRepository";
import { ETaskAppStatus } from "../interfaces/enums/ETaskAppStatus";
import { safePromise } from "@/helpers/safePromise";
import { pgClient } from "@/Infrastructure/database";
import { HTTP500Error } from "@/helpers/ApiError";
import { injectable } from "inversify";

@injectable()
export class TaskApplicationRepository implements ITaskApplicationRepository {
  constructor() {}

  async apply(application: TaskApplication): Promise<boolean> {
    // console.log(application);
    const query = `INSERT INTO applies (task_id, tasker_id, status, content, price) VALUES ($1, $2, $3, $4, $5) RETURNING id`;
    const values = [
      application.taskId,
      application.taskerId,
      ETaskAppStatus.PENDING,
      application.content,
      application.price,
    ];

    const [error, data] = await safePromise(() =>
      pgClient.query(query, values)
    );
    // console.log(error, data);
    if (error) throw new HTTP500Error(error);

    return true;
  }
  async getApplications(
    taskId: number | null,
    taskerId: number | null
  ): Promise<TaskApplication[]> {
    let query = `SELECT 
  ap.id, 
  ap.task_id, 
  ap.status, 
  ap.content, 
  ap.price,
  json_build_object(
    'id', ap.tasker_id,
    'name', users.name,
    'profile_picture', users.profile_picture
  ) AS tasker
FROM 
  applies AS ap
LEFT JOIN 
  taskers ON ap.tasker_id = taskers.id
LEFT JOIN 
  users ON taskers.user_id = users.id 
WHERE 1=1`; //WHERE 1=1 is a trick to make the query more dynamic
    const values: any = [];
    if (taskId) {
      query += ` AND task_id = $1`;
      values.push(taskId);
    }
    if (taskerId) {
      query += ` AND tasker_id = $${values.length + 1}`;
      values.push(taskerId);
    }

    const [error, data] = await safePromise(() =>
      pgClient.query(query, values)
    );

    if (error) throw new HTTP500Error(error);

    return data.rows;
  }
  // this logic may be in task assignment
  async acceptApplication(appId: number): Promise<boolean> {
    const query = `UPDATE applies SET status = $1 WHERE id = $2`;
    const values = [ETaskAppStatus.ACCEPTED, appId];

    const [error, data] = await safePromise(() =>
      pgClient.query(query, values)
    );

    if (error) throw new HTTP500Error(error);

    return true;
  }

  async checkIfTaskerApplied(
    taskId: number,
    taskerId: number
  ): Promise<boolean> {
    const query = `SELECT * FROM applies WHERE task_id = $1 AND tasker_id = $2`;
    const [error, data] = await safePromise(() =>
      pgClient.query(query, [taskId, taskerId])
    );
    if (error) throw new HTTP500Error(error);
    return data.rows.length > 0;
  }

  async checkifTaskerIsTaskOwner(
    taskId: number,
    taskerId: number
  ): Promise<boolean> {
    const query = `SELECT * 
                      FROM v_tasks t 
                      LEFT JOIN users u ON t.user_id = u.id 
                      LEFT JOIN taskers ta ON ta.user_id = u.id 
                      WHERE t.id = $1
                        AND ta.id = $2 
                        AND t.user_id = ta.user_id;
`;

    const [error, data] = await safePromise(() =>
      pgClient.query(query, [taskId, taskerId])
    );
    if (error) throw new HTTP500Error(error);
    return data.rows.length > 0;
  }
}
