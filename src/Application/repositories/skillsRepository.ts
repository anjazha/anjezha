import { Skills } from "@/Domain/entities/Skills";
import { TaskerSkills } from "@/Domain/entities/TakserSkills";
import { Tasker } from "@/Domain/entities/Tasker";
import { pgClient } from "@/Infrastructure/database";
import { Client, Pool } from "pg";
import { ISkillsRepository } from "../interfaces/Skills/ISkiilsRepository";
import { injectable } from "inversify";


@injectable()
export class SkillsRepository implements ISkillsRepository {
    private client:Pool;
    constructor() {
        this.client = pgClient;

    }

    async createSkill(skill: string): Promise<Skills> {
        // const { skill: skillName } = skill;
        const { rows } = await this.client.query(
            `INSERT INTO skills (name) VALUES ($1) RETURNING id, name`,
            [skill]
        );

        // const {id} = rows[0];
        // return new Skills(skill, id);
        return rows[0];
    }

    async getSkills(): Promise<Skills[]> {
        const { rows } = await this.client.query(
            `SELECT * FROM skills`
        );

        return rows.map((skill: any) => new Skills(skill.name, skill.id));
    }


    async getSkillById(id: number): Promise<Skills> {
        const { rows } = await this.client.query(
            `SELECT * FROM skills WHERE id = $1`,
            [id]
        );

        const skill = rows[0];
        return new Skills(skill.name, skill.id);
    }

    async getSkillByName(skillName: string): Promise<Skills | null> {
        const {rows} = await this.client.query(
            `SELECT * FROM skills WHERE name = $1 returning *`,
            [skillName]
        );

        const skill = rows[0];

        if (!skill) {
            return null;
        }
        return new Skills(skill.name, skill.id);
    }

    async updateSkill(skill: string, id:number): Promise<any> {
      try{

          const {rows} = await this.client.query(
              `UPDATE skills SET name = $1 WHERE id = $2 returning *`,
              [skill, id]
          );
  
          return rows;
      } catch(err){
        throw new Error(`Error updating skill ${err.message} ${err.stack}`);
      }
    }

    async deleteSkill(id: number): Promise<any> {
        const {rows} = await this.client.query(
            `DELETE FROM skills WHERE id = $1 returning *`,
            [id]
        );

        return rows;
    }


    // async addSkillToTasker(taskerId: number, skillId: number): Promise<void> {
    //     await this.client.query(
    //         `INSERT INTO tasker_skills (tasker_id, skill_id) VALUES ($1, $2) returning *`,
    //         [taskerId, skillId]
    //     );
    // }


    // async findSkillsByTaskerId(taskerId: number): Promise<Skills[]> {
    //     const {rows} = await this.client.query(
    //        `SELECT s.name FROM skills s
    //         INNER JOIN tasker_skills ts ON s.id = ts.skill_id
    //         WHERE ts.tasker_id = $1`,
    //         [taskerId]
    //     );
       
    //     return rows.map((skill: any) => new Skills(skill.skill, skill.id));
    // }

    // async findTaskersBySkillId(skillId: number): Promise<Tasker[]> {
    //     const {rows} = await this.client.query(
    //         `SELECT t.* FROM taskers t
    //         JOIN tasker_skills ts ON t.id = ts.tasker_id
    //         WHERE ts.skill_id = $1`,
    //         [skillId]
    //     );
    //     const taskers = rows;

    //     return taskers.map((tasker: any) => new Tasker(tasker.id, tasker.email, tasker.password, tasker.name, tasker.location, tasker.rating, tasker.price, tasker.availability));
    // }

   
}