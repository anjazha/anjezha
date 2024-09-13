import { Skills } from "@/Domain/entities/Skills";
import { pgClient } from "@/Infrastructure/database";
import { Pool } from "pg";
import { ITaskerSkillsRepository } from "../interfaces/Skills/ITaskerSkillsRepository";
import { injectable } from "inversify";

@injectable()
export class TaskerSkillsRepository implements ITaskerSkillsRepository {
    private client: Pool;
    constructor() {
        this.client = pgClient;
    }

    async addSkillToTasker(taskerId: number, skillId: number): Promise<void> {
        await this.client.query(
            `INSERT INTO tasker_skills (tasker_id, skill_id) VALUES ($1, $2) returning *`,
            [taskerId, skillId]
        );
    }

    async findSkillsByTaskerId(taskerId: number): Promise<Skills[]> {
        const { rows } = await this.client.query(
            `SELECT s.skill, s.id FROM skills s
            JOIN tasker_skills ts ON s.id = ts.skill_id
            WHERE ts.tasker_id = $1`,
            [taskerId]
        );

        return rows.map((row) => new Skills(row.skill, row.id));
    }

    async deleteTaskerSkill(taskerId: number, skillId: number): Promise<any> {
        const { rows } = await this.client.query(
            `DELETE FROM tasker_skills WHERE tasker_id = $1 AND skill_id = $2 returning *`,
            [taskerId, skillId]
        );

        return "tasker skill deleted";
    }

    async updateSkillbyTaskerId(taskerId: number, skillId: number): Promise<any> {
         const query = `update skills set skill = $1 from tasker_skills where tasker_skills.skill_id = skills.id and tasker_skills.tasker_id = $2 returning *`;

         const { rows } = await this.client.query(
                query,
                [skillId, taskerId]
            );

            return rows;



    }
}