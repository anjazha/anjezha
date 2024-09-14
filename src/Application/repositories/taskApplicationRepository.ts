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
    const query = `INSERT INTO applies (task_id, tasker_id, status, content) VALUES ($1, $2, $3, $4) RETURNING id`;
    const values = [
      application.taskId,
      application.taskerId,
      ETaskAppStatus.PENDING,
      application.content,
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
    let query = `SELECT * FROM applies WHERE 1=1`; //WHERE 1=1 is a trick to make the query more dynamic
    const values:any = [];
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
}
