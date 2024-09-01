import { Role } from "@/Domain/entities/role";


export interface IRoleRepository {

    getRoles(): Promise<Role[]>;

    getRoleById(id: number): Promise<Role>;

    createRole(role: Role): Promise<Role>;

    updateRole(role: Role): Promise<string>;

    deleteRole(id: number): Promise<string>;
    getRoleByUserId(userId: number): Promise<Role>;

}