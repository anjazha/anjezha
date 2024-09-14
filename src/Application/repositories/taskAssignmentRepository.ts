import { injectable } from "inversify";
import { ITaskAssignmentRepository } from "../interfaces/TaskAssignment/ITaskAssignmentRepository";
import { TaskAssignment } from "@/Domain/entities/TaskAssignment";
import { safePromise } from "@/helpers/safePromise";
import { pgClient } from "@/Infrastructure/database";
import { HTTP404Error, HTTP500Error } from "@/helpers/ApiError";
import { ETaskStatus } from "../interfaces/enums/ETaskStatus";

@injectable()
export class TaskAssignmentRepository implements ITaskAssignmentRepository {
  constructor() {}

  async assign(assignment: TaskAssignment): Promise<boolean> {
    const query = `INSERT INTO tasker_assignments (task_id, tasker_id, status, assigned_at) VALUES ($1, $2, $3, $4) RETURNING id`;
    const values = [
      assignment.taskId,
      assignment.taskerId,
      assignment.status,
      assignment.assignedAt,
    ];

    const [error, result] = await safePromise(() =>
      pgClient.query(query, values)
    );
    if (error) {
      console.log(error);
      throw new HTTP500Error(error);
    }

    return result?.rowCount > 0;
  }

  async isTaskExist(taskId: number) : Promise<boolean>{
    const query = `SELECT * FROM tasks WHERE id = $1`;
    const values = [taskId];

    const [error, result] = await safePromise(() =>
      pgClient.query(query, values)
    );
    if (error) {
      throw new HTTP500Error(error);
    }

    return result?.rowCount > 0;
  }


  async updateStatus (taskId: number, status : ETaskStatus) : Promise<boolean>{
      const query = `UPDATE tasker_assignments SET status = $1 WHERE task_id = $2 RETURNING id`;
      const values = [status, taskId];

      const [error, data] = await safePromise(() => pgClient.query(query, values));
      if (error) throw new HTTP500Error(error);

      if (data?.rowCount === 0) throw new HTTP404Error(`There is no task assignment for task with id ${taskId}`);

    return true
  }
}
