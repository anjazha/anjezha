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


  private readonly GET_ASSIGNMENTS_QUERY = `SELECT * FROM tasker_assignments WHERE task_id = $1`;
  private readonly ASSIGN_TASK_QUERY = `INSERT INTO tasker_assignments (task_id, tasker_id, status, assigned_at) VALUES ($1, $2, $3, $4) RETURNING id`;

  async assign(assignment: TaskAssignment): Promise<boolean> {
    const values = [
      assignment.taskId,
      assignment.taskerId,
      assignment.status,
      assignment.assignedAt,
    ];

    const [error, result] = await safePromise(() =>
      pgClient.query(this.ASSIGN_TASK_QUERY, values)
    );
    if (error) {
      console.log(error);
      throw new HTTP500Error(error);
    }

    return result?.rowCount > 0;
  }
private readonly UPDATE_TASK_ASSIGNMENTS_STATUS_QUERY = `UPDATE tasker_assignments SET status = $1 WHERE task_id = $2 RETURNING id`;
  async updateStatus (taskId: number, status : ETaskStatus) : Promise<boolean>{
      
      const values = [status, taskId];

      const [error, data] = await safePromise(() => pgClient.query(this.UPDATE_TASK_ASSIGNMENTS_STATUS_QUERY, values));
      if (error) throw new HTTP500Error(error);

      if (data?.rowCount === 0) return false;

    return true
  }


  async getAssignments(taskId: number): Promise<TaskAssignment[] | null> {
  
    const values = [taskId];

    const [error, data] = await safePromise(() => pgClient.query(this.GET_ASSIGNMENTS_QUERY, values));
    if (error) throw new HTTP500Error(error);

    if (data?.rowCount === 0) return null;

    return data.rows.map((row: any) => {
      return new TaskAssignment(
        row.task_id,
        row.tasker_id,
        row.status,
        row.assigned_at
      );
    });
  }
}
