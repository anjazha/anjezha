import { Role } from "@/Domain/entities/role";
import { INTERFACE_TYPE } from "@/helpers";
import { inject, injectable } from "inversify";
import { IRoleRepository } from "../interfaces/User/IRoleRepository";
import { error } from "console";
import { IRoleService } from "../interfaces/User/IRoleService";



@injectable()
export class RoleService implements IRoleService {
    constructor(@inject(INTERFACE_TYPE.RoleService) private roleRepository: IRoleRepository) {}

    async getRoles(): Promise<Role[]> {
        return this.roleRepository.getRoles();
    }

    async getRoleById(id: number): Promise<Role> {
        return this.roleRepository.getRoleById(id);
    }

    async getRoleByName(name: string): Promise<Role | null> {
        // return this.roleRepository.getRoleByName(name);
        return null;
    }

    async createRole(role: Role): Promise<Role> {
        // 1-chcek of user exist or not ??
         const roleExist = await this.roleRepository.getRoleByUserId(role.userId);

         // return error if exist
         if(roleExist){
            throw new Error("role exist");
         }

         // 3- create role with data
         return await this.roleRepository.createRole(role);
    }


    async updateRole(role: Role): Promise<string> {
        const {userId}= role; 
        let getRole = await this.roleRepository.getRoleByUserId(userId);

        if(role){
            getRole = await this.roleRepository.updateRole(new Role(userId, 'tasker'))
        }
        return getRole.name;
    }

    async deleteRole(id: number): Promise<string> {
        return this.roleRepository.deleteRole(id);
    }
    


}