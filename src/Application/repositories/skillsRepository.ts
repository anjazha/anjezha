import { Skills } from "@/Domain/entities/Skills";
import { TaskerSkills } from "@/Domain/entities/TakserSkills";
import { Tasker } from "@/Domain/entities/Tasker";
import { pgClient } from "@/Infrastructure/database";
import { Client, Pool } from "pg";



export class SkillsRepository {
    private client:Pool;
    constructor() {
        this.client = pgClient;

    }

    async create(skill: Skills): Promise<Skills> {
        const { skill: skillName } = skill;
        const { rows } = await this.client.query(
            `INSERT INTO skills (skill) VALUES ($1) RETURNING *`,
            [skillName]
        );

        const lastID = rows[0].id;
        return new Skills(skillName, lastID);
    }


    async addSkillToTasker(taskerId: number, skillId: number): Promise<void> {
        await this.client.query(
            `INSERT INTO tasker_skills (tasker_id, skill_id) VALUES ($1, $2) returning *`,
            [taskerId, skillId]
        );
    }

    async findSkillByName(skillName: string): Promise<Skills | null> {
        const {rows} = await this.client.query(
            `SELECT * FROM skills WHERE skill = $1 returning *`,
            [skillName]
        );

        const skill = rows[0];

        if (!skill) {
            return null;
        }
        return new Skills(skill.skill, skill.id);
    }

    async findSkillById(skillId: number): Promise<Skills | null> {
        const {rows} = await this.client.query(
            `SELECT * FROM skills WHERE id = $1 returning *`,
            [skillId]
        );

        const skill = rows[0];
        if (!skill) {
            return null;
        }
        return new Skills(skill.skill, skill.id);
    }

    async findSkillsByTaskerId(taskerId: number): Promise<Skills[]> {
        const {rows} = await this.client.query(
           `SELECT s.name FROM skills s
            INNER JOIN tasker_skills ts ON s.id = ts.skill_id
            WHERE ts.tasker_id = $1`,
            [taskerId]
        );
       
        return rows.map((skill: any) => new Skills(skill.skill, skill.id));
    }

    async findTaskersBySkillId(skillId: number): Promise<Tasker[]> {
        const {rows} = await this.client.query(
            `SELECT t.* FROM taskers t
            JOIN tasker_skills ts ON t.id = ts.tasker_id
            WHERE ts.skill_id = $1`,
            [skillId]
        );
        const taskers = rows;

        return taskers.map((tasker: any) => new Tasker(tasker.id, tasker.email, tasker.password, tasker.name, tasker.location, tasker.rating, tasker.price, tasker.availability));
    }

   
}