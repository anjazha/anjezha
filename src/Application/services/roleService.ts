import { Role } from "@/Domain/entities/role";
import { INTERFACE_TYPE } from "@/helpers";
import { inject, injectable } from "inversify";
import { IRoleRepository } from "../interfaces/User/IRoleRepository";



@injectable()
export class RoleService {
    constructor(@inject(INTERFACE_TYPE.RoleService) private roleRepository: IRoleRepository) {}

    async getRoles(): Promise<Role[]> {
        return this.roleRepository.getRoles();
    }

    async getRoleById(id: number): Promise<Role> {
        return this.roleRepository.getRoleById(id);
    }

    async createRole(role: Role): Promise<Role> {
        return this.roleRepository.createRole(role);
    }


    async updateRole(role: Role): Promise<string> {
        return this.roleRepository.updateRole(role);
    }

    async deleteRole(id: number): Promise<string> {
        return this.roleRepository.deleteRole(id);
    }
    


}