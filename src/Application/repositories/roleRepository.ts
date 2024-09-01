import { Role } from "@/Domain/entities/role";
import { pgClient } from "@/Infrastructure/database";
import { Client } from "pg";
import { IRoleRepository } from "../interfaces/User/IRoleRepository";
import { injectable } from "inversify";


@injectable()
export class RoleRepository implements IRoleRepository {
    client: Client;
    constructor() {
        this.client = pgClient;
    }

    async getRoles(): Promise<Role[]> {
        try {
            const { rows } = await this.client.query("SELECT * FROM roles");
            return rows;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getRoleById(id: number): Promise<Role> {
        try {
            const { rows } = await this.client.query("SELECT * FROM roles WHERE id=$1", [id]);
            return rows[0];
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getRoleByUserId(userId: number): Promise<Role> {
        try {
            const { rows } = await this.client.query("SELECT * FROM roles WHERE user_id=$1", [userId]);
            return rows[0];
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async createRole(role: Role): Promise<Role> {
        try {
            const { rows } = await this.client.query("INSERT INTO roles(name) VALUES($1) RETURNING *", [role.name]);
            return rows[0];
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateRole(role: Role): Promise<string> {
        try {
            // update query to update the role
            await this.client.query(
                "UPDATE roles SET user_id=$1, SET name=$2 WHERE id=$3 RETURNING *", 
                [role.name,role.userId, role.id]);

            return "Role updated successfully";
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteRole(id: number): Promise<string> {
        try {
            await this.client.query("DELETE FROM roles WHERE id=$1", [id]);
            return "Role deleted successfully";
        } catch (error) {
            throw new Error(error.message);
        }
    }

}