import { injectable , inject} from "inversify";


import { Tasker } from "@/Domain/entities/Tasker";
import { ITaskerService } from "../interfaces/User/ITaskerService";
import { INTERFACE_TYPE } from "@/helpers/containerConst";
import { ITaskerRepository } from "../interfaces/User/ITaskerRepository";
import { IRoleRepository } from "../interfaces/User/IRoleRepository";
import { Role } from "@/Domain/entities/role";
import { generateToken } from "@/helpers/tokenHelpers";

@injectable()
export class TaskerService implements ITaskerService {

    constructor(
        @inject(INTERFACE_TYPE.TaskerRepository) private taskerRepository: ITaskerRepository,
        @inject(INTERFACE_TYPE.RoleRepository) private roleRepository:IRoleRepository
    ) {}

    async createTasker(taskerData: Tasker): Promise<any> {
       
        const userId= taskerData.userId;

       try{
         const taskerExist = await this.taskerRepository.getTaskerByUserId(userId);

        if(taskerExist){
            throw new Error("tasker exist");
        }
        // craete tasker on db 
         const tasker= this.taskerRepository.createTasker(taskerData);

         
         // update roles about user to become tasker 
         

         let role = await this.roleRepository.getRoleByUserId(userId);

         if(role){
           role = await this.roleRepository.updateRole(new Role(userId, 'tasker'))
         }

        //  console.log(role.name);

         // generte new token with new role

         //const token= await generateToken({userId, role: role.name});
         //retutn token with acess and refresh token update role
         return {tasker, role:role.name};
        }  catch (error) {
            throw error;
        }
    }

    async getTaskerById(id: number): Promise<Tasker> {
        return await this.taskerRepository.getTaskerById(id)
    }

    async updateTasker(tasker: Tasker): Promise<string> {
         return await await this.taskerRepository.updateTasker(tasker);
    }

    async deleteTasker(id: number): Promise<string> {
         return  await await this.taskerRepository.deleteTasker(id);
    }

    // async getTaskerByUserId(userId: number): Promise<Tasker> {
    //     return await this.taskerRepository.getTaskerByUserId(userId)
    // }

    // async getTaskerByCategoryId(categoryId: number): Promise<Tasker[]> {
    //     return this.taskerRepository.getTaskerByCategoryId(categoryId)
    // }

    // async getTaskerByLocation(location: string): Promise<Tasker[]> {
    //     return this.taskerRepository.getTaskerByLocation(location)
    // }

    // async getTaskerByRating(rating: number): Promise<Tasker[]> {
    //     return this.taskerRepository.getTaskerByRating(rating)
    // }

}