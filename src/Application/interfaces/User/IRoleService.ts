import { Role } from "@/Domain/entities/role";


export interface IRoleService {
    getRoleById(id: number): Promise<Role | null>;
    getRoleByName(name: string): Promise<Role | null>;
    getRoles(): Promise<Role[]>;
    createRole(role: Role): Promise<Role>;
    updateRole(role: Role): Promise<string>;
    deleteRole(id: number): Promise<string>;
}

